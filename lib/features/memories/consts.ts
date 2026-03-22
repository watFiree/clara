import z from "zod";

export const memoryConfigSchema = z.object({
  memoryLimit: z.number(),
});

export type MemoryConfig = z.infer<typeof memoryConfigSchema>;

export interface MemoryAccessCheck {
  allowed: boolean;
  reason?: string;
}
