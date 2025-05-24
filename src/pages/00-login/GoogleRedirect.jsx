import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import DataLoading from '../../component/_common/DataLoading';

function GoogleRedirect() {
    const navigate = useNavigate();
    
    useEffect(()=>{
        // get parameter in url
        const search = window.location.search;
        const param = new URLSearchParams(search);
        const code = param.get('code');
        const getState = param.get('state');
        const sessionState = sessionStorage.getItem('google_state');

        if (!code) return;

        if (getState !== sessionState) {
            alert('⚠️ 로그인 보안 오류! 다시 시도해주세요');
            return;
        }

        // 백엔드로 code 전송 → 토큰 + 유저 정보 받기
        axios({
            method: "get",
            url: `${process.env.REACT_APP_APIURL}/google`,
            params: { code, state: getState }
        })
        .then((res) => {
            const access_token = res.data.google_access_token;
            const google_user =  {
                id: res.data.id,
                name: res.data.name,
                email: res.data.email
            }
    
            sessionStorage.setItem('provider', 'google');
            sessionStorage.setItem('access', access_token)
            sessionStorage.setItem('user', JSON.stringify(google_user))
    
            setTimeout(() => {
                navigate('/');
            }, 1100);
        })
        .catch((err) => {
            console.error('구글 로그인 실패:', err)
        });
    }, [navigate])

    return (
        <div className='rd-background'>
            <p><img src="/imgs/logo_black.svg" alt="떠나봅서logo" /></p>
            <DataLoading className={'rb-loading'}/>
            <span>구글 로그인중입니다...</span>
        </div>
    )
}

export default GoogleRedirect