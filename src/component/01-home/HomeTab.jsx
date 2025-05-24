import { NavLink } from 'react-router-dom'

function HomeTab({tabLink, imgurl, tabTitle}) {
  return (
    <div className='home-tabcomp'>
      <NavLink to={tabLink}>
        <img src={`/imgs/${imgurl}`} alt="" />
        <span>{tabTitle}</span>
      </NavLink>
    </div>
  )
}

export default HomeTab