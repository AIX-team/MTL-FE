import React, { useState } from 'react';
import '../../../css/Modal.css';
import resetIcon from '../../../images/resetBtn.svg';


const TitleEditModal = ({ isOpen, onClose, title, onSave }) => {
  const [updateTitle, setUpdateTitle] = useState(title);

  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (e.target.className === 'HG-modal-overlay') {
      onClose();
    }
  };

  const handleTitleChange = (e) => {
    console.log(e.target.value);
    setUpdateTitle(e.target.value);
  };

  return (
    <div className="HG-modal-overlay" onClick={handleOverlayClick}>
      <div className="HG-modal-content">
        <div className='HG-modal-title-guidebook'>가이드북 제목 수정</div>
        <div className='HG-modal-description-guidebook'>가이드북의 제목을 수정할 수 있습니다.</div>
        <div className='HG-TravelInfo-Edit-Frame'>
          <div className="HG-input-wrapper">
            <input 

              className="HG-modal-input-guidebook"
              type="text"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
            />

            {updateTitle && (
              <button 
                className="HG-reset-button"
                onClick={() => setUpdateTitle('')}
                type="button"
              >
                <img src={resetIcon} alt="resetIcon" />

              </button>
            )}
          </div>
        </div>

        <div className="HG-modal-buttons">
          <div className="HG-modal-button" onClick={onClose}>취소</div>
          <div className="HG-modal-button-submit" onClick={() => {
            onSave(updateTitle);
            onClose();
          }}>확인</div>
        </div>

      </div>
    </div>
  );
};

export default TitleEditModal; 