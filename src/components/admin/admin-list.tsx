import type { ReactNode } from "react";
import type { PagedList } from "../../hooks/use-paged-list";

interface Props<T> {
  list: PagedList<T>;
  renderItem: (item: T) => ReactNode;
}

/** Loading, error and empty message below the list. */
function ListStatus<T>({ list }: { list: PagedList<T> }) {
  if (list.error) return <p className="admin-message error">{list.error}</p>;
  if (list.loading) return <p className="admin-message">Lädt …</p>;
  if (list.items.length === 0) return <p className="admin-message">Keine Einträge gefunden.</p>;
  return null;
}

/** Shared list view for all admin tabs, including "Mehr laden". */
export default function AdminList<T extends { id: number | string }>({
  list,
  renderItem,
}: Props<T>) {
  return (
    <div className="admin-list-box">
      <ul className="admin-list">
        {list.items.map((item) => (
          <li key={item.id} className="admin-row">{renderItem(item)}</li>
        ))}
      </ul>
      <ListStatus list={list} />
      {list.hasMore && !list.loading && (
        <button className="admin-more-btn" onClick={list.loadMore}>Mehr laden</button>
      )}
    </div>
  );
}