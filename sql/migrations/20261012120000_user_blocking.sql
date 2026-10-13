-- =====================================================================
-- Block users: Supabase Auth ban plus a mirror flag for the admin list.
-- =====================================================================

-- Mirrors auth.users.banned_until so admins can see who is blocked.
-- Not part of the column grants on profiles, so users cannot change it.
alter table public.profiles add column if not exists banned_at timestamptz;

-- Admin only: blocks or unblocks a user. Uses the ban feature of Supabase Auth
-- (auth.users.banned_until), so a blocked user cannot log in; open sessions are
-- ended. Admins cannot block themselves or other admins.
-- Call from the frontend with: supabase.rpc('admin_set_user_banned', { target, banned })
create or replace function public.admin_set_user_banned(target uuid, banned boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if target = auth.uid() then
    raise exception 'You cannot block yourself';
  end if;
  if exists (select 1 from public.profiles where id = target and role = 'admin') then
    raise exception 'Admins cannot be blocked';
  end if;

  update auth.users
     set banned_until = case when banned then now() + interval '100 years' else null end
   where id = target;

  update public.profiles
     set banned_at = case when banned then now() else null end
   where id = target;

  if banned then
    delete from auth.sessions where user_id = target;
  end if;
end;
$$;

revoke execute on function public.admin_set_user_banned(uuid, boolean) from public, anon;
grant  execute on function public.admin_set_user_banned(uuid, boolean) to authenticated;
