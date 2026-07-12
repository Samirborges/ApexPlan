import { Target, Flag, Calendar } from "lucide-react";

export const siteConfig = {
  name: "ApexPlan",
} as const;

export const hero = {
  title: "Smart goal management platform to achieve your objectives",
  subtitle:
    "Define your objectives, set goals, establish deadlines, and achieve your biggest goals with ApexPlan.",
  cta: "Started",
} as const;

export const features = [
  {
    title: "Define your goal",
    subtitle: "Objective",
    description:
      "The objective is the final result you want to achieve. Clearly define the outcome you're aiming for.",
    icon: Target,
  },
  {
    title: "Create the path",
    subtitle: "Goals",
    description:
      "To achieve your objectives, you need clear and measurable goals to track your progress.",
    icon: Flag,
  },
  {
    title: "Task scheduling",
    subtitle: "Calendar",
    description:
      "To have better control over your activities, set deadlines and starting dates for your tasks.",
    icon: Calendar,
  },
] as const;