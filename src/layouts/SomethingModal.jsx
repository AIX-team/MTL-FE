import React from 'react';
import '../css/layout/SomethingModal.css';
const SomethingModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="WS-Modal-Overlay">
            <div className="WS-Modal">
                <p className="WS-Modal-Message">{message}</p>
                <button className="WS-Modal-Button" onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
};

export default SomethingModal; 