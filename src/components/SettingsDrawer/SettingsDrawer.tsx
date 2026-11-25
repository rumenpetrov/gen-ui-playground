import { type ReactNode, type SubmitEvent, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import {
  API_URL_PLACEHOLDER,
  type AppSettings,
  GOOGLE_MODEL_ID_PLACEHOLDER,
  MODEL_ID_PLACEHOLDER,
  normalizeGoogleModelId,
  validateSettings,
} from "../../utils/settings";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  children: ReactNode;
}

const SettingsForm = ({
  settings,
  onSave,
  onClose,
}: Pick<SettingsDrawerProps, "settings" | "onSave" | "onClose">) => {
  const [providerType, setProviderType] = useState<AppSettings["providerType"]>(
    settings.providerType,
  );
  const [openaiApiUrl, setOpenaiApiUrl] = useState(
    settings.openaiCompatible.apiUrl,
  );
  const [openaiModelId, setOpenaiModelId] = useState(
    settings.openaiCompatible.modelId,
  );
  const [googleApiKey, setGoogleApiKey] = useState(settings.google.apiKey);
  const [googleModelId, setGoogleModelId] = useState(settings.google.modelId);
  const [showApiKey, setShowApiKey] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validating) {
      return;
    }

    const nextSettings: AppSettings = {
      providerType,
      openaiCompatible: {
        apiUrl: openaiApiUrl.trim().replace(/\/+$/, ""),
        modelId: openaiModelId.trim(),
      },
      google: {
        apiKey: googleApiKey.trim(),
        modelId: normalizeGoogleModelId(googleModelId),
      },
    };

    setValidating(true);
    setError(null);

    try {
      const validation = await validateSettings(nextSettings);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      onSave(nextSettings);
      onClose();
    } finally {
      setValidating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? (
        <div role="alert" className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      ) : null}

      <fieldset className="fieldset">
        <legend className="fieldset-legend">API Provider</legend>
        <Select
          name="providerType"
          value={providerType}
          onChange={(e) => {
            setProviderType(e.target.value as AppSettings["providerType"]);
            setShowApiKey(false);
            if (error) {
              setError(null);
            }
          }}
          disabled={validating}
        >
          <option value="openai-compatible">OpenAI-Compatible</option>
          <option value="google">Google Gemini</option>
        </Select>
      </fieldset>

      {providerType === "openai-compatible" ? (
        <>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">API URL</legend>
            <Input
              name="apiUrl"
              type="url"
              placeholder={API_URL_PLACEHOLDER}
              value={openaiApiUrl}
              onChange={(e) => {
                setOpenaiApiUrl(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              disabled={validating}
              required
            />
            <p className="label text-xs opacity-70">
              We suggest LM Studio Bionic
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Model ID</legend>
            <Input
              name="modelId"
              type="text"
              placeholder={MODEL_ID_PLACEHOLDER}
              value={openaiModelId}
              onChange={(e) => {
                setOpenaiModelId(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              disabled={validating}
              required
            />
          </fieldset>
        </>
      ) : (
        <>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">API Key</legend>
            <div className="join w-full">
              <Input
                name="googleApiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="AIza..."
                value={googleApiKey}
                onChange={(e) => {
                  setGoogleApiKey(e.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                className="join-item"
                autoComplete="off"
                disabled={validating}
                required
              />
              <button
                type="button"
                className="btn join-item bg-base-100 border-base-content/20 hover:bg-base-300"
                onClick={() => setShowApiKey((prev) => !prev)}
                disabled={validating}
                aria-label={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="label text-xs opacity-70 whitespace-normal">
              <span>
                Get an API key from{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  Google AI Studio
                </a>
                . Stored locally in your browser.
              </span>
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Model ID</legend>
            <Input
              name="googleModelId"
              type="text"
              placeholder={GOOGLE_MODEL_ID_PLACEHOLDER}
              value={googleModelId}
              onChange={(e) => {
                setGoogleModelId(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              disabled={validating}
              required
            />
          </fieldset>
        </>
      )}

      <div className="mt-2 flex flex-col">
        <Button type="submit" disabled={validating}>
          {validating ? "Validating..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export const SettingsDrawer = ({
  isOpen,
  onClose,
  settings,
  onSave,
  children,
}: SettingsDrawerProps) => {
  return (
    <div className="drawer drawer-end h-dvh overflow-hidden">
      <input
        id="settings-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={(e) => {
          if (!e.target.checked) {
            onClose();
          }
        }}
      />
      <div className="drawer-content flex flex-col h-dvh overflow-hidden">
        {children}
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="settings-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="bg-base-200 text-base-content min-h-full w-96 max-w-full p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-circle"
              onClick={onClose}
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          <SettingsForm
            key={`${isOpen}-${JSON.stringify(settings)}`}
            settings={settings}
            onSave={onSave}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsDrawer;
