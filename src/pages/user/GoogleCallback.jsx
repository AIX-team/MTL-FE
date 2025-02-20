import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { callLoginAPI } from '../../apis/UserAPICalls';
import { useDispatch } from 'react-redux';

function GoogleCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      
      try {
        const result = await dispatch(callLoginAPI(code));
        console.log('result:', result);
        if (result.status === 200) {
          navigate('/link'); // 로그인 성공
        } else if (result.status === 201) {
          navigate('/signup'); // 회원가입 필요
        } else {
          navigate('/login'); // 로그인 실패
        }
      } catch (error) {
        console.error('로그인 처리 실패:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  return <div>로그인 처리중...</div>;
}

export default GoogleCallback;