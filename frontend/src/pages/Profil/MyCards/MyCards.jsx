import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { message, Modal, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./MyCards.css"
const { confirm } = Modal;

const MyCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders/cards", { withCredentials: true });
      setCards(res.data.cards || []);
    } catch (error) {
      message.error("Kartlar getirilirken hata oluştu.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDelete = (cardId) => {
    confirm({
      title: "Kartı silmek istediğinize emin misiniz?",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk: async () => {
        try {
          await axios.delete(`/api/orders/${cardId}`, { withCredentials: true });
          message.success("Kart başarıyla silindi.");
          setCards((prev) => prev.filter((card) => card._id !== cardId));
        } catch (error) {
          message.error("Kart silinirken hata oluştu.");
          console.error(error);
        }
      },
    });
  };

  return (
    <section className="my-cards-container">
      <h2>Kayıtlı Kartlarım</h2>

      {loading ? (
        <p className="loading-text">Yükleniyor...</p>
      ) : cards.length === 0 ? (
        <p className="empty-text">Henüz kayıtlı bir kartınız yok.</p>
      ) : (
        <ul className="cards-list">
          {cards.map((card) => (
            <li key={card._id} className="card-item" tabIndex={0} aria-label={`Kart: ${card.cardType} - ${card.cardHolderName}`}>
              <div className="card-content">
                <div className="card-header">
                  <span className="card-type">{card.cardType?.toUpperCase() || "KART"}</span>
                  <Tooltip title="Kartı Sil">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(card._id)}
                      aria-label="Kartı Sil"
                      type="button"
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </div>
                <div className="card-holder">{card.cardHolderName}</div>
                <div className="card-number">**** **** **** {card.last4Digits}</div>
                <div className="card-expiry">Son Kullanma: {card.expireMonth}/{card.expireYear}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MyCards;
