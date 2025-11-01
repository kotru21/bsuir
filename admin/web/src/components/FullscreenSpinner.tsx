export function FullscreenSpinner({
  message,
}: {
  message?: string;
}): JSX.Element {
  return (
    <div className="fullscreen-spinner">
      <div className="spinner" />
      {message ? <p>{message}</p> : null}
    </div>
  );
}
