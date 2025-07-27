import { useState } from "react";
import ReactQuill from "react-quill"; // react-quill importu
import "react-quill/dist/quill.snow.css"; // react-quill css'i
import "./CreatePage.css";
import { message } from "antd";
import axios from "@/utils/axios";

const CreatePage = () => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContentChange = (value) => {
    setForm((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
        return message.warning("Lütfen tüm alanları doldurun.");
      }

      await axios.post("/api/pages", form);
      message.success("Sayfa başarıyla oluşturuldu.");
      setForm({ title: "", slug: "", content: "" });
    } catch (error) {
      console.error(error);
      message.error("Sayfa oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <div className="create-page-container">
      <h2>Yeni Statik Sayfa Oluştur</h2>
      <form className="create-page-form" onSubmit={handleSubmit}>
        <label>
          Sayfa Başlığı
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Örn: Gizlilik Politikası"
          />
        </label>

        <label>
          Slug (URL)
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Örn: privacy-policy"
          />
        </label>

        <label>
          Sayfa İçeriği
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={handleContentChange}
            placeholder="Bu sayfada gizlilik politikamızı bulabilirsiniz..."
            style={{ height: "200px", marginBottom: "20px" }}
          />
        </label>

        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default CreatePage;
