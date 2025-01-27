import axios from 'axios';

const DOMAIN = 'http://localhost:8080'; // backend (spring) 연결
const DOMAIN2 = 'http://localhost:8000' // fastapi (ai) 연결

// backend 요청
export const request = async (method, url, data) => {

    return await axios({
        method,
        url: `${DOMAIN}${url}`,
        data,
        headers: {
            'Content-Type': 'application/json', // JSON으로 요청한다는 것을 명시
            'Authorization': localStorage.getItem('token'), // 토큰 request header에 담아주기
        },
        
    })
    .then(res => res.data)
    .catch(error => {
        console.log(error);
        throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록
    });
};

// 로그인 요청
export const loginRequest = async (method, url, data) => {
    return await axios({
        method,
        url: `${DOMAIN}${url}`,
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res)
    .catch(error => {
        console.log(error);
        throw error; 
    });
};


// fastapi 요청
export const fastAPIrequest = async (method, url, data) => {

    return await axios({
        method,
        url: `${DOMAIN2}${url}`,
        data,
        headers: {
            'Content-Type': 'application/json',
        },
        
    })
    .then(res => res.data)
    .catch(error => {
        console.log(error);
        throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록
    });
};
