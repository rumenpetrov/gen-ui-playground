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

interface ModelsResponse {
  data?: Array<{
    id?: string;
  }>;
}

export async function validateSettings(
  settings: Pick<AppSettings, "apiUrl" | "modelId">,
): Promise<{ valid: true } | { valid: false; error: string }> {
  const cleanUrl = settings.apiUrl.trim().replace(/\/+$/, "");
  const cleanModelId = settings.modelId.trim();

  if (!cleanUrl || !cleanModelId) {
    return {
      valid: false,
      error: "Both API URL and Model ID are required.",
    };
  }

  let response: Response;
  try {
    response = await fetch(`${cleanUrl}/models`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    return {
      valid: false,
      error:
        "Could not connect to the API URL. Make sure the server is running, the URL is correct (e.g. http://localhost:1235/v1), and CORS is enabled.",
    };
  }

  if (!response.ok) {
    return {
      valid: false,
      error: `API server responded with status ${response.status} (${response.statusText}) when checking ${cleanUrl}/models.`,
    };
  }

  let body: ModelsResponse;
  try {
    body = (await response.json()) as ModelsResponse;
  } catch {
    return {
      valid: false,
      error: "Invalid JSON response from /models endpoint. Check your API URL.",
    };
  }

  if (!Array.isArray(body.data)) {
    return {
      valid: false,
      error:
        "Unexpected response format from /models endpoint. Make sure the API URL points to an OpenAI-compatible base URL (ending in /v1).",
    };
  }

  const availableModels = body.data
    .map((item) => item.id)
    .filter((id): id is string => typeof id === "string");

  if (!availableModels.includes(cleanModelId)) {
    const availableHint =
      availableModels.length > 0
        ? ` Available models: ${availableModels.join(", ")}`
        : " No models are currently loaded on the server.";

    return {
      valid: false,
      error: `Model "${cleanModelId}" was not found on the server.${availableHint}`,
    };
  }

  return { valid: true };
}
