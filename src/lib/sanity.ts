export const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID || '72ylykxj';
export const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.EXPO_PUBLIC_SANITY_API_VERSION || '2024-03-01';

export async function sanityFetch<T>(groqQuery: string): Promise<T | null> {
  try {
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
      groqQuery
    )}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[Sanity] Fetch failed with status ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json.result as T;
  } catch (err) {
    console.warn('[Sanity] Network error:', err);
    return null;
  }
}

export function urlForImage(source: unknown): string {
  if (!source) return '';
  if (typeof source === 'string') return source;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = source as any;
  const ref = s.asset?._ref || s._ref;
  if (!ref || typeof ref !== 'string') return '';
  const match = ref.match(/^image-([a-f0-9]+)-([0-9x]+)-([a-z0-9]+)$/);
  if (match) {
    const [, id, dimensions, ext] = match;
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;
  }
  return '';
}

export function urlForFile(ref: string | { asset?: { _ref: string } }) {
  const fileRef = typeof ref === 'string' ? ref : ref?.asset?._ref;
  if (!fileRef) return null;
  const parts = fileRef.split('-');
  if (parts.length >= 3 && parts[0] === 'file') {
    const id = parts[1];
    const ext = parts[2];
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
  }
  return null;
}

export interface CourseLesson {
  _id: string;
  title: string;
  slug?: { current: string };
  tier: 'beginner' | 'intermediate' | 'advanced';
  moduleNumber: number;
  lessonOrder: number;
  youtubeUnlistedUrl: string;
  taal: string;
  bolNotation: string;
  summary?: string;
  pdfAttachmentUrl?: string;
}

export interface SiteSettings {
  registrationFeeInr: number;
  beginnerPriceInr: number;
  intermediatePriceInr: number;
  advancedPriceInr: number;
  masterclassHourlyInr: number;
  googleCalendarBookingUrl: string;
  contactEmail: string;
  socialInstagram: string;
}

export interface PerformanceWork {
  _id: string;
  title: string;
  category: string;
  year: string;
  youtubeUrl: string;
  taal?: string;
  venueOrAlbum?: string;
  thumbnailUrl?: string;
  description?: string;
}

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  registrationFeeInr: 400,
  beginnerPriceInr: 2500,
  intermediatePriceInr: 3000,
  advancedPriceInr: 3500,
  masterclassHourlyInr: 4500,
  googleCalendarBookingUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules',
  contactEmail: 'surjeettablaacademy@gmail.com',
  socialInstagram: 'https://instagram.com/surjeetsinghofficial_',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await sanityFetch<Partial<SiteSettings>>('*[_type == "siteSettings"][0]');
    if (data) {
      return {
        registrationFeeInr: data.registrationFeeInr ?? FALLBACK_SITE_SETTINGS.registrationFeeInr,
        beginnerPriceInr: data.beginnerPriceInr ?? FALLBACK_SITE_SETTINGS.beginnerPriceInr,
        intermediatePriceInr: data.intermediatePriceInr ?? FALLBACK_SITE_SETTINGS.intermediatePriceInr,
        advancedPriceInr: data.advancedPriceInr ?? FALLBACK_SITE_SETTINGS.advancedPriceInr,
        masterclassHourlyInr: data.masterclassHourlyInr ?? FALLBACK_SITE_SETTINGS.masterclassHourlyInr,
        googleCalendarBookingUrl: data.googleCalendarBookingUrl || FALLBACK_SITE_SETTINGS.googleCalendarBookingUrl,
        contactEmail: data.contactEmail || FALLBACK_SITE_SETTINGS.contactEmail,
        socialInstagram: data.socialInstagram || FALLBACK_SITE_SETTINGS.socialInstagram,
      };
    }
  } catch (err) {
    console.warn('[Sanity] Using fallback settings:', err);
  }
  return FALLBACK_SITE_SETTINGS;
}

export async function getCourseLessons(): Promise<CourseLesson[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawLessons = await sanityFetch<any[]>(
      '*[_type == "courseLesson"] | order(tier asc, moduleNumber asc, lessonOrder asc)'
    );

    if (rawLessons && rawLessons.length > 0) {
      return rawLessons.map((l) => {
        let pdfUrl = l.pdfAttachmentUrl;
        if (l.pdfAttachment?.asset?._ref) {
          pdfUrl = urlForFile(l.pdfAttachment);
        }
        return {
          _id: l._id,
          title: l.title,
          slug: l.slug,
          tier: (l.tier || 'beginner').toLowerCase(),
          moduleNumber: l.moduleNumber || 1,
          lessonOrder: l.lessonOrder || 1,
          youtubeUnlistedUrl: l.youtubeUnlistedUrl || '',
          taal: l.taal || 'Teentaal',
          bolNotation: l.bolNotation || '',
          summary: l.summary || '',
          pdfAttachmentUrl: pdfUrl || undefined,
        };
      });
    }
  } catch (err) {
    console.warn('[Sanity] Lessons fetch error:', err);
  }
  return [];
}

export async function getPerformanceWorks(): Promise<PerformanceWork[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await sanityFetch<any[]>('*[_type == "performanceWork"] | order(year desc, _createdAt desc)');
    if (raw && raw.length > 0) {
      return raw.map((w) => ({
        _id: w._id,
        title: w.title,
        category: w.category || 'Solo Recital',
        year: w.year || '2024',
        youtubeUrl: w.youtubeUrl || '',
        taal: w.taal,
        venueOrAlbum: w.venueOrAlbum,
        thumbnailUrl: w.thumbnail ? urlForImage(w.thumbnail) : w.thumbnailUrl,
        description: w.description,
      }));
    }
  } catch (err) {
    console.warn('[Sanity] Works fetch error:', err);
  }
  return [];
}
