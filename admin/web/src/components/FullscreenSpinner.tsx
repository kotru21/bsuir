import styles from "./FullscreenSpinner.module.css";

export function FullscreenSpinner({
  message,
}: {
  message?: string;
}): React.JSX.Element {
  return (
    <div className={styles.fullscreen}>
      <div className={styles.spinner} />
      {message ? <p>{message}</p> : null}
    </div>
  );
}
