import { useState } from "react";
import type { ComponentType } from "react";
import "./admin-page.css";
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

/** Selected tab and search text; the search is cleared when the tab changes. */
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

/** Renders the list that belongs to the selected tab. */
function ActiveTab({ tab, term }: { tab: AdminTab; term: string }) {
  const View = TAB_VIEWS[tab];
  return <View term={term} />;
}

/** Admin page: tabs for orders, reviews and users with dynamic search. */
export default function AdminPage() {
  const { tab, search, setSearch, term, changeTab } = useAdminView();

  return (
    <main className="admin-page">
      <h1>Admin</h1>
      <AdminTabs active={tab} onChange={changeTab} />
      <AdminSearch value={search} placeholder={PLACEHOLDERS[tab]} onChange={setSearch} />
      <ActiveTab tab={tab} term={term} />
    </main>
  );
}