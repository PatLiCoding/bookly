export type AdminTab = "orders" | "reviews" | "users";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "orders", label: "Bestellungen" },
  { id: "reviews", label: "Bewertungen" },
  { id: "users", label: "User" },
];

interface Props {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}

/** Tab bar of the admin page. */
export default function AdminTabs({ active, onChange }: Props) {
  return (
    <div className="admin-tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`admin-tab ${t.id === active ? "active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}