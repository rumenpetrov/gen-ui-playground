import { type ReactNode, type SubmitEvent, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import {
  API_URL_PLACEHOLDER,
  type AppSettings,
  MODEL_ID_PLACEHOLDER,
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
  const [apiUrl, setApiUrl] = useState(settings.apiUrl);
  const [modelId, setModelId] = useState(settings.modelId);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      providerType,
      apiUrl: apiUrl.trim(),
      modelId: modelId.trim(),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">API Provider</legend>
        <Select
          name="providerType"
          value={providerType}
          onChange={(e) =>
            setProviderType(e.target.value as AppSettings["providerType"])
          }
          disabled
        >
          <option value="openai-compatible">openai-compatible</option>
          <option value="cloud">cloud</option>
        </Select>
        <p className="label text-xs opacity-70">
          Cloud API is not supported yet.
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">API URL</legend>
        <Input
          name="apiUrl"
          type="url"
          placeholder={API_URL_PLACEHOLDER}
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          required
        />
        <p className="label text-xs opacity-70">We suggest LM Studio Bionic</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Model ID</legend>
        <Input
          name="modelId"
          type="text"
          placeholder={MODEL_ID_PLACEHOLDER}
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          required
        />
      </fieldset>

      <div className="mt-2 flex flex-col">
        <Button type="submit">Save</Button>
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
            key={`${isOpen}-${settings.providerType}-${settings.apiUrl}-${settings.modelId}`}
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
