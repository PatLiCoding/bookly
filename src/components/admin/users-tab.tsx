import usePagedList from "../../hooks/use-paged-list";
import { fetchUsers, type AdminUser } from "../../services/admin-service";
import AdminList from "./admin-list";

/** Full name or a fallback if the profile has no name. */
function fullName(user: AdminUser): string {
  return `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || "Ohne Namen";
}

/** Address as one line, or an empty string. */
function fullAddress(user: AdminUser): string {
  const city = [user.zip, user.city].filter(Boolean).join(" ");
  return [user.street, city, user.country].filter(Boolean).join(", ");
}

/** One user: name, role badge and address (read-only). */
function UserRow({ user }: { user: AdminUser }) {
  return (
    <div className="admin-row-main">
      <strong>
        {fullName(user)}
        {user.role === "admin" && <span className="admin-badge">Admin</span>}
      </strong>
      <span>{fullAddress(user) || "Keine Adresse hinterlegt"}</span>
    </div>
  );
}

/** Users tab: paged, searchable, read-only list of profiles. */
export default function UsersTab({ term }: { term: string }) {
  const list = usePagedList(fetchUsers, term);
  return <AdminList list={list} renderItem={(u) => <UserRow user={u} />} />;
}