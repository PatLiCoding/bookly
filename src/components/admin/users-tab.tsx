import usePagedList from "../../hooks/use-paged-list";
import { fetchUsers, setUserBanned, type AdminUser } from "../../services/admin-service";
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

/** Confirmation text before blocking a user. */
function banConfirm(user: AdminUser): string {
  return (
    `${fullName(user)} wirklich sperren?\n\n` +
    "Der User kann sich danach nicht mehr einloggen. Bestellungen und " +
    "Bewertungen bleiben erhalten. Die Sperre kann jederzeit aufgehoben werden."
  );
}

interface RowProps {
  user: AdminUser;
  onToggleBan: (user: AdminUser) => void;
}

/** One user: name, badges, address and a block button (not shown for admins). */
function UserRow({ user, onToggleBan }: RowProps) {
  const banned = Boolean(user.banned_at);
  return (
    <>
      <div className="admin-row-main">
        <strong>
          {fullName(user)}
          {user.role === "admin" && <span className="admin-badge">Admin</span>}
          {banned && <span className="admin-badge admin-badge--banned">Gesperrt</span>}
        </strong>
        <span>{fullAddress(user) || "Keine Adresse hinterlegt"}</span>
      </div>
      {user.role !== "admin" && (
        <button
          className={banned ? "admin-cancel-btn" : "admin-delete-btn"}
          onClick={() => onToggleBan(user)}
        >
          {banned ? "Entsperren" : "Sperren"}
        </button>
      )}
    </>
  );
}

/** Users tab: paged, searchable list of profiles; admins can block and unblock users. */
export default function UsersTab({ term }: { term: string }) {
  const list = usePagedList(fetchUsers, term);

  async function toggleBan(user: AdminUser) {
    const ban = !user.banned_at;
    if (ban && !window.confirm(banConfirm(user))) return;
    try {
      await setUserBanned(user.id, ban);
      const banned_at = ban ? new Date().toISOString() : null;
      list.setItems((prev) => prev.map((u) => (u.id === user.id ? { ...u, banned_at } : u)));
    } catch {
      window.alert("Die Sperre konnte nicht geändert werden.");
    }
  }

  return <AdminList list={list} renderItem={(u) => <UserRow user={u} onToggleBan={toggleBan} />} />;
}