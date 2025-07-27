import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { CartContext } from "../../../context/CartProvider";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import api from "../../../utils/axios";
import "./Info.css";

const Info = ({ product }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [stock, setStock] = useState(product.quantity);

  const {
    _id,
    name,
    price,
    discount,
    category,
    sizes = [],
    colors = [],
    images = [],
  } = product;

  const discountedPrice =
    discount > 0 ? Math.round(price - (price * discount) / 100) : price;

  const isAlreadyInCart = cartItems.some((item) => item._id === _id);

  // Ortalama puan ve yorum sayısını tutacak state
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, count: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      setIsFavorite(false);
      return;
    }

    const fetchFavoriteStatus = async () => {
      try {
        setFavLoading(true);
        const res = await api.get("/api/favorites", { withCredentials: true });
        const favorites = res.data || [];
        const found = favorites.some((fav) => fav.productId._id === _id);
        setIsFavorite(found);
      } catch (error) {
        console.error("Favori durumu alınamadı:", error);
        setIsFavorite(false);
      } finally {
        setFavLoading(false);
      }
    };

    fetchFavoriteStatus();
  }, [isAuthenticated, _id]);

  useEffect(() => {
    // Backend’den puan ve yorum sayısı çekiliyor
    const fetchRatingStats = async () => {
      try {
        const res = await api.get(`/api/reviews/product/${_id}/rating`);
        setRatingStats(res.data);
      } catch (error) {
        console.error("Puan ve yorum bilgisi alınamadı:", error);
      }
    };

    fetchRatingStats();
  }, [_id]);

  // Yıldızları renklendirmek için fonksiyon (dolu = sarı, boş = soluk gri)
  const renderStars = (averageRating) => {
    const roundedRating = Math.round(averageRating);
    return (
      <ul
        className="product-star"
        style={{
          display: "flex",
          gap: "4px",
          padding: 0,
          margin: 0,
          listStyle: "none",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <li key={i}>
            <i
              className="bi bi-star-fill"
              style={{
                color: i < roundedRating ? "#facc15" /* sarı */ : "#d1d5db" /* soluk gri */,
                fontSize: "1.2rem",
              }}
            ></i>
          </li>
        ))}
      </ul>
    );
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Favorilere eklemek için giriş yapmalısınız.");
      navigate("/auth");
      return;
    }

    setFavLoading(true);

    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${_id}`, { withCredentials: true });
        setIsFavorite(false);
        message.info("Favorilerden çıkarıldı.");
      } else {
        await api.post(
          "/api/favorites",
          { productId: _id },
          { withCredentials: true }
        );
        setIsFavorite(true);
        message.success("Favorilere eklendi!");
      }
    } catch (error) {
      console.error("Favori işlemi başarısız:", error);
      message.error("Favori işlemi sırasında hata oluştu.");
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      message.warning("Sepete eklemek için giriş yapmalısınız.");
      navigate("/auth");
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      message.warning("Lütfen bir beden seçin.");
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      message.warning("Lütfen bir renk seçin.");
      return;
    }

    if (isAlreadyInCart) {
      message.info("Bu ürün zaten sepette.");
      return;
    }

    if (quantity > stock) {
      message.error("Stokta yeterli ürün yok.");
      return;
    }

    const itemToAdd = {
      _id,
      name,
      images, // Burada tüm images dizisini gönderiyoruz
      price: discountedPrice,
      quantity,
      selectedSize,
      selectedColor,
    };

    addToCart(itemToAdd);
    message.success("Ürün sepete eklendi!");
  };

  return (
    <div className="product-info">
      <h1 className="product-title">{name}</h1>

      <div
        className="product-review"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        {renderStars(ratingStats.averageRating)}
        <span>{ratingStats.count} Yorum</span>
      </div>

      <div className="product-price">
        {discount > 0 && <s className="old-price">₺{price}</s>}
        <strong className="new-price">₺{discountedPrice}</strong>
        <span className="stock-info">Stok: {stock}</span>
      </div>

      <form className="variations-form">
        <div className="variations">
          {colors.length > 0 && (
            <div className="values">
              <div className="values-label">
                <span>Renk</span>
              </div>
              <div className="values-list">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-btn ${
                      selectedColor === color ? "active" : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="values">
              <div className="values-label">
                <span>Beden</span>
              </div>
              <div className="values-list">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-btn ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="cart-button">
            <input
              type="number"
              min="1"
              max={stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
              className="btn btn-lg btn-primary"
              type="button"
              onClick={handleAddToCart}
              disabled={isAlreadyInCart || stock === 0}
            >
              {stock === 0
                ? "Tükendi"
                : isAlreadyInCart
                ? "Sepette Eklendi"
                : "Sepete Ekle"}
            </button>
          </div>

          <div className="product-extra-buttons">
            <a
              href="#"
              className="favorite-btn"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite();
              }}
              style={{ color: isFavorite ? "red" : "gray" }}
              aria-disabled={favLoading}
            >
              <i className="bi bi-heart-fill"></i>
              <span>Favorilere ekle</span>
            </a>

            <a href="#">
              <i className="bi bi-globe"></i>
              <span>Beden Rehberi</span>
            </a>

            <a href="#">
              <i className="bi bi-share"></i>
              <span>Paylaş</span>
            </a>
          </div>
        </div>
      </form>

      <div className="divider"></div>

      <div className="product-meta">
        <div className="product-sku">
          <span>SKU:</span>
          <strong>{_id}</strong>
        </div>
        <div className="product-categories">
          <span>Kategori:</span>
          <strong>{category?.name || "Bilinmiyor"}</strong>
        </div>
      </div>
    </div>
  );
};

Info.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
    sizes: PropTypes.arrayOf(PropTypes.string),
    colors: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Info;
