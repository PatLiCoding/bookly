const MAX_WIDTH = 600;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const JPEG_QUALITY = 0.8;

/** Loads a file into an image element. */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Das Bild konnte nicht gelesen werden."));
    };
    img.src = url;
  });
}

/** Scales the image down to MAX_WIDTH and returns it as a JPEG data URL. */
function scaleToDataUrl(img: HTMLImageElement): string {
  const scale = Math.min(1, MAX_WIDTH / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Das Bild konnte nicht verarbeitet werden.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/** Validates an image file and converts it to a compressed base64 data URL. */
export async function fileToCoverDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/"))
    throw new Error("Bitte wähle eine Bilddatei aus.");
  if (file.size > MAX_FILE_SIZE)
    throw new Error("Die Datei ist zu groß (maximal 5 MB).");
  return scaleToDataUrl(await loadImage(file));
}

/** Image src for a stored cover; adds the data-URL prefix if it is missing. */
export function coverSrc(cover: string): string {
  const hasPrefix = cover.startsWith("data:") || cover.startsWith("http");
  return hasPrefix ? cover : `data:image/jpeg;base64,${cover}`;
}
