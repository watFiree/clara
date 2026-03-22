import { ASK_QUESTIONS_INSTRUCTIONS } from "./ask-questions";
import { SAVE_MEMORY_INSTRUCTIONS } from "./save-memory";
import { GET_MEMORIES_INSTRUCTIONS } from "./get-memories";
import { UPDATE_MEMORY_INSTRUCTIONS } from "./update-memory";

/**
 * Build tool usage instructions section.
 * Always includes askQuestions; memory tools only when memory is enabled.
 */
export function buildToolInstructions(memoryEnabled: boolean): string {
  const sections = [
    "# Tool usage instructions\n",
    ASK_QUESTIONS_INSTRUCTIONS,
  ];

  if (memoryEnabled) {
    sections.push(
      GET_MEMORIES_INSTRUCTIONS,
      SAVE_MEMORY_INSTRUCTIONS,
      UPDATE_MEMORY_INSTRUCTIONS,
    );
  }

  return sections.join("\n\n");
}
