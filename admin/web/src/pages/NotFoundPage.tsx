import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { cn } from "../lib/cn";

export function NotFoundPage(): JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <Card className="max-w-xl text-center">
        <h1 className="text-2xl">Страница не найдена</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary">На главную</Button>
          </Link>
          <a href="mailto:support@example.org" className={cn("inline-block")}>
            <Button variant="ghost">Связаться с поддержкой</Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
