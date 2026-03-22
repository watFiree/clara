import {
  HeartIcon,
  SunIcon,
  CloudIcon,
  SparklesIcon,
  MoonIcon,
  WindIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface WellbeingPrompt {
  icon: LucideIcon;
  label: string;
  message: string;
}

const moodMorning: WellbeingPrompt[] = [
  {
    icon: HeartIcon,
    label: "Morning check-in",
    message: "How are you feeling this morning?",
  },
  {
    icon: HeartIcon,
    label: "Start your day",
    message: "What's on your mind as you start your day?",
  },
];

const moodAfternoon: WellbeingPrompt[] = [
  {
    icon: HeartIcon,
    label: "Afternoon check-in",
    message: "How's your day going so far?",
  },
  {
    icon: HeartIcon,
    label: "Pause and reflect",
    message: "Take a moment -- how are you really doing?",
  },
];

const moodEvening: WellbeingPrompt[] = [
  {
    icon: HeartIcon,
    label: "Evening check-in",
    message: "How did today go for you?",
  },
  {
    icon: HeartIcon,
    label: "Wind down",
    message: "How are you feeling as the day winds down?",
  },
];

const gratitude: WellbeingPrompt[] = [
  {
    icon: SunIcon,
    label: "Gratitude",
    message: "What's something small that made you smile today?",
  },
  {
    icon: SunIcon,
    label: "Grateful for",
    message: "Name one thing you're grateful for right now",
  },
  {
    icon: SunIcon,
    label: "Bright spot",
    message: "Who made a difference in your day?",
  },
];

const stress: WellbeingPrompt[] = [
  {
    icon: CloudIcon,
    label: "Let it out",
    message: "Is anything weighing on you right now?",
  },
  {
    icon: CloudIcon,
    label: "Feel lighter",
    message: "What would help you feel a little lighter today?",
  },
];

const selfReflection: WellbeingPrompt[] = [
  {
    icon: SparklesIcon,
    label: "Self-reflection",
    message: "What's something you've been proud of recently?",
  },
  {
    icon: SparklesIcon,
    label: "Dream a little",
    message: "What would your ideal day look like?",
  },
  {
    icon: SparklesIcon,
    label: "Explore yourself",
    message: "Is there something you'd like to understand about yourself?",
  },
];

const sleep: WellbeingPrompt[] = [
  {
    icon: MoonIcon,
    label: "Sleep check",
    message: "How did you sleep last night?",
  },
  {
    icon: MoonIcon,
    label: "Energy levels",
    message: "What's your energy like today?",
  },
  {
    icon: MoonIcon,
    label: "Rest",
    message: "Is anything keeping you up at night?",
  },
];

const mindfulness: WellbeingPrompt[] = [
  {
    icon: WindIcon,
    label: "Breathe",
    message: "Let's take a slow breath together. What do you notice?",
  },
  {
    icon: WindIcon,
    label: "Be present",
    message: "What are you present to right now?",
  },
  {
    icon: WindIcon,
    label: "Ground yourself",
    message: "Describe what's around you in this moment",
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const allPools = [gratitude, stress, selfReflection, sleep, mindfulness];

function pickFromRemainingPool(exclude: WellbeingPrompt[]): WellbeingPrompt {
  const available = allPools.filter((pool) => pool !== exclude);
  const pool = available[Math.floor(Math.random() * available.length)];
  return pickRandom(pool);
}

export function getWellbeingPrompts(): WellbeingPrompt[] {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return [
      pickRandom(moodMorning),
      pickRandom(gratitude),
      pickFromRemainingPool(gratitude),
    ];
  }

  if (hour >= 12 && hour < 18) {
    return [
      pickRandom(moodAfternoon),
      pickRandom(selfReflection),
      pickFromRemainingPool(selfReflection),
    ];
  }

  if (hour >= 18 && hour < 23) {
    return [
      pickRandom(moodEvening),
      pickRandom(sleep),
      pickFromRemainingPool(sleep),
    ];
  }

  // Night: 23-5
  return [
    pickRandom(sleep),
    pickRandom(mindfulness),
    pickFromRemainingPool(mindfulness),
  ];
}
