# Внимание AI ассистенту

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

## Коротко о проекте

Telegram-бот на TypeScript (ES modules / Bun 1+) для выдачи рекомендаций по спортивным секциям БГУИР. Код небольшой и централизован: UI — Telegram (Telegraf), админ-панель — React (Vite). Данные — canonical seed `prisma/data/sections.ts`, runtime-источники: `src/data/*` и база данных; логика рекомендаций — `src/recommendation.ts`.

## Входная точка и сценарии

- `src/index.ts` — bootstrapping: читается `BOT_TOKEN` из `.env`, подключаются сцены и middleware, запускается Telegraf. Любые изменения запуска/конфигурации должны учитывать, что проект использует `type: "module"` и NodeNext resolution.
- Основная диалоговая логика находится в `src/bot/scenes/onboarding.ts` — тут реализован WizardScene с шагами (возраст, пол, уровень подготовки, формат, цели и выдача рекомендаций).

## Ключевые файлы и их роль (пусть ИИ смотрит сюда в первую очередь)

- `prisma/data/sections.ts` — canonical seed для разработки и тестов. При добавлении секций держите структуру `SportSection` (см. `src/types.ts`). runtime-источники изображений — `src/data/images` или `data/images`.
- `src/recommendation.ts` — правило-ориентированный движок: `recommendSections(profile, limit)`, `fallbackSection(profile)`, `listAllSections()`.
  - Помните о кешировании `getAllSections()` (TTL 5 минут); при обновлении секций кеш нужно инвалидавать или использовать прямой Prisma запрос.
- `src/types.ts` — все важные типы (UserProfile, SportSection, RecommendationResult). Сохраняйте совместимость типов при изменениях API.
- `src/bot/keyboards.ts` — все inline/keyboard builders и формат callback data (например: `age:+1`, `fitness_prev`, `sections:0`, `rec:section-id`). Следуйте существующему префиксу: `action:payload`.
  - Callback-strings парсятся буквально: `action:payload`. Для кнопок навигации используйте `wizardrec:index` или `sections:index`. Обработчики находятся в `src/bot/handlers`.
- `src/bot/formatters.ts` — MarkdownV2-экранирование и рендер рекомендаций. Используйте `escapeMarkdown` перед вставкой текста в подписи.
- `src/bot/telegram.ts` — безопасные обёртки `replyMarkdownV2Safe` / `replyWithPhotoMarkdownV2Safe` — предпочитайте их, чтобы автоматически падать в plain text при ошибках Telegram.
  - `replyMarkdownV2Safe` и `replyWithPhotoMarkdownV2Safe` автоматически обрезают сообщения > 4096 chars и делают fallback на plain text; используйте их вместе с `formatters.escapeMarkdown`.
- `src/bot/session.ts` — shape сессии (`RecommendationSession`, `TempState`) и helper'ы `ensureProfile`/`ensureTemp` — используйте их в сценах для совместимости с существующим кодом.
  - `ensureProfile(ctx)` / `ensureTemp(ctx)` возвращают мутабельные объекты и гарантируют правильный тип; эти методы широко используются в `src/bot/scenes/onboarding/*`.

## Запуск и сборка (оперативные команды)

- Установка: `bun install` (создаёт `bun.lockb`).
- Разработка (без сборки): `bun run dev` (скрипт использует `tsx src/index.ts`).
- Admin front-end: `bun run dev:admin` (Vite); build: `bun run build:admin`.
- Dev server (bot + api): `bun run dev` or `bun run dev:server`.
- Сборка и прод: `bun run build` -> `bun start` (bun build -> `dist/server.js`).
- Быстрая проверка типов: `bunx tsc --noEmit`.
- Юнит-тесты: `bun run test` (Bun test). В тестах используется `vi.mock` (совместимый с Bun alias) для мока Prisma — см. `test/recommendation.test.ts`.

Обязательно: создайте `.env` из `.env.example` и положите `BOT_TOKEN` там.

## Важные проектные конвенции

- Используется Node ESM + TypeScript с NodeNext. В исходниках импорт модулей приводится с расширением `.js` (например `import { recommendSections } from "./recommendation.js"`) — оставляйте `.js` в импортах в `src` чтобы tsc/NodeNext корректно резолвили пути после компиляции.
  - Важно: не удаляйте `.js` в исходниках. Это конвенция для корректной работы ESM в runtime после компиляции.
- Callback-data паттерн: `prefix:payload` — парсится в сценах/обработчиках буквально. Любые новые клавиатуры должны следовать этой схемы.
- Сессии хранятся в памяти через `telegraf` session middleware — это временное хранилище. Если нужна устойчивость, добавляйте persistent session middleware и мигрируйте shape `RecommendationSession`.
- Изображения секций: храните в `src/data/images`. В рантайме `src/index.ts` использует `resolveImagePath` (cwd → src → dist) для поиска изображения — не полагайтесь на один абсолютный путь.
  - `resolveImagePath()` блокирует absolute paths и `..` элементы; тесты: `test/imageResolver.test.ts`.

## Типичные изменения и где править

- изменить логику рекомендаций — `src/recommendation.ts` (функции `computeScore` / `buildReasons`);
  - Для изменения логики рекомендаций: пишите модульные тесты; `scoreSections` и `computeCosineSimilarity` — ключевые точки.
- добавить/править секцию — `src/data/sections.ts` (поле `imagePath` относительное к проекту);
  - Добавление секций: отредактируйте `prisma/data/sections.ts` (seed) и, если нужно — `src/data/images/*`. Для стабильности тестов используйте `vi.mock` на Prisma.
- добавить новый шаг в onboarding — `src/bot/scenes/onboarding.ts` (используйте `ensureProfile/ensureTemp` и `sendPromptMessage` / `cleanupPromptMessage` для аккуратного UX);
  - Stepped scenes: каждый шаг находится в `src/bot/scenes/onboarding/steps` — reuse `wrapSceneStep()` и `wrapBotHandler()` для безопасных обработчиков и автоматического выхода из ошибки. Посмотрите `goalStep.ts` и `goalPriorityStep.ts` для примеров.
- новая клавиатура — `src/bot/keyboards.ts` (все сборщики клавиатур возвращают `Markup` и используют callback-строки в существующем формате).

## Частые источники ошибок (на что ИИ должен обращать внимание)

- MarkdownV2: всегда экранируйте пользовательский текст через `escapeMarkdown` перед отправкой. При отправке фото используйте `replyWithPhotoMarkdownV2Safe`.
  - Примеры: `renderRecommendationSummary()` и `renderRecommendationDetail()` используют `escapeMarkdown` для всех строк, пригодных для отправки в caption.
- Импорты: забыв `.js` в импортах приведёт к runtime ошибкам при `node dist/...` на ESM. Проверяйте `tsc` и запуск после изменения импортов.
- Права на файлы/пути изображений: `resolveImagePath` иногда не найдёт файл — тестируйте и добавляйте изображения в `src/data/images`.
  - Чтобы избежать развёртки: сохраните изображения в `src/data/images` и используйте относительные `imagePath` в секциях.
- Сессии не персистентны — при рестарте все временные данные теряются.
  - Для устойчивости: внедрите persistent session middleware на основе БД/redis; сохраните shape `RecommendationSession`.

---

## Быстрые примеры и хитрости (для AI агент-ассистентов)

- ESM/Import example: `import { recommendSections } from "./recommendation.js"` — оставляйте `.js` в `src`.
- Callback-data example: обработка `age:+1` — см. `src/bot/keyboards.ts` и `src/bot/scenes/onboarding/*`.
- Image resolver: `resolveImagePath("./data/images/wrestling.jpg")` — безопасный поиск и test: `test/imageResolver.test.ts`.
- Mocking Prisma in tests: `vi.mock("../src/infrastructure/prismaClient.js", () => ({ getPrismaClient: () => ({ sportSection: { findMany: vi.fn().mockResolvedValue(sportSections), }, }), }));`
- Scoring: `recommendSections(profile, 3)` — проверьте `getAllSections()` кеш и contribution weights (`buildUserVector`/`computeCosineSimilarity`).

---

Если нужно, могу добавить пример PR шаблона/CI тестового шага или расширить раздел "Как добавить новую секцию" с чеклистом (db seed → image → tests → docs).

## Быстрый тест- сценарий (ручной)

1. Скопировать `.env.example` → `.env`, поставить BOT_TOKEN.
2. `bun run dev`.
3. В Telegram: `/start` → пройти Wizard → убедиться, что рекомендации возвращаются и что кнопки (inline) работают (нажатия ведут к `answerCbQuery`, редактированию/удалению сообщений).

Если что-то неясно или хотите, чтобы я расширил файл (например, добавить примеры unit-тестов или CI-пайплайн), скажите какие разделы приоритетны.
