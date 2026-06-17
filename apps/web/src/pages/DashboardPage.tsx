import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  formatCurrency,
  formatDate,
  formatRelative,
  INVOICE_STATUS_LABELS,
  invoiceStatusTone,
  listActiveTripsWithPositions,
  listCompanies,
  listPaidInvoices,
  listOpenInvoices,
  listPastTrips,
  outstandingBalance,
  subscribeToLocations,
  TRIP_STATUS_LABELS,
  tripStatusTone,
  type Company,
  type Invoice,
  type TripLocation,
  type TripWithCompany,
  type TripWithPosition,
} from '@ginqs/core'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthProvider'
import { Badge, Card, Chip, EmptyState, RouteSpark, StatCard, Tabs } from '../components/ui'
import { LiveMap, type MapMarker } from '../components/LiveMap'

type View = 'operacion' | 'clientes' | 'finanzas'

export function DashboardPage() {
  const { profile } = useAuth()
  const isStaff = profile?.role === 'employee' || profile?.role === 'admin'
  const companyId = profile?.role === 'customer' ? profile.company_id ?? undefined : undefined

  const [activeTrips, setActiveTrips] = useState<TripWithPosition[]>([])
  const [pastTrips, setPastTrips] = useState<TripWithCompany[]>([])
  const [openInvoices, setOpenInvoices] = useState<Invoice[]>([])
  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  // Initial load
  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([
      listActiveTripsWithPositions(supabase, companyId),
      listPastTrips(supabase, companyId),
      listOpenInvoices(supabase, companyId),
      listPaidInvoices(supabase, companyId),
      isStaff ? listCompanies(supabase) : Promise.resolve([] as Company[]),
    ])
      .then(([active_, past, open, paid, comps]) => {
        if (!active) return
        setActiveTrips(active_)
        setPastTrips(past)
        setOpenInvoices(open)
        setPaidInvoices(paid)
        setCompanies(comps)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [companyId, isStaff])

  // Live position updates: patch the matching trip's latest_location in place.
  useEffect(() => {
    const unsubscribe = subscribeToLocations(supabase, {
      onInsert: (loc: TripLocation) => {
        setActiveTrips((prev) =>
          prev.map((t) =>
            t.id === loc.trip_id &&
            (!t.latest_location || loc.recorded_at >= t.latest_location.recorded_at)
              ? { ...t, latest_location: loc }
              : t,
          ),
        )
      },
    })
    return unsubscribe
  }, [])

  const markers = useMemo<MapMarker[]>(
    () =>
      activeTrips
        .filter((t) => t.latest_location)
        .map((t) => ({
          id: t.id,
          lat: t.latest_location!.lat,
          lon: t.latest_location!.lon,
          label: `${t.reference} · ${TRIP_STATUS_LABELS[t.status]}`,
          sublabel: `${t.company?.name ?? ''} → ${t.destination_label ?? ''}`,
          tone: tripStatusTone(t.status) as MapMarker['tone'],
        })),
    [activeTrips],
  )

  const balance = outstandingBalance(openInvoices)
  const creditLimit = profile?.company?.credit_limit ?? 0
  const overdueCount = openInvoices.filter((i) => i.status === 'overdue').length

  const [view, setView] = useState<View>('operacion')
  const tabItems = [
    { id: 'operacion', label: 'Operación' },
    ...(isStaff ? [{ id: 'clientes', label: 'Clientes' }] : []),
    { id: 'finanzas', label: 'Finanzas' },
  ]

  if (loading) return <div className="page-loading">Cargando panel…</div>

  return (
    <div className="dashboard">
      <div className="dash-head">
        <h1>{isStaff ? 'Panel de operaciones' : 'Panel de carga'}</h1>
        <p className="muted">
          {isStaff
            ? 'Clientes, viajes en curso con ubicación en vivo y facturación.'
            : 'Tu carga, viajes, ubicación en tiempo real y estado de cuenta.'}
        </p>
      </div>

      {/* KPIs */}
      <div className="stats-grid">
        <StatCard label="Viajes activos" value={activeTrips.length} tone="info" />
        {isStaff ? (
          <>
            <StatCard label="Clientes" value={companies.length} />
            <StatCard label="Facturas por cobrar" value={openInvoices.length} hint={`${overdueCount} vencidas`} tone={overdueCount ? 'danger' : undefined} />
            <StatCard label="Saldo por cobrar" value={formatCurrency(balance)} />
          </>
        ) : (
          <>
            <StatCard label="Por pagar" value={formatCurrency(balance)} hint={overdueCount ? `${overdueCount} vencida(s)` : 'Al corriente'} tone={overdueCount ? 'danger' : 'success'} />
            <StatCard label="Línea de crédito" value={formatCurrency(creditLimit)} />
            <StatCard label="Crédito disponible" value={formatCurrency(Math.max(creditLimit - balance, 0))} tone="success" />
          </>
        )}
      </div>

      <Tabs items={tabItems} active={view} onChange={(id) => setView(id as View)} />

      {view === 'operacion' && (
        <>
          {/* Live map */}
          <Card
            title="Ubicación en vivo"
            action={
              <span className="chips">
                <Chip online>EN VIVO</Chip>
                <Chip>{markers.length} GPS</Chip>
              </span>
            }
          >
            {markers.length ? (
              <LiveMap markers={markers} height={380} />
            ) : (
              <EmptyState>No hay viajes activos con ubicación por ahora.</EmptyState>
            )}
          </Card>

          <div className="dash-grid">
            <Card title={isStaff ? 'Viajes en curso' : 'Mis envíos activos'}>
              {activeTrips.length ? (
                <ul className="rows">
                  {activeTrips.map((t) => (
                    <li key={t.id} className="row">
                      <div className="row-main">
                        <Link to={`/app/trips/${t.id}`} className="row-title">
                          {t.reference}
                        </Link>
                        <div className="row-sub">
                          {isStaff && t.company?.name ? `${t.company.name} · ` : ''}
                          {t.origin_label} → {t.destination_label}
                        </div>
                        <div className="chips">
                          <Chip online={t.status === 'in_transit'}>
                            {t.status === 'in_transit' ? 'EN RUTA' : TRIP_STATUS_LABELS[t.status]}
                          </Chip>
                          <Chip>GPS</Chip>
                          <Chip>LTE</Chip>
                          {t.latest_location && (
                            <Chip>{formatRelative(t.latest_location.recorded_at)}</Chip>
                          )}
                        </div>
                        <RouteSpark
                          points={[
                            [t.origin_lat ?? NaN, t.origin_lon ?? NaN],
                            ...(t.latest_location
                              ? ([[t.latest_location.lat, t.latest_location.lon]] as Array<[number, number]>)
                              : []),
                            [t.destination_lat ?? NaN, t.destination_lon ?? NaN],
                          ]}
                          progressIndex={t.latest_location ? 1 : 0}
                        />
                      </div>
                      <Badge tone={tripStatusTone(t.status)}>{TRIP_STATUS_LABELS[t.status]}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState>Sin viajes activos.</EmptyState>
              )}
            </Card>

            <Card title="Viajes anteriores">
              <PastTripsList trips={pastTrips} showCompany={isStaff} />
            </Card>
          </div>
        </>
      )}

      {view === 'clientes' && isStaff && (
        <Card title="Clientes">
          {companies.length ? (
            <ul className="rows">
              {companies.map((c) => (
                <li key={c.id} className="row">
                  <div className="row-main">
                    <div className="row-title">{c.name}</div>
                    <div className="row-sub">{c.address ?? c.rfc ?? ''}</div>
                  </div>
                  <span className="row-meta">{formatCurrency(c.credit_limit, c.currency)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Sin clientes asignados.</EmptyState>
          )}
        </Card>
      )}

      {view === 'finanzas' && (
        <div className="dash-grid">
          <Card title={isStaff ? 'Facturas por cobrar' : 'Factura actual'}>
            <InvoiceList invoices={openInvoices} showCompany={isStaff} companies={companies} />
          </Card>
          <Card title="Facturas pagadas">
            <InvoiceList invoices={paidInvoices} showCompany={isStaff} companies={companies} />
          </Card>
        </div>
      )}
    </div>
  )
}

function PastTripsList({ trips, showCompany }: { trips: TripWithCompany[]; showCompany: boolean }) {
  if (!trips.length) return <EmptyState>Sin viajes anteriores.</EmptyState>
  return (
    <ul className="rows">
      {trips.map((t) => (
        <li key={t.id} className="row">
          <div>
            <Link to={`/app/trips/${t.id}`} className="row-title">
              {t.reference}
            </Link>
            <div className="row-sub">
              {showCompany && t.company?.name ? `${t.company.name} · ` : ''}
              {t.origin_label} → {t.destination_label}
            </div>
            <div className="row-meta">Entregado {formatDate(t.delivered_at)}</div>
          </div>
          <Badge tone={tripStatusTone(t.status)}>{TRIP_STATUS_LABELS[t.status]}</Badge>
        </li>
      ))}
    </ul>
  )
}

function InvoiceList({
  invoices,
  showCompany,
  companies,
}: {
  invoices: Invoice[]
  showCompany: boolean
  companies: Company[]
}) {
  if (!invoices.length) return <EmptyState>Sin facturas.</EmptyState>
  const nameById = new Map(companies.map((c) => [c.id, c.name]))
  return (
    <ul className="rows">
      {invoices.map((inv) => (
        <li key={inv.id} className="row">
          <div>
            <div className="row-title">{inv.number}</div>
            <div className="row-sub">
              {showCompany && nameById.get(inv.company_id) ? `${nameById.get(inv.company_id)} · ` : ''}
              Vence {formatDate(inv.due_at)}
            </div>
          </div>
          <div className="row-end">
            <span className="row-amount">{formatCurrency(Number(inv.amount), inv.currency)}</span>
            <Badge tone={invoiceStatusTone(inv.status)}>{INVOICE_STATUS_LABELS[inv.status]}</Badge>
          </div>
        </li>
      ))}
    </ul>
  )
}
