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
import api from "@/utils/axios"; // Güncel Axios importu

const { Option } = Select;

const UpdateProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        const cats = Array.isArray(res.data.categories)
          ? res.data.categories
          : Array.isArray(res.data)
          ? res.data
          : [];
        setCategories(cats);
      } catch (error) {
        message.error("Kategoriler yüklenirken hata oluştu.");
      }
    };
    fetchCategories();
  }, []);

  // Ürün bilgilerini çek
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/${id}`);
        const data = res.data.data || res.data;

        // Kategori ID normalize et
        const categoryId =
          data.category?._id || (typeof data.category === "string" ? data.category : null);

        form.setFieldsValue({
          name: data.name,
          description: data.description,
          price: data.price ?? 0,
          stock: data.quantity ?? 0,
          category: categoryId,
        });

        // Görselleri fileList olarak set et
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
  }, [id, form]);

  // Upload değişimini yönet
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Upload öncesi kontrol
  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("Sadece JPG/PNG formatında dosya yükleyebilirsiniz.");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Dosya boyutu 5MB'dan küçük olmalı.");
    }
    return isJpgOrPng && isLt5M;
  };

  // Form submit
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Cloudinary URL'lerini al
      const images = fileList
        .filter((file) => file.status === "done")
        .map(
          (file) =>
            file.url || (file.response && file.response.secure_url) || ""
        )
        .filter(Boolean);

      const updatedProduct = {
        ...values,
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

        <Form.Item
          label="Açıklama"
          name="description"
          rules={[{ required: true, message: "Açıklama giriniz." }]}
        >
          <Input.TextArea rows={4} placeholder="Ürün açıklaması" />
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
            action={`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`}
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            multiple
            maxCount={5}
            data={{ upload_preset: import.meta.env.VITE_CLOUD_UPLOAD_PRESET }}
            beforeUpload={beforeUpload}
          >
            {fileList.length >= 5 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Yükle</div>
              </div>
            )}
          </Upload>
          <small>En fazla 5 görsel yükleyebilirsiniz.</small>
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
