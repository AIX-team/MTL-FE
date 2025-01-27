import { loginRequest} from "./Apis";
import { login,showSignUp} from "../modules/UserModule";

/* 로그인 정보 전달 받는 함수 */
export function callLoginAPI(code) {

    console.log('구글 login api calls...');

    return async (dispatch, getState) => {
        try {
            // 서버에 로그인 요청
            const result = await loginRequest('GET', `/auth/google/callback?code=${code}`);
            console.log('구글 login result : ', result); // 서버에서 반환된 유저 정보

            // 로그인 성공 시 action dispatch
            const token = result.data.results.token;
            const userInfo = result.data.results.user;
            
            // 유저 정보가 없는 경우, 회원가입 모달을 통해 가입 여부를 판별
            if(!userInfo){
                dispatch(showSignUp()); //회원 가입 모달 표시
                return false; 
            }
            
            // 유저 정보가 있는 경우, 로그인 처리 
            dispatch(login({ token, userInfo }));
            
            // 토큰을 로컬 스토리지에 저장
            localStorage.setItem('token', token);

            // // 리다이렉트
            // window.location.href = 'http://localhost:3000/loginSuccess';

            return true; // 로그인 성공
        } catch (error) {
            console.error('Login API error:', error);
            return false; // 로그인 실패
        }
    }
}
