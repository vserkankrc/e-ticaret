import "./Search.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // yönlendirme için
import axios from "@/utils/axios";

const Search = ({ isSearchShow, setIsSearchShow }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchResults = async (keyword) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/search?query=${keyword}`);
      setResults(response.data.data || []);
    } catch (error) {
      console.error("Arama sırasında hata oluştu:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const goToProduct = (id) => {
    setIsSearchShow(false); // modal kapansın
    setQuery(""); // input temizlensin
    navigate(`/ProductDetailsPage/${id}`); // ürün detay sayfasına git
  };

  const closeSearch = () => {
    setIsSearchShow(false);
    setQuery("");
  };

  return (
    <div className={`modal-search ${isSearchShow ? "show" : ""}`}>
      <div className="modal-wrapper">
        <h3 className="modal-title">Ürünleri arayın</h3>
        <p className="modal-text">Aradığınız ürünleri görmek için yazmaya başlayın.</p>

        <form
          className="search-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Ne Aramıştınız?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>

        <div className="search-results">
          <div className="search-heading">
            <h3>ARANAN SONUÇLAR</h3>
          </div>

          {loading ? (
            <p>Yükleniyor...</p>
          ) : results.length > 0 ? (
            <div className="results">
              {results.map((product) => (
                <div
                  key={product._id}
                  className="search-result-item"
                  onClick={() => goToProduct(product._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") goToProduct(product._id); }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="search-thumb"
                    loading="lazy"
                  />
                  <div className="search-info">
                    <span className="search-name">{product.name}</span>
                    <span className="search-price">₺{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length > 1 ? (
            <p>Sonuç bulunamadı.</p>
          ) : null}
        </div>

        <i
          className="bi bi-x-circle"
          id="close-search"
          onClick={closeSearch}
        ></i>
      </div>

      <div
        className="modal-overlay"
        onClick={closeSearch}
      ></div>
    </div>
  );
};

Search.propTypes = {
  setIsSearchShow: PropTypes.func.isRequired,
  isSearchShow: PropTypes.bool.isRequired,
};

export default Search;
