import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AskQuestionsInput } from "@/lib/tools/ask-questions/consts";

export function AskQuestionsWizardSkeleton({
  input,
}: {
  input?: AskQuestionsInput;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-base">
          {input?.title || (
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          )}
        </CardTitle>
        <div className="space-y-1">
          <Progress value={0} />
          <span className="text-xs text-muted-foreground">
            Loading questions…
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="flex flex-wrap gap-2">
          {[80, 64, 96].map((w) => (
            <div
              key={w}
              className="h-8 animate-pulse rounded-md bg-muted"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
