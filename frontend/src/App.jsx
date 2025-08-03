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
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Sayfaları görüntüleme */}
        <Route path="/:slug" element={<StaticPage />} />

        {/* Kategoriye göre ürün */}
        <Route path="/categori/:categoryId" element={<CategoryProductsPage />} />

        {/* Parola Sıfırlama */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Kullanıcı Profili */}
        <Route path="/profile/*" element={<ProfilePages />} />

        {/* Admin Paneli */}
        <Route path="/admin" element={<Navigate to="/admin/users" />} />
        <Route path="/admin/users" element={<UserPage />} />
        <Route path="/admin/categories" element={<CategoryPage />} />
        <Route path="/admin/categories/update/:id" element={<UpdateCategoryPage />} />
        <Route path="/admin/categories/create" element={<CreateCategoryPage />} />
        <Route path="/admin/products" element={<ProductPage />} />
        <Route path="/admin/products/create" element={<CreateProductPage />} />
        <Route path="/admin/products/update/:id" element={<UpdateProductPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/orders/canceled" element={<CanceledOrders />} />
        <Route path="/admin/reviews" element={<Reviews />} />
        <Route path="/admin/pages" element={<PageList />} />
        <Route path="/admin/pages/create" element={<CreatePage />} />
        <Route path="/admin/pages/update/:id" element={<UpdatePage />} />
      </Routes>

      <CookieConsent />
    </>
  );
}

export default App;
