import "./ProfileSidebar.css";

// eslint-disable-next-line react/prop-types
const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div>
      <h2>Hesabım</h2>
      <ul className="profile-menu">
        <li onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>
          🧾 Siparişlerim
        </li>
        <li onClick={() => setActiveTab("details")} className={activeTab === "details" ? "active" : ""}>
          👤 Bilgilerim
        </li>
        <li onClick={() => setActiveTab("changepassword")} className={activeTab === "changepassword" ? "active" : ""}>
          🔒 Şifre Değiştir
        </li>
        <li onClick={() => setActiveTab("favorites")} className={activeTab === "favorites" ? "active" : ""}>
          ❤️ Favorilerim
        </li>
        <li onClick={() => setActiveTab("cards")} className={activeTab === "cards" ? "active" : ""}>
          💳 Kartlarım
        </li>
      </ul>
    </div>
  );
};

export default ProfileSidebar;
