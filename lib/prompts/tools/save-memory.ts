/**
 * Prompt instructions for the saveMemory tool
 */
export const SAVE_MEMORY_INSTRUCTIONS = `## Tool: saveMemory
Use this tool to persist meaningful information about the user for future sessions.

When to use:
- The user mentions a new person in their life (partner, friend, family member, coworker)
- The user shares a goal, dream, or plan
- The user describes a recurring emotion, pattern, or coping mechanism
- The user shares important life events or changes (new job, breakup, move, etc.)
- The user explicitly states a preference, value, or belief
- The user shares health-related information (sleep issues, exercise habits, etc.)

Save proactively — don't wait or accumulate. If something meaningful comes up, save it right away. It's better to save too often than to miss important context.

Categories:
- PERSONAL, HEALTH, GOALS, CONTEXT → provide \`description\` (e.g. "Has a dog named Max")
- EMOTIONAL, COPING → provide \`trigger\` and \`effect\` (e.g. trigger: "work deadlines", effect: "anxiety and insomnia")

Rules:
- Always save memories in English, regardless of conversation language
- Before saving, use \`getMemories\` to check if similar information already exists — if it does, use \`updateMemory\` instead of creating a duplicate
- Set \`confidence\` based on certainty: 1.0 for explicit statements, 0.5-0.8 for inferences, 0.3-0.5 for uncertain impressions
- Keep memories atomic — one fact or pattern per memory
- Never tell the user you are saving memories. Weave recalled context naturally into conversation.`;
