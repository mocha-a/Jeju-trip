import { NavLink } from 'react-router-dom'
import Map_blue from '../icons/Map_blue'
import Map_gray from '../icons/Map_gray'

import '../../styles/01-home/home.scss'

function MapItem() {
  return (
    <div className='bottom-icons'>
      <NavLink to='/planner' className={({ isActive }) => `home-menu ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            {isActive ? <Map_blue className={"menu-blue"} /> : <Map_gray className={"menu-gray"} />}
            <b className={`menu-label ${isActive ? 'active' : ''}`}>내 여행</b>
          </>
        )}
      </NavLink>
    </div>
  )
}

export default MapItem