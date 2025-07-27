import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/axios";
import ProductItem from "@/components/Products/ProductItem";

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/products/categories/${categoryId}`);
        setProducts(res.data.data);
      } catch (err) {
        setError("Ürünler yüklenirken hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchProducts();
  }, [categoryId]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="products">
      <div className="container">
       
      <h2>
  {products.length > 0
    ? `${products[0].category?.name || "Kategori"} Kategorisindeki Ürünler`
    : "Kategoriye Ait Ürünler"}
</h2>


        <div className="product-list">
          {products.length === 0 ? (
            <p>Bu kategoride ürün bulunmamaktadır.</p>
          ) : (
            products.map((product) => (
              <ProductItem key={product._id} productItem={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryProductsPage;
