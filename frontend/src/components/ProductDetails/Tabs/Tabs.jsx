import { useState } from "react";
import PropTypes from "prop-types";
import "./Tabs.css";
import Reviews from "../../Reviews/Reviews";

const Tabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("desc");

  const handleTabClick = (e, tab) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const { description, _id: productId } = product || {};

  return (
    <div className="single-tabs">
      <ul className="tab-list">
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "desc" ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, "desc")}
          >
            Ürün Açıklaması
          </a>
        </li>

        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, "reviews")}
          >
            Yorumlar
          </a>
        </li>
      </ul>

      <div className="tab-panel">
        <div
          className={`tab-panel-descriptions content ${
            activeTab === "desc" ? "active" : ""
          }`}
        >
          {description ? (
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className="product-description">
              Ürün açıklaması bulunmamaktadır.
            </p>
          )}
        </div>

        <div className={`content ${activeTab === "reviews" ? "active" : ""}`}>
          <Reviews productId={productId} />
        </div>
      </div>
    </div>
  );
};

Tabs.propTypes = {
  product: PropTypes.shape({
    description: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Tabs;
