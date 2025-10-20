# BSUIR Sport Marketing Telegram Bot

Prototype Telegram bot in TypeScript that recommends BSUIR educational-sport sections based on user preferences and physical data.

## Features

- Step-by-step conversational wizard to collect age, gender, fitness level, training format preferences, goals, and contact tolerance.
- Rule-based recommendation engine mapping user profile to curated section data extracted from the programme descriptions.
- Highlights expected results (1, 3, 6+ months) and unique benefits for each suggested section.
- Commands:
  - `/start` — launch the assistant.
  - `/restart` — restart the questionnaire.
  - `/sections` — list all available sections with short summaries.

## Getting Started

1. **Install dependencies**

   ```powershell
   cd d:\projects\bsuir
   npm install
   ```

2. **Configure environment**

   - Copy `.env.example` to `.env` and set your bot token from [BotFather](https://core.telegram.org/bots#botfather).

   ```powershell
   Copy-Item .env.example .env
   # then edit .env to set BOT_TOKEN
   ```

3. **Run in development mode**

   ```powershell
   npm run dev
   ```

4. **Build for production**

   ```powershell
   npm run build
   npm start
   ```

Ensure the bot token is kept secret. Revoke it via BotFather if exposed.

## Project Structure

```text
src/
  data/sections.ts      # Structured catalogue of sport sections
  recommendation.ts     # Scoring logic for matching user profiles
  index.ts              # Telegram bot entry point with dialogue flow
  types.ts              # Shared TypeScript types
.env.example            # Template for environment variables
package.json            # Dependency and script definitions
tsconfig.json           # TypeScript compiler configuration
```

## Next Steps

- Connect to a persistent data source for live section schedules and location info.
- Add multi-language support (e.g., Russian/English toggles).
- Expand analytics to log anonymised questionnaire results for marketing insights.
- Integrate admin commands for updating section metadata via chat.

## Local images for sections

If you prefer to store section images locally (recommended for offline hosting), place image files in `src/data/images`.

- Default filenames (used by `src/data/sections.ts`):
  - athleticGymnastics.jpg
  - basketball.jpg
  - wrestling.jpg
  - volleyball.jpg
  - aikido.jpg
  - muayThai.jpg
  - trackAndField.jpg
  - futsal.jpg
  - swimming.jpg
  - rhythmicGymnastics.jpg
  - specialMedical.jpg
  - football.jpg

After placing images, run the bot as usual (`npm run dev`). The `/sections` command will show the slider using these local files.
