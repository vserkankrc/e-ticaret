import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Spin, Button } from "antd";
import axios from "@/utils/axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sayfa verisini yükle
  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/pages/${id}`);
        if (res.data.success) {
          setForm({
            title: res.data.data.title,
            slug: res.data.data.slug,
            content: res.data.data.content,
          });
        } else {
          message.error("Sayfa bulunamadı");
          navigate("/admin/pages");
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        message.error("Sayfa yüklenirken hata oluştu");
        navigate("/admin/pages");
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContentChange = (value) => {
    setForm({ ...form, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      return message.warning("Lütfen tüm alanları doldurun.");
    }
    setSaving(true);
    try {
      const res = await axios.put(`/api/pages/${id}`, form);
      if (res.data.success) {
        message.success("Sayfa başarıyla güncellendi");
        navigate("/admin/pages");
      } else {
        message.error(res.data.message || "Güncelleme başarısız");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Sayfa güncellenirken hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin tip="Sayfa yükleniyor..." style={{ display: "block", margin: "20px auto" }} />;

  return (
    <div className="update-page-container" style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>Sayfa Güncelle</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Başlık
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Sayfa başlığı"
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
        </label>

        <label>
          Slug (URL)
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Sayfa URL'si"
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
        </label>

        <label>
          İçerik
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={handleContentChange}
            style={{ height: 200, marginBottom: 20 }}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold", "italic", "underline", "strike", "blockquote",
              "list", "bullet", "indent",
              "link", "image",
            ]}
          />
        </label>

        <Button type="primary" htmlType="submit" loading={saving}>
          Güncelle
        </Button>
      </form>
    </div>
  );
};

export default UpdatePage;
