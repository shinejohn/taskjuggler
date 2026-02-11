// ============================================================
// SITEHEALTH MCP SERVER — TYPE DEFINITIONS
// ============================================================

/** A single application in the Fibonacco ecosystem (or any future app) */
export interface AppConfig {
  name: string;
  baseUrl: string;
  pages: PageConfig[];
  /** Optional auth config for protected pages */
  auth?: AuthConfig;
  /** Tags for filtering (e.g., "publishing", "smb", "internal") */
  tags?: string[];
}

/** A single page/route to audit */
export interface PageConfig {
  path: string;
  name: string;
  /** Whether this page requires authentication */
  requiresAuth?: boolean;
  /** Expected elements that MUST be present (smoke test) */
  requiredElements?: string[];
  /** Skip certain element types on this page */
  skipElementTypes?: string[];
}

/** Authentication configuration */
export interface AuthConfig {
  type: 'cookie' | 'bearer' | 'form-login';
  loginUrl?: string;
  credentials?: {
    username: string;
    password: string;
    usernameField?: string;
    passwordField?: string;
  };
  token?: string;
  cookies?: Record<string, string>;
}

/** Query definition for finding interactive elements */
export interface ElementQuery {
  selector: string;
  type: ElementType;
  description: string;
  testAction: TestAction;
}

export type ElementType =
  | 'link'
  | 'button'
  | 'nav-link'
  | 'dropdown'
  | 'menu-item'
  | 'tab'
  | 'text-input'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'modal-trigger'
  | 'accordion'
  | 'custom-clickable'
  | 'media';

export type TestAction =
  | 'click'
  | 'focus-and-type'
  | 'open-select'
  | 'toggle'
  | 'check-controls';

/** Information about a discovered element */
export interface ElementInfo {
  tag: string;
  id: string | null;
  className: string | null;
  text: string;
  href: string | null;
  name: string | null;
  ariaLabel: string | null;
  placeholder: string | null;
  title: string | null;
  inputType: string | null;
  role: string | null;
  disabled: boolean;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  elementType: ElementType;
  testAction: TestAction;
  description: string;
  label: string;
}

/** Result of testing a single element */
export interface ElementTestResult {
  index: number;
  elementType: ElementType;
  label: string;
  tag: string;
  href: string | null;
  id: string | null;
  location: string;
  testAction: TestAction;
  status: TestStatus;
  details: string;
  screenshot: string | null;
  consoleErrors: string[];
  networkErrors: string[];
  /** CSS selector that can re-locate this element */
  selector: string;
  /** The component/file this element likely belongs to (if determinable) */
  possibleComponent?: string;
}

export type TestStatus = 'PASS' | 'FAIL' | 'WARNING' | 'ERROR' | 'SKIP';

/** Complete audit results for a single page */
export interface PageAuditResult {
  url: string;
  name: string;
  app: string;
  timestamp: string;
  loadStatus: string;
  loadTimeMs: number;
  elements: ElementTestResult[];
  summary: AuditSummary;
}

/** Summary counts */
export interface AuditSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  errors: number;
  skipped: number;
}

/** Complete audit run across multiple pages */
export interface FullAuditReport {
  runId: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  pages: PageAuditResult[];
  overallSummary: AuditSummary;
}

/** A failure that needs to be fixed — the unit of work for the AI fix loop */
export interface FixableIssue {
  issueId: string;
  app: string;
  page: string;
  pageUrl: string;
  elementType: ElementType;
  label: string;
  selector: string;
  status: TestStatus;
  details: string;
  screenshot: string | null;
  consoleErrors: string[];
  networkErrors: string[];
  /** Suggested fix category */
  fixCategory: FixCategory;
  /** Whether this has been fixed and verified */
  resolved: boolean;
}

export type FixCategory =
  | 'dead-link'          // href goes to 404/500
  | 'dead-button'        // click produces no response
  | 'js-error'           // console error on interaction
  | 'network-error'      // failed API call
  | 'missing-handler'    // onclick/event handler missing
  | 'empty-form'         // select with no options, etc.
  | 'broken-navigation'  // navigation to error page
  | 'accessibility'      // missing aria labels, etc.
  | 'unknown';

/** Configuration for the AI fix loop */
export interface FixLoopConfig {
  /** Max iterations before giving up */
  maxIterations: number;
  /** Anthropic API key */
  apiKey?: string;
  /** Model to use */
  model: string;
  /** Path to the project source code */
  projectRoot: string;
  /** Whether to auto-apply fixes or just suggest */
  autoApply: boolean;
  /** Whether to re-audit after each fix */
  verifyAfterFix: boolean;
}

/** Result of asking AI to fix an issue */
export interface AiFixSuggestion {
  issueId: string;
  analysis: string;
  files: FileChange[];
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
}

/** A file change suggested by AI */
export interface FileChange {
  filePath: string;
  action: 'edit' | 'create' | 'delete';
  /** For edits: the original content to find */
  searchContent?: string;
  /** For edits/creates: the new content */
  replaceContent?: string;
  /** Full file content for creates */
  newContent?: string;
}
