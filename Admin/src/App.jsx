// App.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// 🔑 Sayfalar
import AdminLogin from "./Components/Auth/Login";
import HomePages from "./Components/Home/HomePages";
import UserPage from "./pages/UsePages/UsePages";
import CategoryPage from "./pages/Categories/CategoryPage";
import UpdateCategoryPage from "./pages/Categories/UpdateCategoryPage";
import CreateCategoryPage from "./pages/Categories/CreateCategoryPage";
import ProductPage from "./pages/Products/ProductPage";
import CreateProductPage from "./pages/Products/CreateProductPage";
import UpdateProductPage from "./pages/Products/UpdateProductPage";
import OrdersPage from "./pages/Orders/Orders";
import CanceledOrders from "./pages/Orders/CanceledOrders";
import Reviews from "./pages/Reviews/Reviews";
import PageList from "./pages/PageList/PagesList";
import CreatePage from "./pages/PageList/CreatePage";
import UpdatePage from "./pages/PageList/UpdatePage";
import UpdateCouponPage from "./pages/Coupon/UpdateCouponPage";
import CouponPage from "./pages/Coupon/CouponPage";
// 🔒 Korumalı Rota
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div>🔄 Yükleniyor...</div>;
  if (!isAuthenticated || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>🔄 Yükleniyor...</div>;

  return (
    <Routes>
      {/* 🔐 Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 🧭 Admin Panel Layout */}
      {isAuthenticated && user?.role === "admin" && (
        <Route path="/admin" element={<HomePages />}>
          <Route index element={<div>Admin Dashboard</div>} />
          <Route path="users" element={<UserPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="categories/create" element={<CreateCategoryPage />} />
          <Route
            path="categories/update/:id"
            element={<UpdateCategoryPage />}
          />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/update/:id" element={<UpdateProductPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/canceled" element={<CanceledOrders />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="pages" element={<PageList />} />
          <Route path="pages/create" element={<CreatePage />} />
          <Route path="pages/update/:id" element={<UpdatePage />} />
          <Route path="coupons/form/:id?" element={<UpdateCouponPage />} />
          <Route path="coupons" element={<CouponPage />} />
        </Route>
      )}

      {/* 🚫 Diğer tüm rotalar login'e yönlendir */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default App;
