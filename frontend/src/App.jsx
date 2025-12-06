import { Routes, Route, } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import QuestionsPage from "./pages/QuestionsPage";
import CommunicationPage from "./pages/CommunicationPage";
import CartPage from "./pages/CartPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";

import PaymentPage from "./pages/PaymentPage";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProfilePages from "./pages/Profil/ProfilePage";

import CookieConsent from "./components/Modals/CookieConsent/CookieConsent.jsx";
import StaticPage from "./pages/Admin/Pages/StaticPage/StaticPage.jsx";

import Notification from "./components/Notification/Notification.jsx";


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

        {/* Bildirimler */}

        <Route path="/notifications" element={<Notification/>}/>
       
        
      
      </Routes>
      <CookieConsent />
    </>
  );
}

export default App;
