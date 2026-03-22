export interface StripeUrlResponse {
  url?: string;
  error?: string;
}

export function isStripeUrlResponse(
  data: unknown
): data is StripeUrlResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    ("url" in data || "error" in data)
  );
}
