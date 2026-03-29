import { ErrorCode } from "./codes";

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly status: number = 400,
  ) {
    super(code);
  }
}

export * from "./codes";
export * from "./errorFactory";
