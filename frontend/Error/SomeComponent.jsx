// components/SomeComponent.jsx
import  { useState } from 'react';

const SomeComponent = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const handleErrorToggle = () => {
    setShouldThrowError(!shouldThrowError);
  };

  // Hata oluşturacak bir durum
  if (shouldThrowError) {
    throw new Error("Bu bir hata mesajıdır!"); // Hata fırlat
  }

  return (
    <div>
      <h2>Some Component</h2>
      <p>Bu bileşen, hata yakalamak için bir örnektir.</p>
      <button onClick={handleErrorToggle}>
        {shouldThrowError ? "Hata Oluşturmayı Durdur" : "Hata Oluştur"}
      </button>
    </div>
  );
};

export default SomeComponent;