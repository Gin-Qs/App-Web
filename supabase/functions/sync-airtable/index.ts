import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// One-way sync: Supabase (source of truth) -> Airtable (team workspace).
// Upserts Clientes, Facturas, Viajes and an Analytics KPI summary.
//
// Secrets/env:
//   AIRTABLE_TOKEN   (required) Airtable Personal Access Token
//   AIRTABLE_BASE_ID (optional) defaults to the Fleeter base
//   SYNC_SECRET      (optional) when set, callers must send it in the
//                    `x-sync-secret` header. The platform JWT gateway already
//                    rejects tokenless calls; this additionally locks the
//                    function so knowing the public anon key is not enough.
//                    Remember to add the header to the pg_cron job when you
//                    enable it (see supabase/migrations/0003).
const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID") ?? "appLCnTe4TcvwOTE3";
const AIRTABLE_TOKEN = Deno.env.get("AIRTABLE_TOKEN");
const SYNC_SECRET = Deno.env.get("SYNC_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TRIP_STATUS: Record<string, string> = {
  scheduled: "Programado", loading: "Cargando", in_transit: "En tránsito",
  delivered: "Entregado", cancelled: "Cancelado",
};
const INVOICE_STATUS: Record<string, string> = {
  draft: "Borrador", sent: "Emitida", paid: "Pagada", overdue: "Vencida",
};

function clean(obj: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && v !== "") out[k] = v;
  }
  return out;
}

async function airtableUpsert(table: string, mergeOn: string[], records: { fields: Record<string, unknown> }[]) {
  let upserted = 0;
  for (let i = 0; i < records.length; i += 10) {
    const chunk = records.slice(i, i + 10);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ performUpsert: { fieldsToMergeOn: mergeOn }, typecast: true, records: chunk }),
      },
    );
    if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`);
    upserted += chunk.length;
  }
  return { table, upserted };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
  }
  if (SYNC_SECRET && req.headers.get("x-sync-secret") !== SYNC_SECRET) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!AIRTABLE_TOKEN) {
    return Response.json({
      ok: false, skipped: true,
      reason: "AIRTABLE_TOKEN no configurado. Agrégalo como secreto de la Edge Function para activar la sincronización.",
    });
  }
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    const [companiesRes, invoicesRes, tripsRes, latestRes] = await Promise.all([
      supabase.from("companies").select("*"),
      supabase.from("invoices").select("*"),
      supabase.from("trips").select("*, company:companies(name)"),
      // One query instead of one per trip (view: newest GPS point per trip).
      supabase.from("trip_latest_locations").select("trip_id,lat,lon,recorded_at"),
    ]);
    for (const r of [companiesRes, invoicesRes, tripsRes, latestRes]) if (r.error) throw r.error;
    const companies = companiesRes.data ?? [];
    const invoices = invoicesRes.data ?? [];
    const trips = tripsRes.data ?? [];

    const latestByTrip: Record<string, { lat: number; lon: number; recorded_at: string }> = {};
    for (const loc of latestRes.data ?? []) {
      latestByTrip[loc.trip_id] = loc;
    }

    const nameById = new Map(companies.map((c: any) => [c.id, c.name]));

    const clientes = companies.map((c: any) => ({ fields: clean({
      "Nombre": c.name, "Supabase ID": c.id, "RFC": c.rfc, "Email": c.contact_email,
      "Teléfono": c.contact_phone, "Dirección": c.address,
      "Línea de crédito": Number(c.credit_limit), "Moneda": c.currency,
    }) }));

    const facturas = invoices.map((inv: any) => ({ fields: clean({
      "Número": inv.number, "Supabase ID": inv.id, "Cliente": nameById.get(inv.company_id),
      "Monto": Number(inv.amount), "Estatus": INVOICE_STATUS[inv.status],
      "Emitida": inv.issued_at, "Vence": inv.due_at, "Pagada": inv.paid_at,
    }) }));

    const viajes = trips.map((t: any) => {
      const loc = latestByTrip[t.id];
      return { fields: clean({
        "Referencia": t.reference, "Supabase ID": t.id,
        "Cliente": t.company?.name ?? nameById.get(t.company_id),
        "Estatus": TRIP_STATUS[t.status], "Carga": t.cargo_description,
        "Origen": t.origin_label, "Destino": t.destination_label,
        "Última posición": loc ? `${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}` : undefined,
        "Actualizado": loc?.recorded_at, "ETA": t.eta,
      }) };
    });

    const open = invoices.filter((i: any) => i.status !== "paid");
    const receivable = open.reduce((s: number, i: any) => s + Number(i.amount), 0);
    const billed = invoices.reduce((s: number, i: any) => s + Number(i.amount), 0);
    const paid = invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.amount), 0);
    const activos = trips.filter((t: any) => ["scheduled", "loading", "in_transit"].includes(t.status)).length;
    const entregados = trips.filter((t: any) => t.status === "delivered").length;
    const now = new Date().toISOString();
    const fmt = (n: number) => n.toLocaleString("es-MX");
    const analytics = [
      ["Clientes", String(companies.length)],
      ["Viajes activos", String(activos)],
      ["Viajes entregados", String(entregados)],
      ["Facturas por cobrar", String(open.length)],
      ["Saldo por cobrar (MXN)", fmt(receivable)],
      ["Facturado total (MXN)", fmt(billed)],
      ["Pagado (MXN)", fmt(paid)],
    ].map(([m, v]) => ({ fields: { "Métrica": m, "Valor": v, "Actualizado": now } }));

    const synced = [];
    synced.push(await airtableUpsert("Clientes", ["Supabase ID"], clientes));
    synced.push(await airtableUpsert("Facturas", ["Supabase ID"], facturas));
    synced.push(await airtableUpsert("Viajes", ["Supabase ID"], viajes));
    synced.push(await airtableUpsert("Analytics", ["Métrica"], analytics));

    return Response.json({ ok: true, at: now, synced });
  } catch (e) {
    // Log the detail server-side only; never echo internals to the caller.
    console.error("sync-airtable failed:", e);
    return Response.json({ ok: false, error: "sync failed" }, { status: 500 });
  }
});
