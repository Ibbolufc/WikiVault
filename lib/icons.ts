import {
  FolderOpen,
  BookOpen,
  Server,
  Shield,
  Wrench,
  Settings,
  Globe,
  Users,
  Zap,
  Database,
  CreditCard,
  Gamepad2,
  HelpCircle,
  FileText,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  FolderOpen,
  BookOpen,
  Server,
  Shield,
  Wrench,
  Settings,
  Globe,
  Users,
  Zap,
  Database,
  CreditCard,
  Gamepad2,
  HelpCircle,
  FileText,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export function getCategoryIcon(name: string | null | undefined): LucideIcon {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return FolderOpen;
}
