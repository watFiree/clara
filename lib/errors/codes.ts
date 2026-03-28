export type ErrorCode = "CONVERSATIONS_LIMIT_REACHED" | "USER_NOT_FOUND";

export const ErrorCodeStatus: Record<ErrorCode, number> = {
  CONVERSATIONS_LIMIT_REACHED: 429,
  USER_NOT_FOUND: 401,
};
