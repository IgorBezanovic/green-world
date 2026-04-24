const DEFAULT_TTL_MS = 15 * 60 * 1000;

type DraftEnvelope<T> = {
  savedAt: number;
  expiresAt: number;
  data: T;
};

export const saveDraft = <T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS) => {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    const payload: DraftEnvelope<T> = {
      savedAt: now,
      expiresAt: now + ttlMs,
      data
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore storage errors (quota / private mode).
  }
};

export const loadDraft = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as DraftEnvelope<T>;
    if (!parsed || typeof parsed !== 'object') return null;

    if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data ?? null;
  } catch {
    return null;
  }
};

export const clearDraft = (key: string) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors.
  }
};

export const DRAFT_TTL_MS = DEFAULT_TTL_MS;
