import { useNavigate } from 'react-router-dom'; // React Router'dan useNavigate'i içe aktar
import "./ErrorMessage.css"

const ErrorMessage = () => {
  const navigate = useNavigate(); // useNavigate kancasını kullanarak yönlendirme fonksiyonunu al

  const handleGoHome = () => {
    navigate('/'); // Ana sayfaya yönlendir
  };

  return (
    <div className="error-message">
      <h1>404 - Sayfa Bulunamadı</h1>
      <p>Aradığınız sayfa mevcut değil. Lütfen URL yi kontrol edin veya ana sayfaya dönün.</p>
      <button className="btn" onClick={handleGoHome}>Ana Sayfaya Dön</button>
    </div>
  );
};

export default ErrorMessage;