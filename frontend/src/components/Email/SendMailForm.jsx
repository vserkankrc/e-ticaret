// frontend/src/Email/SendMailForm.jsx
import { useState } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";

export default function SendMailForm() {
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    if (!email) {
      return message.warning("Lütfen geçerli bir e-posta girin.");
    }

    try {
      await axios.post("/api/mail/send-confirmation", {
        to: email,
        subject: "Kayıt Başarılı!",
        text: "Kayıt olduğunuz için teşekkür ederiz.",
        html: "<h1>Hoş geldiniz!</h1><p>Kayıt işleminiz başarıyla tamamlandı.</p>",
      });

      message.success("✅ Mail başarıyla gönderildi!");
      setEmail(""); // formu temizle
    } catch (err) {
      console.error(err);
      message.error("❌ Mail gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <Input
        type="email"
        placeholder="Alıcı e-posta adresi"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <Button type="primary" onClick={handleSend} block>
        Mail Gönder
      </Button>
    </div>
  );
}
