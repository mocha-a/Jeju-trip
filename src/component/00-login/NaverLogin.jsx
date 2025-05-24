
function NaverLogin() {
  const naver_url = 'https://nid.naver.com/oauth2.0/authorize';

  const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
  const naver_redirect_uri = `${process.env.REACT_APP_REDIRECT_URI}/authnaver`;
  const naver_response_type = 'code';

  const state = crypto.randomUUID();
  sessionStorage.setItem('naver_state', state);
  
  // 인가 코드 받기
  function naver_login() {
    // 응답
    window.location.href = naver_url+`?client_id=${naver_client_id}&redirect_uri=${naver_redirect_uri}&response_type=${naver_response_type}&state=${state}`
  }

  return (
    <>
      <p onClick={naver_login}>
        <img src="/imgs/login_naver_01.png" alt="로그인btn-네이버" className='login-pc'/>
        <img src="/imgs/login_naver_02.png" alt="로그인btn(mob)-네이버" className='login-mobile'/>
      </p>
    </>
  )
}

export default NaverLogin