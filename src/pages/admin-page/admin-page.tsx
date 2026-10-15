import { useState } from "react";
import type { ComponentType } from "react";
import "./admin-page.css";
import "./admin-dialog.css";
import "./admin-select.css";
import AdminSearch from "../../components/admin/admin-search";
import AdminTabs, { type AdminTab } from "../../components/admin/admin-tabs";
import OrdersTab from "../../components/admin/orders-tab";
import BooksTab from "../../components/admin/books-tab";
import ReviewsTab from "../../components/admin/reviews-tab";
import UsersTab from "../../components/admin/users-tab";
import useDebounce from "../../hooks/use-debounce";

const PLACEHOLDERS: Record<AdminTab, string> = {
  orders: "Suche nach Bestellnummer oder Kunde",
  books: "Suche nach Titel, Autor oder Kategorie",
  reviews: "Suche nach Buch, User oder Kommentar",
  users: "Suche nach Name",
};

/** Manages active admin tab state and search query input, clearing search input on tab switches. */
function useAdminView() {
  const [tab, setTab] = useState<AdminTab>("orders");
  const [search, setSearch] = useState("");
  const term = useDebounce(search.trim());

  const changeTab = (next: AdminTab) => {
    setTab(next);
    setSearch("");
  };

  return { tab, search, setSearch, term, changeTab };
}

const TAB_VIEWS: Record<AdminTab, ComponentType<{ term: string }>> = {
  orders: OrdersTab,
  books: BooksTab,
  reviews: ReviewsTab,
  users: UsersTab,
};

/** Dynamically renders the list component corresponding to the active tab selection. */
function ActiveTab({ tab, term }: { tab: AdminTab; term: string }) {
  const View = TAB_VIEWS[tab];
  return <View term={term} />;
}

/** Main admin dashboard page component featuring multi-tab views and dynamic search integration. */
export default function AdminPage() {
  const { tab, search, setSearch, term, changeTab } = useAdminView();

  return (
    <main className="admin-page">
      <h1 className="admin-headline">Admin</h1>
      <AdminTabs active={tab} onChange={changeTab} />
      <AdminSearch value={search} placeholder={PLACEHOLDERS[tab]} onChange={setSearch} />
      <ActiveTab tab={tab} term={term} />
    </main>
  );
}