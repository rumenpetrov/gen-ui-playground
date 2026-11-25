export type ProviderType = "openai-compatible" | "google";

export interface OpenAICompatibleSettings {
  apiUrl: string;
  modelId: string;
}

export interface GoogleSettings {
  apiKey: string;
  modelId: string;
}

export interface AppSettings {
  providerType: ProviderType;
  openaiCompatible: OpenAICompatibleSettings;
  google: GoogleSettings;
}

interface StoredSettings extends Partial<AppSettings> {
  apiUrl?: unknown;
  modelId?: unknown;
}

const STORAGE_KEY = "gen-ui-playground:settings";
const GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export const API_URL_PLACEHOLDER = "http://localhost:1235/v1";
export const MODEL_ID_PLACEHOLDER = "google/gemma-4-e2b";
export const GOOGLE_MODEL_ID_PLACEHOLDER = "gemini-2.5-flash";

export const DEFAULT_SETTINGS: AppSettings = {
  providerType: "openai-compatible",
  openaiCompatible: {
    apiUrl: "",
    modelId: "",
  },
  google: {
    apiKey: "",
    modelId: "",
  },
};

export function normalizeGoogleModelId(modelId: string): string {
  return modelId.trim().replace(/^models\//, "");
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(raw) as StoredSettings;
    const legacyApiUrl = typeof parsed.apiUrl === "string" ? parsed.apiUrl : "";
    const legacyModelId =
      typeof parsed.modelId === "string" ? parsed.modelId : "";

    return {
      providerType:
        parsed.providerType === "google" ? "google" : "openai-compatible",
      openaiCompatible: {
        apiUrl:
          typeof parsed.openaiCompatible?.apiUrl === "string"
            ? parsed.openaiCompatible.apiUrl
            : legacyApiUrl,
        modelId:
          typeof parsed.openaiCompatible?.modelId === "string"
            ? parsed.openaiCompatible.modelId
            : legacyModelId,
      },
      google: {
        apiKey:
          typeof parsed.google?.apiKey === "string" ? parsed.google.apiKey : "",
        modelId:
          typeof parsed.google?.modelId === "string"
            ? parsed.google.modelId
            : "",
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function isSettingsConfigured(settings: AppSettings): boolean {
  if (settings.providerType === "google") {
    return Boolean(
      settings.google.apiKey.trim() &&
        normalizeGoogleModelId(settings.google.modelId),
    );
  }

  return Boolean(
    settings.openaiCompatible.apiUrl.trim() &&
      settings.openaiCompatible.modelId.trim(),
  );
}

interface ModelsResponse {
  data?: Array<{
    id?: string;
  }>;
}

interface GoogleModelMetadata {
  name?: string;
  supportedGenerationMethods?: string[];
}

interface GoogleErrorResponse {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

async function validateOpenAICompatibleSettings(
  settings: OpenAICompatibleSettings,
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

async function validateGoogleSettings(
  settings: GoogleSettings,
): Promise<{ valid: true } | { valid: false; error: string }> {
  const cleanApiKey = settings.apiKey.trim();
  const cleanModelId = normalizeGoogleModelId(settings.modelId);

  if (!cleanApiKey || !cleanModelId) {
    return {
      valid: false,
      error: "Both API Key and Model ID are required.",
    };
  }

  const modelPath = cleanModelId.includes("/")
    ? cleanModelId.split("/").map(encodeURIComponent).join("/")
    : `models/${encodeURIComponent(cleanModelId)}`;

  let response: Response;
  try {
    response = await fetch(`${GOOGLE_API_BASE_URL}/${modelPath}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-goog-api-key": cleanApiKey,
      },
    });
  } catch {
    return {
      valid: false,
      error:
        "Could not connect to the Google Gemini API. Check your internet connection and try again.",
    };
  }

  if (!response.ok) {
    let apiMessage: string | undefined;
    try {
      const errorBody = (await response.json()) as GoogleErrorResponse;
      apiMessage = errorBody.error?.message;
    } catch {
      // Ignore JSON parsing errors on non-OK responses
    }

    if (response.status === 404) {
      return {
        valid: false,
        error:
          apiMessage ||
          `Model "${cleanModelId}" was not found on the Google Gemini API. Check the Model ID (e.g. ${GOOGLE_MODEL_ID_PLACEHOLDER}).`,
      };
    }

    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 403
    ) {
      return {
        valid: false,
        error:
          apiMessage ||
          "Invalid or unauthorized Google API key. Check your key from Google AI Studio.",
      };
    }

    return {
      valid: false,
      error:
        apiMessage ||
        `Google Gemini API responded with status ${response.status} (${response.statusText}).`,
    };
  }

  let body: GoogleModelMetadata;
  try {
    body = (await response.json()) as GoogleModelMetadata;
  } catch {
    return {
      valid: false,
      error: "Invalid JSON response from the Google Gemini API.",
    };
  }

  if (
    Array.isArray(body.supportedGenerationMethods) &&
    !body.supportedGenerationMethods.includes("generateContent")
  ) {
    return {
      valid: false,
      error: `Model "${cleanModelId}" does not support content generation (generateContent). Try a generative model like ${GOOGLE_MODEL_ID_PLACEHOLDER}.`,
    };
  }

  return { valid: true };
}

export async function validateSettings(
  settings: AppSettings,
): Promise<{ valid: true } | { valid: false; error: string }> {
  if (settings.providerType === "google") {
    return validateGoogleSettings(settings.google);
  }

  return validateOpenAICompatibleSettings(settings.openaiCompatible);
}
