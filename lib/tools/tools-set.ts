import { ToolSet } from "ai";
import { askQuestionsTool } from "./ask-questions/tool";
import { createSaveMemoryTool } from "./save-memory/tool";
import { createGetMemoriesTool } from "./get-memories/tool";
import { createUpdateMemoryTool } from "./update-memory/tool";
import { createReadJournalTool } from "./read-journal/tool";
import { createUpdateJournalTool } from "./update-journal/tool";
import { MemoryAccessCheck } from "../features/memories/consts";
import { JournalAccessCheck } from "../features/journal/consts";

interface ToolsSetParams {
  userId: string;
  conversationId: string;
  memoryAccess: MemoryAccessCheck;
  journalAccess: JournalAccessCheck;
}

export const createToolsSet = async ({
  userId,
  conversationId,
  memoryAccess,
  journalAccess,
}: ToolsSetParams) => {
  const tools: ToolSet = {
    askQuestions: askQuestionsTool,
  };

  if (memoryAccess.allowed) {
    tools.saveMemory = createSaveMemoryTool(userId, conversationId, memoryAccess.memoryLimit);
    tools.getMemories = createGetMemoriesTool(userId);
    tools.updateMemory = createUpdateMemoryTool(userId);
  }

  if (journalAccess.allowed) {
    if (journalAccess.readToolEnabled) {
      tools.readJournal = createReadJournalTool(userId);
    }
    if (journalAccess.updateToolEnabled) {
      tools.updateJournal = createUpdateJournalTool();
    }
  }

  return tools;
};
