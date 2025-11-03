/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  InputNumber,
  Upload,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "@/utils/axios";
import TiptapEditor from "../../Components/TiptapEditor/TiptapEditor";

const { Option } = Select;

const UpdateProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [description, setDescription] = useState(""); // ✅ Tiptap için local state

  // 1️⃣ Kategorileri fetch et
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        const cats = Array.isArray(res.data.data) ? res.data.data : [];
        setCategories(cats);
      } catch (error) {
        message.error("Kategoriler yüklenirken hata oluştu.");
      }
    };
    fetchCategories();
  }, []);

  // 2️⃣ Ürün bilgilerini fetch et (kategoriler yüklendikten sonra)
  useEffect(() => {
    if (!id || categories.length === 0) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/${id}`);
        const data = res.data.data || res.data;

        // category ID set et
        let categoryId = null;
        if (data.category) {
          if (typeof data.category === "string") {
            categoryId = data.category;
          } else if (data.category._id) {
            categoryId = data.category._id;
          }
        }

        form.setFieldsValue({
          name: data.name,
          price: data.price ?? 0,
          stock: data.quantity ?? 0,
          category: categoryId,
        });

        setDescription(data.description || ""); // ✅ description state set

        const files = (data.images || []).map((url, idx) => ({
          uid: String(idx),
          name: `image${idx}.jpg`,
          status: "done",
          url,
        }));
        setFileList(files);
      } catch (error) {
        message.error("Ürün bilgileri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, categories, form]);

  // Upload değişimini yönet
  const handleUploadChange = async ({ file, fileList: newFileList }) => {
    if (file.status === "uploading" && !file.url && !file.response) {
      const formData = new FormData();
      formData.append("image", file.originFileObj);

      try {
        const res = await api.post("/api/products/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        file.url = res.data.url;
        file.status = "done";
        message.success(`${file.name} yüklendi.`);
      } catch (err) {
        console.error("Görsel yüklenemedi:", err);
        file.status = "error";
        message.error(`${file.name} yüklenemedi.`);
      }
    }

    setFileList(newFileList);
  };

  // Upload öncesi kontrol
  const beforeUpload = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    const isAllowed = allowedTypes.includes(file.type);
    if (!isAllowed) {
      message.error(
        "Sadece JPG, PNG, WEBP, GIF veya SVG formatında dosya yükleyebilirsiniz."
      );
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Dosya boyutu 5MB'dan küçük olmalı.");
    }

    return isAllowed && isLt5M;
  };

  // Form submit
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const images = fileList
        .filter((file) => file.status === "done")
        .map((file) => file.url || "")
        .filter(Boolean);

      const updatedProduct = {
        ...values,
        description, // ✅ Tiptap içeriğini ekle
        quantity: values.stock,
        images,
      };
      delete updatedProduct.stock;

      await api.put(`/api/products/${id}`, updatedProduct);
      message.success("Ürün başarıyla güncellendi.");
      navigate("/admin/products");
    } catch (error) {
      console.log("Ürün güncelleme hatası:", error);
      message.error("Ürün güncellenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.getFieldValue("name")) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Ürün Güncelle</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ price: 0, stock: 0 }}
      >
        <Form.Item
          label="Ürün Adı"
          name="name"
          rules={[{ required: true, message: "Ürün adı giriniz." }]}
        >
          <Input placeholder="Ürün adı" />
        </Form.Item>

        <Form.Item label="Açıklama" required>
          <TiptapEditor value={description} onChange={setDescription} />
        </Form.Item>

        <Form.Item
          label="Kategori"
          name="category"
          rules={[{ required: true, message: "Kategori seçiniz." }]}
        >
          <Select
            placeholder="Kategori seçiniz"
            loading={categories.length === 0}
            allowClear
          >
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Fiyat"
          name="price"
          rules={[{ required: true, message: "Fiyat giriniz." }]}
        >
          <InputNumber
            min={0}
            formatter={(value) => `₺ ${value}`}
            parser={(value) => value.replace(/₺\s?|(,*)/g, "")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Stok"
          name="stock"
          rules={[{ required: true, message: "Stok adedi giriniz." }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Ürün Görselleri">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            multiple
            maxCount={5}
            beforeUpload={beforeUpload}
          >
            {fileList.length >= 5 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Yükle</div>
              </div>
            )}
          </Upload>
          <small>
            En fazla 5 görsel yükleyebilirsiniz. Desteklenen formatlar: JPG,
            PNG, WEBP, GIF, SVG
          </small>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Güncelle
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateProductPage;
