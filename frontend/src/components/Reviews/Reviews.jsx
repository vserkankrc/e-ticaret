import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import "./Reviews.css";

const Reviews = ({ active, productId }) => {
  const [reviews, setReviews] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const reviewsRes = await api.get(`/api/reviews/product/${productId}`);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        console.error("🔴 Yorumları çekerken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const renderStars = (rating) => (
    <span className="rating-stars text-yellow-500 text-lg">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </span>
  );

  const getMaskedName = (user = {}) => {
    const firstName = user.name || "";
    const lastName = user.surname || "";

    const maskedFirst =
      firstName.length > 2
        ? firstName.slice(0, 2) + "*".repeat(firstName.length - 2)
        : firstName;
    const maskedLast =
      lastName.length > 2
        ? lastName.slice(0, 2) + "*".repeat(lastName.length - 2)
        : lastName;

    const fullName = `${maskedFirst} ${maskedLast}`.trim();
    return fullName || "Kullanıcı";
  };

  const toggleExpand = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={`tab-panel-reviews ${active} p-4`} id="reviews">
      <h3 className="text-xl font-bold mb-4">Ürün Yorumları</h3>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : reviews.length === 0 ? (
        <p>Bu ürüne henüz yorum yapılmamış.</p>
      ) : (
        <div className="comments space-y-4">
          <ol className="comment-list space-y-4">
            {reviews.map((review) => {
              const isExpanded = expandedComments[review._id];
              const shortText = review.comment.slice(0, 180);
              const needsTruncation = review.comment.length > 180;

              return (
                <li
                  key={review._id}
                  className="comment border rounded-xl p-4 shadow-sm bg-white"
                >
                  <div className="comment-content">
                    <div className="comment-meta flex items-center justify-between mb-2">
                      <strong className="text-md text-gray-700">
                        {getMaskedName(review.userId)}
                      </strong>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {isExpanded ? review.comment : shortText}
                      {needsTruncation && !isExpanded && (
                        <span
                          className="continue-link text-blue-500 cursor-pointer ml-1"
                          onClick={() => toggleExpand(review._id)}
                        >
                          devamı...
                        </span>
                      )}
                    </p>
                    {isExpanded && needsTruncation && (
                      <button
                        onClick={() => toggleExpand(review._id)}
                        className="collapse-btn text-xs text-blue-600 mt-2"
                      >
                        Yorumun bir kısmını gizle ▲
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};

Reviews.propTypes = {
  active: PropTypes.string,
  productId: PropTypes.string.isRequired,
};

export default Reviews;
