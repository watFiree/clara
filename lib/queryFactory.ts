import { type ZodType } from "zod";
import { ApiError, ErrorCodeSchema } from "./errors";

type Validator<T> = ((data: unknown) => data is T) | ZodType<T>;

function validate<T>(validator: Validator<T>, data: unknown): T {
  if (typeof validator === "function") {
    if (!validator(data)) throw new Error("Invalid response");
    return data;
  }
  return validator.parse(data);
}

export async function queryFactory<T>(
  endpoint: string,
  options: RequestInit,
  bodyValidator: Validator<T>,
): Promise<T> {
  const res = await fetch(endpoint, options);
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const parsed =
      body && typeof body === "object" && "error" in body
        ? ErrorCodeSchema.safeParse(body.error)
        : null;
    const error = parsed?.success ? parsed.data : "UNKNOWN";
    throw new ApiError(error, res.status);
  }
  return validate(bodyValidator, body);
}
