-- Run this in Supabase Dashboard > SQL Editor.
-- It allows logged-in Supabase Auth users to read and manage SSOP records.
-- Do not use a service role key in the frontend.

alter table public.employees enable row level security;
alter table public.suppliers enable row level security;
alter table public.delivery_vehicles enable row level security;
alter table public.raw_material_receiving enable row level security;
alter table public.raw_material_receiving_items enable row level security;
alter table public.delivery_truck_inspections enable row level security;
alter table public.pest_control_inspections enable row level security;
alter table public.pest_control_inspection_items enable row level security;
alter table public.oil_temperature_records enable row level security;
alter table public.oil_temperature_readings enable row level security;
alter table public.cleaning_sanitation_logs enable row level security;
alter table public.stock_management_records enable row level security;
alter table public.stock_management_items enable row level security;

drop policy if exists "Authenticated users can select employees" on public.employees;
drop policy if exists "Authenticated users can insert employees" on public.employees;
drop policy if exists "Authenticated users can update employees" on public.employees;
drop policy if exists "Authenticated users can delete employees" on public.employees;
create policy "Authenticated users can select employees" on public.employees for select to authenticated using (true);
create policy "Authenticated users can insert employees" on public.employees for insert to authenticated with check (true);
create policy "Authenticated users can update employees" on public.employees for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete employees" on public.employees for delete to authenticated using (true);

drop policy if exists "Authenticated users can select suppliers" on public.suppliers;
drop policy if exists "Authenticated users can insert suppliers" on public.suppliers;
drop policy if exists "Authenticated users can update suppliers" on public.suppliers;
drop policy if exists "Authenticated users can delete suppliers" on public.suppliers;
create policy "Authenticated users can select suppliers" on public.suppliers for select to authenticated using (true);
create policy "Authenticated users can insert suppliers" on public.suppliers for insert to authenticated with check (true);
create policy "Authenticated users can update suppliers" on public.suppliers for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete suppliers" on public.suppliers for delete to authenticated using (true);

drop policy if exists "Authenticated users can select delivery vehicles" on public.delivery_vehicles;
drop policy if exists "Authenticated users can insert delivery vehicles" on public.delivery_vehicles;
drop policy if exists "Authenticated users can update delivery vehicles" on public.delivery_vehicles;
drop policy if exists "Authenticated users can delete delivery vehicles" on public.delivery_vehicles;
create policy "Authenticated users can select delivery vehicles" on public.delivery_vehicles for select to authenticated using (true);
create policy "Authenticated users can insert delivery vehicles" on public.delivery_vehicles for insert to authenticated with check (true);
create policy "Authenticated users can update delivery vehicles" on public.delivery_vehicles for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete delivery vehicles" on public.delivery_vehicles for delete to authenticated using (true);

drop policy if exists "Authenticated users can select raw material receiving" on public.raw_material_receiving;
drop policy if exists "Authenticated users can insert raw material receiving" on public.raw_material_receiving;
drop policy if exists "Authenticated users can update raw material receiving" on public.raw_material_receiving;
drop policy if exists "Authenticated users can delete raw material receiving" on public.raw_material_receiving;
create policy "Authenticated users can select raw material receiving" on public.raw_material_receiving for select to authenticated using (true);
create policy "Authenticated users can insert raw material receiving" on public.raw_material_receiving for insert to authenticated with check (true);
create policy "Authenticated users can update raw material receiving" on public.raw_material_receiving for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete raw material receiving" on public.raw_material_receiving for delete to authenticated using (true);

drop policy if exists "Authenticated users can select raw material receiving items" on public.raw_material_receiving_items;
drop policy if exists "Authenticated users can insert raw material receiving items" on public.raw_material_receiving_items;
drop policy if exists "Authenticated users can update raw material receiving items" on public.raw_material_receiving_items;
drop policy if exists "Authenticated users can delete raw material receiving items" on public.raw_material_receiving_items;
create policy "Authenticated users can select raw material receiving items" on public.raw_material_receiving_items for select to authenticated using (true);
create policy "Authenticated users can insert raw material receiving items" on public.raw_material_receiving_items for insert to authenticated with check (true);
create policy "Authenticated users can update raw material receiving items" on public.raw_material_receiving_items for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete raw material receiving items" on public.raw_material_receiving_items for delete to authenticated using (true);

drop policy if exists "Authenticated users can select delivery truck inspections" on public.delivery_truck_inspections;
drop policy if exists "Authenticated users can insert delivery truck inspections" on public.delivery_truck_inspections;
drop policy if exists "Authenticated users can update delivery truck inspections" on public.delivery_truck_inspections;
drop policy if exists "Authenticated users can delete delivery truck inspections" on public.delivery_truck_inspections;
create policy "Authenticated users can select delivery truck inspections" on public.delivery_truck_inspections for select to authenticated using (true);
create policy "Authenticated users can insert delivery truck inspections" on public.delivery_truck_inspections for insert to authenticated with check (true);
create policy "Authenticated users can update delivery truck inspections" on public.delivery_truck_inspections for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete delivery truck inspections" on public.delivery_truck_inspections for delete to authenticated using (true);

drop policy if exists "Authenticated users can select pest control inspections" on public.pest_control_inspections;
drop policy if exists "Authenticated users can insert pest control inspections" on public.pest_control_inspections;
drop policy if exists "Authenticated users can update pest control inspections" on public.pest_control_inspections;
drop policy if exists "Authenticated users can delete pest control inspections" on public.pest_control_inspections;
create policy "Authenticated users can select pest control inspections" on public.pest_control_inspections for select to authenticated using (true);
create policy "Authenticated users can insert pest control inspections" on public.pest_control_inspections for insert to authenticated with check (true);
create policy "Authenticated users can update pest control inspections" on public.pest_control_inspections for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete pest control inspections" on public.pest_control_inspections for delete to authenticated using (true);

drop policy if exists "Authenticated users can select pest control inspection items" on public.pest_control_inspection_items;
drop policy if exists "Authenticated users can insert pest control inspection items" on public.pest_control_inspection_items;
drop policy if exists "Authenticated users can update pest control inspection items" on public.pest_control_inspection_items;
drop policy if exists "Authenticated users can delete pest control inspection items" on public.pest_control_inspection_items;
create policy "Authenticated users can select pest control inspection items" on public.pest_control_inspection_items for select to authenticated using (true);
create policy "Authenticated users can insert pest control inspection items" on public.pest_control_inspection_items for insert to authenticated with check (true);
create policy "Authenticated users can update pest control inspection items" on public.pest_control_inspection_items for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete pest control inspection items" on public.pest_control_inspection_items for delete to authenticated using (true);

drop policy if exists "Authenticated users can select oil temperature records" on public.oil_temperature_records;
drop policy if exists "Authenticated users can insert oil temperature records" on public.oil_temperature_records;
drop policy if exists "Authenticated users can update oil temperature records" on public.oil_temperature_records;
drop policy if exists "Authenticated users can delete oil temperature records" on public.oil_temperature_records;
create policy "Authenticated users can select oil temperature records" on public.oil_temperature_records for select to authenticated using (true);
create policy "Authenticated users can insert oil temperature records" on public.oil_temperature_records for insert to authenticated with check (true);
create policy "Authenticated users can update oil temperature records" on public.oil_temperature_records for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete oil temperature records" on public.oil_temperature_records for delete to authenticated using (true);

drop policy if exists "Authenticated users can select oil temperature readings" on public.oil_temperature_readings;
drop policy if exists "Authenticated users can insert oil temperature readings" on public.oil_temperature_readings;
drop policy if exists "Authenticated users can update oil temperature readings" on public.oil_temperature_readings;
drop policy if exists "Authenticated users can delete oil temperature readings" on public.oil_temperature_readings;
create policy "Authenticated users can select oil temperature readings" on public.oil_temperature_readings for select to authenticated using (true);
create policy "Authenticated users can insert oil temperature readings" on public.oil_temperature_readings for insert to authenticated with check (true);
create policy "Authenticated users can update oil temperature readings" on public.oil_temperature_readings for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete oil temperature readings" on public.oil_temperature_readings for delete to authenticated using (true);

drop policy if exists "Authenticated users can select cleaning sanitation logs" on public.cleaning_sanitation_logs;
drop policy if exists "Authenticated users can insert cleaning sanitation logs" on public.cleaning_sanitation_logs;
drop policy if exists "Authenticated users can update cleaning sanitation logs" on public.cleaning_sanitation_logs;
drop policy if exists "Authenticated users can delete cleaning sanitation logs" on public.cleaning_sanitation_logs;
create policy "Authenticated users can select cleaning sanitation logs" on public.cleaning_sanitation_logs for select to authenticated using (true);
create policy "Authenticated users can insert cleaning sanitation logs" on public.cleaning_sanitation_logs for insert to authenticated with check (true);
create policy "Authenticated users can update cleaning sanitation logs" on public.cleaning_sanitation_logs for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete cleaning sanitation logs" on public.cleaning_sanitation_logs for delete to authenticated using (true);

drop policy if exists "Authenticated users can select stock management records" on public.stock_management_records;
drop policy if exists "Authenticated users can insert stock management records" on public.stock_management_records;
drop policy if exists "Authenticated users can update stock management records" on public.stock_management_records;
drop policy if exists "Authenticated users can delete stock management records" on public.stock_management_records;
create policy "Authenticated users can select stock management records" on public.stock_management_records for select to authenticated using (true);
create policy "Authenticated users can insert stock management records" on public.stock_management_records for insert to authenticated with check (true);
create policy "Authenticated users can update stock management records" on public.stock_management_records for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete stock management records" on public.stock_management_records for delete to authenticated using (true);

drop policy if exists "Authenticated users can select stock management items" on public.stock_management_items;
drop policy if exists "Authenticated users can insert stock management items" on public.stock_management_items;
drop policy if exists "Authenticated users can update stock management items" on public.stock_management_items;
drop policy if exists "Authenticated users can delete stock management items" on public.stock_management_items;
create policy "Authenticated users can select stock management items" on public.stock_management_items for select to authenticated using (true);
create policy "Authenticated users can insert stock management items" on public.stock_management_items for insert to authenticated with check (true);
create policy "Authenticated users can update stock management items" on public.stock_management_items for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete stock management items" on public.stock_management_items for delete to authenticated using (true);
