import { useState, useEffect } from "react";
import "./auth.css";
import type { User } from "../../interface/user";
import { user as dummyUsers } from "../../data/user-dummy-data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export function Auth({ isOpen, onClose, onLoginSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function resetForm() {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setError("");
  }

  function switchTab(loginMode: boolean) {
    setIsLogin(loginMode);
    resetForm();
  }

  function handleLogin() {
    const found = users.find(
      (u) => u.email === email && u.passwort === password,
    );
    if (!found) {
      setError("E-Mail oder Passwort falsch");
      return;
    }
      onLoginSuccess(found);
      resetForm(); 
    onClose();
  }

  function handleRegister() {
    const exists = users.some((u) => u.email === email);
    if (exists) {
      setError("E-Mail wird bereits verwendet");
      return;
    }

    const newUser: User = {
      id: users.length + 1,
      Firstname: firstname,
      Lastname: lastname,
      email,
      passwort: password,
      deliveryAddress: [],
      reviews: [],
      order: [],
    };
    setUsers([...users, newUser]);
      onLoginSuccess(newUser);
      resetForm(); 
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="auth-tabs">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => switchTab(true)}
          >
            Anmelden
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => switchTab(false)}
          >
            Registrieren
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{isLogin ? "Willkommen zurück!" : "Konto erstellen"}</h2>

          {!isLogin && (
            <div className="input-group">
              <label>Vorname</label>
              <input
                type="text"
                placeholder="Dein Vorname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <label>Nachname</label>
              <input
                type="text"
                placeholder="Dein Nachname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>E-Mail Adresse</label>
            <input
              type="email"
              placeholder="name@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Passwort</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="submit-btn">
            {isLogin ? "Einloggen" : "Konto anlegen"}
          </button>
        </form>
      </div>
    </div>
  );
}
