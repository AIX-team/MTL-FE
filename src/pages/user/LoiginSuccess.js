import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { callLoginAPI } from "../../apis/UserAPICalls"; 
import '../../css/LoginSuccess.css';

function LoginSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        console.log('Received code:', code);

        if (code) {
            const loginResult = async () => {
                const result = await dispatch(callLoginAPI(code));
            
                if (result) {
                    // 로그인 성공 처리
                    alert("로그인 성공");
                    navigate('/link'); // 메인 화면으로 이
                } else {
                    alert("로그인 실패");
                    console.log('로그인 실패 응답:', result);
                    navigate('/link'); // 메인 페이지 이동
                }
            };
            loginResult(); // 비동기 함수 호출
        } 
    }, [location, navigate, dispatch]);

    return (
        <div>
            <h2> 로그인 처리 중... </h2>
          
        </div>
    );
}

export default LoginSuccess;
