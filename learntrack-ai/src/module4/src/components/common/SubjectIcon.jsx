import {
  Bot,
  Code2,
  Database,
  Settings,
  Globe,
  Monitor,
  BarChart3,
  FlaskConical,
  Gamepad2,
  Lightbulb,
  Image as ImageIcon,
  LayoutGrid,
} from "lucide-react";

export const ICON_MAP = {
  bot: Bot,
  code2: Code2,
  database: Database,
  settings: Settings,
  globe: Globe,
  monitor: Monitor,
  "bar-chart": BarChart3,
  flask: FlaskConical,
  gamepad: Gamepad2,
  lightbulb: Lightbulb,
  image: ImageIcon,
  "layout-grid": LayoutGrid,
};

export default function SubjectIcon({ icon, className }) {
  const Icon = ICON_MAP[icon] || Bot;
  return <Icon className={className} strokeWidth={2} />;
}
