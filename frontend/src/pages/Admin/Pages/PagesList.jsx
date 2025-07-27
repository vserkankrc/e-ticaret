import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { message, Spin, Modal, Button } from "antd";

const { confirm } = Modal;

const PagesList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/pages");
      const dataPages = Array.isArray(res.data.data) ? res.data.data : [];
      setPages(dataPages);
    } catch (error) {
      console.error("Sayfalar yüklenirken hata:", error);
      message.error("Sayfalar yüklenirken hata oluştu.");
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = (id) => {
    confirm({
      title: "Sayfayı silmek istediğinize emin misiniz?",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk: async () => {
        try {
          await axios.delete(`/api/pages/${id}`);
          message.success("Sayfa başarıyla silindi.");
          fetchPages();
        } catch (error) {
          console.error("Sayfa silinirken hata:", error);
          message.error("Sayfa silinirken hata oluştu.");
        }
      },
    });
  };

  const handleUpdate = (id) => {
    // Burada güncelleme sayfasına yönlendirme yapabilirsin
    // Örneğin React Router kullanıyorsan:
    window.location.href = `/admin/pages/update/${id}`;
    // Ya da useNavigate() ile
    // navigate(`/admin/pages/update/${id}`);
  };

  if (loading) return <Spin tip="Yükleniyor..." style={{ display: "block", margin: "20px auto" }} />;

  if (!pages.length) return <div>Henüz sayfa bulunmamaktadır.</div>;

  return (
    <div>
      <h2>Sayfalar Listesi</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {pages.map((page) => (
          <li key={page._id || page.slug} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <strong>{page.title}</strong> — <em>{page.slug}</em>
            </div>
            <div>
              <Button type="primary" onClick={() => handleUpdate(page._id)} style={{ marginRight: 8 }}>
                Güncelle
              </Button>
              <Button danger onClick={() => handleDelete(page._id)}>
                Sil
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PagesList;
