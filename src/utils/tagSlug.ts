// Tag → URL slug mapping
// ------------------------------------------------------------
// StudyAU tags are authored in English, so every tag passes straight through
// `slugifyStr` (kebab-case, ASCII). The lookup table below is kept empty by
// default; add an entry only when the default slug would be ambiguous or ugly
// and you want a stable override (e.g. "Go8" → "go8" is fine, but a tag like
// "C/C++" would need an explicit mapping).

import { slugifyStr } from "./slugify";

export const TAG_SLUG_MAP: Record<string, string> = {
  // Add explicit overrides here when needed. Example:
  // "C/C++": "c-cpp",
};

/** Convert a single tag to a URL slug. Prefer the explicit map, else slugifyStr. */
export const slugifyTag = (tag: string): string => {
  return TAG_SLUG_MAP[tag] ?? slugifyStr(tag);
};

/** Batch version, mirrors the shape of slugifyAll. */
export const slugifyTagAll = (tags: string[]): string[] => tags.map(slugifyTag);
