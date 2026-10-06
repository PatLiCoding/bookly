interface Props {
  loading: boolean;
  error: Error | null;
}

/** Shows a short hint while data is loading or if loading failed. */
function LoadStatus({ loading, error }: Props) {
  if (error) {
    return <p className="load-status">Die Daten konnten nicht geladen werden.</p>;
  }
  return loading ? <p className="load-status">Lädt …</p> : null;
}

export default LoadStatus;