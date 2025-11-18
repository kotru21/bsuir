import { ErrorCard } from "../components/ErrorCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function ServerErrorPage({
  onReset,
}: {
  onReset?: () => void;
}): JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <Card className="max-w-xl text-center">
        <h1 className="text-2xl">Внутренняя ошибка сервера</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Произошла непредвиденная ошибка. Попробуйте обновить страницу или
          вернуться на главную.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              if (onReset) {
                onReset();
              } else {
                // fallback: reload page
                void (window.location && window.location.reload());
              }
            }}>
            Попробовать снова
          </Button>
          <a href="/">
            <Button variant="ghost">На главную</Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
