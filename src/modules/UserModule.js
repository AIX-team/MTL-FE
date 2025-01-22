import { useNavigate } from "react-router-dom";
import { createActions, handleActions } from "redux-actions"

const navigate = useNavigate;

// 초기 state 값
const initialState = {
    userInfo: [],
    token: null,
    users: [],
}

//액션 타입 설정
export const LOGIN = 'user/LOGIN';
export const LOG_OUT = 'user/LOG_OUT';


//유저 관련 액션 함수
export const { user: {login, logOut}} = createActions({
    [LOGIN] : ({ token, userInfo }) => ({ token, userInfo }),
    [LOG_OUT]: ({ token, userInfo }) => ({ token, userInfo }),

});

//리듀서 함수
const userReducer = handleActions(
    {
        [LOGIN] : (state, {payload: { token, userInfo }}) => {

            // localStorage에 로그인 상태 저장
            localStorage.setItem("token", "Bearer" + token); // 토큰 저장
            
            return {
                ...state,
                userInfo: userInfo,
                token: token,
            }
        },
        [LOG_OUT] : () => {
            localStorage.removeItem('token'); // 로그인 토큰 삭제
            return initialState;
        },
    },
    initialState
);

export default userReducer;