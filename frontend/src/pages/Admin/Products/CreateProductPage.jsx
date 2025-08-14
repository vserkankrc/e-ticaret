import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const CreateProductPage = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories`);
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error("Kategori verisi bir dizi değil:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Kategori verisi alınamadı:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = ({ fileList }) => {
    setImageList(fileList.slice(0, 5));
  };

  const handleSubmit = async (values) => {
    if (imageList.length < 1 || imageList.length > 5) {
      return message.error("Lütfen en az 1, en fazla 5 görsel yükleyin.");
    }

    try {
      setLoading(true);
      const uploadedImageUrls = [];

      for (let i = 0; i < imageList.length; i++) {
        const formData = new FormData();
        formData.append("image", imageList[i].originFileObj);

        const res = await axios.post(
          `${apiUrl}/api/products/upload-image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        uploadedImageUrls.push(res.data.url);
      }

      const newProduct = {
        ...values,
        images: uploadedImageUrls,
      };

      await axios.post(`${apiUrl}/api/products`, newProduct);
      message.success("Ürün başarıyla oluşturuldu!");
      form.resetFields();
      setImageList([]);
    } catch (err) {
      console.error(err);
      message.error("Ürün oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="create-product-page"
      style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}
    >
      <h2>Yeni Ürün Oluştur</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Ürün Adı"
          name="name"
          rules={[{ required: true, message: "Ürün adı giriniz." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Açıklama"
          name="description"
          rules={[{ required: true, message: "Açıklama giriniz." }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Fiyat"
          name="price"
          rules={[{ required: true, message: "Fiyat giriniz." }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Stok Adedi"
          name="quantity"
          rules={[{ required: true, message: "Stok adedi giriniz." }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label="İndirim (%)" name="discount">
          <InputNumber style={{ width: "100%" }} min={0} max={100} />
        </Form.Item>

        <Form.Item
          label="Renkler"
          name="colors"
          rules={[{ required: false, message: "Renk seçiniz." }]}
        >
          <Select mode="multiple" placeholder="Renk seçin">
            <Option value="kırmızı">Kırmızı</Option>
            <Option value="siyah">Siyah</Option>
            <Option value="mavi">Mavi</Option>
            <Option value="yeşil">Yeşil</Option>
            <Option value="beyaz">Beyaz</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Bedenler"
          name="sizes"
          rules={[{ required: false, message: "Beden seçiniz." }]}
        >
          <Select mode="multiple" placeholder="Beden seçin">
            <Option value="s">S</Option>
            <Option value="m">M</Option>
            <Option value="l">L</Option>
            <Option value="xl">XL</Option>
            <Option value="xxl">XXL</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Kategori"
          name="categoryId"
          rules={[{ required: true, message: "Kategori seçiniz." }]}
        >
          <Select
            placeholder="Kategori Seçin"
            loading={categories.length === 0}
          >
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Görseller" required>
          <Upload
            listType="picture"
            fileList={imageList}
            beforeUpload={() => false}
            onChange={handleImageChange}
            multiple
          >
            <Button icon={<UploadOutlined />}>Görsel Yükle (max 5)</Button>
          </Upload>
          <small>{imageList.length} görsel seçildi</small>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Ürünü Oluştur
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProductPage;
