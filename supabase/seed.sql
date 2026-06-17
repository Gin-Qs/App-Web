-- =====================================================================
-- Fleeter — demo seed data
-- Demo password for ALL accounts: Demo1234!
--   cliente@acmefoods.mx  (customer, Acme Foods)
--   ana@fleeter.mx          (employee)
--   gabriel@fleeter.mx      (admin)
-- Safe to re-run (uses ON CONFLICT DO NOTHING).
-- =====================================================================

-- ---------- Companies ----------
insert into public.companies (id, name, rfc, contact_email, contact_phone, address, credit_limit, currency) values
  ('11111111-1111-1111-1111-111111111111', 'Acme Foods S.A. de C.V.', 'AFO120101AB1', 'ops@acmefoods.mx', '+52 81 1234 5678', 'Monterrey, NL', 2500000, 'MXN'),
  ('22222222-2222-2222-2222-222222222222', 'Portline Imports',        'PIM150315CD2', 'logistica@portline.mx', '+52 55 9876 5432', 'Veracruz, VER', 1800000, 'MXN'),
  ('33333333-3333-3333-3333-333333333333', 'Horizon Manufacturing',   'HMA180620EF3', 'compras@horizonmfg.mx', '+52 33 4455 6677', 'Guadalajara, JAL', 3200000, 'MXN')
on conflict (id) do nothing;

-- ---------- Demo auth users (+ email identities) ----------
-- Token columns are set to '' (not NULL) so GoTrue can authenticate them.
-- The on_auth_user_created trigger creates the matching public.profiles rows.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change, email_change_token_new,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token
) values
  ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-0000-0000-0000-000000000001', 'authenticated', 'authenticated',
   'ana@fleeter.mx', crypt('Demo1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Ana Rivera","role":"employee"}',
   '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-0000-0000-0000-000000000002', 'authenticated', 'authenticated',
   'gabriel@fleeter.mx', crypt('Demo1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Gabriel (DG)","role":"admin"}',
   '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-0000-0000-0000-000000000003', 'authenticated', 'authenticated',
   'cliente@acmefoods.mx', crypt('Demo1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Acme Foods Ops","role":"customer","company_id":"11111111-1111-1111-1111-111111111111"}',
   '', '', '', '', '', '', '', '')
on conflict (id) do nothing;

insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '{"sub":"aaaaaaaa-0000-0000-0000-000000000001","email":"ana@fleeter.mx"}', 'email', now(), now(), now()),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', '{"sub":"aaaaaaaa-0000-0000-0000-000000000002","email":"gabriel@fleeter.mx"}', 'email', now(), now(), now()),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000003', '{"sub":"aaaaaaaa-0000-0000-0000-000000000003","email":"cliente@acmefoods.mx"}', 'email', now(), now(), now())
on conflict do nothing;

-- ---------- Account assignments ----------
insert into public.account_assignments (employee_id, company_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333')
on conflict do nothing;

-- ---------- Trips ----------
insert into public.trips (id, reference, company_id, assigned_employee_id, status, cargo_description,
  origin_label, origin_lat, origin_lon, destination_label, destination_lat, destination_lon,
  departure_at, eta, delivered_at) values
  ('a0000000-0000-0000-0000-000000000a01', 'TR-8912', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001',
   'in_transit', 'Refrigerated produce — 22 pallets', 'Monterrey, NL', 25.6866, -100.3161, 'Mexico City CEDIS', 19.4326, -99.1332,
   now() - interval '6 hours', now() + interval '4 hours', null),
  ('a0000000-0000-0000-0000-000000000a02', 'TR-9011', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001',
   'loading', 'Imported electronics — 12 crates', 'Veracruz Port', 19.1738, -96.1342, 'Puebla DC', 19.0414, -98.2063,
   now() + interval '2 hours', now() + interval '9 hours', null),
  ('a0000000-0000-0000-0000-000000000a04', 'TR-9034', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-0000-0000-0000-000000000001',
   'in_transit', 'Auto parts — 40 pallets', 'Guadalajara, JAL', 20.6597, -103.3496, 'Querétaro Plant', 20.5888, -100.3899,
   now() - interval '3 hours', now() + interval '1 hour', null),
  ('a0000000-0000-0000-0000-000000000b01', 'TR-8700', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001',
   'delivered', 'Dry goods — 18 pallets', 'Monterrey, NL', 25.6866, -100.3161, 'Saltillo DC', 25.4232, -101.0053,
   now() - interval '8 days', now() - interval '8 days' + interval '5 hours', now() - interval '8 days' + interval '5 hours'),
  ('a0000000-0000-0000-0000-000000000b02', 'TR-8621', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001',
   'delivered', 'Frozen goods — 20 pallets', 'Monterrey, NL', 25.6866, -100.3161, 'Mexico City CEDIS', 19.4326, -99.1332,
   now() - interval '20 days', now() - interval '20 days' + interval '11 hours', now() - interval '20 days' + interval '12 hours')
on conflict (id) do nothing;

-- ---------- Initial location trail ----------
insert into public.trip_locations (trip_id, lat, lon, speed_kph, heading, recorded_at) values
  ('a0000000-0000-0000-0000-000000000a01', 25.6866, -100.3161, 0,  180, now() - interval '6 hours'),
  ('a0000000-0000-0000-0000-000000000a01', 24.8333, -100.0000, 92, 175, now() - interval '4 hours'),
  ('a0000000-0000-0000-0000-000000000a01', 23.7369, -99.9000,  88, 172, now() - interval '2 hours'),
  ('a0000000-0000-0000-0000-000000000a01', 22.1565, -100.9855, 95, 168, now() - interval '30 minutes'),
  ('a0000000-0000-0000-0000-000000000a04', 20.6597, -103.3496, 0,  95,  now() - interval '3 hours'),
  ('a0000000-0000-0000-0000-000000000a04', 20.6300, -102.3000, 90, 92,  now() - interval '90 minutes'),
  ('a0000000-0000-0000-0000-000000000a04', 20.6000, -101.2000, 87, 90,  now() - interval '20 minutes');

-- ---------- Invoices ----------
insert into public.invoices (number, company_id, trip_id, amount, currency, status, issued_at, due_at, paid_at) values
  ('INV-10231', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000a01', 48500.00, 'MXN', 'sent',    current_date - 5,  current_date + 10, null),
  ('INV-9931',  '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000b01', 39200.00, 'MXN', 'paid',    current_date - 35, current_date - 20, current_date - 22),
  ('INV-9877',  '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000b02', 51750.00, 'MXN', 'paid',    current_date - 50, current_date - 35, current_date - 33),
  ('INV-9802',  '11111111-1111-1111-1111-111111111111', null,                                  27300.00, 'MXN', 'paid',    current_date - 70, current_date - 55, current_date - 54),
  ('INV-10270', '22222222-2222-2222-2222-222222222222', 'a0000000-0000-0000-0000-000000000a02', 62100.00, 'MXN', 'draft',   current_date,      current_date + 15, null),
  ('INV-10244', '33333333-3333-3333-3333-333333333333', 'a0000000-0000-0000-0000-000000000a04', 73850.00, 'MXN', 'overdue', current_date - 25, current_date - 5,  null)
on conflict (number) do nothing;
