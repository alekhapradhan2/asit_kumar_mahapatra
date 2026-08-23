/**
 * Central site configuration reader.
 * Reads from environment variables (which are set from SiteSettings in DB at build/runtime).
 * All values default to configurable placeholders — never hardcoded brand names.
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#d4af37',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
} as const;

export const apiUrl = siteConfig.apiUrl;
