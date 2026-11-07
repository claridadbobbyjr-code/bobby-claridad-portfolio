import {
  ArrowRight, BadgeCheck, Calendar, ChartLine, Check, Code2, FlaskConical, Gauge, Gift, Layers,
  LayoutTemplate, Mail, Palette, Plug, RefreshCw, Search, ShieldCheck, ShoppingBag, ShoppingCart,
  Split, Target, Wrench, Zap, type LucideIcon,
} from 'lucide-react';

/** String keys used in src/content/site.ts mapped to icon components. */
export const icons: Record<string, LucideIcon> = {
  arrow: ArrowRight,
  badge: BadgeCheck,
  bag: ShoppingBag,
  calendar: Calendar,
  cart: ShoppingCart,
  chart: ChartLine,
  check: Check,
  code: Code2,
  flask: FlaskConical,
  gauge: Gauge,
  gift: Gift,
  layers: Layers,
  layout: LayoutTemplate,
  mail: Mail,
  palette: Palette,
  plug: Plug,
  search: Search,
  shield: ShieldCheck,
  split: Split,
  sync: RefreshCw,
  target: Target,
  wrench: Wrench,
  zap: Zap,
};

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? BadgeCheck;
}
