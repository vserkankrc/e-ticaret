/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Radio, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "@/utils/axios";
import "./SavedCards.css";

const SavedCards = ({ onCardSelect }) => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/orders/cards");

      const cardsArray = Array.isArray(response.data)
        ? response.data
        : response.data?.cards || [];

      setCards(cardsArray);
    } catch (error) {
      console.error("Kartlar alınamadı", error);
      setCards([]); // boş setle
    }
    setLoading(false);
  };

  const handleDelete = async (cardId) => {
    try {
      await axios.delete(`/api/cards/${cardId}`);
      setCards((prev) => prev.filter((card) => card._id !== cardId));
      if (selectedCardId === cardId) {
        setSelectedCardId(null);
        onCardSelect(null);
      }
    } catch (error) {
      console.error("Kart silinemedi", error);
    }
  };

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedCardId(selectedId);
    onCardSelect(selectedId);
    setShowNewCardForm(false);
  };

  return (
    <section className="saved-cards">
      <h3>Kayıtlı Kartlarım</h3>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : cards.length === 0 || showNewCardForm ? (
        <p style={{ fontSize: 14, marginTop: 5 }}>
          {cards.length === 0
            ? "Henüz kayıtlı kartınız bulunmuyor."
            : "Yeni kart bilgilerinizi aşağıdan giriniz."}
        </p>
      ) : (
        <Radio.Group
          onChange={handleSelect}
          value={selectedCardId}
          className="cards-list"
        >
          {Array.isArray(cards) &&
            cards.map((card) => (
              <div key={card._id} className="card-box">
                <Radio value={card._id} className="card-radio" />
                <div className="card-details">
                  <div className="card-holder">{card.cardHolderName}</div>
                  <div className="card-number">**** **** **** {card.last4Digits}</div>
                  <div className="card-expiry">
                    SKT: {card.expireMonth}/{card.expireYear}
                  </div>
                </div>
                <Tooltip title="Kartı Sil">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(card._id)}
                  >
                    <DeleteOutlined />
                  </button>
                </Tooltip>
              </div>
            ))}
        </Radio.Group>
      )}

      {cards.length > 0 && !showNewCardForm && (
        <p
          className="new-card-toggle"
          onClick={() => {
            setShowNewCardForm(true);
            setSelectedCardId(null);
            onCardSelect(null);
          }}
        >
       
        </p>
      )}
    </section>
  );
};

export default SavedCards;
