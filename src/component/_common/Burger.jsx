import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { googleLogout, kakaoLogout, naverLogout } from '../../utils/logout';

import Right_blue from '../icons/Right_blue';
import Close from '../icons/Close';
import Btn1Popup from '../popups/Btn1Popup';
import Btn2Popup from '../popups/Btn2Popup';

function Burger({onClose, isOpen}) {
  const [user, setUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDonePopupOpen, setIsDonePopupOpen] = useState(false);
  const navigate = useNavigate();

  // 세션에 저장된 사용자 정보 가져오기
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [isOpen]);

  // 로그아웃 동작 및 팝업 관리
  function handleLogoutConfirm() {
    const provider = sessionStorage.getItem('provider');
    setIsPopupOpen(false);

    // 로그아웃 완료 팝업 (비동기. 로그아웃 완료 후 진행되어야 함.)
    const afterLogout = () => {
      setTimeout(() => {
        setIsDonePopupOpen(true);
      }, 400);
    }

    if (provider === 'kakao') {
      kakaoLogout();
      return;
    } 
    
    if (provider === 'naver') {
      naverLogout(afterLogout);
    } else if (provider === 'google') {
      googleLogout(afterLogout);
    }
  }

  return (
    <div className={`burger-rel ${isOpen ? 'active' : ''}`}>
      <div className='burger'>
          <div className="bug-close">
            <button onClick={onClose}>
              <Close className={"bugclose-btn"}/>
            </button>
          </div>
        <div>
          <ul className='bug-menu'>
            <li className='bugbtn' onClick={onClose}>
              <NavLink to="/">
                <span>Home</span>
                <Right_blue className={'bugarrow'}/>
              </NavLink>
            </li>
            <li className='bugbtn' onClick={onClose}>
              <NavLink to="/trip/triplist/tour">
                <span>관광지</span>
                <Right_blue className={'bugarrow'}/>
              </NavLink>
            </li>
            <li className='bugbtn' onClick={onClose}>
              <NavLink to="/trip/triplist/food">
                <span>맛집</span>
                <Right_blue className={'bugarrow'}/>
              </NavLink>
            </li>
            <li className='bugbtn' onClick={onClose}>
              <NavLink to="/trip/triplist/festival">
                <span>축제 행사</span>
                <Right_blue className={'bugarrow'}/>
              </NavLink>
            </li>
            <li className='bugbtn' onClick={onClose}>
              <NavLink to="/community">
                <span>떠나톡</span>
                <Right_blue className={'bugarrow'}/>
              </NavLink>
            </li>
            <li className='bugbtn' onClick={() => {
              window.open('https://bus.jeju.go.kr/search/line', '_blank', 'noopener,noreferrer');
              onClose();
            }}>
              <div className='bugbus'>
                <span>버스정보</span>
                <Right_blue className={'bugarrow'}/>
              </div>
            </li>
            <li className='bugbtn' onClick={onClose}>
              <NavLink to="/my">
                <span>마이페이지</span>
                <Right_blue className={'bugarrow'}/>
              </NavLink>
            </li>
          </ul>
          <div className='bug-login'>
            {user
              ? <span onClick={() => setIsPopupOpen(true)}>로그아웃</span>
              : <NavLink to="/login">로그인</NavLink>
            }
          </div>
        </div>
      </div>

      {/* 로그아웃 완료 팝업 */}
      <Btn1Popup 
        isOpen={isDonePopupOpen}
        setIsOpen={setIsDonePopupOpen}
        type={'logout'}
        onConfirm={() => {
          onClose(true);
          setIsDonePopupOpen(false);
          navigate('/');             
        }}
        className={'popup-box-burger'}
      />

      {/* 로그아웃 확인 팝업 */}
      <Btn2Popup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        type={'logout'}
        onConfirm={handleLogoutConfirm}
        className={'popup-box-burger'}
      />
    </div>
  )
}

export default Burger