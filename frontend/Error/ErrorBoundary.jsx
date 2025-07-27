// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Hata yakalandı:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false }); // Hata durumunu sıfırla
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Bir hata oluştu.</h1>
          <p>Üzgünüz, bir şeyler yanlış gitti. Lütfen daha sonra tekrar deneyin.</p>
          <button onClick={this.handleRetry}>Tekrar Dene</button>
        </div>
      );
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children; // Normalde çocuk bileşenleri render edilir
  }
}

export default ErrorBoundary;