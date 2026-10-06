/**
 * Fallback URL for the default book cover image when no cover is provided.
 */
const DEFAULT_COVER = `${import.meta.env.BASE_URL}assets/img/bookcover_default.png`;

/**
 * Resolves the cover image path or URL. Returns the given cover image URL
 * if available, or falls back to the default cover asset.
 *
 * @param cover - The optional cover image URL or path.
 * @returns The provided cover image URL, or `DEFAULT_COVER` if undefined/null/empty.
 */
export function getCover(cover?: string | null): string {
  return cover ? cover : DEFAULT_COVER;
}
