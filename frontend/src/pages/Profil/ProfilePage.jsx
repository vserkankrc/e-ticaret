import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MyCards from "./MyCards/MyCards.jsx";
import MyOrders from "./MyOrders/MyOrders.jsx";
import MyDetails from "./MyDetails/MyDetails.jsx";
import ChangePassword from "./ChangePassword/ChangePassword.jsx";
import MyFavorites from "./MyFavorites/MyFavorites.jsx";
import ProfileSidebar from "../../components/Profil/ProfileSidebar.jsx";
import "./ProfilePage.css";

const ProfilePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Mobilde menü tıklanınca kapansın
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <MyOrders />;
      case "details":
        return <MyDetails />;
      case "changepassword":
        return <ChangePassword />;
      case "favorites":
        return <MyFavorites />;
      case "cards":
        return <MyCards />;
      default:
        return <MyOrders />;
    }
  };

  return (
    <div className="profil-page-container">
      <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        ☰ Menü
      </button>

      <div className={`profile-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ProfileSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

      <div className="profil-content">{renderContent()}</div>
    </div>
  );
};

export default ProfilePage;
