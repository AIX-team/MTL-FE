import React from 'react';
import '../css/layout/SomethingModal.css';
const SomethingModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="WS-LinkPage-Modal-Overlay">
            <div className="WS-LinkPage-Modal">
                <p className="WS-LinkPage-Modal-Message">{message}</p>
                <button className="WS-LinkPage-Modal-Button" onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
};

export default SomethingModal; 