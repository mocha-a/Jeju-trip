import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataLoading from '../../component/_common/DataLoading';

function NaverRedirect() {
    const navigate = useNavigate();
    
    useEffect(()=>{
        // get parameter in url
        const search = window.location.search;
        const param = new URLSearchParams(search);
        const code = param.get('code');
        const getState = param.get('state');
        const sessionState = sessionStorage.getItem('naver_state');
        
        if (!code) return;

        if (getState !== sessionState) {
            alert('⚠️ 로그인 보안 오류! 다시 시도해주세요');
            return;
        }

        axios({
            method: "get",
            url: `${process.env.REACT_APP_APIURL}/naver`,
            params: { code, state: getState }
        })
        .then(res=>{
            const access_token = res.data.naver_access_token;
            const naver_user = {
                id: res.data.id,
                name: res.data.name,
                email: res.data.email
            }
            
            // 세션에 저장
            sessionStorage.setItem('provider', 'naver');
            sessionStorage.setItem('access', access_token);
            sessionStorage.setItem('user', JSON.stringify(naver_user));

            // 완료 후 홈으로 이동.
            setTimeout(() => {
                navigate('/');
            }, 1100);
        })
        .catch(err => {
            console.error('네이버 로그인 실패:', err);
        });
    }, [navigate])

    return (
        <div className='rd-background'>
            <p><img src="/imgs/logo_black.svg" alt="떠나봅서logo" /></p>
            <DataLoading className={'rb-loading'}/>
            <span>네이버 로그인중입니다...</span>
        </div>
    )
}

export default NaverRedirect