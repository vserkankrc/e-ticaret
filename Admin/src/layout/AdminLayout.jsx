import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import PropTypes from "prop-types";
import {
  UserOutlined,
  LaptopOutlined,
  RollbackOutlined,
  BarcodeOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  CommentOutlined,
  ProfileOutlined,
   NotificationOutlined, 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Sider, Header, Content } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user || user.role !== "admin") {
      console.log("[AdminLayout] Yetkisiz erişim, yönlendiriliyor...");
      navigate("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [user, isAuthenticated, loading, navigate]);

  if (loading || authorized === null) {
    return null;
  }

  const menuItems = [
    { key: "1", icon: <DashboardOutlined />, label: "Dashboard", onClick: () => navigate("/admin") },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Kategoriler",
      children: [
        { key: "3", label: "Kategori Listesi", onClick: () => navigate("/admin/categories") },
        { key: "4", label: "Yeni Kategori Oluştur", onClick: () => navigate("/admin/categories/create") },
      ],
    },
    {
      key: "5",
      icon: <LaptopOutlined />,
      label: "Ürünler",
      children: [
        { key: "6", label: "Ürün Listesi", onClick: () => navigate("/admin/products") },
        { key: "7", label: "Yeni Ürün Oluştur", onClick: () => navigate("/admin/products/create") },
      ],
    },
    {
      key: "8",
      icon: <BarcodeOutlined />,
      label: "Kuponlar",
      children: [
        { key: "9", label: "Kupon Listesi", onClick: () => navigate("/admin/coupons") },
        { key: "10", label: "Yeni Kupon Oluştur", onClick: () => navigate("/admin/coupons/create") },
      ],
    },
    { key: "11", icon: <UserOutlined />, label: "Kullanıcı Listesi", onClick: () => navigate("/admin/users") },
    { key: "12", icon: <ShoppingCartOutlined />, label: "Siparişler", onClick: () => navigate("/admin/orders") },
    { key: "18", icon: <RollbackOutlined />, label: "İptal Edilen Siparişler", onClick: () => navigate("/admin/orders/canceled") },

    // Bildirim Gönder menüsü bağımsız ve görünür
    { key: "19", icon: <NotificationOutlined />, label: "Bildirim Gönder", onClick: () => navigate("/admin/notifications") },

    { key: "13", icon: <CommentOutlined />, label: "Yorumlar", onClick: () => navigate("/admin/reviews") },
    {
      key: "14",
      icon: <ProfileOutlined />,
      label: "Sayfalar",
      children: [
        { key: "15", label: "Sayfaları Listele", onClick: () => navigate("/admin/pages") },
        { key: "16", label: "Yeni Sayfa Oluştur", onClick: () => navigate("/admin/pages/create") },
      ],
    },
    { key: "17", icon: <RollbackOutlined />, label: "Ana Sayfaya Git", onClick: () => navigate("/") },
  ];

  return (
    <div className="admin-layout">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider width={200} theme="dark">
          <Menu mode="inline" theme="dark" style={{ height: "100%" }} items={menuItems} />
        </Sider>
        <Layout>
          <Header style={{ background: "#001529" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "white" }}>
              <h2>Admin Paneli</h2>
            </div>
          </Header>
          <Content>
            <div style={{ padding: "24px 50px", minHeight: 360 }}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node,
};

export default AdminLayout;
