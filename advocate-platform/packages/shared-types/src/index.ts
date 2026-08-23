// ─── ENUMS ──────────────────────────────────────────────────────────────────

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT';

export type CaseStatus =
  | 'CONSULTATION'
  | 'DOCUMENTS_PENDING'
  | 'PREPARING_CASE'
  | 'FILED'
  | 'REGISTERED'
  | 'NOTICE_ISSUED'
  | 'HEARING_SCHEDULED'
  | 'HEARING_COMPLETED'
  | 'EVIDENCE_STAGE'
  | 'ARGUMENTS'
  | 'AWAITING_JUDGMENT'
  | 'JUDGMENT_DELIVERED'
  | 'WON'
  | 'SETTLED'
  | 'CLOSED'
  | 'LOST'
  | 'ARCHIVED';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type UpdateSource =
  | 'OFFICIAL_COURT_DATA'
  | 'ADVOCATE_UPDATE'
  | 'ADMIN_UPDATE'
  | 'SYSTEM_SYNC';

export type Visibility = 'ADMIN_ONLY' | 'INTERNAL_TEAM' | 'CLIENT_VISIBLE';

export type DocumentType =
  | 'CLIENT_DOCUMENT'
  | 'PETITION'
  | 'AFFIDAVIT'
  | 'NOTICE'
  | 'COURT_ORDER'
  | 'EVIDENCE'
  | 'HEARING_DOCUMENT'
  | 'JUDGMENT'
  | 'FINAL_VERDICT'
  | 'SETTLEMENT'
  | 'OTHER';

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

export type SyncStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'PARTIAL';

// ─── API RESPONSE SHAPES ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface AuthTokenPayload {
  sub: string;       // userId
  role: Role;
  clientId?: string; // only for CLIENT role
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: Role;
    clientId?: string;
  };
}

// ─── USER / CLIENT ──────────────────────────────────────────────────────────

export interface ClientDTO {
  id: string;
  clientId: string;
  fullName: string;
  email: string;
  mobile: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pinCode?: string | null;
  profilePhoto?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── CASE ────────────────────────────────────────────────────────────────────

export interface CaseDTO {
  id: string;
  internalCaseId: string;
  clientRef?: string | null;
  clientId: string;
  client?: Pick<ClientDTO, 'clientId' | 'fullName'>;
  title: string;
  caseType: string;
  practiceArea: string;
  courtName?: string | null;
  courtLocation?: string | null;
  caseNumber?: string | null;
  cnrNumber?: string | null;
  filingNumber?: string | null;
  filingDate?: string | null;
  registrationDate?: string | null;
  currentStatus: CaseStatus;
  caseStage?: string | null;
  oppositeParty?: string | null;
  oppositeAdvocate?: string | null;
  judgeDetails?: string | null;
  nextHearingDate?: string | null;
  prevHearingDate?: string | null;
  priority: Priority;
  assignedAdvocate?: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStatusHistoryDTO {
  id: string;
  caseId: string;
  status: CaseStatus;
  title: string;
  description?: string | null;
  date: string;
  source: UpdateSource;
  isClientVisible: boolean;
  createdAt: string;
}

// ─── HEARING ─────────────────────────────────────────────────────────────────

export interface HearingDTO {
  id: string;
  caseId: string;
  hearingDate: string;
  purpose?: string | null;
  result?: string | null;
  nextDate?: string | null;
  notes?: string | null;
  source: UpdateSource;
  isClientVisible: boolean;
  createdAt: string;
}

// ─── DOCUMENT ────────────────────────────────────────────────────────────────

export interface DocumentDTO {
  id: string;
  title: string;
  docType: DocumentType;
  category?: string | null;
  caseId?: string | null;
  clientId?: string | null;
  mimeType: string;
  sizeBytes: number;
  visibility: Visibility;
  description?: string | null;
  version: number;
  tags: string[];
  uploadedById: string;
  uploadedAt: string;
}

// ─── ARTICLE ─────────────────────────────────────────────────────────────────

export interface ArticleDTO {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string | null;
  content: string;
  featuredImage?: string | null;
  authorId: string;
  category?: { id: string; name: string; slug: string } | null;
  tags: string[];
  practiceAreas: string[];
  status: ContentStatus;
  publishedAt?: string | null;
  seoTitle?: string | null;
  metaDesc?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── SUCCESS STORY ───────────────────────────────────────────────────────────

export interface SuccessStoryDTO {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string | null;
  shortSummary?: string | null;
  fullStory: string;
  category?: string | null;
  practiceArea?: string | null;
  result?: string | null;
  isAnonymous: boolean;
  clientDisplay?: string | null;
  status: ContentStatus;
  publishedAt?: string | null;
  seoTitle?: string | null;
  metaDesc?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── AUDIT LOG ───────────────────────────────────────────────────────────────

export interface AuditLogDTO {
  id: string;
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

// ─── SITE CONFIG ─────────────────────────────────────────────────────────────

export interface PublicSiteConfig {
  siteName: string;
  siteUrl: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  primaryColor: string;
  defaultSeoTitle: string;
  defaultMetaDesc: string;
}
