import "./Questions.css";
import { useState } from "react";

const Questions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isQuestionOpen, setQuestionOpen] = useState(false);
  const [question, setQuestion] = useState(false);
  const [answer, setAnswer] = useState(false);

  return (
    <div className="questions-policy">
      <div className="questions-container">
        <h2>Popüler Sorular</h2>
      </div>

      <div
        className="questions-header"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span>Ücret iadem ne zaman yapılır?</span>
        <div className="question-close">
          <i className={`fa ${isOpen ? "fa-minus" : "fa-plus"}`}></i>
        </div>
      </div>
      {isOpen && (
        <div className="question-answer">
          <ul>
            <li>
              <span>
                İptal ettiğiniz ürünün ücret iadesi bankanıza bağlı olarak
                değişkenlik gösterebilir. Bu süre yaklaşık 1 haftayı bulabilir.
              </span>
            </li>
            <li>
              <span>
                İade ettiğiniz ürünün ücret iade süreci aşağıdaki gibidir;
              </span>
            </li>
            <li>
              <span>
                • Ürün satıcıya ulaştıktan sonra en geç 48 saat içerisinde iade
                şartlarına uygunluğu kontrol edilir.
              </span>
            </li>
            <li>
              <span>
                • Ürün iade şartlarına uygunsa, iadeniz onaylanır ve ücret
                iadeniz bankanıza bağlı olarak 2-10 iş günü içerisinde ödeme
                yapmış olduğunuz kartınıza yansır.
              </span>
            </li>
            <li>
              <span>
                • Ürün iade şartlarına uygun değilse adresinize geri gönderilir.
              </span>
            </li>
            <li>
              <span>
                Not: • Bankanıza ücret iadesi yapıldığında üyelik e-posta
                adresinize bilgilendirme mesajı gönderilir. Tutarın
                kartınıza/hesabınıza yansıma süresi bankanıza bağlıdır.
              </span>
            </li>
            <li>
              <span>
                • Banka kartına yapılan iadenlerin hesabınıza yansıma süresi
                daha uzundur.
              </span>
            </li>
            <li>
              <span>
                • Bankanızdan ücret iadesi kontrolü yapmak için “Hesabım”
                “Siparişlerim“ adımından referans numaranızı
                görüntüleyebilirsiniz.
              </span>
            </li>
            <li>
              <span>
                • Taksitli yapılan alışverişlerin ücreti bankaya tek seferde
                ödenir ancak bankanız bu tutarı kredi kartınıza taksitli bir
                şekilde iade eder.
              </span>
            </li>
          </ul>
        </div>
      )}

      <div
        className="questions-header " 
        onClick={() => setQuestionOpen(!isQuestionOpen)}
      >
        <span>
          Siparişimin teslimat adresini veya alıcı adını değiştirebilir miyim?
        </span>
        <div className="question-close">
          <i className={`fa ${isQuestionOpen ? "fa-minus" : "fa-plus"}`}></i>
        </div>
      </div>

      {isQuestionOpen && (
        <div className="question-answer">
          <span>
            Değişiklik talebinizi “Hesabım” bölümünden ““ butonuna tıklayarak
            bize iletebilirsiniz. Biz de bu talebinizi kargo firmaları ile
            paylaşacağız.
          </span>
        </div>
      )}

      <div className={`questions-header`} onClick={() => setQuestion(!question)}>
        <span>Siparişim ne zaman gelir?</span>
        <div className="question-close">
          <i className={`fa ${question ? "fa-minus" : "fa-plus"}`}></i>
        </div>
      </div>
      {question && (
        <div className="question-answer">
          <span>
            <p>
              • Satın aldığınız ürünler Hesabım-Siparişlerim-Sipariş Detay
              sayfasında belirtilen teslimat tarih aralığında teslim edilir.
            </p>
            <p>
              • Üründe “Hızlı Teslimat” etiketi bulunuyorsa siparişiniz en geç
              bir sonraki iş günü kargoya verilir. “Bugün Kargoda” etiketi
              bulunuyorsa siparişiniz aynı gün içerisinde kargoya verilir.
            </p>
            <p>
              • Sipariş dağıtıma çıktığında kargo firması tarafından SMS ile
              bilgilendirilirsiniz.
            </p>
            <p>
              • Kargoya verildikten sonra siparişinizin kargo aşamalarını
              Hesabım-Siparişlerim-Sipariş Detay sayfasında bulunan Kargom
              Nerede? linkinden takip edebilirsiniz.
            </p>
          </span>
        </div>
      )}

      <div
        className="questions-header"
        onClick={() => {
          setAnswer(!answer);
        }}
      >
        <span>Siparişimi nasıl iptal edebilirim?</span>
        <div className="question-close">
          <i className={`fa ${answer ? "fa-minus" : "fa-plus"}`}></i>
        </div>
      </div>
      {answer && (
        <div className="question-answer">
          <span>
            <p>
              Yanlış ürün sipariş ettiyseniz veya fikrinizi değiştirdiyseniz
              ürünlerinizin kargo hazırlıkları başlamadan önce aşağıdaki şekilde
              kolayca iptal edebilirsiniz.
            </p>
            <p>
              “Siparişlerim” “Detaylar/Sipariş Detayı” “Sipariş İptal”
              adımlarını takip ederek.
            </p>
            <p>
              “Hesabım” bölümünde yer alan “Yardım” adımından “Canlı Yardıma
              Bağlan” a tıkladığınızda açılan sayfada “İptal ve İade” yi
              seçerek.
            </p>
            <p>
              Ürünleriniz kargolanmak üzere hazırlanmaya başlandıysa (faturanız
              kesildiyse) veya kargoya verildiyse iptal edilemez. Bu durumda
              ürünü teslim aldığınızda iade edebilirsiniz.
            </p>
            <p>İPUCU:</p>
            <p>
              Ücret iade işlemleri 2 iş günü içerisinde tamamlanır. İadeniz
              tamamlanıp bankanıza iadeniz yapıldığında email ile
              bilgilendirilirsiniz.
            </p>
          </span>
        </div>
      )}
    </div>
  );
};

export default Questions;
