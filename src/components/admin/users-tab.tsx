import { useState } from "react";
import usePagedList from "../../hooks/use-paged-list";
import { fetchUsers, setUserBanned, deleteUserAccount, type AdminUser } from "../../services/admin-service";
import AdminList from "./admin-list";
import AdminMessageDialog, { type DialogConfig } from "./admin-dialog-modal";

/**
 * Returns the full name of a user or a fallback string.
 */
function fullName(u: AdminUser): string {
  return `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || "Ohne Namen";
}

/**
 * Formats user address fields into a single readable string.
 */
function fullAddress(u: AdminUser): string {
  const city = [u.zip, u.city].filter(Boolean).join(" ");
  return [u.street, city, u.country].filter(Boolean).join(", ");
}

/**
 * Generates the ban confirmation message for a given user.
 */
function banMsg(u: AdminUser): string {
  return `${fullName(u)} wirklich sperren?\n\nDer User kann sich nicht mehr einloggen.`;
}

interface RowProps {
  user: AdminUser;
  onToggleBan: (u: AdminUser) => void;
  onDeleteUser: (u: AdminUser) => void;
}

/**
 * Renders a single user row with status badges and action buttons.
 */
function UserRow({ user, onToggleBan, onDeleteUser }: RowProps) {
  const banned = Boolean(user.banned_at);
  return (
    <>
      <div className="admin-row-main">
        <strong>{fullName(user)} {user.role === "admin" && <span className="admin-badge">Admin</span>} {banned && <span className="admin-badge admin-badge--banned">Gesperrt</span>}</strong>
        <span>{fullAddress(user) || "Keine Adresse"}</span>
      </div>
      {user.role !== "admin" && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button className={banned ? "admin-cancel-btn" : "admin-delete-btn"} onClick={() => onToggleBan(user)}>{banned ? "Entsperren" : "Sperren"}</button>
          <button className="admin-delete-btn" onClick={() => onDeleteUser(user)}>Löschen</button>
        </div>
      )}
    </>
  );
}

/**
 * Admin tab for managing user accounts, banning, and deleting profiles via custom dialogs.
 */
export default function UsersTab({ term }: { term: string }) {
  const list = usePagedList(fetchUsers, term);
  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  /** Executes the ban/unban API call and updates local state. */
  const executeBan = async (user: AdminUser, ban: boolean) => {
    try {
      await setUserBanned(user.id, ban);
      const banned_at = ban ? new Date().toISOString() : null;
      list.setItems((prev) => prev.map((u) => (u.id === user.id ? { ...u, banned_at } : u)));
    } catch {
      setDialog({ title: "Fehler", message: "Sperre konnte nicht geändert werden." });
    }
  };

  /** Prompts confirmation dialog before banning a user. */
  const toggleBan = (user: AdminUser) => {
    const ban = !user.banned_at;
    if (!ban) return executeBan(user, false);
    setDialog({
      title: "User sperren", message: banMsg(user), confirmLabel: "Sperren", isDestructive: true,
      onConfirm: () => executeBan(user, true),
    });
  };

  /** Prompts confirmation dialog before deleting a user account. */
  const handleDeleteUser = (user: AdminUser) => {
    setDialog({
      title: "User löschen", message: `${fullName(user)} wirklich endgültig löschen?`, confirmLabel: "Löschen", isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteUserAccount(user.id);
          list.setItems((prev) => prev.filter((u) => u.id !== user.id));
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Löschen fehlgeschlagen.";
          setDialog({ title: "Fehler", message: msg });
        }
      },
    });
  };

  return (
    <>
      <AdminList list={list} renderItem={(u) => <UserRow user={u} onToggleBan={toggleBan} onDeleteUser={handleDeleteUser} />} />
      {dialog && <AdminMessageDialog {...dialog} onClose={() => setDialog(null)} />}
    </>
  );
}