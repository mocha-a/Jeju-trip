import { NavLink } from 'react-router-dom'

function MainItem({className, detailurl, homeMainPhoto, tripTitle, title, introduction}) {
  return (
      <div className={className}>
        <NavLink to={detailurl}>
          <p className='home-bgimg'>
            <img src={homeMainPhoto} alt="" />
          </p>
          <div className='home-main-whimg'>
            <p>
              <img src="/imgs/home_slidetitle_00.png" alt="" />
            </p>
            <b>{tripTitle}</b>
          </div>
          <div className='home-main-text'>
            <b>{title}</b>
            <span>{introduction}</span>
          </div>
        </NavLink>
      </div>
  )
}

export default MainItem