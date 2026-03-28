"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon } from "lucide-react";
import type {
  AskQuestionsInput,
  AskQuestionsOutput,
} from "@/lib/tools/ask-questions/consts";
import type { Tool, UIToolInvocation } from "ai";
import { AskQuestionsWizardSkeleton } from "./ask-questions-wizard-skeleton";

type AskQuestionsWizardProps = {
  toolCallId: string;
  input: AskQuestionsInput;
  state: UIToolInvocation<Tool>["state"];
  output?: AskQuestionsOutput;
  addToolOutput: (args: {
    tool: "askQuestions";
    toolCallId: string;
    output: AskQuestionsOutput;
  }) => void;
};

export function AskQuestionsWizard({
  toolCallId,
  input,
  state,
  output,
  addToolOutput,
}: AskQuestionsWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AskQuestionsOutput["answers"]>([]);
  const [customText, setCustomText] = useState("");

  if (state === "output-available" && output) {
    return <CompletedSummary title={input.title} answers={output.answers} />;
  }

  if (state === "input-streaming") {
    return <AskQuestionsWizardSkeleton input={input} />;
  }

  const questions = input.questions;
  const current = questions[currentIndex];
  if (!current) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (answer: string, wasCustom: boolean) => {
    const newAnswer = {
      questionId: current.id,
      questionText: current.text,
      answer,
      wasCustomAnswer: wasCustom,
    };
    const updatedAnswers = [...answers, newAnswer];

    if (isLastQuestion) {
      addToolOutput({
        tool: "askQuestions",
        toolCallId,
        output: { answers: updatedAnswers },
      });
    } else {
      setAnswers(updatedAnswers);
      setCurrentIndex(currentIndex + 1);
      setCustomText("");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-base">{input.title}</CardTitle>
        <div className="space-y-1">
          <Progress value={progress} />
          <span className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium">{current.text}</p>
        <div className="flex flex-wrap gap-2">
          {current.options.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="sm"
              onClick={() => handleAnswer(option, false)}
            >
              {option}
            </Button>
          ))}
        </div>
        {current.allowCustomAnswer && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customText.trim()) handleAnswer(customText.trim(), true);
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Or type your own answer..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
            <Button type="submit" size="sm" disabled={!customText.trim()}>
              {isLastQuestion ? "Submit" : "Next"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function CompletedSummary({
  title,
  answers,
}: {
  title: string;
  answers: AskQuestionsOutput["answers"];
}) {
  return (
    <Card className="w-full max-w-md opacity-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircleIcon className="size-4 text-green-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {answers.map((a) => (
          <div key={a.questionId} className="text-sm">
            <span className="text-muted-foreground">{a.questionText}</span>
            <Badge variant="secondary" className="ml-2">
              {a.answer}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
