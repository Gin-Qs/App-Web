-- =====================================================================
-- Schedule the Supabase -> Airtable sync (Edge Function `sync-airtable`).
-- Runs every 15 minutes. The function returns a harmless {skipped:true}
-- until the AIRTABLE_TOKEN secret is configured, so this is safe to schedule.
-- The anon key below is public and only used to pass the JWT gateway; the
-- function runs with the service role internally.
-- Hardening (optional): set a SYNC_SECRET secret on the Edge Function and
-- add ,'x-sync-secret','<the-secret>' to the headers object below (store it
-- in Vault rather than committing it) — then only callers who know the
-- secret can trigger the sync, not anyone holding the public anon key.
-- Unschedule with: select cron.unschedule('fleeter-airtable-sync');
-- =====================================================================
create extension if not exists pg_net;

select cron.schedule(
  'fleeter-airtable-sync',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://kxxvqrkhiwowkxeszmsy.supabase.co/functions/v1/sync-airtable',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4eHZxcmtoaXdvd2t4ZXN6bXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTAzMTgsImV4cCI6MjA5NzIyNjMxOH0.LQcK5BKCm1wn7lilYqle4seKgUskv5Tdc_De9vjBqTY'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);
