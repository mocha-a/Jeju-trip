
function GoogleLogin() {
  const google_url = 'https://accounts.google.com/o/oauth2/v2/auth';

  const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const google_redirect_uri = `${process.env.REACT_APP_REDIRECT_URI}/authgoogle`;
  const google_response_type = 'code';
  const google_scope = 'profile email';
  const google_access_type = 'offline';
  const google_include_granted_scopes = 'true';

  const google_state = crypto.randomUUID();
  sessionStorage.setItem('google_state', google_state);
  
  // 인가 코드 받기
  function google_login() {
    // 응답
    window.location.href = google_url+`?client_id=${google_client_id}&redirect_uri=${google_redirect_uri}&response_type=${google_response_type}&scope=${google_scope}&access_type=${google_access_type}&include_granted_scopes=${google_include_granted_scopes}&state=${google_state}`
  }

  return (
    <p onClick={google_login}>
      <img src="/imgs/login_google_01.png" alt="로그인btn-구글" className='login-pc'/>
      <img src="/imgs/login_google_02.png" alt="로그인btn(mob)-구글" className='login-mobile'/>
    </p>
  )
}

export default GoogleLogin