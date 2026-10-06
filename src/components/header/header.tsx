import { useState, useRef, useEffect } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../auth/auth";
import SearchBar from "../search-bar/search-bar";
import { useAuth } from "../../context/use-auth";
import { useCartContext } from "../../context/use-cart-context";

function Header() {
  const { loggedUser, logout } = useAuth();
  const { cartCount } = useCartContext();
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleProfileClick() {
    setIsMenuOpen(false);
    navigate("/profil");
  }

  function handleOrdersClick() {
    setIsMenuOpen(false);
    navigate("/order");
  }

  function handleLogoutClick() {
    logout();
    setIsMenuOpen(false);
  }

  function handleReviewsClick() {
    setIsMenuOpen(false);
    navigate("/reviews");
  }

  return (
    <header className="header">
      <div className="header-content-max-width">
        <Link to="/" className="logo-container">
          <img className="logo" src="./assets/icons/logo.png" alt="Logo" />
          <span>Bookly</span>
        </Link>

        <div className="search-filter-container">
          <SearchBar />
        </div>

        <div className="actions">
          <div
            className="cart"
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
            onClick={() => navigate("/cart")}
          >
            <img
              className="cart-image"
              src={
                isCartHovered
                  ? "./assets/icons/cart_hover.png"
                  : "./assets/icons/cart_default.png"
              }
              alt="Cart"
            />
            <span className="cart-count">{cartCount}</span>
          </div>

          <div className="user-section" ref={menuRef}>
            {loggedUser ? (
              <div className="account-container">
                <img
                  className="user-image"
                  src={
                    isAccountHovered
                      ? "./assets/icons/account_hover.png"
                      : "./assets/icons/account_default.png"
                  }
                  onMouseEnter={() => setIsAccountHovered(true)}
                  onMouseLeave={() => setIsAccountHovered(false)}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  alt="Logged User"
                />
                {isMenuOpen && (
                  <div className="account-menu">
                    <div className="account-menu-name">
                      <span className="account-menu-firstname">
                        {loggedUser.Firstname}
                      </span>
                      <span className="account-menu-lastname">
                        {loggedUser.Lastname}
                      </span>
                    </div>
                    <button className="account-menu-item" onClick={handleProfileClick}>
                      Profil
                    </button>
                    <button className="account-menu-item" onClick={handleOrdersClick}>
                      Bestellungen
                    </button>
                    <button className="account-menu-item" onClick={handleReviewsClick}>
                      Bewertungen
                    </button>
                    <button className="account-menu-item logout" onClick={handleLogoutClick}>
                      Ausloggen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => setIsAuthOpen(true)}>
                Login
              </button>
            )}
          </div>

          <Auth
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;