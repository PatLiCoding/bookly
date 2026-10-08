import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { PAGE_SIZE } from "../services/admin-service";

/** Loads one page of items, starting at `offset`, filtered by `term`. */
export type Loader<T> = (offset: number, term: string) => Promise<T[]>;

export interface PagedList<T> {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  hasMore: boolean;
  loading: boolean;
  error: string;
  loadMore: () => void;
}

/** State of a paged list. */
function usePageState<T>() {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applyPage = useCallback((page: T[], offset: number) => {
    setItems((prev) => (offset === 0 ? page : [...prev, ...page]));
    setHasMore(page.length === PAGE_SIZE);
  }, []);

  return { items, setItems, hasMore, loading, setLoading, error, setError, applyPage };
}

type PageState<T> = ReturnType<typeof usePageState<T>>;
type FetchPage = (offset: number, isStale: () => boolean) => Promise<void>;

/** Creates the function that loads a page and ignores outdated results. */
function usePageFetcher<T>(load: Loader<T>, term: string, s: PageState<T>): FetchPage {
  const { setLoading, setError, applyPage } = s;
  return useCallback(async (offset, isStale) => {
    setLoading(true);
    setError("");
    try {
      const page = await load(offset, term);
      if (!isStale()) applyPage(page, offset);
    } catch {
      if (!isStale()) setError("Laden fehlgeschlagen. Bitte erneut versuchen.");
    }
    if (!isStale()) setLoading(false);
  }, [load, term, applyPage, setLoading, setError]);
}

/** Loads the first page whenever the fetcher (i.e. the search term) changes. */
function useFirstPage(fetchPage: FetchPage) {
  useEffect(() => {
    let stale = false;
    fetchPage(0, () => stale);
    return () => {
      stale = true;
    };
  }, [fetchPage]);
}

/**
 * Paged list with "Mehr laden" and server-side search.
 * `load` must be a stable function (e.g. imported from a service).
 */
export default function usePagedList<T>(load: Loader<T>, term: string): PagedList<T> {
  const state = usePageState<T>();
  const fetchPage = usePageFetcher(load, term, state);
  useFirstPage(fetchPage);
  const loadMore = () => void fetchPage(state.items.length, () => false);
  const { items, setItems, hasMore, loading, error } = state;
  return { items, setItems, hasMore, loading, error, loadMore };
}