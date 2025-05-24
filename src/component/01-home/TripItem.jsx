import { NavLink } from 'react-router-dom'
import Trip_blue from '../icons/Trip_blue'
import Trip_gray from '../icons/Trip_gray'

import '../../styles/01-home/home.scss'

function TripItem() {
  return (
    <div className='bottom-icons'>
      <NavLink to='/trip' className={({ isActive }) => `home-menu ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            {isActive ? <Trip_blue className={"menu-blue"} /> : <Trip_gray className={"menu-gray"} />}
            <b className={`menu-label ${isActive ? 'active' : ''}`}>트립</b>
          </>
        )}
      </NavLink>
    </div>
  )
}

export default TripItem