# Архитектура

<!-- markdownlint-disable MD033 -->

## Обзор

Проект объединяет Telegram-бота и веб-панель администратора, которые работают поверх единого Fastify-приложения и используют общую бизнес-логику и базу данных. Разделы ниже содержат детализированные диаграммы и описания, вынесенные из основного README ради лучшей навигации.

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
- Статистика и список анкет обслуживаются REST API, защищённым cookie-сессиями и CSRF.

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

- SPA общается с API через защищённые cookie-сессии и CSRF-токены.
- Fastify агрегирует статистику и отдаёт статические файлы Vite-сборки.

</details>

---

## Процесс работы чат-бота

<details>
<summary>Развернуть диаграмму</summary>

```mermaid
flowchart TD
   Start([Пользователь запускает /start])

   Start --> CheckSession{Сессия существует?}

   CheckSession -->|Нет| CreateSession[Создать новую сессию и показать приветствие]
   CheckSession -->|Да| CreateSession

   CreateSession --> Wizard[Wizard анкеты: приветствие → возраст → пол → подготовка → комфорт по интенсивности → формат → цели → приоритет целей → контактность → интерес к соревнованиям]

   Wizard --> AssembleProfile[Собрать профиль пользователя]

   AssembleProfile --> ComputeRecs[Вычислить рекомендации recommendSections]

   ComputeRecs --> CheckResults{Найдены релевантные секции?}

   CheckResults -->|Да| SendTop[Отправить топ-N секций с обоснованием и изображениями]
   CheckResults -->|Нет| SendFallback[Показать запасную секцию и подсказку для связи]

   SendTop --> ShowButtons
   SendFallback --> ShowButtons

   ShowButtons[Инлайн-кнопка Подробнее; Перезапустить / Записаться — в будущем]

   ShowButtons --> UserAction{Действие пользователя}

   UserAction -.->|Записаться будущий функционал| RecordInterest[Зафиксировать интерес в БД]
   UserAction -->|Подробнее| ShowDetails[Показать детальную информацию о секции]
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

**Алгоритм:** после запуска сцены бот собирает профиль, вычисляет рекомендации, выдаёт карточки и предлагает действия через инлайн-кнопки.

</details>

---

## Модель данных

<details>
<summary>Развернуть диаграмму</summary>

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
      string[] preferredFormats "Выбранные форматы тренировок"
      string[] desiredGoals "Цели (может быть несколько)"
      json goalPriorities "Вес желаемых целей"
      json formatPriorities "Вес предпочитаемых форматов"
      float intensityComfort "Комфортная интенсивность (0..1)"
      float intensityFlexibility "Гибкость восприятия нагрузки"
      boolean avoidContact "Отказ от контактных видов"
      float contactTolerance "Нормализованная толерантность к контактам"
      boolean interestedInCompetition "Были ли отмечены соревнования"
      float competitionDrive "Насколько важны соревнования"
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
      float score "Оценка соответствия (0..1, косинусное сходство)"
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

**Что важно:** модель описывает профили, ответы и рекомендации, а также реакции пользователей на секции. Секции сопровождаются медиа и прогнозами результата.

</details>

---

## Связанные материалы

- Основной обзор читайте в разделе «4. Архитектура» главного README.
- Описание базы данных вынесено в `docs/DATABASE.md`.
- Подробности развёртывания и конфигурации — в `docs/DEPLOYMENT.md`.
