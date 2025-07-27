import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Slider from "react-slick";
import PropTypes from "prop-types";
import { message } from "antd";
import { useLoading } from "../../context/LoadingProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function NextBtn({ onClick }) {
  return (
    <button className="glide__arrow glide__arrow--right" onClick={onClick}>
      <i className="bi bi-chevron-right"></i>
    </button>
  );
}

NextBtn.propTypes = {
  onClick: PropTypes.func,
};

function PrevBtn({ onClick }) {
  return (
    <button className="glide__arrow glide__arrow--left" onClick={onClick}>
      <i className="bi bi-chevron-left"></i>
    </button>
  );
}

PrevBtn.propTypes = {
  onClick: PropTypes.func,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // loading aç
      try {
        const response = await fetch(`${apiUrl}/api/products`);
        if (!response.ok) {
          message.error("Veri getirme başarısız.");
          return;
        }
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Veri hatası:", error);
        message.error("Ürünler alınırken bir hata oluştu.");
      } finally {
        setLoading(false); // loading kapat
      }
    };

    fetchProducts();
  }, [apiUrl, setLoading]);

  const slidesToShowCount = 4;

  const sliderSettings = {
    dots: false,
    infinite: products.length > slidesToShowCount,
    slidesToShow: slidesToShowCount,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    autoplaySpeed: 3000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="products">
      <div className="container">
        <div className="section-title">
         
        </div>

        <div className="product-wrapper product-carousel">
          {products.length > 0 ? (
            <Slider {...sliderSettings}>
              {products.map((product) => (
                <ProductItem productItem={product} key={product._id} />
              ))}
            </Slider>
          ) : (
            <div className="no-products">Ürün bulunamadı.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
