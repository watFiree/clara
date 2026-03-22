/**
 * Prompt instructions for the getMemories tool
 */
export const GET_MEMORIES_INSTRUCTIONS = `## Tool: getMemories
Use this tool to retrieve stored information about the user.

When to use:
- At the START of every conversation — use a broad query to recall general context about the user
- When the user references something from a previous session
- Before saving a new memory — check if similar information already exists to avoid duplicates
- When the user says "remember when..." or references past topics

Tips:
- Use descriptive queries for best results (e.g. "user's family and relationships" instead of just "family")
- Filter by category when you know what type of information you need
- Never tell the user you are checking memories — weave recalled context naturally into conversation.`;
