# Техническое описание проекта

## 1. Аннотация

Репозиторий [kotru21/bsuir](https://github.com/kotru21/bsuir) представляет прототип цифровой платформы маркетинга спортивных услуг БГУИР. Решение объединяет Telegram-бота, реализованного на Node.js 24.11 и Telegraf, с административной веб-панелью на React 18 (Vite). Оба интерфейса запускаются из одного процесса, но взаимодействуют через общие сервисы Fastify и Prisma, используя общую доменную модель и базу данных PostgreSQL. Основная научно-практическая ценность проекта заключается в алгоритме подбора спортивных секций по профилю пользователя и в едином операционном конвейере аналитики откликов.

## 2. Общая архитектура

Система построена по принципу единой серверной шины ([src/admin/server.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/server.ts)), которая инстанцирует Fastify-приложение и подключает REST-маршруты ([src/admin/routes](https://github.com/kotru21/bsuir/tree/main/src/admin/routes)). Telegraf-бот конфигурируется отдельно ([src/bot/app.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/app.ts)) и запускается рядом через [src/index.ts](https://github.com/kotru21/bsuir/blob/main/src/index.ts), поэтому обе части разделяют те же сервисы и инфраструктуру:

- слой бот-сцен: [src/bot/scenes/onboarding.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/scenes/onboarding.ts) и подпакет [steps](https://github.com/kotru21/bsuir/tree/main/src/bot/scenes/onboarding/steps);
- сервисы Fastify: статистика ([src/admin/services/statisticsService.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/services/statisticsService.ts)), регистрация откликов ([src/services/submissionRecorder.ts](https://github.com/kotru21/bsuir/blob/main/src/services/submissionRecorder.ts)), агрегация профиля ([src/services/profileAssembler.ts](https://github.com/kotru21/bsuir/blob/main/src/services/profileAssembler.ts));
- бизнес-ядро рекомендаций: [src/recommendation.ts](https://github.com/kotru21/bsuir/blob/main/src/recommendation.ts) и доменные типы [src/types.ts](https://github.com/kotru21/bsuir/blob/main/src/types.ts);
- инфраструктура доступа к данным: Prisma-клиент ([src/infrastructure/prismaClient.ts](https://github.com/kotru21/bsuir/blob/main/src/infrastructure/prismaClient.ts)) и статический каталог секций ([src/data/sections.ts](https://github.com/kotru21/bsuir/blob/main/src/data/sections.ts)).

Telegram-бот работает как отдельный Telegraf-инстанс (без Fastify-middleware) и использует in-memory сессии ([src/bot/session.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/session.ts)). Админ-панель собирается Vite и обслуживается тем же Fastify-сервером через статический раздачик. Модель данных описана в [prisma/schema.prisma](https://github.com/kotru21/bsuir/blob/main/prisma/schema.prisma) и синхронизируется с PostgreSQL.

## 3. Доменная модель и структуры данных

Каталог секций формируется из массива объектов `SportSection` ([src/data/sections.ts](https://github.com/kotru21/bsuir/blob/main/src/data/sections.ts)), типизированных через [src/types.ts](https://github.com/kotru21/bsuir/blob/main/src/types.ts). Ключевые сущности:

- `UserProfile`: возраст, пол, базовый уровень подготовки и расширенный вектор предпочтений (массивы `preferredFormats` и `desiredGoals`, карта весов `goalPriorities`, параметры `intensityComfort`, `intensityFlexibility`, `contactTolerance`, `competitionDrive`, флаги `avoidContact` и `interestedInCompetition`). Поле `formatPriorities` пока не собирается мастер-сценой и зарезервировано для будущих итераций.
- `SportSection`: идентификатор, формат (`individual`/`group`/`mixed`), уровень контактности, интенсивность, рекомендуемые уровни подготовки, ожидаемые результаты по временным горизонтам и дополнительные преимущества; при необходимости секция расширяется предвычисленным `similarityVector`.
- `RecommendationResult`: косинусная оценка `score ∈ [0, 1]`, ссылка на секцию, нормализованный вектор и перечень `RecommendationReason`, фиксирующий вклад целей, форматов, интенсивности, соревнований, контактности и дополнительных выгод.

Привязка к БД реализована через Prisma-модель [prisma/schema.prisma](https://github.com/kotru21/bsuir/blob/main/prisma/schema.prisma): сейчас сохраняются агрегированные анкеты (`SurveySubmission`) и топ-N рекомендаций (`RecommendationSnapshot`). Поштучные ответы и события интереса планируются на следующих этапах. Для анкетирования используется WizardScene Telegraf, где каждый шаг формирует часть `UserProfile` и вектор признаков, пригодный для последующего сопоставления.

## 4. Алгоритм рекомендаций

Алгоритм реализован в [src/recommendation.ts](https://github.com/kotru21/bsuir/blob/main/src/recommendation.ts) и основан на сравнении нормализованных векторов признаков профиля и каждой секции. Формально профиль `p` и секция `s` описываются вектором `v_p, v_s ∈ ℝ^n`, включающим цели (`goal:*`), форматы (`format:*`), интенсивность (`intensity:*`), соревнования (`competition`) и толерантность к контактам (`contactTolerance`). После нормализации функция сходства сводится к косинусной метрике:

$$
score(s, p) = \cos(\theta) = \frac{v_p \cdot v_s}{\lVert v_p \rVert_2\, \lVert v_s \rVert_2}, \quad score \in [0, 1].
$$

Векторы строятся функциями `buildUserVector` и `buildSectionVector`. Например, вклад интенсивности вычисляется по гибкости пользователя (`intensityFlexibility`) и его комфортному уровню (`intensityComfort`):

```typescript
const comfortTarget = clamp01(
  profile.intensityComfort ?? fitnessScalar[profile.fitnessLevel] ?? 0.5
);
const flexibility = clamp01(profile.intensityFlexibility ?? 0.4);
const tolerance = 0.35 + flexibility * 0.5;

INTENSITY_LEVELS.forEach((level) => {
  const levelValue = fitnessScalar[level];
  const distance = Math.abs(comfortTarget - levelValue);
  const weight = Math.max(0, 1 - distance / tolerance);
  if (weight > 0) {
    vector[`intensity:${level}` as VectorKey] = round(weight);
  }
});
```

После фильтрации несовместимых по контактности секций (`isContactCompatible`) оба вектора нормализуются, и косинусная близость превращается в итоговый балл. Ключевой фрагмент вычислений:

```typescript
const { similarity, contributions } = computeCosineSimilarity(
  normalizedUser,
  normalizedSection
);

const reasons = buildReasons(
  contributions,
  profile,
  section,
  userVector,
  sectionVector
);
```

`contributions` сохраняет вклад каждой размерности и позже преобразуется в массив `RecommendationReason` (совпадение целей, форматов, интенсивности, соревнований или контактности). Результирующий список сортируется по `score` и усечён до `limit` в `recommendSections`, а `fallbackSection` возвращает лучший из доступных вариантов, даже если все значения нулевые. Такое представление открывает путь к дальнейшему расширению (например, добавлению новых измерений без переписывания логики весов).

### 4.1. Планы по миграции на модели машинного обучения

Текущий векторный подход обеспечивает интерпретируемую и детерминированную выдачу рекомендаций, однако он ограничен жёсткими эвристиками. Для повышения качества персонализации и адаптивности к историческим паттернам взаимодействий предлагается постепенная миграция к гибридной ML-архитектуре, включающей retrieval + reranking. Основные шаги и мотивы:

- Сбор событий: логирование показов (`exposure`), кликов (`click`), переходов на карточки (`visit`) и конверсий (`enroll`), с метаданными (user_id, timestamp, source, campaign). Собранные записи станут основой для обучения модели ранжирования и моделей коллаборативной фильтрации.
- Candidate generation: использовать существующие content-векторы в сочетании с ANN (Faiss/Annoy) для быстрого отбора кандидатов; этот слой даёт устойчивый старт и совместим с текущими векторами.
- Reranker: обучаемый ранжировщик (LightGBM/DeepFM/NN — в зависимости от объёма данных) для предсказания вероятности конверсии; фичи — content-features, user-features, context-features и агрегированные сигналы времённой активности.
- Гибридизация: объединять content-based и collaborative approaches (NCF/ALS/LightGCN) в единый пайплайн; использовать ensemble-методы для устойчивости.
- Мониторинг и A/B-тесты: валидация offline метриками (Recall@K, NDCG@K, AUC) и последующее A/B тестирование online (CTR, conversion-to-enroll) для оценки реального эффекта.

Такой путь минимизирует риски (сохранение content-based слоя), даёт контролируемую эволюцию и позволяет сохранить объяснимость через SHAP/разложение вкладов в ранжировщике.

## 5. Телеграм-бот и диалоговый движок

Главная сцена ([src/bot/scenes/onboarding.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/scenes/onboarding.ts)) формирует Wizard посредством последовательности `intro → age → gender → fitness → intensityComfort → format → goals → goalPriority → contactPreference → competitionInterest`. Каждый шаг реализуется как модуль из каталога [src/bot/scenes/onboarding/steps](https://github.com/kotru21/bsuir/tree/main/src/bot/scenes/onboarding/steps) и использует:

- клавиатуры `Markup` из [src/bot/keyboards.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/keyboards.ts) с callback-данными вида `prefix:payload`;
- форматирование сообщений с MarkdownV2 через [src/bot/formatters.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/formatters.ts) и защитные обёртки `replyMarkdownV2Safe` / `replyWithPhotoMarkdownV2Safe` ([src/bot/telegram.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/telegram.ts));
- сессионные хелперы `ensureProfile` / `ensureTemp` из [src/bot/session.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/session.ts), гарантирующие консистентность данных.

После прохождения последнего шага профиль передаётся в `recommendSections`, а полученный список оформляется карточками с изображениями из [src/bot/services/imageResolver.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/services/imageResolver.ts) и пояснениями из [src/bot/services/recommendationPresenter.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/services/recommendationPresenter.ts). Отдельный обработчик `/sections` ([src/bot/handlers/sections.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/handlers/sections.ts)) публикует полный каталог в обход Wizard.

## 6. Административная веб-панель

Клиентская часть ([admin/web](https://github.com/kotru21/bsuir/tree/main/admin/web)) собрана на React 18 с TypeScript и Vite. Основные узлы:

- [admin/web/src/App.tsx](https://github.com/kotru21/bsuir/blob/main/admin/web/src/App.tsx): декларация роутинга (логин, дашборд, таблица анкет) и контекстов;
- [admin/web/src/auth/AuthProvider.tsx](https://github.com/kotru21/bsuir/blob/main/admin/web/src/auth/AuthProvider.tsx): cookie-сессии, CSRF-поток и хранение токена;
- [admin/web/src/charts](https://github.com/kotru21/bsuir/tree/main/admin/web/src/charts): настройка Chart.js визуализаций через TanStack Query и кастомные хуки;
- [admin/web/src/pages/DashboardPage.tsx](https://github.com/kotru21/bsuir/blob/main/admin/web/src/pages/DashboardPage.tsx) и [admin/web/src/pages/SubmissionsPage.tsx](https://github.com/kotru21/bsuir/blob/main/admin/web/src/pages/SubmissionsPage.tsx): отображение KPI и детализированных записей;
- [admin/web/src/components](https://github.com/kotru21/bsuir/tree/main/admin/web/src/components): библиотека UI-элементов (Button, Modal, TimelineChart) с Tailwind-классами;
- [admin/web/src/api](https://github.com/kotru21/bsuir/tree/main/admin/web/src/api): клиент REST-эндпойнтов `/admin/api`.

Конфигурация сборки (Vite + SWC + PostCSS) задаётся в [admin/web/vite.config.ts](https://github.com/kotru21/bsuir/blob/main/admin/web/vite.config.ts) и [admin/web/tailwind.config.ts](https://github.com/kotru21/bsuir/blob/main/admin/web/tailwind.config.ts). Статика админки поставляется через Fastify-маршрут [src/admin/routes/ui.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/routes/ui.ts).

## 7. Серверная инфраструктура Fastify

Файл [src/admin/server.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/server.ts) инициализирует Fastify с плагинами cookie-сессий, CSRF и statics, затем регистрирует маршруты:

- [src/admin/routes/auth.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/routes/auth.ts): цикл аутентификации администратора (login/logout, выдача CSRF токена);
- [src/admin/routes/stats.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/routes/stats.ts): агрегированные метрики (количество анкет, распределения по полу, уровню подготовки, временная динамика);
- [src/admin/routes/submissions.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/routes/submissions.ts): пагинированный список анкет с рекомендациями и причинами;
- [src/admin/routes/index.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/routes/index.ts): объединяющий модуль для подключения к серверу.

Сервисы [src/admin/services/statisticsService.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/services/statisticsService.ts) и [src/services/profileAssembler.ts](https://github.com/kotru21/bsuir/blob/main/src/services/profileAssembler.ts) взаимодействуют с Prisma-клиентом ([src/infrastructure/prismaClient.ts](https://github.com/kotru21/bsuir/blob/main/src/infrastructure/prismaClient.ts)) и предоставляют данные в виде DTO, совместимых с фронтендом. Поддержка админских страниц обеспечивается маршрутом [src/admin/routes/ui.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/routes/ui.ts), который сервирует Vite-бандл и proxy-запросы к SPA.

## 8. Тестирование и верификация

Unit-тесты ([test](https://github.com/kotru21/bsuir/tree/main/test)) охватывают диалоговые сцены ([test/onboarding.steps.test.ts](https://github.com/kotru21/bsuir/blob/main/test/onboarding.steps.test.ts), [test/onboarding.test.ts](https://github.com/kotru21/bsuir/blob/main/test/onboarding.test.ts)) и рекомендационный движок ([test/recommendation.test.ts](https://github.com/kotru21/bsuir/blob/main/test/recommendation.test.ts), [test/recommendation.cover.test.ts](https://github.com/kotru21/bsuir/blob/main/test/recommendation.cover.test.ts)). Для них используется Vitest с конфигурацией TypeScript (tsx). Дополнительно реализованы проверки AI-сводок ([test/aiSummary.test.ts](https://github.com/kotru21/bsuir/blob/main/test/aiSummary.test.ts)) и контекста сцены ([test/onboarding.context.test.ts](https://github.com/kotru21/bsuir/blob/main/test/onboarding.context.test.ts)).

Контроль качества обеспечивается скриптами `npm run test`, `npm run lint` и `npx tsc --noEmit`. Для визуальной проверки предусмотрен ручной сценарий: запуск `npm run dev`, прохождение анкеты через `/start`, просмотр каталога и сверка аналитики в SPA (см. README).

## 9. Развёртывание и эксплуатация

Проект поддерживает гибридный режим разработки: `npm run dev` одновременно запускает Telegraf (через `tsx src/index.ts`) и Fastify, `npm run dev:admin` — Vite Dev Server для фронтенда. Продуктивная сборка выполняется через `npm run build` (tsc → `dist/index.js`); запуск — `npm start`. Procfile позволяет развернуть сервис на Heroku-подобных платформах. Настройки окружения конфигурируются в `.env` (BOT_TOKEN, DATABASE_URL, ADMIN_SESSION_SECRET, параметры AI-инференса). Секция [docs/DEPLOYMENT.md](https://github.com/kotru21/bsuir/blob/main/docs/DEPLOYMENT.md) содержит инструкции по миграции Prisma и вариации окружений.

## 10. Заключение

Репозиторий демонстрирует комплексное решение для автоматизации рекомендаций спортивных секций, объединяющее диалоговый интерфейс и административную аналитику. Чёткое разделение ответственности в модульной структуре, формализованный алгоритм оценки секций и расширяемая инфраструктура Fastify делают проект подходящим кейсом для исследований в областях интеллектуальных рекомендательных систем, цифрового маркетинга и интеграции чат-ботов с аналитическими панелями.

## 11. Поток данных и взаимодействие компонентов

Сценарий обработки запроса начинается в Telegram. Команда `/start` активирует сцену, зарегистрированную в [src/bot/app.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/app.ts); Telegraf работает автономно и не прокидывает контекст в Fastify-сессии. Диалоговые шаги пишут промежуточные значения в `RecommendationSession` ([src/bot/session.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/session.ts)). После получения полного профиля вызывается сервис [src/services/profileAssembler.ts](https://github.com/kotru21/bsuir/blob/main/src/services/profileAssembler.ts), собирающий итоговую структуру `UserProfile`. Далее запускается `recommendSections`, и результирующие рекомендации сериализуются в DTO, пригодное для отправки через MarkdownV2.

Сейчас [src/services/submissionRecorder.ts](https://github.com/kotru21/bsuir/blob/main/src/services/submissionRecorder.ts) сохраняет агрегированную анкету и топ-N рекомендаций. Логирование детальных реакций (просмотр, интерес, повторный запуск) запланировано на будущее. Параллельно админ-панель опрашивает API `/admin/api/stats/overview` и `/admin/api/stats/timeline`, получая агрегированные метрики из накопленных `SurveySubmission` записей.

## 12. Формализация бизнес-метрик

Статистический модуль формирует сводную карту показателей. Например, ежедневная воронка конверсии рассчитывается как

$$
  ext{ConversionRate}(d) = \frac{N_{\text{completed}}(d)}{N_{\text{started}}(d)},
$$

где $N_{\text{started}}(d)$ — количество сессий, начавших сценарий в день $d$, а $N_{\text{completed}}(d)$ — завершивших его и получивших рекомендации. Источник данных — таблица submissions, читаемая Prisma-запросом в `statisticsService.ts`. Дополнительно вычисляется распределение по полу и фитнес-уровням:

$$
P_{\text{fitness}}(l) = \frac{N_l}{\sum_{k \in \{low,\ medium,\ high\}} N_k},
$$

что позволяет выявлять смещения в аудитории и адаптировать рекомендации.

## 13. Примеры реализации fitnessStep

Ниже иллюстрирован фрагмент шага выбора уровня подготовки ([src/bot/scenes/onboarding/steps/fitnessStep.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/scenes/onboarding/steps/fitnessStep.ts)), демонстрирующий работу интерактивного «слайдера» и переход к уточнению комфортной интенсивности:

```typescript
if (data === "fitness_prev") {
  temp.fitnessIndex = Math.max(0, temp.fitnessIndex - 1);
  await ctx.answerCbQuery?.();
  await sendFitnessSlider(ctx, "edit");
  return;
}

if (data === "fitness_next") {
  temp.fitnessIndex = Math.min(fitnessOrder.length - 1, temp.fitnessIndex + 1);
  await ctx.answerCbQuery?.();
  await sendFitnessSlider(ctx, "edit");
  return;
}

if (data === "fitness_done") {
  const profile = ensureProfile(ctx);
  const level = fitnessOrder[temp.fitnessIndex] ?? "medium";
  profile.fitnessLevel = level;
  await ctx.answerCbQuery?.("Уровень сохранен.");
  resetPromptState(ctx);
  await sendIntensityComfortPrompt(ctx, "new");
  await ctx.wizard.next();
  return;
}
```

Диалоговые шаги опираются на `ensureProfile`/`ensureTemp`, чтобы гарантировать присутствие mutable-объекта профиля и временного состояния, а `sendFitnessSlider`/`sendIntensityComfortPrompt` централизуют форматирование и удаление устаревших сообщений. Такой паттерн упрощает тестирование ([test/onboarding.steps.test.ts](https://github.com/kotru21/bsuir/blob/main/test/onboarding.steps.test.ts)) и делает сценарий устойчивым к повторным нажатиям.

## 14. Сервис AI-сводок

Модуль [src/services/aiSummary.ts](https://github.com/kotru21/bsuir/blob/main/src/services/aiSummary.ts) подключает внешний API (Heroku Inference) для генерации текстовых пояснений. Он принимает `RecommendationResult[]`, агрегирует причины и отправляет запрос в модель. Для избежания перегрева внешнего сервиса реализован rate limiting и таймаут, а fallback возвращает шаблонные пояснения. При наличии API-ключа админ-панель отображает AI-обзор в карточках рекомендаций; при отсутствии — использует статическое описание из [src/bot/services/recommendationPresenter.ts](https://github.com/kotru21/bsuir/blob/main/src/bot/services/recommendationPresenter.ts).

## 15. Обеспечение безопасности

Сервер Fastify применяет несколько уровней защиты:

- cookie-сессии подписываются секретом `ADMIN_SESSION_SECRET`, хранится только идентификатор сеанса;
- CSRF-модуль генерирует токены, выдаваемые эндпойнтом `/csrf` и проверяемые на POST-запросах;
- маршруты администратора оборачиваются middleware аутентификации ([src/admin/routes/auth.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/routes/auth.ts)), которое проверяет наличие валидной сессии и блокирует доступ к статистике без авторизации;
- Telegram-бот фильтрует входящие сообщения, обрабатывая только разрешённые команды, и логирует невалидные callback-данные для аудита.

## 16. Производительность и масштабирование

При росте трафика архитектура предусматривает горизонтальную масштабируемость. Fastify и Telegraf могут быть разделены на отдельные процессы с использованием очередей сообщений (например, Redis) для передачи событий. Prisma поддерживает пул подключений к PostgreSQL, а статический каталог секций кэшируется в памяти процесса и обновляется при деплое. Для админ-панели предусмотрена сборка CDN-friendly артефактов Vite; gzip/бротли-настройки могут быть добавлены на уровне reverse proxy.

## 17. Перспективы исследований

Представленный прототип служит основой для дальнейших научных экспериментов:

- внедрение гибридного рекомендательного алгоритма, который поверх текущего векторного косинусного движка добавляет модели машинного обучения (например, факторизацию матриц по собранным отзывам);
- анализ пользовательских траекторий с применением методов когортного анализа и доверительных интервалов для ConversionRate;
- интеграция A/B-тестов в процесс выдачи рекомендаций, что позволит количественно оценивать влияние новых правил построения векторов и параметров `computeCosineSimilarity` на ключевые метрики.

Эти направления могут быть описаны в дальнейших главах научной работы, используя полученный код как экспериментальную платформу.

## 18. API админ-панели

REST-интерфейс расположен под префиксом `/admin/api` и обслуживается маршрутами Fastify ([src/admin/routes](https://github.com/kotru21/bsuir/tree/main/src/admin/routes)). Аутентификация основана на cookie-сессиях, выдаваемых после `POST /admin/api/login`, и защищена CSRF-токенами. Эндпойнты разделяются на три группы:

- мониторинг (`GET /health`, `GET /csrf`, `GET /session`);
- аналитика (`GET /stats/overview`, `/stats/demographics`, `/stats/timeline?rangeDays=N`);
- анкеты (`GET /submissions?page=1&pageSize=25`).

Запросы валидируются через `zod` (см. пример в [src/admin/routes/stats.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/routes/stats.ts)). Клиентская сторона использует универсальный `apiFetch` ([admin/web/src/api/client.ts](https://github.com/kotru21/bsuir/blob/main/admin/web/src/api/client.ts)), который автоматически сериализует тело, прикрепляет cookie и маршрутизирует ошибки:

```typescript
const response = await fetch(`${API_BASE}${path}`, {
  method: method ?? "GET",
  credentials: "include",
  headers: finalHeaders,
  body: isJsonBody ? JSON.stringify(body) : null,
  ...rest,
});

if (!response.ok) {
  if (response.status === 401 && !suppressUnauthorizedEvent) {
    window.dispatchEvent(new CustomEvent("admin:unauthorized"));
  }
  throw buildError(response.status, await response.json().catch(() => null));
}
```

Таким образом, фронтенд реагирует на истекшие сессии, инициируя повторный вход. Fastify-плагин [src/admin/plugins/authentication.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/plugins/authentication.ts) дополняет запросы методами `requireAdminAuth`, `issueAdminCsrfToken`, `verifyAdminCsrfToken`, формируя строгий контур безопасности.

## 19. Хранилище данных и Prisma

Приложение использует PostgreSQL и Prisma ORM. Схема [prisma/schema.prisma](https://github.com/kotru21/bsuir/blob/main/prisma/schema.prisma) включает `SurveySubmission` (агрегированная анкета) и `RecommendationSnapshot` (сохранённые карточки выдачи). Дополнительные таблицы (`Profile`, `Interaction` и др.) пока не реализованы и описаны как возможное развитие в документации [docs/DATABASE.md](https://github.com/kotru21/bsuir/blob/main/docs/DATABASE.md). Операции выполняются через сервисы:

- [src/services/profileAssembler.ts](https://github.com/kotru21/bsuir/blob/main/src/services/profileAssembler.ts) — формирует DTO для сохранения анкет;
- [src/services/submissionRecorder.ts](https://github.com/kotru21/bsuir/blob/main/src/services/submissionRecorder.ts) — записывает рекомендации и агрегированную анкету;
- [src/admin/services/statisticsService.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/services/statisticsService.ts) — агрегирует данные для API.

Миграции управляются командами `npx prisma migrate deploy` и `npx prisma migrate dev --name <label>`. Для резервного копирования предлагаются команды `pg_dump` и `pg_restore`, адаптированные к переменной окружения `DATABASE_URL`. В разработке к базе подключается `connectPrisma()` внутри [src/index.ts](https://github.com/kotru21/bsuir/blob/main/src/index.ts); при отсутствии `DATABASE_URL` приложение запускается в режим без аналитики, выводя предупреждение.

## 20. Развёртывание и конфигурация

Файл [docs/DEPLOYMENT.md](https://github.com/kotru21/bsuir/blob/main/docs/DEPLOYMENT.md) описывает два режима: локальную разработку и продакшен. Основные переменные окружения включают `BOT_TOKEN`, `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, параметры Fastify (`FASTIFY_HOST`, `FASTIFY_PORT`).

Сборка выполняется через `npm run build` (tsc) с последующим `npm start`. Для разработки используется `npm run dev`, комбинирующий запуск Fastify и Telegraf, а клиентской части — `npm run dev:admin`. Конфигурация админки (`loadAdminConfig`) определяет необходимость авторизации, TTL сессии и параметры cookie. procfile упрощает деплой на Heroku-совместимые платформы.

## 21. Жизненный цикл приложений

[src/index.ts](https://github.com/kotru21/bsuir/blob/main/src/index.ts) координирует запуск системных компонентов:

1. загрузка `.env` и сбор конфигурации;
2. инициализация Prisma-подключения (если задана база);
3. построение Fastify-сервера (`buildAdminServer`), регистрация маршрутов и запуск на порту `PORT || 3000`;
4. настройка Telegraf-бота (`configureBot`) и запуск `bot.launch()`;
5. обработка сигналов `SIGINT`, `SIGTERM` с корректным выключением сервера, бота и базы.

Обработчики ошибок регистрируются через `process.on("unhandledRejection", ...)`, что обеспечивает журналирование неожиданных промис-ошибок.

## 22. Конфиденциальность и обеспечение доступа

Fastify-плагин аутентификации (см. раздел 15) реализован в [src/admin/plugins/authentication.ts](https://github.com/kotru21/bsuir/blob/main/src/admin/plugins/authentication.ts): он проверяет пароль с помощью Argon2 и генерирует уникальные CSRF-токены. При завершении сессии (`POST /logout`) используется `request.reply.clearAdminSession()` для уничтожения cookie. В SPA за отлов истекших сессий отвечает контекст `AuthProvider` ([admin/web/src/auth/AuthProvider.tsx](https://github.com/kotru21/bsuir/blob/main/admin/web/src/auth/AuthProvider.tsx)):

```tsx
useEffect(() => {
  const handleUnauthorized = () => {
    setState((prev) => ({
      ...prev,
      authenticated: false,
      username: null,
      csrfToken: null,
      error: "Сессия истекла. Войдите снова.",
    }));
  };
  window.addEventListener("admin:unauthorized", handleUnauthorized);
  return () =>
    window.removeEventListener("admin:unauthorized", handleUnauthorized);
}, []);
```

Так достигается непротиворечивость между серверной и клиентской сессиями.

## 23. Руководство для контрибьюторов

Документ [docs/CONTRIBUTING.md](https://github.com/kotru21/bsuir/blob/main/docs/CONTRIBUTING.md) устанавливает процессы внесения изменений:

- использовать Node.js 24.11+, настраивать `.env` и выполнять миграции перед разработкой;
- придерживаться TypeScript-стиля без неявного `any`, сохранять расширения `.js` в импортах;
- перед Pull Request запускать `npm run lint`, `npm run test`, `npx tsc --noEmit`;
- оформлять коммиты в стиле Conventional (`feat:`, `fix:`, `docs:` и т.д.).

Для UI-изменений ожидаются скриншоты, а для функциональных — описание шагов тестирования. Такой регламент облегчает ревью и поддерживает консистентность кодовой базы.

## 24. Роадмап и развитие

README содержит план развития, классифицированный по горизонту времени:

- Q4 2025: интеграция с CRM, многоязычность, расширенная аналитика;
- Q1–Q2 2026: динамический каталог, запись на занятия, система уведомлений;
- 2026+: AI-ассистент по тренировкам, мобильные приложения, геймификация.

Эти направления задают траекторию эволюции платформы и могут быть использованы для построения научных гипотез о масштабировании рекомендательных сервисов.
