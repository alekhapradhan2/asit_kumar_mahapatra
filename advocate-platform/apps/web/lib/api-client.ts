import { siteConfig } from './config';

// Inline types to avoid cross-package path issues in Next.js
// These mirror @advocate/shared-types PublicSiteConfig
interface PublicSiteConfig {
  siteName: string;
  siteUrl: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  workingHours: string;
  socialLinks: Record<string, string | null>;
  primaryColor: string;
  defaultSeoTitle: string;
  defaultMetaDesc: string;
}


/**
 * Typed API client for server-side and client-side requests.
 */

async function fetchAPI<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...rest } = options || {};

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...rest?.headers,
  };

  const response = await fetch(`${siteConfig.apiUrl}${path}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const publicApi = {
  getSiteConfig: () =>
    fetchAPI<{ success: boolean; data: PublicSiteConfig }>('/public/site-config'),

  getArticles: (page = 1, limit = 10) =>
    fetchAPI<{ success: boolean; data: any[]; pagination: any }>(
      `/public/articles?page=${page}&limit=${limit}`
    ),

  getArticle: (slug: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/public/articles/${slug}`),

  getSuccessStories: (page = 1, limit = 10) =>
    fetchAPI<{ success: boolean; data: any[]; pagination: any }>(
      `/public/success-stories?page=${page}&limit=${limit}`
    ),

  getSuccessStory: (slug: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/public/success-stories/${slug}`),
};

// ─── Authenticated API ────────────────────────────────────────────────────────

export function createAuthClient(token: string) {
  return {
    // Cases
    getCases: () =>
      fetchAPI<{ success: boolean; data: any[] }>('/cases', { token }),

    getCase: (id: string) =>
      fetchAPI<{ success: boolean; data: any }>(`/cases/${id}`, { token }),

    getCaseTimeline: (id: string) =>
      fetchAPI<{ success: boolean; data: any[] }>(`/cases/${id}/timeline`, { token }),

    getCaseHearings: (id: string) =>
      fetchAPI<{ success: boolean; data: any[] }>(`/cases/${id}/hearings`, { token }),

    getCaseVerdict: (id: string) =>
      fetchAPI<{ success: boolean; data: any }>(`/cases/${id}/verdict`, { token }),

    // Admin: Clients
    getClients: (page = 1, search?: string) =>
      fetchAPI<{ success: boolean; data: any[]; pagination: any }>(
        `/clients?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
        { token }
      ),

    createClient: (data: any) =>
      fetchAPI<{ success: boolean; data: any }>('/clients', {
        method: 'POST', body: JSON.stringify(data), token,
      }),

    // Admin: Dashboard
    getDashboard: async () => {
      const [clientsRes, casesRes] = await Promise.all([
        fetchAPI<any>('/clients?limit=1', { token }),
        fetchAPI<any>('/cases?limit=1', { token }),
      ]);
      return { totalClients: clientsRes.pagination?.total, totalCases: casesRes.pagination?.total };
    },
  };
}
