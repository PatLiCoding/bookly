import { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { Auth } from "../auth/auth";
import SearchBar from "../search-bar/search-bar";
import CartButton from "./cart-button";
import UserSection from "./user-section";

/** Shop logo and name, linking to the home page. */
function Logo() {
  return (
    <Link to="/" className="logo-container">
      <img className="logo" src="./assets/icons/logo.png" alt="Logo" />
      <span>Bookly</span>
    </Link>
  );
}

/** Cart button, user section and the login/register modal. */
function HeaderActions() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="actions">
      <CartButton />
      <UserSection onLoginClick={() => setIsAuthOpen(true)} />
      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

/**
 * Renders the main top navigation header including logo, search bar,
 * shopping cart indicator, and user account dropdown menu.
 */
function Header() {
  return (
    <header className="header">
      <div className="header-content-max-width">
        <Logo />
        <div className="search-filter-container">
          <SearchBar />
        </div>
        <HeaderActions />
      </div>
    </header>
  );
}

export default Header;