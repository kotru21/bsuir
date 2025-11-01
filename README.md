# Прототип системы цифрового маркетинга образовательно-спортивных услуг БГУИР

## Содержание

| Раздел                                                                | Описание                                             |
| --------------------------------------------------------------------- | ---------------------------------------------------- |
| [Введение](#введение)                                                 | Контекст создания прототипа и задачи проекта         |
| [Основные функции бота](#основные-функции-бота)                       | Ключевые пользовательские и операционные возможности |
| [Диаграммы чат-бота](#диаграммы-чат-бота)                             | Варианты использования, бизнес-процесс и ER-логика   |
| [Подробное описание функций](#подробное-описание-функций)             | Расширенный обзор пользовательских сценариев         |
| [Техническая документация](#техническая-документация)                 | Архитектура, файловая структура, технологии          |
| [Установка и запуск](#установка-и-запуск)                             | Настройка окружения и сценарии запуска               |
| [Тестирование и контроль качества](#тестирование-и-контроль-качества) | Набор автоматических и ручных проверок               |
| [Планы развития](#планы-развития)                                     | Идеи для расширения и внедрения                      |

## Введение

Прототип системы цифрового маркетинга образовательно-спортивных услуг БГУИР — это чат-бот в Telegram, который помогает абитуриентам, студентам и сотрудникам подобрать подходящие спортивные секции, понять ожидаемую динамику прогресса и быстро связаться с организаторами. Бот сочетает маркетинговый подход (акцент на ценностях и результатах) и персонализированную аналитику (учёт анамнеза, целей, предпочтений по формату занятий).

Цель прототипа:

- собрать требования и проверить гипотезу о спросе на digital-консьерж для спортивных программ БГУИР;
- предложить персональные рекомендации по секциям, снизив барьер входа и повысив конверсию в записи;
- предоставить маркетинговой команде структурированные данные о заинтересованности и профиле аудитории.

## Основные функции бота

- **Интерактивное анкетирование**: последовательный Wizard-процесс собирает возраст, пол, уровень физической подготовки, желаемый формат тренировок, цели и готовность к контактным видам спорта.
- **Персонализированные рекомендации**: движок правил рассчитывает наиболее релевантные секции, обосновывает выбор и предлагает прогноз достижимых результатов на горизонты 1, 3 и 6+ месяцев.
- **Обзор каталога секций**: команда `/sections` выводит галерею с кратким описанием и преимуществами каждой секции, включая изображения и контактную информацию.
- **Гибкий UX**: кнопки-инлайн облегчают выбор ответов, а безопасные обработчики взаимодействий защищают от ошибок Telegram API.
- **Маркетинговые инсайты**: формирование профиля пользователя на основе ответов облегчает последующую сегментацию аудитории и планирование коммуникаций.
- **Админ-панель и аналитика**: веб-интерфейс на Fastify + React показывает агрегированную статистику опросов, диаграммы распределения и список всех заполненных анкет.

## Диаграммы чат-бота

### Диаграмма вариантов использования

```mermaid
flowchart LR
   user(Telegram user):::actor
   marketing(Marketing team):::actor

   subgraph Bot [Digital marketing bot]
      start[/Start dialog/]
      profile[Collect profile]
      recommend[Deliver recommendations]
      sections[Browse sections]
      feedback[Leave feedback]
      export[Export insights]
   end

   user --> start
   start --> profile
   profile --> recommend
   user --> sections
   user --> feedback
   marketing --> export

   classDef actor fill:#f0f0f0,stroke:#333,stroke-width:1;
```

**Расшифровка:** Пользователь Telegram инициирует диалог, проходит сбор профиля и получает рекомендации; маркетинговая команда использует экспорт интересов.

### Бизнес-процесс взаимодействия

```mermaid
flowchart TD
   A[User starts bot with /start] --> B{Session exists?}
   B -- No --> C[Create session and show greeting]
   B -- Yes --> D[Offer resume or restart]
   C --> E[Wizard: age -> gender -> fitness -> format -> goals -> contact]
   D --> E
   E --> F[Build user profile]
   F --> G[Calculate recommendations recommendSections]
   G --> H{Relevant sections found?}
   H -- Yes --> I[Send top-N sections with reasoning]
   H -- No --> J[Show fallback section and feedback hint]
   I --> K[Inline buttons: enroll, browse, restart]
   J --> K
   K --> L[Log interest and finish scenario]
```

**Расшифровка:** Пользователь запускает бота, заполняет анкету, после чего движок рекомендаций выбирает секции; далее пользователь взаимодействует с кнопками, а система фиксирует интерес.

### Логическая диаграмма сущность-связь

```mermaid
erDiagram
      USER_PROFILE ||--o{ ANSWER : содержит
      USER_PROFILE }o--|| RECOMMENDATION : формирует
      RECOMMENDATION }o--|| SPORT_SECTION : сопоставляет
      SPORT_SECTION ||--o{ RESULT_PROJECTION : описывает
      SPORT_SECTION ||--o{ MEDIA_ASSET : иллюстрирует

      USER_PROFILE {
            string telegramId
            int age
            enum gender
            enum fitnessLevel
            enum formatPreference
            enum goal
            boolean contactSportsOk
      }

      ANSWER {
            string stepId
            string value
            datetime timestamp
      }

      SPORT_SECTION {
            string id
            string title
            string location
            string scheduleSummary
      }

      RECOMMENDATION {
            string sectionId
            float score
            string[] reasons
      }

      RESULT_PROJECTION {
            string horizon
            string description
      }

      MEDIA_ASSET {
            string path
            string altText
      }
```

**Расшифровка:** Профиль пользователя связан с ответами и рекомендациями; рекомендации привязаны к секциям, для которых описаны прогнозы результатов и медиаматериалы.

## Подробное описание функций

- **Анкета «Знакомство»**: вступительная сцена объясняет возможности бота и подготавливает пользователя к опросу, используя дружественные подсказки.
- **Выбор возрастной группы**: шаг `ageSelectionStep` применяет динамические клавиатуры и проверяет корректность ввода; результаты влияют на фильтрацию секций с возрастными ограничениями.
- **Определение пола**: шаг `genderStep` уточняет приоритетные секции и используется в текстах рекомендаций.
- **Оценка физподготовки**: `fitnessStep` предлагает шкалу уровней подготовки и учёт прошлых занятий, что изменяет базовый коэффициент в `computeScore`.
- **Формат занятий**: `formatStep` фиксирует предпочтение очного, гибридного или самостоятельного режима, повышая релевантность секций с совпадающим расписанием.
- **Целеполагание**: `goalStep` определяет ключевой ожидаемый результат (здоровье, соревнования, дисциплина, коммуникация), формирующий текстовые обоснования.
- **Контактность**: `competitionInterestStep` и `contactPreferenceStep` проверяют готовность к контактным направлениям, исключая неподходящие секции.
- **Выдача рекомендаций**: `recommendSections` вычисляет итоговый рейтинг, подбирает изображения, формирует MarkdownV2-представление и отправляет блок карточек с кнопками для навигации.
- **Команда `/sections`**: обработчик `src/bot/handlers/sections.ts` выводит полный каталог секций с базовой информацией, доступный независимо от завершения анкеты.
- **Перезапуск `/restart`**: очищает сессию, что позволяет пользователю оперативно изменить ответы (актуально при смене целей).
- **Защита от ошибок**: middleware `safeHandler` и адаптеры `replyMarkdownV2Safe`/`replyWithPhotoMarkdownV2Safe` гарантируют корректный fallback в случае проблем с форматированием или отсутствием изображений.

## Техническая документация

### Архитектурный обзор

- **Интерфейс взаимодействия** — Telegram бот на Telegraf WizardScene управляет многошаговыми сценариями и безопасной отправкой сообщений.
- **Доменная логика** — модуль `src/recommendation.ts` со scoring-движком и причинными объяснениями поверх статического каталога.
- **Каталог** — статические данные секций (`src/data/sections.ts`) с изображениями, прогнозами результатов и атрибутами отбора.
- **Админ-HTTP слой** — Fastify-сервер (`src/admin`) с сессиями, CSRF-защитой, статикой Vite и REST API под `/admin/api`.
- **Хранилище** — PostgreSQL + Prisma (`prisma/schema.prisma`, `src/infrastructure/prismaClient.ts`) для сохранения анкет и рекомендаций.
- **Админ-UI** — одностраничное приложение на React/Vite (`admin/web`) с TanStack Query и Chart.js для дашборда.
- **Инфраструктура** — Node.js 18 (ESM), TypeScript, `tsx` для запуска в dev, `tsc` и `vite build` для сборки, деплой на Heroku.
- **Сессии** — в памяти Telegraf для бота и cookie-based Fastify session для админ-панели.

### Дерево проекта

```text
src/
   index.ts
   recommendation.ts
   types.ts
   admin/
      config.ts
      server.ts
      routes/
         auth.ts
         stats.ts
         submissions.ts
         ui.ts
      plugins/
         authentication.ts
      services/
         statisticsService.ts
   bot/
      app.ts
      constants.ts
      formatters.ts
      keyboards.ts
      session.ts
      telegram.ts
      handlers/
         commands.ts
         sections.ts
      scenes/
         onboarding.ts
         onboarding/
            helpers.ts
            prompts.ts
            steps/
               *.ts
      services/
         imageResolver.ts
      utils/
         safeHandler.ts
   data/
      sections.ts
      images/
   domain/
      profileDefaults.ts
   infrastructure/
      prismaClient.ts
   services/
      profileAssembler.ts
      submissionRecorder.ts
admin/web/
   index.html
   vite.config.ts
   src/
      App.tsx
      main.tsx
      pages/
      components/
      api/
prisma/
   schema.prisma
   migrations/
test/
   *.test.ts
```

### Назначение ключевых файлов и модулей

| Путь                                      | Назначение                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/index.ts`                            | Точка входа: загрузка `.env`, запуск Telegraf, регистрация сцен и middleware                            |
| `src/recommendation.ts`                   | Алгоритм расчёта рейтинга секций, набор эвристик, fallback-логика                                       |
| `src/types.ts`                            | Определения типов: `UserProfile`, `SportSection`, `RecommendationResult` и вспомогательные перечисления |
| `src/data/sections.ts`                    | Каталог секций с описанием, локацией, расписанием, прогнозами результатов и изображениями               |
| `src/bot/app.ts`                          | Конфигурация Telegraf, подключение сцен, общие middlewares                                              |
| `src/bot/constants.ts`                    | Константы проекта (префиксы callback-данных, лимиты рекомендаций)                                       |
| `src/bot/formatters.ts`                   | Утилиты MarkdownV2, форматирование карточек рекомендаций                                                |
| `src/bot/keyboards.ts`                    | Генераторы inline-клавиатур и раскладок для шагов анкеты                                                |
| `src/bot/session.ts`                      | Структура и helpers работы с сессией (`ensureProfile`, `ensureTemp`)                                    |
| `src/bot/telegram.ts`                     | Безопасные методы отправки сообщений/фото с fallback на plain text                                      |
| `src/bot/handlers/commands.ts`            | Регистрация команд `/start`, `/restart`, `/sections`                                                    |
| `src/bot/handlers/sections.ts`            | Рендер каталога секций и обработка инлайн-навигации                                                     |
| `src/bot/scenes/onboarding.ts`            | Центральная сцена-оркестратор анкеты                                                                    |
| `src/bot/scenes/onboarding/steps/*.ts`    | Модули, описывающие отдельные шаги Wizard-сцены                                                         |
| `src/bot/scenes/onboarding/prompts.ts`    | Текстовые шаблоны и подсказки для шагов                                                                 |
| `src/bot/scenes/onboarding/helpers.ts`    | Общие функции для работы сцен (например, `sendPromptMessage`)                                           |
| `src/bot/services/imageResolver.ts`       | Нахождение файлов изображений в dev/prod среде                                                          |
| `src/bot/utils/safeHandler.ts`            | Обёртка для ловли исключений внутри Telegraf-хэндлеров                                                  |
| `src/domain/profileDefaults.ts`           | Значения профиля по умолчанию и базовые веса                                                            |
| `src/services/profileAssembler.ts`        | Компоновка пользовательских ответов в `UserProfile`                                                     |
| `src/services/submissionRecorder.ts`      | Сохранение заполненных анкет и рекомендаций в базе данных                                               |
| `src/admin/server.ts`                     | Fastify-приложение с конфигурацией сессий, статикой и подключением REST-маршрутов                       |
| `src/admin/services/statisticsService.ts` | Агрегация статистики и выборка анкет для админ-панели                                                   |
| `src/admin/routes/*.ts`                   | REST-эндпойнты `/admin/api` для авторизации, статистики и списка анкет                                  |
| `prisma/schema.prisma`                    | Схема базы данных Prisma (PostgreSQL) для хранения опросов и рекомендаций                               |
| `admin/web/src`                           | Исходники SPA админ-панели (React + Vite + TanStack Query + Chart.js)                                   |
| `test/*.test.ts`                          | Набор Jest-тестов для рекомендаций и сценариев онбординга                                               |

### Технологический стек

- **Node.js 18 + ES Modules** — основная платформа исполнения и сборки.
- **TypeScript** — статическая типизация, NodeNext-модули для корректных `.js` импортов.
- **Telegraf** — фреймворк для Telegram-ботов с поддержкой сцен и middleware.
- **Fastify** — HTTP-сервер для админ-панели с сессиями, CSRF и статикой.
- **Prisma + PostgreSQL** — слой данных для хранения ответов опросов и рекомендаций.
- **React + Vite + TanStack Query + Chart.js** — SPA-дэшборд для визуализации статистики.
- **Jest** — модульные тесты для рекомендаций и сценариев опроса.
- **tsx** — быстрый запуск TypeScript без предварительной компиляции в режиме разработки.
- **dotenv** — загрузка токена бота и других секретов из `.env`.

## Установка и запуск

1. **Клонирование и установка зависимостей**

   ```powershell
   cd d:\projects\bsuir
   npm install
   ```

2. **Настройка переменных окружения**

   ```powershell
   Copy-Item .env.example .env
   # Обязательно заполните:
   # BOT_TOKEN                – токен бота из BotFather
   # DATABASE_URL             – строка подключения к PostgreSQL
   # ADMIN_USERNAME           – логин для панели
   # ADMIN_PASSWORD           – пароль (хэш будет подсчитан автоматически)
   #   или ADMIN_PASSWORD_HASH – заранее подготовленный Argon2-хэш
   # ADMIN_SESSION_SECRET     – секрет с длиной >= 32 символа
   ```

3. **Применение миграций базы данных** (один раз на окружение)

   ```powershell
   npx prisma migrate deploy
   ```

4. **Разработка**

   - API + бот: `npm run dev` (Telegraf + Fastify на <http://localhost:3000>)
   - UI: `npm run dev:admin` (Vite dev-server на <http://localhost:5173> с прокси на API)

5. **Сборка и продакшен-запуск**

   ```powershell
   npm run build   # vite build + tsc
   npm start       # запускает бота и Fastify-сервер
   ```

6. **Проверка типов**

   ```powershell
   npx tsc --noEmit
   ```

Важно: токен бота храните конфиденциально. В случае утечки немедленно перевыпустите его через BotFather и обновите `.env`.

## Тестирование и контроль качества

- **Модульные тесты**: `npm test` выполняет Jest-спеки `recommendation.test.ts` и `recommendation.cover.test.ts`, проверяющие корректность алгоритма, и `onboarding.*.test.ts`, подтверждающие сценарии Wizard-а.
- **Статический анализ**: регулярная проверка `npx tsc --noEmit` предотвращает типовые несоответствия и ошибочные импорты.
- **Ручное тестирование**: пройдите полный сценарий `/start` → заполнение анкеты → получение рекомендаций → просмотр `/sections` → нажатие инлайн-кнопок.
- **Верификация ассетов**: убедитесь, что изображения секций находятся в `src/data/images`, а `imageResolver` находит их и в dev, и в prod.

## Планы развития

- **Интеграция CRM**: передача профилей в систему лид-менеджмента для отслеживания конверсии в записи.
- **Аналитическая панель**: веб-интерфейс для мониторинга статистики по аудитории и популярности секций.
- **Поддержка многоязычности**: перевод интерфейса и контента на русский/английский/белорусский языки.
- **Расширение каталога**: динамическая загрузка расписаний, стоимости и наличия мест из внешних источников.
- **Устойчивые сессии**: подключение Redis или базы данных для восстановления диалогов после рестарта бота.
- **Интеграция оплаты**: оформление записи и предоплаты прямо в чат-боте.
