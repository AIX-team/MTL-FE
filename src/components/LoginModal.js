import React from 'react';
import '../css/LoginModal.css'; // 모달 스타일을 위한 CSS 파일

const LoginModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleGoogleLogin = () => {
        const clientId = '294655601674-c93mo2jvfqe96spanjq8npovo0um1j97.apps.googleusercontent.com'; // 구글 클라이언트 ID
        const redirectUri = 'http://localhost:3000'; // 리디렉션 URI
        const scope = 'profile email'; // 요청할 권한
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
        window.location.href = authUrl; // 구글 로그인 페이지로 리디렉션
    };

    const handleKakaoLogin = () => {
        const clientId = 'bd5756f93546ee3a9ccadc4394902b27'; // 구글 클라이언트 ID
        const redirectUri = 'http://localhost:3000'; // 리디렉션 URI
        const scope = 'profile_nickname,profile_image,account_email,name'; // 요청할 권한
        const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
        window.location.href = authUrl; // 구글 로그인 페이지로 리디렉션
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 id='login-text'>Login</h2>
                <div className='login-form' onClick={handleGoogleLogin}>
                    <img src='/images/google_logo.png'></img>
                    <span>Google 계정으로 로그인</span>
                </div>
                <div className='login-form' onClick={handleKakaoLogin}>
                    <img src='/images/kakao_logo.png'></img>
                    <span>카카오 계정으로 로그인</span>
                </div>
                <button id='login-close' onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default LoginModal;