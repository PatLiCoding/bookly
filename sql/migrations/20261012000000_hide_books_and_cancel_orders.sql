-- =====================================================================
-- Hide books instead of deleting them, allow cancelled orders.
-- =====================================================================

-- Hidden books are not shown in the shop and cannot be ordered, but stay
-- readable so old orders can still show their cover.
alter table public.books
  add column if not exists hidden boolean not null default false;

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('processing', 'shipped', 'delivered', 'cancelled'));
