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
import LegalPage from "./pages/legal-page/legal-page";
import AdminOrdersPage from "./pages/admin-page/admin-page";
import { useAuth } from "./context/use-auth";
import { ProtectedRoute } from "./components/protected-route/protected-route";
import AdminRoute from "./components/admin/admin-route";

/**
 * Route wrapper component for displaying order details.
 * Extracts the `orderId` route parameter and passes authenticated user context to `OrderDetailPage`.
 *
 * @returns The rendered `OrderDetailPage` component or `null` if the user is unauthenticated.
 */
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

/**
 * Route wrapper component for the user profile page.
 * Bridges authenticated user state, profile updates, account deletion/logout,
 * and navigation actions to the `Profile` component.
 *
 * @returns The rendered `Profile` component or `null` if the user is unauthenticated.
 */
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

/**
 * Route wrapper component for the order history page.
 * Passes the authenticated user context and navigation callbacks to `OrdersPage`.
 *
 * @returns The rendered `OrdersPage` component or `null` if the user is unauthenticated.
 */
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

/**
 * Route wrapper component for the user reviews page.
 * Passes authenticated user context to `MyReviewsPage`.
 *
 * @returns The rendered `MyReviewsPage` component or `null` if the user is unauthenticated.
 */
function ReviewsWrapper() {
  const { loggedUser } = useAuth();
  if (!loggedUser) return null;
  return <MyReviewsPage user={loggedUser} />;
}

/**
 * Root Application component that sets up the main layout structure
 * including Header, Navbar, Footer, public routing, and protected routes.
 *
 * @returns The main application JSX layout structure.
 */
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
          <Route path="/imprint" element={<LegalPage type="imprint" />} />
          <Route path="/policy" element={<LegalPage type="privacy" />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/profil" element={<ProfileWrapper />} />
            <Route path="/order" element={<OrdersWrapper />} />
            <Route path="/order/:orderId" element={<OrderDetailWrapper />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/reviews" element={<ReviewsWrapper />} />
            <Route path="/admin" element={
            <AdminRoute><AdminOrdersPage /></AdminRoute>}/>
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;