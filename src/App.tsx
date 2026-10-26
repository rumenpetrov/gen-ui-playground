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
  {
    label: "Solar System Stats",
    prompt:
      "Show 4 stats about our solar system (Planets, Moons, Age, Star Type).",
  },
  {
    label: "Apollo Timeline",
    prompt:
      "Show a timeline of the first 4 Apollo moon missions with year, mission name, and summary.",
  },
  {
    label: "Server Health",
    prompt:
      "Display 3 sample server health stats (CPU, Memory, Uptime) and a table of 3 mock incidents with Service, Severity, and Status columns.",
  },
  {
    label: "Traffic Dashboard",
    prompt:
      "Show 3 sample website traffic stats (Visitors, Bounce Rate, Avg Duration) and a table of top 4 referral sources with Source and Visits columns.",
  },
  {
    label: "Largest Planets",
    prompt:
      "Show a comparison table of the 5 largest planets in our solar system with Planet, Diameter, and Moons columns.",
  },
  {
    label: "Outage Report",
    prompt:
      "Show a sample production outage report with 3 impact stats, a 3-step timeline of events, and a table of 3 affected services.",
  },
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
                  key={suggestion.label}
                  type="button"
                  className="btn btn-xs bg-base-100 border-base-content/20 hover:bg-base-300"
                  onClick={() => setPrompt(suggestion.prompt)}
                  disabled={streaming}
                >
                  {suggestion.label}
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
