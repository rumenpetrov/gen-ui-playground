import { streamText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createLibrary } from "@openuidev/react-lang";
import { LayoutOUID } from "../components/Layout";
import { StatsOUID } from "../components/Stats";
import { StatOUID } from "../components/Stat";
import { TableOUID } from "../components/Table";
import { TableHeadOUID } from "../components/TableHead";
import { TableBodyOUID } from "../components/TableBody";
import { TableRowOUID } from "../components/TableRow";
import { TableHeaderOUID } from "../components/TableHeader";
import { TableCellOUID } from "../components/TableCell";
import { TimelineOUID } from "../components/Timeline";
import { TimelineItemOUID } from "../components/TimelineItem";

export const uiLibrary = createLibrary({
  root: "Layout",
  components: [
    LayoutOUID,
    StatsOUID,
    StatOUID,
    TableOUID,
    TableHeadOUID,
    TableBodyOUID,
    TableRowOUID,
    TableHeaderOUID,
    TableCellOUID,
    TimelineOUID,
    TimelineItemOUID,
  ],
});

// Compiles the Zod schemas + OpenUI Lang grammar rules locally into text
export const SYSTEM_PROMPT = uiLibrary.prompt({
  additionalRules: [
    "NEVER put Stat directly inside Layout; always wrap Stat items inside Stats([...]).",
    "NEVER put TableRow directly inside Table; Table takes ([TableHead, TableBody]).",
    "TableHead only contains TableRow which contains TableHeader children.",
    "TableBody only contains TableRow which contains TableCell children.",
    "TableRow has 1 or multiple children.",
    "TableCell recieves only 1 argument. Never more than tihs.",
    "NEVER put TimelineItem directly inside Layout; always wrap TimelineItem items inside Timeline([...]).",
  ],
  examples: [
    `root = Layout([stats, table, timeline])
stats = Stats([s1, s2])
s1 = Stat("VWCE", "2.12%", "Up")
s2 = Stat("4GLD", "-3%", "Down")
table = Table([thead, tbody])
thead = TableHead([headrow1])
headrow1 = TableRow([TableHeader("Ticker"), TableHeader("Change")])
tbody = TableBody([bodyrow, bodyrow2])
bodyrow1 = TableRow([TableCell("VWCE"), TableCell("+2.12%")])
bodyrow2 = TableRow([TableCell("4GLD"), TableCell("-3.00%")])
timeline = Timeline([t1, t2])
t1 = TimelineItem("1984", "First Macintosh computer", "The Apple Macintosh was introduced.")
t2 = TimelineItem("1998", "iMac", "iMac is a family of all-in-one Mac desktop computers.")`,
  ],
});

const LLM_BASE_URL = "http://localhost:1235/v1";
const LLM_MODEL_ID = "google/gemma-4-e2b";

const llm = createOpenAICompatible({
  name: "llm",
  baseURL: LLM_BASE_URL,
});

export async function streamLocalUI(
  userPrompt: string,
  onChunk: (openUiCodeSoFar: string) => void,
) {
  const { textStream } = streamText({
    model: llm(LLM_MODEL_ID),
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
    temperature: 0.1,
  });

  let buffer = "";
  for await (const delta of textStream) {
    buffer += delta;
    onChunk(buffer);
  }
}
