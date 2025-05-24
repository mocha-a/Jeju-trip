import { NavLink } from 'react-router-dom'
import Mypage_blue from '../icons/Mypage_blue'
import Mypage_gray from '../icons/Mypage_gray'

import '../../styles/01-home/home.scss'

function MypageItem() {
  return (
    <div className='bottom-icons'>
      <NavLink to='/my' className={({ isActive }) => `home-menu ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            {isActive ? <Mypage_blue className={"menu-blue"} /> : <Mypage_gray className={"menu-gray"} />}
            <b className={`menu-label ${isActive ? 'active' : ''}`}>마이페이지</b>
          </>
        )}
      </NavLink>
    </div>
  )
}

export default MypageItem