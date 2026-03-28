import { ErrorCode } from "./codes";

export class ApiError extends Error {
  constructor(public readonly code: ErrorCode) {
    super(code);
  }
}

export * from "./codes";
export * from "./errorFactory";
