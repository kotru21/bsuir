# Архитектура

<!-- markdownlint-disable MD033 -->

## Обзор

Проект объединяет Telegram-бота и веб-панель администратора, которые запускаются в одном Node.js процессе: Fastify обслуживает API и статику, а Telegraf работает как отдельный бот-инстанс, разделяющий те же сервисы и базу данных. Разделы ниже содержат детализированные диаграммы и описания, вынесенные из основного README ради лучшей навигации.

> ℹ️ **Совет:** диаграммы свёрнуты по умолчанию. Нажмите «Развернуть диаграмму», чтобы увидеть схему целиком и сопроводительные пояснения.

---

## Логическая архитектура решения

<details>
<summary>Развернуть диаграмму</summary>

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
         RecEngine["Recommendation Engine<br/>векторное косинусное сходство"]
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

**Ключевые связи:**

- Telegram-бот и веб-панель используют общие сервисы и инфраструктуру.
- Рекомендательный движок нормализует векторы профиля и секций, считает косинусное сходство и сохраняет лучшие результаты через Prisma.
- Статистика и список анкет обслуживаются REST API, защищённым cookie-сессиями; CSRF проверяется только на мутациях (login/logout).

</details>

---

## Архитектура веб-панели

<details>
<summary>Развернуть диаграмму</summary>

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
      StatSvc["Сервис статистики\n(statisticsService)"]
      SubRec["Регистратор откликов\n(submissionRecorder)"]
   end

   subgraph DataLayer["Данные"]
      Prisma["Prisma Client"]
      PG[(PostgreSQL)]
      Catalog[("Каталог секций\nsections.ts")]
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

**Примечания:**

- SPA общается с API через защищённые cookie-сессии; CSRF-токен требуется только при входе/выходе.
- Fastify агрегирует статистику и отдаёт статические файлы Vite-сборки.

</details>

---

## Процесс работы чат-бота

<details>
<summary>Развернуть диаграмму</summary>

```mermaid
flowchart TD
   Start([Пользователь запускает /start])

   Start --> CheckSession{Сессия\nсуществует?}

   CheckSession -->|Нет| CreateSession[Создать новую сессию\nи показать приветствие]
   CheckSession -->|Да| CreateSession

   CreateSession --> Wizard[Wizard анкеты:\nприветствие → возраст → пол\n→ подготовка → комфорт по интенсивности\n→ формат → цели → приоритет целей\n→ контактность → интерес к соревнованиям]

   Wizard --> AssembleProfile[Собрать профиль\nпользователя]

   AssembleProfile --> ComputeRecs[Вычислить рекомендации\nrecommendSections]

   ComputeRecs --> CheckResults{Найдены\nрелевантные\nсекции?}

   CheckResults -->|Да| SendTop[Отправить топ-N секций\nс обоснованием и изображениями]
   CheckResults -->|Нет| SendFallback[Показать запасную секцию\nи подсказку для связи]

   SendTop --> ShowButtons
   SendFallback --> ShowButtons

   ShowButtons[Инлайн-кнопки:\nЗаписаться / Подробнее\nПерезапустить]

   ShowButtons --> UserAction{Действие\nпользователя}

   UserAction -.->|Записаться\nбудущий функционал| RecordInterest[Зафиксировать интерес\nв БД]
   UserAction -->|Подробнее| ShowDetails[Показать детальную\nинформацию о секции]
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

**Алгоритм:** после запуска сцены бот собирает профиль, вычисляет рекомендации, выдаёт карточки и предлагает действия через инлайн-кнопки. Шаг `RecordInterest` на диаграмме помечен пунктиром, потому что логирование интереса пока не реализовано и рассматривается как будущая доработка.

</details>

---

## Модель данных

<details>
<summary>Развернуть диаграмму</summary>

```mermaid
erDiagram
   SURVEY_SUBMISSION ||--o{ RECOMMENDATION_SNAPSHOT : "содержит"
   RECOMMENDATION_SNAPSHOT }o--|| SPORT_SECTION : "указывает_на"

   SURVEY_SUBMISSION {
      string id PK
      string telegramUserId "опциональный ID пользователя"
      string chatId "опциональный chat id"
      int age
      string gender
      string fitnessLevel
      string[] preferredFormats
      string[] desiredGoals
      boolean avoidContact
      boolean interestedInCompetition
      string aiSummary? "опциональное AI-пояснение"
      timestamp createdAt
   }

   RECOMMENDATION_SNAPSHOT {
      string id PK
      string submissionId FK
      string sectionId
      string sectionName
      float score
      int rank
      json reasons
      timestamp createdAt
   }

   SPORT_SECTION {
      string id PK
      string title
      string summary
      string format
      string contactLevel
      string intensity
      string[] focus
   }
```

**Что важно:** в текущей версии БД сохраняет только агрегированную анкету и снимки рекомендаций, а данные секций подгружаются из статического каталога `src/data/sections.ts`; таблицы с покомпонентными ответами и событиями интереса остаются в дорожной карте.

</details>

---

## Связанные материалы

- Основной обзор читайте в разделе «4. Архитектура» главного README.
- Описание базы данных вынесено в `docs/DATABASE.md`.
- Подробности развёртывания и конфигурации — в `docs/DEPLOYMENT.md`.
