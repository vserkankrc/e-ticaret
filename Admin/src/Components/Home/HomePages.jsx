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
  GiftOutlined,
  StopOutlined,
  NotificationOutlined, // <-- Bildirim ikonu eklendi
} from "@ant-design/icons";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const { Sider, Header, Content } = Layout;

const HomePages = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [user, isAuthenticated, loading, navigate]);

  if (loading || authorized === null) return null;

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Kategoriler",
      children: [
        {
          key: "3",
          label: "Kategori Listesi",
          onClick: () => navigate("/admin/categories"),
        },
        {
          key: "4",
          label: "Yeni Kategori Oluştur",
          onClick: () => navigate("/admin/categories/create"),
        },
      ],
    },
    {
      key: "5",
      icon: <LaptopOutlined />,
      label: "Ürünler",
      children: [
        {
          key: "6",
          label: "Ürün Listesi",
          onClick: () => navigate("/admin/products"),
        },
        {
          key: "7",
          label: "Yeni Ürün Oluştur",
          onClick: () => navigate("/admin/products/create"),
        },
      ],
    },
    {
      key: "8",
      icon: <UserOutlined />,
      label: "Kullanıcı Listesi",
      onClick: () => navigate("/admin/users"),
    },
    {
      key: "9",
      icon: <ShoppingCartOutlined />,
      label: "Siparişler",
      children: [
        {
          key: "10",
          label: "Tüm Siparişler",
          onClick: () => navigate("/admin/orders"),
        },
        {
          key: "11",
          icon: <StopOutlined />,
          label: "İptal Edilen Siparişler",
          onClick: () => navigate("/admin/orders/canceled"),
        },
      ],
    },
    {
      key: "12",
      icon: <GiftOutlined />,
      label: "Kuponlar",
      children: [
        {
          key: "13",
          label: "Kupon Listesi",
          onClick: () => navigate("/admin/coupons"),
        },
        {
          key: "14",
          label: "Yeni Kupon Oluştur",
          onClick: () => navigate("/admin/coupons/form"),
        },
      ],
    },
    {
      key: "15",
      icon: <CommentOutlined />,
      label: "Yorumlar",
      onClick: () => navigate("/admin/reviews"),
    },
    {
      key: "16",
      icon: <ProfileOutlined />,
      label: "Sayfalar",
      children: [
        {
          key: "17",
          label: "Sayfaları Listele",
          onClick: () => navigate("/admin/pages"),
        },
        {
          key: "18",
          label: "Yeni Sayfa Oluştur",
          onClick: () => navigate("/admin/pages/create"),
        },
      ],
    },
    {
      key: "19",
      icon: <NotificationOutlined />, // <-- Bildirim Gönder menüsü ikonu
      label: "Bildirim Gönder",
      onClick: () => navigate("/admin/notifications"),
    },
    {
      key: "20",
      icon: <RollbackOutlined />,
      label: "Ana Sayfaya Git",
      onClick: () => navigate("/"),
    },
  ];

  return (
    <div className="admin-layout">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider width={200} theme="dark">
          <Menu mode="vertical" style={{ height: "100%" }} items={menuItems} />
        </Sider>
        <Layout>
          <Header>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "white",
              }}
            >
              <h2>Admin Paneli</h2>
            </div>
          </Header>
          <Content>
            <div style={{ padding: "24px 50px", minHeight: 360 }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

HomePages.propTypes = {
  children: PropTypes.node,
};

export default HomePages;
