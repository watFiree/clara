import z from "zod";

export const ErrorCodeSchema = z.union([
  z.literal("CONVERSATIONS_LIMIT_REACHED"),
  z.literal("USER_NOT_FOUND"),
  z.literal("UNKNOWN"),
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export const ErrorCodeStatus: Record<ErrorCode, number> = {
  CONVERSATIONS_LIMIT_REACHED: 429,
  USER_NOT_FOUND: 401,
  UNKNOWN: 404,
};
