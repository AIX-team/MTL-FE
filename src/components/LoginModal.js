import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginModal.css'; // 모달 스타일을 위한 CSS 파일
import googleLogo from '../images/google_logo.png';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    
    if (!isOpen) return null;

    const handleGoogleLogin = () => {
        const clientId = '197908814644-velr9kl1pr3ej9k416evvgr19880iuvu.apps.googleusercontent.com'; // 구글 클라이언트 ID
        const redirectUri = 'http://localhost:3000/loginSuccess'; // 리디렉션 URI
        const scope = 'profile email'; // 요청할 권한
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

        window.location.href = authUrl; // 구글 로그인 페이지로 리디렉션
    };

    const handleClose = () => {
        onClose(); // 모달 닫기
        navigate('/link'); // /link 페이지로 이동
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 id='login-text'> 로그인 </h2>
                <div className='login-form' onClick={handleGoogleLogin}>
                    <img src={googleLogo}></img>
                    <span>Google 계정으로 로그인</span>
                </div>
                <button id='login-close' onClick={handleClose}>닫기</button>
            </div>
        </div>
    );
};

export default LoginModal;