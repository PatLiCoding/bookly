-- =====================================================================
-- Account deletion and order retention.
-- Orders survive account deletion (kept for the legal retention period),
-- each order stores the addresses as they were at purchase time.
-- =====================================================================

-- Address snapshots at purchase time (needed for invoice, shipping, returns).
-- Shape: { name, street, zip, city, country }
alter table public.orders
  add column if not exists billing_address  jsonb,
  add column if not exists shipping_address jsonb;

-- NULL after the account was deleted: the order is no longer linked to a person.
alter table public.orders alter column user_id drop not null;
alter table public.orders drop constraint if exists orders_user_id_fkey;
alter table public.orders add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

-- Lets a logged-in user delete their own account. Profile, addresses and
-- reviews are removed via ON DELETE CASCADE. Orders are kept (user_id becomes
-- NULL) because of the legal retention period. Refused while orders are open.
-- Call from the frontend with: supabase.rpc('delete_own_account')
create or replace function public.delete_own_account()
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if exists (
    select 1 from public.orders
    where user_id = auth.uid() and status in ('processing', 'shipped')
  ) then
    raise exception 'open_orders';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_own_account() from public, anon;
grant  execute on function public.delete_own_account() to authenticated;

-- Admin only: deletes a user account (same effects as delete_own_account()).
-- Refused for admins, for the caller and while the user has open orders.
-- Call from the frontend with: supabase.rpc('admin_delete_user', { target })
create or replace function public.admin_delete_user(target uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if target = auth.uid() then
    raise exception 'You cannot delete yourself';
  end if;
  if exists (select 1 from public.profiles where id = target and role = 'admin') then
    raise exception 'Admins cannot be deleted';
  end if;
  if exists (
    select 1 from public.orders
    where user_id = target and status in ('processing', 'shipped')
  ) then
    raise exception 'open_orders';
  end if;
  delete from auth.users where id = target;
end;
$$;

revoke execute on function public.admin_delete_user(uuid) from public, anon;
grant  execute on function public.admin_delete_user(uuid) to authenticated;

-- Deletes orders whose retention period has ended: the end of the calendar year
-- of the order plus retention_years (default 8). Order items go with them.
-- Only callable with the service_role key or from the SQL editor.
create or replace function public.purge_expired_orders(retention_years int default 8)
returns integer
language sql security definer set search_path = ''
as $$
  with deleted as (
    delete from public.orders
    where order_date < date_trunc('year', now()) - make_interval(years => retention_years)
    returning 1
  )
  select count(*)::int from deleted;
$$;

revoke execute on function public.purge_expired_orders(int) from public, anon, authenticated;

-- Customers may only cancel their own order while it is still processing.
drop policy if exists "orders: cancel own" on public.orders;
create policy "orders: cancel own" on public.orders
  for update to authenticated
  using (user_id = auth.uid() and status = 'processing')
  with check (user_id = auth.uid() and status = 'cancelled');
