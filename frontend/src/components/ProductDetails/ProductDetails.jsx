import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Gallery from "./Gallery/Gallery";
import Info from "./Info/Info";
import Tabs from "./Tabs/Tabs";
import api from "../../utils/axios"; // axios instance burada import edilmeli
import "./ProductDetails.css";

export const ProductDetails = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/api/products/${productId}`);
        setProduct(res.data.data || res.data); 
        // backend'e göre res.data.data olabilir veya sadece res.data olabilir, kontrol et
      } catch (err) {
        console.error("Ürün detay alınamadı:", err);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  if (!product) return <div>Yükleniyor...</div>;

  return (
    <section className="single-product">
      <div className="container">
        <div className="single-product-wrapper">
          {/* Burada breadcrumb'a sadece product değil, kategori ve isim props olarak daha doğru olur */}
          <Breadcrumb 
            categories={product.categoryPath || []} 
            productName={product.name} 
          />
          <div className="single-content">
            <main className="site-main">
              <Gallery images={product.images || []} />
              <Info product={product} />
            </main>
          </div>
          <Tabs product={product} />
        </div>
      </div>
    </section>
  );
};
