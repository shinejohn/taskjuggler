// ============================================================
// APP CONFIGURATION REGISTRY
// ============================================================
// Add every app, every page, every route here.
// This is the single source of truth for what gets tested.
// ============================================================

import { AppConfig } from '../types.js';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = 'sitehealth-apps.json';

/** Default Fibonacco apps — customize these with your actual URLs and routes */
export const DEFAULT_APPS: AppConfig[] = [
  {
    name: 'Day.News',
    baseUrl: process.env.DAYNEWS_URL || 'http://localhost:8000',
    tags: ['publishing', 'public'],
    pages: [
      { path: '/', name: 'Homepage' },
      { path: '/articles', name: 'Article Listing' },
      { path: '/news', name: 'News Categories' },
      { path: '/events', name: 'Events Calendar' },
      { path: '/business', name: 'Business Directory' },
      { path: '/local-voices', name: 'Local Voices / Podcasts' },
      { path: '/search', name: 'Search' },
      { path: '/login', name: 'Login' },
      { path: '/register', name: 'Register' },
      // Add real article slugs as you test:
      // { path: '/posts/your-article-slug', name: 'Article Detail' },
      // { path: '/poll/your-poll-slug', name: 'Poll Page' },
      // { path: '/clearwater/best-of', name: 'Best Of Index' },
    ],
  },
  {
    name: 'SMB Command Center',
    baseUrl: process.env.SMB_URL || 'http://localhost:8001',
    tags: ['smb', 'internal'],
    auth: { type: 'form-login', loginUrl: '/login' },
    pages: [
      { path: '/dashboard', name: 'Dashboard', requiresAuth: true },
      { path: '/crm', name: 'CRM Dashboard', requiresAuth: true },
      { path: '/crm/customers', name: 'Customer List', requiresAuth: true },
      { path: '/crm/pipeline', name: 'Pipeline Board', requiresAuth: true },
      { path: '/crm/campaigns', name: 'Campaigns', requiresAuth: true },
      { path: '/crm/segments', name: 'Segments', requiresAuth: true },
      { path: '/crm/reports', name: 'CRM Reports', requiresAuth: true },
    ],
  },
  {
    name: 'GoEventCity',
    baseUrl: process.env.GOEVENTCITY_URL || 'http://localhost:8002',
    tags: ['publishing', 'public'],
    pages: [
      { path: '/', name: 'Events Home' },
      { path: '/events', name: 'Event Listing' },
      { path: '/calendar', name: 'Calendar View' },
      { path: '/submit', name: 'Submit Event' },
      { path: '/search', name: 'Event Search' },
    ],
  },
  {
    name: 'DowntownGuide',
    baseUrl: process.env.DOWNTOWNGUIDE_URL || 'http://localhost:8003',
    tags: ['publishing', 'public'],
    pages: [
      { path: '/', name: 'Directory Home' },
      { path: '/businesses', name: 'Business Listing' },
      { path: '/categories', name: 'Categories' },
      { path: '/search', name: 'Business Search' },
    ],
  },
  {
    name: 'GoLocalVoices',
    baseUrl: process.env.GOLOCALVOICES_URL || 'http://localhost:8004',
    tags: ['publishing', 'public'],
    pages: [
      { path: '/', name: 'Voices Home' },
      { path: '/podcasts', name: 'Podcast Listing' },
      { path: '/videos', name: 'Video Listing' },
      { path: '/search', name: 'Content Search' },
    ],
  },
  {
    name: 'AlphaSite',
    baseUrl: process.env.ALPHASITE_URL || 'http://localhost:8005',
    tags: ['smb', 'internal'],
    auth: { type: 'form-login', loginUrl: '/login' },
    pages: [
      { path: '/', name: 'AlphaSite Home' },
      { path: '/marketplace', name: 'AI Employee Marketplace' },
      { path: '/dashboard', name: 'Operations Dashboard', requiresAuth: true },
      { path: '/agents', name: 'Agent Management', requiresAuth: true },
    ],
  },
];

/** Load app configurations — from file if it exists, otherwise defaults */
export function loadApps(): AppConfig[] {
  const configPath = path.resolve(CONFIG_FILE);
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(raw) as AppConfig[];
    } catch {
      console.error(`Failed to parse ${CONFIG_FILE}, using defaults`);
    }
  }
  return DEFAULT_APPS;
}

/** Save app configurations to file */
export function saveApps(apps: AppConfig[]): void {
  const configPath = path.resolve(CONFIG_FILE);
  fs.writeFileSync(configPath, JSON.stringify(apps, null, 2));
}

/** Add or update an app in the config */
export function upsertApp(app: AppConfig): AppConfig[] {
  const apps = loadApps();
  const idx = apps.findIndex(a => a.name === app.name);
  if (idx >= 0) {
    apps[idx] = app;
  } else {
    apps.push(app);
  }
  saveApps(apps);
  return apps;
}

/** Add a page to an existing app */
export function addPageToApp(appName: string, page: { path: string; name: string }): AppConfig | null {
  const apps = loadApps();
  const app = apps.find(a => a.name === appName);
  if (!app) return null;

  // Don't duplicate
  if (!app.pages.find(p => p.path === page.path)) {
    app.pages.push(page);
  }
  saveApps(apps);
  return app;
}

/** Get all pages across all apps, with full URLs */
export function getAllPages(apps?: AppConfig[], tags?: string[]): Array<{ app: string; url: string; name: string; requiresAuth: boolean }> {
  const allApps = apps || loadApps();
  const filtered = tags ? allApps.filter(a => a.tags?.some(t => tags.includes(t))) : allApps;

  const pages: Array<{ app: string; url: string; name: string; requiresAuth: boolean }> = [];
  for (const app of filtered) {
    for (const page of app.pages) {
      pages.push({
        app: app.name,
        url: `${app.baseUrl}${page.path}`,
        name: `${app.name} > ${page.name}`,
        requiresAuth: page.requiresAuth || false,
      });
    }
  }
  return pages;
}
