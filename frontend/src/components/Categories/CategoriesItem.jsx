import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import "./CategoriesItem.css";

const CategoriesItem = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        setCategories(response.data.data);
      } catch (err) {
        console.error("Kategori verileri çekilemedi:", err.message);
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <>
      {categories.map((category) => (
        <li className="category-item" key={category._id}>
          <Link to={`/categori/${category._id}`}>
            <span className="category-title">{category.name}</span>
          </Link>
        </li>
      ))}
    </>
  );
};

export default CategoriesItem;
