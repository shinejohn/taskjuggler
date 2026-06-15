import {
  CheckSquare,
  Phone,
  Shield,
  GitBranch,
  FolderKanban,
  Bot,
  Lightbulb,
  FileText,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface ModuleConfig {
  id: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  color: string;
  description: string;
  /** Route path within expo-router */
  route: string;
  /** Whether the module is fully implemented in the mobile app */
  ready: boolean;
}

/**
 * All platform modules. IDs match backend module names (config/modules.php).
 */
export const ALL_MODULES: ModuleConfig[] = [
  {
    id: 'tasks',
    name: 'Task Juggler',
    shortName: 'Tasks',
    icon: CheckSquare,
    color: '#2563eb',
    description: 'AI-powered task management and inbox routing',
    route: '/(tabs)/tasks',
    ready: true,
  },
  {
    id: 'coordinator',
    name: '4Calls',
    shortName: 'Calls',
    icon: Phone,
    color: '#7c3aed',
    description: 'AI call routing and coordinator',
    route: '/(modules)/coordinator',
    ready: false,
  },
  {
    id: 'sitehealth',
    name: 'Site Health',
    shortName: 'Scanner',
    icon: Shield,
    color: '#059669',
    description: 'Website security scanning and monitoring',
    route: '/(modules)/sitehealth',
    ready: false,
  },
  {
    id: 'processes',
    name: '4Process',
    shortName: 'Process',
    icon: GitBranch,
    color: '#d97706',
    description: 'Business process automation',
    route: '/(modules)/processes',
    ready: false,
  },
  {
    id: 'projects',
    name: '4Projects',
    shortName: 'Projects',
    icon: FolderKanban,
    color: '#dc2626',
    description: 'Project and milestone management',
    route: '/(modules)/projects',
    ready: false,
  },
  {
    id: 'urpa',
    name: 'URPA',
    shortName: 'URPA',
    icon: Bot,
    color: '#0891b2',
    description: 'Voice AI assistant',
    route: '/(modules)/urpa',
    ready: false,
  },
  {
    id: 'ideacircuit',
    name: 'Idea Circuit',
    shortName: 'Ideas',
    icon: Lightbulb,
    color: '#ea580c',
    description: 'Collaborative idea management',
    route: '/(modules)/ideacircuit',
    ready: false,
  },
  {
    id: 'officialnotice',
    name: 'Official Notice',
    shortName: 'Notices',
    icon: FileText,
    color: '#4f46e5',
    description: 'Official notice management',
    route: '/(modules)/officialnotice',
    ready: false,
  },
];

/** Modules the user can access that are implemented in the mobile app. */
export function getEnabledModules(enabledIds?: string[]): ModuleConfig[] {
  const entitled = enabledIds?.length
    ? ALL_MODULES.filter((m) => enabledIds.includes(m.id))
    : ALL_MODULES.filter((m) => m.ready);

  return entitled.filter((m) => m.ready);
}

/** All modules on the user's plan (including coming soon). */
export function getEntitledModules(enabledIds?: string[]): ModuleConfig[] {
  if (!enabledIds?.length) {
    return ALL_MODULES.filter((m) => m.ready);
  }

  return ALL_MODULES.filter((m) => enabledIds.includes(m.id));
}
