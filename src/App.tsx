import { type SubmitEvent, useState } from "react";
import { Renderer } from "@openuidev/react-lang";
import Button from "./components/Button";
import SettingsDrawer from "./components/SettingsDrawer";
import Textarea from "./components/Textarea";
import { streamLocalUI, uiLibrary } from "./utils/Agent";
import {
  type AppSettings,
  isSettingsConfigured,
  loadSettings,
  saveSettings,
} from "./utils/settings";

const promptList = [
  "Show me key performance stats for the top 5 companies in S&P 500.",
  "A timeline with the last 5 presidents of France.",
  "Display server health stats and a table of recent incidents.",
  "Show me a dashboard of website traffic metrics and top referral sources.",
  "I want to see a comparison table of the 5 largest planets in our solar system.",
  "Show me a production outage report with impact stats, a timeline of events during the incident, and a table of affected services.",
];

function App() {
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const configured = isSettingsConfigured(settings);

  const handleSaveSettings = (nextSettings: AppSettings) => {
    saveSettings(nextSettings);
    setSettings(nextSettings);
  };

  const handleGenerate = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!configured || streaming) {
      return;
    }

    setStreaming(true);
    setCode("");

    try {
      await streamLocalUI(prompt, setCode, settings);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <SettingsDrawer
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      settings={settings}
      onSave={handleSaveSettings}
    >
      <header className="shrink-0 px-6 py-3 border-b border-base-content/15 bg-base-200 flex items-center justify-between">
        <h1 className="font-semibold text-base">Gen UI Playground</h1>
        <button
          type="button"
          className="btn btn-sm bg-base-100 border-base-content/20 hover:bg-base-300"
          onClick={() => setIsSettingsOpen(true)}
        >
          Settings
        </button>
      </header>

      {configured ? (
        <>
          <main className="flex-1 overflow-auto p-4">
            <Renderer
              library={uiLibrary}
              response={code}
              isStreaming={streaming}
            />
          </main>

          <form
            onSubmit={handleGenerate}
            className="shrink-0 px-20 py-4 border-t border-base-content/15 bg-base-200 flex flex-col gap-3"
          >
            <div className="flex flex-wrap gap-2 overflow-auto">
              {promptList.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="btn btn-xs bg-base-100 border-base-content/20 hover:bg-base-300"
                  onClick={() => setPrompt(suggestion)}
                  disabled={streaming}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <Textarea
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={streaming}
            />

            <Button type="submit" disabled={streaming}>
              {streaming ? "Generating..." : "Generate UI"}
            </Button>
          </form>
        </>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
          <div className="max-w-md flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Configure LLM Settings</h2>
            <p className="text-base-content/70">
              Please configure your API URL and Model ID in the settings before
              using the app.
            </p>
            <Button type="button" onClick={() => setIsSettingsOpen(true)}>
              Open Settings
            </Button>
          </div>
        </main>
      )}
    </SettingsDrawer>
  );
}

export default App;
