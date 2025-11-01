# Прототип системы цифрового маркетинга образовательно-спортивных услуг БГУИР

## Содержание

| Раздел                                                                | Описание                                             |
| --------------------------------------------------------------------- | ---------------------------------------------------- |
| [Введение](#введение)                                                 | Контекст создания прототипа и задачи проекта         |
| [Основные функции бота](#основные-функции-бота)                       | Ключевые пользовательские и операционные возможности |
| [Основные функции веб-панели](#основные-функции-веб-панели)           | Возможности админской аналитики и управления         |
| [Архитектура веб-панели](#архитектура-веб-панели)                     | Структура SPA, Fastify-API и взаимодействие модулей  |
| [Хранилище данных](#хранилище-данных)                                 | Архитектура и использование базы данных              |
| [Архитектура решения](#архитектура-решения)                           | Взаимодействие компонентов бота, API и веб-панели    |
| [Структура кода](#структура-кода)                                     | Логическое разделение модулей и зависимостей         |
| [Диаграммы чат-бота](#диаграммы-чат-бота)                             | Варианты использования, бизнес-процесс и ER-логика   |
| [Подробное описание функций](#подробное-описание-функций)             | Расширенный обзор пользовательских сценариев         |
| [Техническая документация](#техническая-документация)                 | Архитектура, файловая структура, технологии          |
| [Установка и запуск](#установка-и-запуск)                             | Настройка окружения и сценарии запуска               |
| [Тестирование и контроль качества](#тестирование-и-контроль-качества) | Набор автоматических и ручных проверок               |
| [Планы развития](#планы-развития)                                     | Идеи для расширения и внедрения                      |

## Введение

Прототип системы цифрового маркетинга образовательно-спортивных услуг БГУИР — это чат-бот в Telegram, который помогает абитуриентам, студентам и сотрудникам подобрать подходящие спортивные секции, понять ожидаемую динамику прогресса и быстро связаться с организаторами. Бот сочетает маркетинговый подход (акцент на ценностях и результатах) и персонализированную аналитику (учёт анамнеза, целей, предпочтений по формату занятий).

## Основные функции бота

- **Интерактивная анкета**: пошаговый wizard для сбора профиля пользователя (возраст, пол, физподготовка, цели, предпочтения).
- **Персонализированные рекомендации**: алгоритм scoring на основе соответствия параметров пользователя и характеристик секций.
- **Визуальное представление**: карточки секций с изображениями, прогнозами результатов и обоснованием выбора.
- **Каталог секций**: команда `/sections` для просмотра всех доступных направлений с фильтрацией.
- **Обработка интереса**: фиксация действий пользователя (просмотр, запись, обратная связь) для аналитики.

## Основные функции веб-панели

- **Дашборд аналитики**: главная страница отображает ключевые KPI — количество анкет, динамику вовлечённости, распределение по полу, возрасту, уровню подготовки и целям.
- **Просмотр анкет**: таблица откликов позволяет искать, фильтровать и раскрывать профиль каждого пользователя вместе с рекомендациями и обоснованиями.
- **Статистика по секциям**: диаграммы показывают популярность направлений и долю контактных/неконтактных видов спорта на основе собранных данных.
- **Интеграция с ботом**: все графики и таблицы обновляются в реальном времени благодаря REST API `/admin/api`, которые подтягивают свежие ответы и расчётные показатели.

## Архитектура веб-панели

### Архитектура и потоки данных

SPA общается с Fastify API через защищённые cookie-сессии и CSRF-токены, а API агрегирует статистику на основе Prisma и кеша в памяти.

```mermaid
flowchart TB
   subgraph Browser["Админ SPA (Vite/React)"]
      UI["Страницы и компоненты"]
      Query["TanStack Query"]
      Charts["Chart.js виджеты"]
   end

   subgraph Fastify["Сервер Fastify"]
      Auth["Маршруты авторизации"]
      Stats["REST /admin/api/stats"]
      Subs["REST /admin/api/submissions"]
      StaticServ["Раздача статики"]
   end

   subgraph Services["Сервисы"]
      StatSvc["Сервис статистики<br/>(statisticsService)"]
      SubRec["Регистратор откликов<br/>(submissionRecorder)"]
   end

   subgraph DataLayer["Данные"]
      Prisma["Prisma Client"]
      PG[(PostgreSQL)]
      Catalog[("Каталог секций<br/>sections.ts")]
   end

   UI -->|хуки + контекст| Query
   Query ==>|POST /login| Auth
   Query ==>|GET /stats| Stats
   Query ==>|GET /submissions| Subs
   UI -.->|загрузка бандла| StaticServ

   Stats --> StatSvc
   Subs --> StatSvc
   Subs --> SubRec

   StatSvc ==> Prisma
   SubRec ==> Prisma
   StatSvc -.-> Catalog

   Prisma ==> PG

   style Browser fill:#e3f2fd
   style Fastify fill:#fff3e0
   style Services fill:#f3e5f5
   style DataLayer fill:#e8f5e9
```

### Логика клиентского приложения

```mermaid
flowchart TD
   App["App.tsx<br/>Корневой компонент"] --> Router["React Router<br/>Маршрутизация"]
   Router --> AuthGuard["AuthProvider<br/>Провайдер авторизации"]

   AuthGuard -->|нет токена| Login["LoginPage<br/>Страница входа"]
   AuthGuard -->|валидная сессия| Layout["Layout<br/>Общий каркас"]

   Layout --> Dashboard["DashboardPage<br/>Дашборд"]
   Layout --> Submissions["SubmissionsPage<br/>Анкеты"]

   Dashboard --> ChartsSetup["charts/setup.ts<br/>Настройка Chart.js"]
   Dashboard --> Metrics["MetricCard.tsx<br/>Карточки метрик"]
   Dashboard --> DistCharts["FitnessDistributionChart.tsx<br/>Графики распределения"]

   Submissions --> TableQuery["api/stats.ts<br/>API запросы"]

   Layout --> Locale["localization.ts<br/>Локализация"]

   style App fill:#1976d2,color:#fff
   style AuthGuard fill:#f57c00,color:#fff
   style Dashboard fill:#388e3c,color:#fff
   style Submissions fill:#388e3c,color:#fff
```

### Ключевые файлы SPA

| Путь                                      | Назначение                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| `admin/web/src/main.tsx`                  | Точка входа Vite, монтирует `App` и подключает провайдеры TanStack Query      |
| `admin/web/src/App.tsx`                   | Объявляет маршруты, глобальные контексты и guard авторизации                  |
| `admin/web/src/auth/AuthProvider.tsx`     | Управляет состоянием сессии, проверяет логин, прокидывает методы входа/выхода |
| `admin/web/src/pages/DashboardPage.tsx`   | Рендер KPI, диаграммы и карточки метрик на основе статистики                  |
| `admin/web/src/pages/SubmissionsPage.tsx` | Отображает таблицу заполненных анкет с фильтрами и детализацией               |
| `admin/web/src/api/client.ts`             | HTTP-клиент с настройкой baseURL, cookie и обработкой ошибок                  |
| `admin/web/src/api/stats.ts`              | Хуки TanStack Query для получения агрегатов и списка анкет                    |
| `admin/web/src/components/Layout.tsx`     | Общий каркас, навигация и shell приложения                                    |
| `admin/web/src/charts/setup.ts`           | Инициализация Chart.js, регистрация плагинов и общих опций                    |

### Технологический стек веб-панели

- **React 18 + TypeScript** для компонентного UI и типовой безопасности.
- **Vite** как dev-сервер и сборщик, даёт HMR и быстрые билды.
- **TanStack Query** для управления асинхронными запросами и кэширования данных.
- **React Router** для client-side навигации между страницами панели.
- **Chart.js + chartjs-adapter-date-fns** для визуализации показателей.
- **Fastify + @fastify/static + @fastify/cookie** для раздачи бандла, API и авторизации.
- **Prisma** в качестве DAL между API и PostgreSQL.

## Хранилище данных

- **PostgreSQL + Prisma**: структура базы данных описана в `prisma/schema.prisma`; миграции позволяют синхронизировать схему между окружениями.
- **Сущности**: база хранит профили пользователей, их ответы по шагам анкеты, рассчитанные рекомендации и журналы взаимодействий с секциями.
- **Связь с приложением**: бот записывает заполненные анкеты через `SubmissionRecorder`, а админ-панель читает агрегированные срезы через `statisticsService`.
- **Миграции и деплой**: команда `npx prisma migrate deploy` применяется при раскатке на новый стенд, гарантируя согласованность схемы.
- **Переменные окружения**: строка подключения `DATABASE_URL` задаётся в `.env`; секретные данные не хранятся в репозитории и должны управляться через защищённые секреты.

## Архитектура решения

- **Коммуникация**: Telegram-пользователи взаимодействуют с ботом через Telegraf, а маркетинговая команда использует веб-панель; оба слоя работают поверх единого Fastify-приложения.
- **Данные**: рекомендательный движок читает статический каталог и дополнительно сохраняет результаты в PostgreSQL через Prisma для аналитики.
- **Интерфейсы**: REST API `/admin/api` обслуживает SPA, а бот получает апдейты и отправляет ответы, используя общие сервисы и форматтеры.

```mermaid
flowchart TB
   User["Клиент Telegram"]
   AdminBrowser["Браузер администратора"]

   subgraph Backend["Node.js Backend"]
      subgraph Telegraf["Telegraf Bot"]
         BotHandlers["Обработчики команд"]
         BotScenes["Wizard сцены"]
      end

      subgraph FastifyApp["Fastify Server"]
         AdminAPI["REST API /admin/api"]
         StaticFiles["Раздача статики"]
         Sessions["Cookie-сессии"]
      end

      subgraph BusinessLogic["Бизнес-логика"]
         RecEngine["Recommendation Engine<br/>scoring алгоритм"]
         ProfileAssembler["Profile Assembler"]
         StatService["Statistics Service"]
      end
   end

   subgraph Data["Слой данных"]
      Prisma["Prisma ORM"]
      DB[(PostgreSQL)]
      Catalog[("Каталог секций<br/>sections.ts + images")]
   end

   User <-->|Telegram Bot API| BotHandlers
   BotHandlers --> BotScenes
   BotScenes --> ProfileAssembler
   ProfileAssembler --> RecEngine

   AdminBrowser -->|HTTPS| Sessions
   Sessions --> AdminAPI
   AdminBrowser -.->|загрузка SPA| StaticFiles

   AdminAPI --> StatService
   RecEngine --> Catalog
   RecEngine ==> Prisma
   BotScenes ==> Prisma
   StatService ==> Prisma
   Prisma ==> DB

   style Backend fill:#e3f2fd
   style Data fill:#e8f5e9
   style User fill:#fff3e0
   style AdminBrowser fill:#fff3e0
```

**Легенда:**

- `==>` Основные потоки данных (критичные)
- `-->` Синхронные вызовы
- `<-->` Двусторонняя коммуникация
- `-.->` Загрузка статических ресурсов

### Развёртывание

Один Node.js процесс обслуживает и бота, и API; статика админ-панели раздаётся Fastify, а база может быть общедоступной или управляемой через облако.

## Структура кода

- **Слои приложения**: код разделён на пользовательский интерфейс (бот и веб-панель), доменную логику (рекомендации, профили), инфраструктуру (Prisma) и сервисы (статистика, сбор данных).
- **Модули**: `src/bot` содержит сцены и утилиты Telegraf, `src/admin` — HTTP-сервер и API, `src/services` и `src/domain` инкапсулируют бизнес-логику, `prisma/` управляет схемой данных.
- **Повторное использование**: общие типы и функции импортируются через `src/types.ts` и `profileDefaults.ts`, обеспечивая согласованность между ботом и админкой.

```mermaid
flowchart TD
   subgraph Presentation["Презентационный слой"]
      A["bot/app.ts<br/>Telegraf App"]
      B["bot/scenes/onboarding<br/>Wizard сцены"]
      C["admin/web/src<br/>React SPA"]
   end

   subgraph Services["Сервисы"]
      D["recommendation.ts<br/>Scoring Engine"]
      E["profileAssembler.ts<br/>Сборка профилей"]
      F["submissionRecorder.ts<br/>Запись анкет"]
      G["statisticsService.ts<br/>Аналитика"]
   end

   subgraph Infrastructure["Инфраструктура"]
      H["prismaClient.ts<br/>ORM клиент"]
      I["schema.prisma<br/>Схема БД"]
      J["imageResolver.ts<br/>Резолвинг изображений"]
   end

   subgraph DataLayer["Слой данных"]
      K["sections.ts<br/>Каталог секций"]
   end

   A ==> B
   A ==> D
   A ==> J
   A --> F

   B ==> E
   E ==> D

   C -.->|HTTP API| G

   F ==> H
   G ==> H
   H ==> I

   D --> K
   J -.-> K

   style Presentation fill:#e3f2fd
   style Services fill:#fff3e0
   style Infrastructure fill:#f3e5f5
   style DataLayer fill:#e8f5e9
```

**Зависимости:** Визуальная схема показывает, как Telegraf сцены используют сервисы для сборки профиля и рекомендаций, а админ-панель опирается на статистический сервис, который агрегирует данные из той же инфраструктуры.

## Диаграммы чат-бота

### Диаграмма вариантов использования

```mermaid
flowchart TB
   user("Пользователь<br/>Telegram")
   marketing("Маркетинговая<br/>команда")

   subgraph system ["Система цифрового маркетинга БГУИР"]
      direction TB

      subgraph user_functions ["Функции пользователя"]
         start["Начать диалог<br/>/start"]
         profile["Заполнить анкету<br/>профилирование"]
         recommend["Получить<br/>рекомендации"]
         sections["Просмотреть<br/>каталог секций"]
      end

      subgraph admin_functions ["Функции администратора"]
         analytics["Просмотреть<br/>аналитику"]
         export["Экспортировать<br/>данные"]
      end
   end

   user --> start
   user --> sections


   start --> profile
   profile --> recommend

   marketing --> analytics
   marketing --> submissions
   marketing --> export

   style system fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
   style user_functions fill:#fff3e0,stroke:#f57c00,stroke-width:2px
   style admin_functions fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
   style user fill:#ffebee,stroke:#c62828,stroke-width:2px
   style marketing fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px
```

**Расшифровка:** Пользователь Telegram инициирует диалог, проходит профилирование и получает рекомендации; маркетинговая команда использует административные функции для анализа и экспорта данных.

### Бизнес-процесс взаимодействия

```mermaid
flowchart TD
   Start([Пользователь запускает /start])

   Start --> CheckSession{Сессия<br/>существует?}

   CheckSession -->|Нет| CreateSession[Создать новую сессию<br/>и показать приветствие]
   CheckSession -->|Да| CreateSession

   CreateSession --> Wizard[Wizard анкеты:<br/>возраст → пол → подготовка<br/>→ формат → цели → контактность]

   Wizard --> AssembleProfile[Собрать профиль<br/>пользователя]

   AssembleProfile --> ComputeRecs[Вычислить рекомендации<br/>recommendSections]

   ComputeRecs --> CheckResults{Найдены<br/>релевантные<br/>секции?}

   CheckResults -->|Да| SendTop[Отправить топ-N секций<br/>с обоснованием и изображениями]
   CheckResults -->|Нет| SendFallback[Показать запасную секцию<br/>и подсказку для связи]

   SendTop --> ShowButtons
   SendFallback --> ShowButtons

   ShowButtons[Инлайн-кнопки:<br/>Записаться / Подробнее<br/>Перезапустить]

   ShowButtons --> UserAction{Действие<br/>пользователя}

   UserAction -.->|Записаться<br/>будущий функционал| RecordInterest[Зафиксировать интерес<br/>в БД]
   UserAction -->|Подробнее| ShowDetails[Показать детальную<br/>информацию о секции]
   UserAction -->|Перезапустить| CreateSession

   RecordInterest -.-> End([Завершение сценария])
   ShowDetails --> ShowButtons

   style Start fill:#4caf50,color:#fff
   style End fill:#f44336,color:#fff
   style CheckSession fill:#ff9800,color:#fff
   style CheckResults fill:#ff9800,color:#fff
   style UserAction fill:#ff9800,color:#fff
   style Wizard fill:#2196f3,color:#fff
   style ComputeRecs fill:#9c27b0,color:#fff
   style RecordInterest fill:#9e9e9e,color:#fff,stroke-dasharray: 5 5
```

**Расшифровка:** При запуске бота проверяется наличие сессии и заполненного профиля. Если профиль есть, пользователь может продолжить с ним или перезапустить. После заполнения анкеты движок рекомендаций подбирает секции, а пользователь взаимодействует с результатами через инлайн-кнопки.

### Логическая диаграмма сущность-связь

```mermaid
erDiagram
   ПРОФИЛЬ_ПОЛЬЗОВАТЕЛЯ ||--o{ ОТВЕТ : "содержит"
   ПРОФИЛЬ_ПОЛЬЗОВАТЕЛЯ ||--o{ РЕКОМЕНДАЦИЯ : "получает"
   ПРОФИЛЬ_ПОЛЬЗОВАТЕЛЯ ||--o{ ИНТЕРЕС_К_СЕКЦИИ : "проявляет"

   РЕКОМЕНДАЦИЯ }o--|| СПОРТ_СЕКЦИЯ : "указывает_на"
   ИНТЕРЕС_К_СЕКЦИИ }o--|| СПОРТ_СЕКЦИЯ : "относится_к"

   СПОРТ_СЕКЦИЯ ||--o{ ПРОГНОЗ_РЕЗУЛЬТАТА : "описывает"
   СПОРТ_СЕКЦИЯ ||--o{ МЕДИА_АКТИВ : "иллюстрирует"

   ПРОФИЛЬ_ПОЛЬЗОВАТЕЛЯ {
      int id PK
      string telegramId UK "Уникальный ID Telegram"
      int age "Возраст пользователя"
      enum gender "Пол (male/female/other)"
      enum fitnessLevel "Уровень подготовки"
      enum formatPreference "Предпочтительный формат"
      enum goal "Основная цель"
      boolean contactSportsOk "Согласие на контактные виды"
      timestamp createdAt
      timestamp updatedAt
   }

   ОТВЕТ {
      int id PK
      int profileId FK
      string stepId "Идентификатор шага"
      string value "Значение ответа"
      timestamp timestamp "Время ответа"
   }

   СПОРТ_СЕКЦИЯ {
      string id PK "Уникальный идентификатор"
      string title "Название секции"
      string description "Описание"
      string location "Место проведения"
      string scheduleSummary "Расписание (текст)"
      enum contactType "contact/non-contact"
      int minAge "Минимальный возраст"
      int maxAge "Максимальный возраст"
      string[] suitableFor "Подходящие цели"
   }

   РЕКОМЕНДАЦИЯ {
      int id PK
      int profileId FK
      string sectionId FK
      float score "Оценка соответствия (0-100)"
      string[] reasons "Причины рекомендации"
      int rank "Позиция в рейтинге"
      timestamp createdAt
   }

   ИНТЕРЕС_К_СЕКЦИИ {
      int id PK
      int profileId FK
      string sectionId FK
      enum actionType "view/contact/register"
      timestamp timestamp
   }

   ПРОГНОЗ_РЕЗУЛЬТАТА {
      int id PK
      string sectionId FK
      string horizon "1_month/3_months/6_months"
      string description "Описание ожидаемого результата"
   }

   МЕДИА_АКТИВ {
      int id PK
      string sectionId FK
      string path "Путь к файлу"
      string altText "Альтернативный текст"
      enum type "image/video"
   }
```

**Расшифровка:**

- Один профиль может иметь много ответов, рекомендаций и интересов к секциям
- Каждая рекомендация и интерес привязаны к конкретной спортивной секции
- Секции имеют множественные прогнозы результатов и медиа-активы
- Добавлена сущность `ИНТЕРЕС_К_СЕКЦИИ` для отслеживания взаимодействий пользователя

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

### Структура проекта

#### Backend (src/)

```text
src/
├── bot/              # Telegram бот (Telegraf)
│   ├── scenes/       # Онбординг-сценарии
│   ├── handlers/     # Команды и действия
│   └── services/     # Резолвинг изображений
├── admin/            # REST API для админки (Fastify)
│   ├── routes/       # Эндпоинты
│   └── services/     # Статистика
├── services/         # Бизнес-логика
├── data/             # Каталог секций + изображения
├── infrastructure/   # Prisma, DB
└── recommendation.ts # Алгоритм подбора
```

#### Frontend (admin/web/)

```text
admin/web/src/
├── pages/         # Страницы админки
├── components/    # UI компоненты
└── api/           # HTTP клиент
```

#### Database (prisma/)

```text
prisma/
├── schema.prisma  # Модели данных
└── migrations/    # История миграций
```

### Назначение ключевых файлов и модулей

#### Бот (Telegram)

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
| `src/bot/handlers/commands.ts`            | Регистрация команд `/start`, `/sections`                                                                |
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
| `test/*.test.ts`                          | Набор Jest-тестов для рекомендаций и сценариев онбординга                                               |

#### Админ: web (frontend)

| Путь (admin/web/src)               | Назначение                                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| `main.tsx`                         | Точка монтирования SPA; настраивает TanStack Query, роутер и провайдеры приложения. |
| `App.tsx`                          | Маршрутизация, layout и общая оболочка приложения (AuthGuard, навигация).           |
| `localization.ts`                  | Файлы локализации/строки интерфейса и вспомогательные функции переводов.            |
| `api/client.ts`                    | HTTP-клиент с настройкой baseURL, cookie и обработкой ошибок для REST-запросов.     |
| `api/auth.ts`                      | Хуки/утилиты для аутентификации администраторов (login/logout).                     |
| `api/stats.ts`                     | Хуки TanStack Query для получения агрегатов статистики и списка анкет.              |
| `pages/DashboardPage.tsx`          | Дашборд: KPI и диаграммы (Chart.js) для аналитики анкет и вовлечённости.            |
| `pages/LoginPage.tsx`              | Страница входа для администраторов с формой и обработкой ошибок.                    |
| `pages/SubmissionsPage.tsx`        | Список анкет: таблица, фильтры и подробный просмотр профилей/рекомендаций.          |
| `components/Layout.tsx`            | Общая структура страниц: шапка, навигация и контейнер содержимого.                  |
| `components/MetricCard.tsx`        | Визуальные карточки метрик для KPI (числа, тренды).                                 |
| `components/FullscreenSpinner.tsx` | Компонент-заглушка для ожидания загрузки (полноэкранный спиннер).                   |
| `components/TimelineChart.tsx`     | Компонент диаграммы временных рядов (использует Chart.js адаптеры).                 |
| `charts/setup.ts`                  | Инициализация Chart.js, регистрация адаптеров и общих опций графиков.               |
| `auth/AuthProvider.tsx`            | Провайдер контекста аутентификации, хранит состояние сессии администратора.         |
| `styles.css`                       | Базовые стили приложения и переменные темы.                                         |

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

### 1. Клонирование и установка зависимостей

```powershell
cd d:\projects\bsuir
npm install
```

### 2. Настройка переменных окружения

```powershell
Copy-Item .env.example .env
```

Обязательно заполните:

- `BOT_TOKEN` – токен бота из BotFather
- `DATABASE_URL` – строка подключения к PostgreSQL
- `ADMIN_USERNAME` – логин для панели
- `ADMIN_PASSWORD` – пароль (хэш будет подсчитан автоматически)
  или `ADMIN_PASSWORD_HASH` – заранее подготовленный Argon2-хэш
- `ADMIN_SESSION_SECRET` – секрет с длиной >= 32 символа

### 3. Применение миграций базы данных

Один раз на окружение:

```powershell
npx prisma migrate deploy
```

### 4. Разработка

**API + бот:**

```powershell
npm run dev
```

Telegraf + Fastify на http://localhost:3000

**UI:**

```powershell
npm run dev:admin
```

Vite dev-server на http://localhost:5173 с прокси на API

### 5. Сборка и продакшен-запуск

```powershell
npm run build   # vite build + tsc
npm start       # запускает бота и Fastify-сервер
```

### 6. Проверка типов

```powershell
npx tsc --noEmit
```

> ⚠️ **Важно:** Токен бота храните конфиденциально. В случае утечки немедленно перевыпустите его через BotFather и обновите `.env`.

## Тестирование и контроль качества

### Автоматические тесты

```powershell
npm test
```

Выполняет Jest-спеки:

- `recommendation.test.ts` и `recommendation.cover.test.ts` — проверка корректности алгоритма scoring
- `onboarding.*.test.ts` — подтверждение сценариев Wizard-а

### Статический анализ

```powershell
npx tsc --noEmit
```

Предотвращает типовые несоответствия и ошибочные импорты.

### Ручное тестирование

Полный сценарий проверки:

1. `/start` → заполнение анкеты
2. Получение рекомендаций с изображениями
3. Просмотр `/sections`
4. Нажатие инлайн-кнопок (записаться, подробнее)
5. Проверка админ-панели (логин, дашборд, анкеты)

### Верификация ассетов

Убедитесь, что:

- Изображения секций находятся в `src/data/images`
- `imageResolver` корректно находит их в dev и prod окружениях
- Все пути в `sections.ts` актуальны

## Планы развития

### Краткосрочные (Q1-Q2 2025)

- **Интеграция CRM**: передача профилей в систему лид-менеджмента для отслеживания конверсии в записи
- **Поддержка многоязычности**: перевод интерфейса и контента на английский/белорусский языки
- **Расширение аналитики**: когортный анализ, воронка конверсии, A/B тесты

### Среднесрочные (Q3-Q4 2025)

- **Расширение каталога**: динамическая загрузка расписаний, стоимости и наличия мест из внешних источников
- **Интеграция оплаты**: оформление записи и предоплаты прямо в чат-боте
- **Система уведомлений**: напоминания о занятиях, достижениях, акциях

### Долгосрочные (2026+)

- **AI-ассистент**: интеграция GPT для консультаций по тренировкам
- **Мобильное приложение**: нативные iOS/Android клиенты
- **Геймификация**: система достижений, рейтинги, челленджи

---
