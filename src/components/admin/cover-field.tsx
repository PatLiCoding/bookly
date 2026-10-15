import { useRef, useState, type ChangeEvent } from "react";
import { coverSrc, fileToCoverDataUrl } from "../../utils/image";

/** Custom hook managing cover file selection, base64 conversion, and error state. */
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
  /** Current cover image encoded as a base64 Data URL, or an empty string. */
  value: string;
  onChange: (cover: string) => void;
}

/** Cover image uploader providing file selection, live preview, replacement, and removal actions. */
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