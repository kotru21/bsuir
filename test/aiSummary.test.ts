import { describe, it, expect } from "vitest";
import { resolveAiConfig } from "../src/services/aiSummary.js";

describe("resolveAiConfig", () => {
  it("returns null when required values are absent", () => {
    expect(resolveAiConfig({})).toBeNull();
  });

  it("builds config when api key, model and endpoint are provided", () => {
    const config = resolveAiConfig({
      INFERENCE_KEY: "test-key",
      INFERENCE_MODEL_ID: "demo-model",
      INFERENCE_URL: "https://example.com",
      INFERENCE_TIMEOUT_MS: "5000",
    });
    expect(config).not.toBeNull();
    expect(config?.endpoint).toBe("https://example.com/v1/chat/completions");
    expect(config?.timeoutMs).toBe(5000);
  });

  it("derives endpoint from base URL when override absent", () => {
    const config = resolveAiConfig({
      INFERENCE_KEY: "test-key",
      INFERENCE_MODEL_ID: "demo-model",
      INFERENCE_URL: "https://example.com/v1/",
    });
    expect(config?.endpoint).toBe("https://example.com/v1/chat/completions");
  });

  it("prefers explicit completions URL override", () => {
    const config = resolveAiConfig({
      INFERENCE_KEY: "test-key",
      INFERENCE_MODEL_ID: "demo-model",
      INFERENCE_URL: "https://example.com/v1",
      INFERENCE_COMPLETIONS_URL: "https://alt.example/custom",
    });
    expect(config?.endpoint).toBe("https://alt.example/custom");
  });
});
