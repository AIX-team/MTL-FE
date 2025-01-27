import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { callLoginAPI } from "../../apis/UserAPICalls";
import { useDispatch } from "react-redux";
import '../../css/LoginSuccess.css';

function LoginSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        console.log('Received code:', code);

        if (code) {
            // callLoginAPI가 Promise를 반환하므로 await 사용
            const loginResult = async () => {
                const result = await dispatch(callLoginAPI(code));
                if (result) {
                    alert("로그인 성공");
                    navigate('/link'); // 메인 화면으로 이동
                } else {
                    // 유저 정보가 없으면 회원가입 모달 표시
                    setShowModal(true);
                }
            };
            loginResult(); // 비동기 함수 호출
        } 
    }, [location, navigate, dispatch]);

    const handleCloseModal = () => {
        setShowModal(false); // 모달 닫기
        navigate('/link'); // 메인 화면으로 이동
    };

    return (
        <>
            {showModal && (
                 <div className="modal-overlay" onClick={handleCloseModal}>
                 <div className="modal-content" onClick={e => e.stopPropagation()}>
                     <h2>회원가입 진행하시겠습니까?</h2>
                     <div className="modal-actions">
                         <button onClick={handleCloseModal}>아니오</button>
                         <button onClick={() => {
                            // 회원가입 로직 추가
                            
                            handleCloseModal();

                         }}>예</button>
                     </div>
                 </div>
             </div>
            )}
        </>
    );
}

export default LoginSuccess;
