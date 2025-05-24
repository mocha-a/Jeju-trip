import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataLoading from '../../component/_common/DataLoading';

import '../../styles/00-login/login.scss'

function KakaoRedirect() {;
    const navigate = useNavigate();
    
    useEffect(()=>{
        // get parameter in url
        const search = window.location.search;
        const param = new URLSearchParams(search);
        const code = param.get('code');

        if (!code) return;

        axios({
            method: "get",
            url: `${process.env.REACT_APP_APIURL}/kakao`,
            params: {code}
        })
        .then(res=>{
            const access_token = res.data.kakao_access_token;
            const kakao_user = {
                id: String(res.data.id),
                name: res.data.properties?.nickname
            }
            
            // 세션에 저장
            sessionStorage.setItem('provider', 'kakao');
            sessionStorage.setItem('access', access_token);
            sessionStorage.setItem('user', JSON.stringify(kakao_user));

            // 완료 후 홈으로 이동.
            setTimeout(() => {
                navigate('/');
            }, 1100);
        })
        .catch(err => {
            console.error('카카오 로그인 실패:', err);
        });
    }, [navigate])

    return (
        <div className='rd-background'>
            <p><img src="/imgs/logo_black.svg" alt="떠나봅서logo" /></p>
            <DataLoading className={'rb-loading'}/>
            <span>카카오 로그인중입니다...</span>
        </div>
    )
}

export default KakaoRedirect