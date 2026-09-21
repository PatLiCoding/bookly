import { useState } from "react";
import "./header.css";

function Header() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const loggedUser = false;

  return (
    <header className="header">
      <div className="content-max-width">
        <div className="search-filter-container">
          <div
            className="search-section"
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
          >
            <textarea name="search" placeholder="Suche"></textarea>
            <div className="lens-area">
              <img
                className="lens-area-border"
                src="/assets/icons/search-borderline.png"
                alt="Borderline"
              />
              <img
                className="lens-img"
                src={
                  isSearchHovered
                    ? "/assets/icons/search-hover.png"
                    : "/assets/icons/search-default.png"
                }
                alt="Search"
              />
            </div>
          </div>
        </div>

        <div className="actions">
          <div
            className="cart"
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
          >
            <img
              className="cart-image"
              src={
                isCartHovered
                  ? "/assets/icons/cart_hover.png"
                  : "/assets/icons/cart_default.png"
              }
              alt="Cart"
            />
            <span className="cart-count">{cartItemCount}</span>
          </div>
          <div className="user-section">
            {loggedUser ? (
              <img className="user-image"
                src={
                  isAccountHovered
                    ? "/assets/icons/account_hover.png"
                    : "/assets/icons/account_default.png"
                }
                onMouseEnter={() => setIsAccountHovered(true)}
                onMouseLeave={() => setIsAccountHovered(false)}
                alt="Logged User"
              />
            ) : (
              <button className="login-btn">Login</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
