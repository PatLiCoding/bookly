import { useEffect, useState } from "react";
import "./auth.css";
import { useAuth } from "../../context/use-auth";

/** Props for the Auth component. */
interface Props {
  /** Indicates whether the authentication modal is visible. */
  isOpen: boolean;
  /** Callback triggered when the modal should be closed. */
  onClose: () => void;
}

/** Represents the form fields for registration and login. */
interface FormValues {
  /** User's first name. */
  firstname: string;
  /** User's last name. */
  lastname: string;
  /** User's email address. */
  email: string;
  /** User's account password. */
  password: string;
}

const EMPTY: FormValues = { firstname: "", lastname: "", email: "", password: "" };

/**
 * Custom hook that locks the background body scrolling when a modal is open.
 *
 * @param isOpen - Controls whether scroll locking is active.
 */
function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
}

/**
 * Custom hook to manage form state and field updates.
 *
 * @returns Object containing form values, error message, and handler functions.
 */
function useFormState() {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");
  
  /**
   * Updates a specific field in the form state.
   *
   * @param field - The key of the field to update.
   * @param value - The new input value.
   */
  const change = (field: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  /** Resets form values and clears any existing error message. */
  const reset = () => {
    setValues(EMPTY);
    setError("");
  };

  return { values, error, setError, change, reset };
}

type FormState = ReturnType<typeof useFormState>;

/**
 * Safely extracts an error message string from an unknown error object.
 *
 * @param err - The caught error.
 * @returns A user-friendly error message string.
 */
function errorText(err: unknown): string {
  return err instanceof Error ? err.message : "Unbekannter Fehler";
}

/**
 * Custom hook that handles submission for authentication (login or sign-up).
 *
 * @param isLogin - Indicates if the active tab is set to login.
 * @param form - Form state object provided by `useFormState`.
 * @param onDone - Callback triggered upon successful submission.
 * @returns Object containing busy indicator state and the submit handler.
 */
function useSubmit(isLogin: boolean, form: FormState, onDone: () => void) {
  const { signIn, signUp } = useAuth();
  const [busy, setBusy] = useState(false);

  /**
   * Handles form submit event, calls auth services, and resets form on success.
   *
   * @param e - Form submission event.
   */
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

/**
 * Orchestrates authentication modal state, switching between login and registration.
 *
 * @param onDone - Callback called after successful login or sign-up.
 * @returns Controls and state for authentication tabs and submit processes.
 */
function useAuthForm(onDone: () => void) {
  const [isLogin, setIsLogin] = useState(true);
  const form = useFormState();
  const { busy, submit } = useSubmit(isLogin, form, onDone);

  /**
   * Switches between login and registration mode and resets the form.
   *
   * @param login - True to switch to login mode, false for registration mode.
   */
  const switchTab = (login: boolean) => {
    setIsLogin(login);
    form.reset();
  };

  return { isLogin, switchTab, form, busy, submit };
}

/** Props for an individual input field component. */
interface FieldProps {
  /** Label text displayed above the input. */
  label: string;
  /** HTML input type (e.g., 'text', 'password', 'email'). */
  type: string;
  /** Placeholder text for the input field. */
  placeholder: string;
  /** Current value of the input field. */
  value: string;
  /** Callback triggered when the input value changes. */
  onChange: (value: string) => void;
  /** Optional minimum character length constraint. */
  minLength?: number;
}

/**
 * Renders a single form label and text input control.
 */
function Field({ label, onChange, ...input }: FieldProps) {
  return (
    <>
      <label>{label}</label>
      <input {...input} onChange={(e) => onChange(e.target.value)} required />
    </>
  );
}

/**
 * Renders fields for first name and last name (used during registration).
 */
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

/**
 * Renders email and password input fields.
 */
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

/** Props for navigation tabs inside the auth modal. */
interface TabsProps {
  /** Whether the login tab is currently selected. */
  isLogin: boolean;
  /** Callback triggered when tab selection changes. */
  onSwitch: (login: boolean) => void;
}

/**
 * Renders tab options for toggling between 'Anmelden' (Login) and 'Registrieren' (Register).
 */
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

/** Props for rendering the interactive form layout. */
interface FormProps {
  /** Whether the current mode is login. */
  isLogin: boolean;
  /** Form state containing error messages and values. */
  form: FormState;
  /** Indicates whether request submission is in progress. */
  busy: boolean;
  /** Form submit event handler function. */
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Renders the form contents including fields, submit button, and error state.
 */
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

/**
 * Modal dialogue component managing user login and account creation.
 */
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