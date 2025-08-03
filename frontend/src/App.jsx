import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import QuestionsPage from "./pages/QuestionsPage";
import CommunicationPage from "./pages/CommunicationPage";
import CartPage from "./pages/CartPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import CreateProductPage from "./pages/Admin/Products/CreateProductPage";
import CreateCategoryPage from "./pages/Admin/Categories/CreateCategoryPage";
import CategoryPage from "./pages/Admin/Categories/CategoryPage";
import UpdateCategoryPage from "./pages/Admin/Categories/UpdateCategoryPage";
import UserPage from "./pages/Admin/UserPage";
import PaymentPage from "./pages/PaymentPage";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProfilePages from "./pages/Profil/ProfilePage";
import ProductPage from "./pages/Admin/Products/ProductPage";
import UpdateProductPage from "./pages/Admin/Products/UpdateProductPage";
import OrdersPage from "./pages/OrdersPage";
import Reviews from "./pages/Admin/Reviews/Reviews";
import CookieConsent from "./components/Modals/CookieConsent/CookieConsent.jsx";
import StaticPage from "./pages/Admin/Pages/StaticPage/StaticPage.jsx";
import CanceledOrders from "./pages/Admin/Orders/CanceledOrders.jsx";
import PageList from "./pages/Admin/Pages/PagesList.jsx";
import CreatePage from "./pages/Admin/Pages/CreatePage";
import UpdatePage from "./pages/Admin/Pages/UpdatePage";
import AdminLayout from "./layouts/AdminLayout"; // 🆕
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        {/* Genel Sayfalar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/communication" element={<CommunicationPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/ProductDetailsPage/:id" element={<ProductDetailsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile/*" element={<ProfilePages />} />
        <Route path="/categori/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/:slug" element={<StaticPage />} />

        {/* Admin Layout ile sarmalanmış rotalar */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to="users" />} />
                <Route path="users" element={<UserPage />} />
                <Route path="categories" element={<CategoryPage />} />
                <Route path="categories/update/:id" element={<UpdateCategoryPage />} />
                <Route path="categories/create" element={<CreateCategoryPage />} />
                <Route path="products" element={<ProductPage />} />
                <Route path="products/create" element={<CreateProductPage />} />
                <Route path="products/update/:id" element={<UpdateProductPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/canceled" element={<CanceledOrders />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="pages" element={<PageList />} />
                <Route path="pages/create" element={<CreatePage />} />
                <Route path="pages/update/:id" element={<UpdatePage />} />
              </Routes>
            </AdminLayout>
          }
        />

        {/* Hatalı route'lar */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <CookieConsent />
    </>
  );
}

export default App;
