import React, { useState, useEffect } from 'react';
import '../../../css/linkpage/TravelInfo/TitleEditModal.css';
import resetIcon from '../../../images/resetBtn.svg';

const TitleEditModal = ({ isOpen, onClose, travelDays, travelInfoTitle, onSave }) => {
  const [daysValue, setDaysValue] = React.useState(travelDays);
  const [titleValue, setTitleValue] = React.useState(travelInfoTitle);

  useEffect(() => {
    setDaysValue(travelDays);
    setTitleValue(travelInfoTitle);
  }, [travelDays, travelInfoTitle]);
  
  if (!isOpen) return null;

  return (
    <div className="HG-modal-overlay">
      <div className="HG-modal-content">
         <div className='HG-modal-title'>여행일, 제목 수정</div>
        <div className='HG-TravelInfo-Edit-Frame'>
          <span>여행일</span>
          <div className="HG-input-wrapper">
            <input 
              className="HG-modal-input-days"
              type="number"
              value={daysValue}
              onChange={(e) => setDaysValue(e.target.value)}
            />
            {daysValue && (
              <button 
                className="HG-reset-button"
                onClick={() => setDaysValue('')}
                type="button"
              >
                <img src={resetIcon} alt="resetIcon" />
              </button>
            )}
          </div>
        </div>
        <div className='HG-TravelInfo-Edit-Frame'>
          <span>제목</span>
          <div className="HG-input-wrapper">
            <input 
              className="HG-modal-input"
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
            />
            {titleValue && (
              <button 
                className="HG-reset-button"
                onClick={() => setTitleValue('')}
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
            onSave({ days: daysValue, title: titleValue });
            onClose();
          }}>확인</div>
        </div>
      </div>
    </div>
  );
};

export default TitleEditModal;