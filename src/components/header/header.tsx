import { useState } from 'react';
import './header.css';

function Header() {
    const [cartItemCount, setCartItemCount] = useState(0);

    return (
        <header className="header">
            <div className="logo-container">
                <img className="logo" src="assets/icons/fav.png" alt="Logo" />
                <span>Bookstore</span>
            </div>

            <div className="actions">
                <div className="cart">
                    🛒
                    <span className="cart-count">
                        {cartItemCount}
                    </span>
                </div>
                <button className="login-btn">Login</button>
            </div>
        </header>
    );
}

export default Header;