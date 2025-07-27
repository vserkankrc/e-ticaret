/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import "./StaticPage.css";

const StaticPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`/api/pages/${slug}`);
        setPage(res.data.data);
      } catch (err) {
        // Sayfa bulunamazsa 404 sayfasına yönlendir
        navigate("/404", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, navigate]);

  if (loading) return <div className="static-page">Yükleniyor...</div>;

  return (
    <div className="static-page">
      <h1>{page.title}</h1>
      <div
        className="static-page-content"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
};

export default StaticPage;
