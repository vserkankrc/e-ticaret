import { useState } from "react";
import api from "@/utils/axios";
import "./ReviewForm.css"

// eslint-disable-next-line react/prop-types
const ReviewForm = ({ productId }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) return;

    try {
   await api.post(`/api/reviews/${productId}`, {
  rating,
  comment,
}, { withCredentials: true });


      setSubmitted(true);
    } catch (error) {
      console.error("Yorum gönderilemedi:", error);
    }
  };

  if (submitted) return <p>✔️ Yorum gönderildi, onay bekliyor.</p>;

  return (
    <div className="review-form-container">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="review-button">
          Ürünü Değerlendir
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="star-select">
            {[1, 2, 3, 4, 5].map((num) => (
              <i
                key={num}
                className={`bi bi-star${rating >= num ? "-fill" : ""}`}
                onClick={() => setRating(num)}
              />
            ))}
          </div>

          <textarea
            placeholder="Yorumunuzu yazın..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Gönder</button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
