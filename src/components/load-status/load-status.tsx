/** Props for the LoadStatus component. */
interface Props {
  /** Indicates whether data fetching is currently in progress. */
  loading: boolean;
  /** Holds an error object if loading failed, or null if successful. */
  error: Error | null;
}

/**
 * Renders a loading message or error notification based on asynchronous status.
 */
function LoadStatus({ loading, error }: Props) {
  if (error) {
    return <p className="load-status">Die Daten konnten nicht geladen werden.</p>;
  }
  return loading ? <p className="load-status">Lädt …</p> : null;
}

export default LoadStatus;