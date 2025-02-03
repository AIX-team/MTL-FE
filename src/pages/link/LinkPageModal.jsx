import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/linkpage/LinkPageModal.css';

const Modal = ({ isOpen, message, onClose }) => {
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

export default Modal; 