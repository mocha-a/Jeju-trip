import { NavLink } from 'react-router-dom'
import Home_blue from '../icons/Home_blue'
import Home_gray from '../icons/Home_gray'

import '../../styles/01-home/home.scss'

function HomeItem() {
  return (
    <div className='bottom-icons'>
      <NavLink to='/' className={({ isActive }) => `home-menu ${isActive ? 'active' : ''}`}>
      {/* isActive로 클래스이름을 동적으로 설정, 현재 경로와 일치하면 active 클래스 추가 */}
        {({ isActive }) => (
          <>
            {isActive ? <Home_blue className={"menu-blue"} /> : <Home_gray className={"menu-gray"} />}
            <b className={`menu-label ${isActive ? 'active' : ''}`}>홈</b>
          </>
        )}
        {/* isActive 값으로 활성화 상태인지 확인하고 변경해줌 */}
      </NavLink>
    </div>
  )
}

export default HomeItem