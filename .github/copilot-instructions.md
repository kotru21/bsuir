## Коротко о проекте

Telegram-бот на TypeScript (ES modules / Node 18) для выдачи рекомендаций по спортивным секциям БГУИР. Код намеренно небольшой и централизован: UI — Telegram (Telegraf), данные — статический каталог в `src/data/sections.ts`, логика рекомендаций — `src/recommendation.ts`.

## Входная точка и сценарии

- `src/index.ts` — bootstrapping: читается `BOT_TOKEN` из `.env`, подключаются сцены и middleware, запускается Telegraf. Любые изменения запуска/конфигурации должны учитывать, что проект использует `type: "module"` и NodeNext resolution.
- Основная диалоговая логика находится в `src/bot/scenes/onboarding.ts` — тут реализован WizardScene с шагами (возраст, пол, уровень подготовки, формат, цели и выдача рекомендаций).

## Ключевые файлы и их роль (пусть ИИ смотрит сюда в первую очередь)

- `src/data/sections.ts` — каталог SportSection, изображения и метаданные. При добавлении секций держите структуру `SportSection` (см. `src/types.ts`).
- `src/recommendation.ts` — правило-ориентированный движок: `recommendSections(profile, limit)`, `fallbackSection(profile)`, `listAllSections()`.
- `src/types.ts` — все важные типы (UserProfile, SportSection, RecommendationResult). Сохраняйте совместимость типов при изменениях API.
- `src/bot/keyboards.ts` — все inline/keyboard builders и формат callback data (например: `age:+1`, `fitness_prev`, `sections:0`, `rec:section-id`). Следуйте существующему префиксу: `action:payload`.
- `src/bot/formatters.ts` — MarkdownV2-экранирование и рендер рекомендаций. Используйте `escapeMarkdown` перед вставкой текста в подписи.
- `src/bot/telegram.ts` — безопасные обёртки `replyMarkdownV2Safe` / `replyWithPhotoMarkdownV2Safe` — предпочитайте их, чтобы автоматически падать в plain text при ошибках Telegram.
- `src/bot/session.ts` — shape сессии (`RecommendationSession`, `TempState`) и helper'ы `ensureProfile`/`ensureTemp` — используйте их в сценах для совместимости с существующим кодом.

## Запуск и сборка (оперативные команды)

- Установка: `npm install`.
- Разработка (без сборки): `npm run dev` (скрипт использует `tsx src/index.ts`).
- Сборка и прод: `npm run build` -> `npm start` (tsc -> dist/index.js).
- Быстрая проверка типов: `npx tsc --noEmit`.

Обязательно: создайте `.env` из `.env.example` и положите `BOT_TOKEN` там.

## Важные проектные конвенции

- Используется Node ESM + TypeScript с NodeNext. В исходниках импорт модулей приводится с расширением `.js` (например `import { recommendSections } from "./recommendation.js"`) — оставляйте `.js` в импортах в `src` чтобы tsc/NodeNext корректно резолвили пути после компиляции.
- Callback-data паттерн: `prefix:payload` — парсится в сценах/обработчиках буквально. Любые новые клавиатуры должны следовать этой схемы.
- Сессии хранятся в памяти через `telegraf` session middleware — это временное хранилище. Если нужна устойчивость, добавляйте persistent session middleware и мигрируйте shape `RecommendationSession`.
- Изображения секций: храните в `src/data/images`. В рантайме `src/index.ts` использует `resolveImagePath` (cwd → src → dist) для поиска изображения — не полагайтесь на один абсолютный путь.

## Типичные изменения и где править

- изменить логику рекомендаций — `src/recommendation.ts` (функции `computeScore` / `buildReasons`);
- добавить/править секцию — `src/data/sections.ts` (поле `imagePath` относительное к проекту);
- добавить новый шаг в onboarding — `src/bot/scenes/onboarding.ts` (используйте `ensureProfile/ensureTemp` и `sendPromptMessage` / `cleanupPromptMessage` для аккуратного UX);
- новая клавиатура — `src/bot/keyboards.ts` (все сборщики клавиатур возвращают `Markup` и используют callback-строки в существующем формате).

## Частые источники ошибок (на что ИИ должен обращать внимание)

- MarkdownV2: всегда экранируйте пользовательский текст через `escapeMarkdown` перед отправкой. При отправке фото используйте `replyWithPhotoMarkdownV2Safe`.
- Импорты: забыв `.js` в импортах приведёт к runtime ошибкам при `node dist/...` на ESM. Проверяйте `tsc` и запуск после изменения импортов.
- Права на файлы/пути изображений: `resolveImagePath` иногда не найдёт файл — тестируйте и добавляйте изображения в `src/data/images`.
- Сессии не персистентны — при рестарте все временные данные теряются.

## Быстрый тест- сценарий (ручной)

1. Скопировать `.env.example` → `.env`, поставить BOT_TOKEN.
2. `npm run dev`.
3. В Telegram: `/start` → пройти Wizard → убедиться, что рекомендации возвращаются и что кнопки (inline) работают (нажатия ведут к `answerCbQuery`, редактированию/удалению сообщений).

Если что-то неясно или хотите, чтобы я расширил файл (например, добавить примеры unit-тестов или CI-пайплайн), скажите какие разделы приоритетны.
