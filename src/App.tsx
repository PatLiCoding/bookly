import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import type { User } from "./interface/user";
import Header from "./components/header/header";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Home from "./pages/home/home";
import CategoryPage from "./pages/category-page/category-page";
import BookDetailsPage from "./pages/book-details-page/book-details-page";
import { Profile } from "./pages/profile-page/profile";
import { CartPage } from "./pages/cart-page/cart-page";
import { CheckoutPage } from "./pages/checkout-page/checkout-page";
import { useCart } from "./utils/use-cart";

function App() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { cartItems, addItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function handleSaveProfile(updated: Partial<User>) {
    setLoggedUser((prev) => (prev ? { ...prev, ...updated } : prev));
  }

  function handleUpdateUser(updatedUser: User) {
    setLoggedUser(updatedUser);
  }

  function handleDeleteAccount() {
    setLoggedUser(null);
  }

  function handleCheckout() {
    navigate("/checkout");
  }

  function handleOrderComplete() {
    clearCart();
  }

  function renderProfileRoute() {
    if (!loggedUser) {
      return <Navigate to="/" replace />;
    }
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
        cartCount={cartCount}
      />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home onAddToCart={addItem} />} />
          <Route
            path="/kategorie/:name"
            element={<CategoryPage onAddToCart={addItem} />}
          />
          <Route
            path="/book/:id"
            element={<BookDetailsPage onAddToCart={addItem} />}
          />
          <Route path="/profil" element={renderProfileRoute()} />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                loggedUser={loggedUser}
                errorMsg={errorMsg}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
                setErrorMsg={setErrorMsg}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cartItems={cartItems}
                loggedUser={loggedUser}
                onUpdateUser={handleUpdateUser}
                onOrderComplete={handleOrderComplete}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
