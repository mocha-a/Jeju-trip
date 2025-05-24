// utils/logout.js
import axios from 'axios';

// 카카오 로그아웃 (카카오 리디렉션)
export function kakaoLogout() {
    const kakaoAccessToken = sessionStorage.getItem('access');
    const logoutRedirectUri = process.env.REACT_APP_LOGOUT_REDIRECT_URI;

    sessionStorage.clear();

    if (kakaoAccessToken) {
        const client_id = process.env.REACT_APP_KAKAO_CLIENT_ID;
        const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${client_id}&logout_redirect_uri=${logoutRedirectUri}`;
        window.location.href = kakaoLogoutUrl;
    } else {
        window.location.href = logoutRedirectUri;
    }
}

// 네이버 로그아웃 (토큰 만료 방식)
export function naverLogout(onAfterLogout) {
    const token = sessionStorage.getItem('access');

    axios.get(`${process.env.REACT_APP_APIURL}/naver/logout`, {
        params: { token }
    })
    .then(() => {
        sessionStorage.clear();
        if (typeof onAfterLogout === 'function') onAfterLogout();
    })
    .catch(err => {
        console.error('네이버 로그아웃 실패:', err);
    });
}

// 구글 로그아웃 (세션 삭제만)
export function googleLogout(onAfterLogout) {
    sessionStorage.clear();
    if (typeof onAfterLogout === 'function') onAfterLogout();
}

// // 로컬 유저 또는 기타
// export function defaultLogout() {
//     clearSessionAndRedirect();
// }
