import React from 'react';
import '../styles/spinner.scss';

interface SpinnerProps {
  isVisible: boolean;
  text?: string;
  variant?: 'classic' | 'dots' | 'pulse';
}

const Spinner: React.FC<SpinnerProps> = ({ 
  isVisible, 
  text = "Loading...", 
  variant = 'classic' 
}) => {
  if (!isVisible) return null;

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="spinner-dots">
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
          </div>
        );
      case 'pulse':
        return <div className="spinner-pulse"></div>;
      default:
        return <div className="spinner"></div>;
    }
  };

  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        {renderSpinner()}
        <div className="spinner-text">{text}</div>
      </div>
    </div>
  );
};

export default Spinner;