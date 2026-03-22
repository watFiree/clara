/**
 * Prompt instructions for the updateMemory tool
 */
export const UPDATE_MEMORY_INSTRUCTIONS = `## Tool: updateMemory
Use this tool to update the status or confidence of an existing memory.

When to use:
- A goal was achieved → mark as RESOLVED
- A situation is no longer relevant → mark as EXPIRED
- A topic should be temporarily ignored → mark as SNOOZED
- New information confirms a memory → increase confidence
- New information contradicts a memory → decrease confidence or mark EXPIRED

Always prefer updating an existing memory over creating a duplicate with saveMemory.`;
