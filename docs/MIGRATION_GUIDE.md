# Применение миграции БД на Heroku

## Изменения в схеме БД

Эта миграция добавляет:

1. **Enum типы** - типобезопасность для Gender, FitnessLevel, TrainingFormat, ContactLevel
2. **Индексы** - повышение производительности запросов статистики и рекомендаций
3. **Soft deletes** - поле `deletedAt` для восстановления данных
4. **Аналитические поля** - автоматический подсчет популярности секций

## Применение на Heroku

### Автоматическое применение

Добавьте скрипт в `package.json`:

```json
{
  "scripts": {
    "migrate:heroku": "heroku pg:psql DATABASE_URL --app your-app-name < prisma/migrations/manual_add_enums_indexes_soft_deletes.sql"
  }
}
```

Затем запустите:

```bash
bun run migrate:heroku
```

### Ручное применение через Heroku CLI

```bash
# Подключитесь к базе данных
heroku pg:psql DATABASE_URL --app your-app-name

# Затем в psql скопируйте и вставьте содержимое manual_add_enums_indexes_soft_deletes.sql
```

### Применение через Heroku Dashboard

1. Откройте Heroku Dashboard → ваше приложение → Resources
2. Кликните на Heroku Postgres
3. Перейдите в Settings → Dataclips или используйте другой SQL клиент
4. Выполните SQL из `manual_add_enums_indexes_soft_deletes.sql`

## Откат миграции

Если что-то пошло не так:

```bash
heroku pg:psql DATABASE_URL --app your-app-name < prisma/migrations/manual_rollback_enums_indexes_soft_deletes.sql
```

## Проверка применения

После применения миграции проверьте:

```sql
-- Проверка enum типов
SELECT typname FROM pg_type WHERE typname IN ('Gender', 'FitnessLevel', 'TrainingFormat', 'ContactLevel');

-- Проверка индексов
SELECT indexname FROM pg_indexes WHERE tablename IN ('SurveySubmission', 'SportSection', 'RecommendationSnapshot');

-- Проверка триггера
SELECT tgname FROM pg_trigger WHERE tgname = 'recommendation_stats_trigger';
```

## Важно

- ⚠️ Миграция изменяет типы существующих колонок
- ⚠️ Убедитесь, что данные в БД совместимы с enum значениями
- ⚠️ Рекомендуется сделать бэкап перед применением: `heroku pg:backups:capture --app your-app-name`

## После применения миграции

1. Сгенерируйте Prisma клиент: `bunx prisma generate`
2. Пересоберите приложение: `bun run build`
3. Задеплойте на Heroku: `git push heroku main`
