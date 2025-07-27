import  { useState } from "react";
import PropTypes from "prop-types";
import "./Gallery.css";

const Gallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="gallery-empty">Görsel bulunamadı.</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-main-image-wrapper">
        <img
          className="gallery-main-image"
          src={images[activeIndex]}
          alt={`Ana görsel ${activeIndex + 1}`}
          onClick={() => window.open(images[activeIndex], "_blank")}
          draggable={false}
        />
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, i) => (
            <div
              key={i}
              className={`thumbnail-wrapper ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}
              onDoubleClick={() => window.open(img, "_blank")}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Gallery;
