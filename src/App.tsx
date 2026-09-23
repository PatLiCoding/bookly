import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import type { User } from "./interface/user";
import Header from "./components/header/header";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/home/home";
import CategoryPage from "./pages/category-page/category-page";
import BookDetailsPage from "./pages/book-details-page/book-details-page";
import { Profile } from "./pages/profile-page/profile";
import Footer from "./components/footer/footer";

function App() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  function handleSaveProfile(updated: Partial<User>) {
    setLoggedUser((prev) => (prev ? { ...prev, ...updated } : prev));
  }

  function handleDeleteAccount() {
    setLoggedUser(null);
  }

  function renderProfileRoute() {
    if (!loggedUser) return <Navigate to="/" replace />;
    return (
      <Profile
        user={loggedUser}
        onSave={handleSaveProfile}
        onDeleteAccount={handleDeleteAccount}
      />
    );
  }

  return (
    <div className="appContainer">
      <Header
        loggedUser={loggedUser}
        onLoginSuccess={setLoggedUser}
        onLogout={() => setLoggedUser(null)}
      />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kategorie/:name" element={<CategoryPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/profil" element={renderProfileRoute()} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;