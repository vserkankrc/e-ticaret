import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Link eklendi
import axios from "axios";
import "./MyFavorites.css";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/api/favorites`, {
          withCredentials: true,
        });
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.favorites || [];
        setFavorites(data);
      } catch (err) {
        console.error("Favoriler yüklenemedi:", err);
        setError("Favoriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [apiUrl]);

  const removeFavorite = async (productId) => {
    try {
      await axios.delete(`${apiUrl}/api/favorites/${productId}`, {
        withCredentials: true,
      });
      setFavorites((prev) =>
        prev.filter((fav) => fav.productId._id !== productId)
      );
    } catch (err) {
      console.error("Favoriden kaldırma hatası:", err);
      alert("Favoriden kaldırma işlemi başarısız oldu.");
    }
  };

  if (loading) return <p>Favoriler yükleniyor...</p>;
  if (error) return <p className="error">{error}</p>;
  if (favorites.length === 0)
    return <p className="no-favorites">Favori ürününüz bulunmamaktadır.</p>;

  return (
    <div className="favorites-container">
      {favorites.map((fav) => {
        const product = fav.productId;
        const detailUrl = `/ProductDetailsPage/${product._id}`;
        return (
          <div className="favorite-item" key={product._id}>
            {/* ✅ Link ile resim ve isim sarıldı */}
            <Link to={detailUrl} className="favorite-link">
              <img src={product.images?.[0]} alt={product.name} />
            </Link>
            <div className="favorite-details">
              <Link to={detailUrl} className="product-name-link">
                <h3>{product.name}</h3>
              </Link>
              <p className="description">{product.description}</p>
              <p className="price">{product.price}₺</p>
              <button
                onClick={() => removeFavorite(product._id)}
                className="remove-btn"
              >
                ❤️ Favoriden Kaldır
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyFavorites;
