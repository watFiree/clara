import z from "zod";

export const journalConfigSchema = z.object({
  monthlyGenerationLimit: z.number(),
  canEdit: z.boolean(),
  readToolEnabled: z.boolean(),
  updateToolEnabled: z.boolean(),
});

export type JournalConfig = z.infer<typeof journalConfigSchema>;

export interface JournalAccessCheck {
  allowed: boolean;
  reason?: string;
  monthlyGenerationLimit: number;
  canEdit: boolean;
  readToolEnabled: boolean;
  updateToolEnabled: boolean;
}
