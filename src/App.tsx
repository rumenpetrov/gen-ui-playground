import { useState } from "react";
import { Renderer } from "@openuidev/react-lang";
import Button from "./components/Button";
import Textarea from "./components/Textarea";
import { streamLocalUI, uiLibrary } from "./utils/Agent";

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

  const handleGenerate = async (e) => {
    e.preventDefault();

    setStreaming(true);
    setCode("");

    await streamLocalUI(prompt, setCode);

    setStreaming(false);
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <main className="flex-1 overflow-auto p-4">
        <Renderer library={uiLibrary} response={code} isStreaming={streaming} />
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
            >
              {suggestion}
            </button>
          ))}
        </div>

        <Textarea
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button type="submit">
          {streaming ? "Generating..." : "Generate UI"}
        </Button>
      </form>
    </div>
  );
}

export default App;
