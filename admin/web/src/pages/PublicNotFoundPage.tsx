import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export function PublicNotFoundPage(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-lg text-center">
        <h1 className="text-2xl">Страница не найдена</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Запрашиваемая страница не найдена. Возможно, вы опечатались в адресе.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary">На главную</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
