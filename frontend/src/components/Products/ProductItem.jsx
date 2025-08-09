import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import api from "@/utils/axios";
import { CartContext } from "../../context/CartProvider";
import { useAuth } from "../../context/AuthContext";
import "./ProductItem.css";
import { message } from "antd";

const ProductItem = ({ productItem }) => {
  const { cartItems, addToCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const isInCart = cartItems.some((item) => item._id === productItem._id);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) {
        setIsFavorite(false);
        return;
      }

      try {
        setFavLoading(true);
        const res = await api.get("/api/favorites", {
          withCredentials: true,
        });

        const favorites = Array.isArray(res.data) ? res.data : [];

        const found = favorites.some(
          (fav) =>
            fav?.productId?._id === productItem._id ||
            fav?._id === productItem._id
        );

        setIsFavorite(found);
      } catch (error) {
        console.error("Favoriler alınamadı:", error);
      } finally {
        setFavLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [productItem._id, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      message.warning("Lütfen favorilere eklemek için giriş yapınız.");
      navigate("/auth");
      return;
    }

    setFavLoading(true);

    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${productItem._id}`, {
          withCredentials: true,
        });
        setIsFavorite(false);
        message.info("Favorilerden çıkarıldı.");
      } else {
        await api.post(
          "/api/favorites",
          { productId: productItem._id },
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
      navigate("/auth");
      return;
    }

    if (isInCart) {
      message.warning("Bu ürün zaten sepette.");
      return;
    }

    const hasColorOptions =
      Array.isArray(productItem.colors) && productItem.colors.length > 0;
    const hasSizeOptions =
      Array.isArray(productItem.sizes) && productItem.sizes.length > 0;

    if (hasColorOptions || hasSizeOptions) {
      navigate(`/ProductDetailsPage/${productItem._id}`);
      return;
    }

    if (!productItem.quantity || productItem.quantity < 1) {
      message.error("Ürün stokta yok.");
      return;
    }

    addToCart({ ...productItem, quantity: 1 });
    message.success("Ürün sepete eklendi.");
  };

  const hasImages =
    Array.isArray(productItem.images) && productItem.images.length > 0;
  const imageSrc = hasImages ? productItem.images[0] : "";

  const discountAmount =
    productItem.discount && productItem.discount > 0
      ? (productItem.price * productItem.discount) / 100
      : 0;

  const discountedPrice =
    discountAmount > 0
      ? (productItem.price - discountAmount).toFixed(2)
      : productItem.price.toFixed(2);

  const productUrl = `https://www.tercihsepetim.com/ProductDetailsPage/${productItem._id}`;

  return (
    <div className="product-item glide__slide glide__slide--active">
      <div className="product-image" style={{ position: "relative" }}>
        <Link to={`/ProductDetailsPage/${productItem._id}`}>
          {hasImages ? (
            <img src={imageSrc} alt={productItem.name} />
          ) : (
            <div>Görsel bulunamadı.</div>
          )}
        </Link>

        {productItem.quantity === 0 && (
          <div className="product-badge sold-out">Tükendi</div>
        )}
        {productItem.quantity > 0 && productItem.quantity <= 5 && (
          <div className="product-badge low-stock">Tükeniyor</div>
        )}
      </div>

      <div className="product-info">
        <Link
          to={`/ProductDetailsPage/${productItem._id}`}
          className="product-title"
        >
          {productItem.name}
        </Link>

        <ul className="product-star">
          {[...Array(4)].map((_, i) => (
            <li key={i}>
              <i className="bi bi-star-fill"></i>
            </li>
          ))}
          <li>
            <i className="bi bi-star-half"></i>
          </li>
        </ul>

        <div className="product-prices">
          <strong className="new-price">₺{discountedPrice}</strong>
          {discountAmount > 0 && (
            <span className="old-price">₺{productItem.price.toFixed(2)}</span>
          )}
        </div>

        {discountAmount > 0 && (
          <span className="product-discount"> %{productItem.discount} </span>
        )}

        <div className="product-links">
          <button
            className="add-to-cart"
            onClick={handleAddToCart}
            disabled={isInCart || productItem.quantity === 0}
            aria-label="Sepete ekle"
          >
            <i className="bi bi-basket-fill"></i>
          </button>

          <button
            className="favorite-btn"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Favoriden çıkar" : "Favorilere ekle"}
            style={{ color: isFavorite ? "red" : "grey" }}
            disabled={favLoading}
          >
            <i className="bi bi-heart-fill"></i>
          </button>

          <Link
            to={`/ProductDetailsPage/${productItem._id}`}
            className="product-link"
            aria-label="Ürün detaylarını görüntüle"
          >
            <i className="bi bi-eye-fill"></i>
          </Link>

          <div className="share-wrapper">
            <button
              className="share-button"
              onClick={() => setShowShareMenu((prev) => !prev)}
              aria-label="Paylaş"
            >
              <i className="bi bi-share-fill"></i>
            </button>

            {showShareMenu && (
              <div className="share-dropdown">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    productUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-facebook"></i> Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    productUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-twitter-x"></i> X
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-whatsapp"></i> WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-instagram"></i> Instagram
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  productItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.array,
    sizes: PropTypes.array,
    quantity: PropTypes.number,
  }).isRequired,
};

export default ProductItem;
