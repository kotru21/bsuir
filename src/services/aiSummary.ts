import type { RecommendationResult, UserProfile } from "../types.js";

const DEFAULT_TIMEOUT_MS = 10000;

type EnvLike = Record<string, string | undefined>;

export interface AiSummaryConfig {
  apiKey: string;
  endpoint: string;
  model: string;
  timeoutMs: number;
  organization?: string;
}

export interface AiSummaryResult {
  content: string | null;
  attempted: boolean;
}

let warnedAboutConfig = false;

function parseTimeout(value: string | undefined): number {
  if (!value) {
    return DEFAULT_TIMEOUT_MS;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_TIMEOUT_MS;
  }
  return parsed;
}

function ensureNoTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

function buildEndpoint(
  baseUrl: string | undefined,
  override: string | undefined
): string | null {
  if (override) {
    return ensureNoTrailingSlash(override);
  }
  if (!baseUrl) {
    return null;
  }

  const trimmed = ensureNoTrailingSlash(baseUrl);
  if (!trimmed) {
    return null;
  }

  if (/\/chat\/completions$/i.test(trimmed)) {
    return trimmed;
  }

  if (/\/v\d+$/i.test(trimmed)) {
    return `${trimmed}/chat/completions`;
  }

  if (/\/v\d+\/chat$/i.test(trimmed)) {
    return `${trimmed}/completions`;
  }

  return `${trimmed}/v1/chat/completions`;
}

export function resolveAiConfig(env: EnvLike): AiSummaryConfig | null {
  const apiKey = env.INFERENCE_KEY?.trim() ?? "";
  const model = env.INFERENCE_MODEL_ID?.trim() ?? "";
  const endpoint = buildEndpoint(
    env.INFERENCE_URL?.trim(),
    env.INFERENCE_COMPLETIONS_URL?.trim()
  );
  const organization = env.INFERENCE_ORGANIZATION?.trim();

  if (!apiKey || !model || !endpoint) {
    const anyConfigured = Boolean(apiKey || model || endpoint);
    if (anyConfigured && !warnedAboutConfig) {
      console.warn(
        "AI summary configuration is incomplete. Set INFERENCE_KEY, INFERENCE_MODEL_ID and either INFERENCE_URL or INFERENCE_COMPLETIONS_URL."
      );
      warnedAboutConfig = true;
    }
    return null;
  }

  return {
    apiKey,
    model,
    endpoint,
    timeoutMs: parseTimeout(env.INFERENCE_TIMEOUT_MS?.trim()),
    organization: organization || undefined,
  };
}

type PromptPayload = {
  profile: UserProfile;
  recommendations: Array<{
    rank: number;
    section: {
      id: string;
      title: string;
      summary: string;
      format: string;
      intensity: string;
      focus: string[];
      extraBenefits: string[];
    };
    reasons: RecommendationResult["reasons"];
  }>;
};

function buildPromptPayload(
  profile: UserProfile,
  recommendations: RecommendationResult[]
): PromptPayload {
  return {
    profile,
    recommendations: recommendations.map((item, index) => ({
      rank: index + 1,
      section: {
        id: item.section.id,
        title: item.section.title,
        summary: item.section.summary,
        format: item.section.format,
        intensity: item.section.intensity,
        focus: [...item.section.focus],
        extraBenefits: [...(item.section.extraBenefits ?? [])],
      },
      reasons: item.reasons,
    })),
  };
}

function buildPrompt(payload: PromptPayload): string {
  return [
    "Ты — AI-ассистент спортивного консультанта БГУИР.",
    "На основе предоставленных данных сформируй 2–3 предложения на русском языке.",
    "Поясни, почему подбор релевантен, в дружелюбном и мотивирующем тоне.",
    "Упомяни максимум два направления, но сделай вывод в целом по подбору.",
    "Избегай списков, используй только текстовое объяснение.",
    "Исходные данные:",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}

export async function generateRecommendationSummary(
  profile: UserProfile,
  recommendations: RecommendationResult[],
  env?: EnvLike
): Promise<AiSummaryResult> {
  const sourceEnv: EnvLike =
    env ?? (typeof process !== "undefined" ? (process.env as EnvLike) : {});
  const config = resolveAiConfig(sourceEnv);
  if (!config) {
    return { content: null, attempted: false };
  }

  if (!recommendations.length) {
    return { content: null, attempted: false };
  }

  const payload = buildPromptPayload(profile, recommendations);
  const prompt = buildPrompt(payload);

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutHandle = controller
    ? setTimeout(() => {
        controller.abort();
      }, config.timeoutMs)
    : null;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    };
    if (config.organization) {
      headers["OpenAI-Organization"] = config.organization;
    }

    const response = await fetch(config.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that helps explain tailored sport section recommendations for students.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 240,
        temperature: 0.2,
      }),
      signal: controller?.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        `Inference API responded with status ${response.status}: ${
          errorBody || response.statusText
        }`
      );
      return { content: null, attempted: true };
    }

    const data = (await response.json().catch(() => ({}))) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.warn("Inference API response did not contain summary content.");
      return { content: null, attempted: true };
    }

    return { content, attempted: true };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("Inference API summary request timed out.");
    } else {
      console.error("Inference API summary request failed:", err);
    }
    return { content: null, attempted: true };
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}
