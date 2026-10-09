import { useRef, useState, type ChangeEvent } from "react";
import { coverSrc, fileToCoverDataUrl } from "../../utils/image";

/** File input state: converts the chosen image and reports errors. */
function useCoverUpload(onChange: (cover: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      onChange(await fileToCoverDataUrl(file));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    }
  }

  return { inputRef, error, handleFile };
}

interface Props {
  /** Current cover (base64 data URL) or an empty string. */
  value: string;
  onChange: (cover: string) => void;
}

/** Cover upload: choose an image, see a preview, replace or remove it. */
export default function CoverField({ value, onChange }: Props) {
  const { inputRef, error, handleFile } = useCoverUpload(onChange);

  return (
    <div className="admin-field">
      Cover
      {value && <img className="admin-cover-preview" src={coverSrc(value)} alt="Cover-Vorschau" />}
      <div className="admin-cover-actions">
        <button type="button" className="admin-cancel-btn" onClick={() => inputRef.current?.click()}>
          {value ? "Bild ersetzen" : "Bild auswählen"}
        </button>
        {value && (
          <button type="button" className="admin-delete-btn" onClick={() => onChange("")}>
            Entfernen
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      {error && <p className="admin-message error">{error}</p>}
    </div>
  );
}