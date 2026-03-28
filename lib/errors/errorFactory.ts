import { NextResponse } from "next/server";
import { ErrorCode, ErrorCodeStatus } from "./codes";

export const ErrorFactory = (errorCode: ErrorCode) =>
  NextResponse.json(
    {
      error: errorCode,
    },
    {
      status: ErrorCodeStatus[errorCode],
    },
  );
