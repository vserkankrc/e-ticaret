import { Button, Popconfirm, Space, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/products`);
      // Backend'den gelen data: { success, data: [...] }
      const products = res.data?.data || [];

      // Kategori adını doğrudan almak için, backend'de populate yapılmalı.
      // Burada kategori objesinin name'i olduğunu varsayıyoruz.
      // Eğer sadece ID geliyorsa, burada map ile kategori adını dolduramazsın.
      
      // Gerekirse frontend'de kategori bilgisi çekilmeli veya backend güncellenmeli.
      
      setDataSource(products);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Ürünler getirilirken hata oluştu");
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/products/${id}`);
      message.success("Ürün başarıyla silindi");
      fetchProducts();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Ürün silinirken hata oluştu");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    {
      title: "Görsel",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        Array.isArray(images) && images.length > 0 ? (
          <img src={images[0]} alt="Ürün Görseli" style={{ width: 100, height: "auto" }} />
        ) : (
          "Yok"
        ),
    },
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Kategori",
      dataIndex: ["category", "name"], // category objesinin name alanı
      key: "categoryName",
      render: (categoryName) => categoryName || "Bilinmiyor",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (price) => (price ? <span>{price.toFixed(2)} ₺</span> : "-"),
    },
    {
      title: "İndirim (%)",
      dataIndex: "discount",
      key: "discount",
      render: (discount) =>
        discount !== undefined && discount > 0 ? <span>%{discount}</span> : "-",
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/products/update/${record._id}`)}
          >
            Güncelle
          </Button>
          <Popconfirm
            title="Ürünü silmek istediğinizden emin misiniz?"
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => deleteProduct(record._id)}
          >
            <Button type="primary" danger>
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Ürün Listesi</h2>
      <Table
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "Gösterilecek ürün yok" }}
      />
    </div>
  );
};

export default ProductPage;
