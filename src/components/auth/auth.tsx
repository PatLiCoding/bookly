import { useEffect, useState } from "react";
import "./auth.css";
import { useAuth } from "../../context/use-auth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const EMPTY: FormValues = { firstname: "", lastname: "", email: "", password: "" };

/** Locks scrolling of the page while the modal is open. */
function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
}

/** Field values and error text of the form. */
function useFormState() {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");
  const change = (field: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));
  const reset = () => {
    setValues(EMPTY);
    setError("");
  };
  return { values, error, setError, change, reset };
}

type FormState = ReturnType<typeof useFormState>;

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : "Unbekannter Fehler";
}

/** Logs in or registers, depending on the active tab. */
function useSubmit(isLogin: boolean, form: FormState, onDone: () => void) {
  const { signIn, signUp } = useAuth();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { values } = form;
      await (isLogin ? signIn(values.email, values.password) : signUp(values));
      form.reset();
      onDone();
    } catch (err) {
      form.setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return { busy, submit };
}

function useAuthForm(onDone: () => void) {
  const [isLogin, setIsLogin] = useState(true);
  const form = useFormState();
  const { busy, submit } = useSubmit(isLogin, form, onDone);
  const switchTab = (login: boolean) => {
    setIsLogin(login);
    form.reset();
  };
  return { isLogin, switchTab, form, busy, submit };
}

interface FieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
}

/** Label and input of one form field. */
function Field({ label, onChange, ...input }: FieldProps) {
  return (
    <>
      <label>{label}</label>
      <input {...input} onChange={(e) => onChange(e.target.value)} required />
    </>
  );
}

function NameFields({ form }: { form: FormState }) {
  const { values, change } = form;
  return (
    <div className="input-group">
      <Field label="Vorname" type="text" placeholder="Dein Vorname"
        value={values.firstname} onChange={(v) => change("firstname", v)} />
      <Field label="Nachname" type="text" placeholder="Dein Nachname"
        value={values.lastname} onChange={(v) => change("lastname", v)} />
    </div>
  );
}

function CredentialFields({ form }: { form: FormState }) {
  const { values, change } = form;
  return (
    <>
      <div className="input-group">
        <Field label="E-Mail Adresse" type="email" placeholder="name@beispiel.de"
          value={values.email} onChange={(v) => change("email", v)} />
      </div>
      <div className="input-group">
        <Field label="Passwort" type="password" placeholder="********" minLength={6}
          value={values.password} onChange={(v) => change("password", v)} />
      </div>
    </>
  );
}

interface TabsProps {
  isLogin: boolean;
  onSwitch: (login: boolean) => void;
}

function AuthTabs({ isLogin, onSwitch }: TabsProps) {
  return (
    <div className="auth-tabs">
      <button className={`tab ${isLogin ? "active" : ""}`} onClick={() => onSwitch(true)}>
        Anmelden
      </button>
      <button className={`tab ${!isLogin ? "active" : ""}`} onClick={() => onSwitch(false)}>
        Registrieren
      </button>
    </div>
  );
}

interface FormProps {
  isLogin: boolean;
  form: FormState;
  busy: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

function AuthForm({ isLogin, form, busy, onSubmit }: FormProps) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>{isLogin ? "Willkommen zurück!" : "Konto erstellen"}</h2>
      {!isLogin && <NameFields form={form} />}
      <CredentialFields form={form} />
      {form.error && <p className="auth-error">{form.error}</p>}
      <button type="submit" className="submit-btn" disabled={busy}>
        {isLogin ? "Einloggen" : "Konto anlegen"}
      </button>
    </form>
  );
}

export function Auth({ isOpen, onClose }: Props) {
  useScrollLock(isOpen);
  const { isLogin, switchTab, form, busy, submit } = useAuthForm(onClose);
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <AuthTabs isLogin={isLogin} onSwitch={switchTab} />
        <AuthForm isLogin={isLogin} form={form} busy={busy} onSubmit={submit} />
      </div>
    </div>
  );
}