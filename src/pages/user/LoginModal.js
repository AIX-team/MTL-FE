import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/login/LoginModal.css'; // 모달 스타일을 위한 CSS 파일
import googleLogo from '../../images/google_logo.png';
import Logo from '../../images/LOGO.png';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleGoogleLogin = () => {
        const clientId = '197908814644-velr9kl1pr3ej9k416evvgr19880iuvu.apps.googleusercontent.com'; // 구글 클라이언트 ID
        const redirectUri = process.env.REACT_APP_FRONTEND_URL + '/loginSuccess'; // 리디렉션 URI
        const scope = 'profile email'; // 요청할 권한
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

        window.location.href = authUrl; // 구글 로그인 페이지로 리디렉션
    };

    const handleClose = () => {
        onClose(); // 모달 닫기
        navigate('/'); // 랜딩페이지로 이동
    };

    return (
        <div className="WS-login" onClick={handleClose}>
            <div className='WS-login-header-Container'>
                <button className='WS-login-back-button' onClick={handleClose}>&lt;</button>
            </div>

            <div className="WS-login-body-container" onClick={e => e.stopPropagation()}>

                <div className='WS-login-logo'>
                    <img src={Logo}></img>
                </div>

                <div className='WS-login-button' onClick={handleGoogleLogin}>
                    <img src={googleLogo}></img>
                    <span>구글 계정으로 시작하기</span>
                </div>

                <div className='WS-login-message-container'>
                    <div>개인정보방침</div>
                    <div>이용약관</div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;