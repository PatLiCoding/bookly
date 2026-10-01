import { useState } from "react";
import "./App.css";
import "./styles/shared.css";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
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
import { OrdersPage } from "./pages/order-page/order-page";
import { OrderDetailPage } from "./pages/order-detail-page/order-detail-page";
import { useCart } from "./utils/use-cart";
import { MyReviewsPage } from "./pages/review-page/reviews-page";

interface OrderDetailRouteProps {
  user: User;
  onBack: () => void;
}

function OrderDetailRoute({ user, onBack }: OrderDetailRouteProps) {
  const { orderId } = useParams<{ orderId: string }>();
  return (
    <OrderDetailPage user={user} orderId={orderId ?? ""} onBack={onBack} />
  );
}

function App() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const {
    cartItems,
    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
  } = useCart();
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

  function handleClearCart() {
  clearCart();
  setErrorMsg("");
}

  function handleNavigateToOrderDetail(orderId: string | number) {
    navigate(`/order/${orderId}`);
  }

  function renderProfileRoute() {
    if (!loggedUser) return <Navigate to="/" replace />;
    return (
      <Profile
        user={loggedUser}
        onSave={handleSaveProfile}
        onDeleteAccount={handleDeleteAccount}
        onNavigateToDetail={handleNavigateToOrderDetail}
      />
    );
  }

  function renderOrdersRoute() {
    if (!loggedUser) return <Navigate to="/" replace />;
    return (
      <OrdersPage
        user={loggedUser}
        onNavigateToDetail={handleNavigateToOrderDetail}
      />
    );
  }

  function renderOrderDetailRoute() {
    if (!loggedUser) return <Navigate to="/" replace />;
    return (
      <OrderDetailRoute user={loggedUser} onBack={() => navigate("/order")} />
    );
  }

  function renderReviewsRoute() {
  if (!loggedUser) return <Navigate to="/" replace />;
  return <MyReviewsPage user={loggedUser} />;
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
          <Route
            path="/"
            element={
              <Home
                cartItems={cartItems}
                onAddToCart={addItem}
                onIncreaseItem={increaseItem}
                onDecreaseItem={decreaseItem}
              />
            }
          />
          <Route
            path="/category/:name"
            element={
              <CategoryPage
                cartItems={cartItems}
                onAddToCart={addItem}
                onIncreaseItem={increaseItem}
                onDecreaseItem={decreaseItem}
              />
            }
          />
          <Route
            path="/book/:id"
            element={
              <BookDetailsPage
                loggedUser={loggedUser}
                cartItems={cartItems}
                onAddToCart={addItem}
                onIncreaseItem={increaseItem}
                onDecreaseItem={decreaseItem}
              />
            }
          />
          <Route path="/profil" element={renderProfileRoute()} />
          <Route path="/order" element={renderOrdersRoute()} />
          <Route path="/order/:orderId" element={renderOrderDetailRoute()} />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                loggedUser={loggedUser}
                errorMsg={errorMsg}
                onIncreaseItem={increaseItem}
                onDecreaseItem={decreaseItem}
                onRemoveItem={removeItem}
                onClearCart={handleClearCart}
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
          <Route path="/reviews" element={renderReviewsRoute()} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
