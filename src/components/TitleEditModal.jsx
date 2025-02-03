import React from 'react';
import '../css/Modal.css';

const TitleEditModal = ({ isOpen, onClose, travelDays, travelInfoTitle, onSave }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'HG-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="HG-modal-overlay" onClick={handleOverlayClick}>
      <div className="HG-modal-content">
        <h2>제목 편집</h2>
        <input 
          type="text"
          defaultValue={travelInfoTitle}
          className="HG-modal-input"
        />
        <div className="HG-modal-buttons">
          <button onClick={onClose}>취소</button>
          <button onClick={onSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default TitleEditModal; 