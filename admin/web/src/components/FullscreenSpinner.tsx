export function FullscreenSpinner({
  message,
}: {
  message?: string;
}): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-transparent text-slate-500 dark:text-slate-300">
      <span
        className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400"
        aria-hidden
      />
      {message ? (
        <p className="max-w-xs text-center text-sm font-medium text-slate-600 dark:text-slate-200">
          {message}
        </p>
      ) : null}
    </div>
  );
}
