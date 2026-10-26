export interface AppSettings {
  providerType: "openai-compatible" | "cloud";
  apiUrl: string;
  modelId: string;
}

const STORAGE_KEY = "gen-ui-playground:settings";

export const API_URL_PLACEHOLDER = "http://localhost:1235/v1";
export const MODEL_ID_PLACEHOLDER = "google/gemma-4-e2b";

export const DEFAULT_SETTINGS: AppSettings = {
  providerType: "openai-compatible",
  apiUrl: "",
  modelId: "",
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      providerType:
        parsed.providerType === "cloud" ? "cloud" : "openai-compatible",
      apiUrl: typeof parsed.apiUrl === "string" ? parsed.apiUrl : "",
      modelId: typeof parsed.modelId === "string" ? parsed.modelId : "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function isSettingsConfigured(settings: AppSettings): boolean {
  return Boolean(settings.apiUrl.trim() && settings.modelId.trim());
}
