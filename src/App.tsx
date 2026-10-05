import "./App.css";
import "./styles/shared.css";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import Header from "./components/header/header";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Home from "./pages/home/home";
import CategoryPage from "./pages/category-page/category-page";
import BookDetailsPage from "./pages/book-details-page/book-details-page";
import Profile from "./pages/profile-page/profile";
import CartPage from "./pages/cart-page/cart-page";
import CheckoutPage from "./pages/checkout-page/checkout-page";
import OrdersPage from "./pages/order-page/order-page";
import OrderDetailPage from "./pages/order-detail-page/order-detail-page";
import MyReviewsPage from "./pages/review-page/reviews-page";
import { useAuth } from "./context/use-auth";
import { ProtectedRoute } from "./components/protected-route/protected-route";

function OrderDetailWrapper() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { loggedUser } = useAuth();
  if (!loggedUser) return null;
  return (
    <OrderDetailPage
      user={loggedUser}
      orderId={orderId ?? ""}
      onBack={() => navigate("/order")}
    />
  );
}

function ProfileWrapper() {
  const { loggedUser, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!loggedUser) return null;

  return (
    <Profile
      user={loggedUser}
      onSave={updateUser}
      onDeleteAccount={logout}
      onNavigateToDetail={(id) => navigate(`/order/${id}`)}
    />
  );
}

function OrdersWrapper() {
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  if (!loggedUser) return null;
  return (
    <OrdersPage
      user={loggedUser}
      onNavigateToDetail={(id) => navigate(`/order/${id}`)}
    />
  );
}

function ReviewsWrapper() {
  const { loggedUser } = useAuth();
  if (!loggedUser) return null;
  return <MyReviewsPage user={loggedUser} />;
}

function App() {
  return (
    <div className="appContainer">
      <Header />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profil" element={<ProfileWrapper />} />
            <Route path="/order" element={<OrdersWrapper />} />
            <Route path="/order/:orderId" element={<OrderDetailWrapper />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/reviews" element={<ReviewsWrapper />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;