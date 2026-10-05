const DEFAULT_COVER = `${import.meta.env.BASE_URL}assets/img/bookcover_default.png`;

export function getCover(cover?: string | null): string {
  return cover ? cover : DEFAULT_COVER;
}
