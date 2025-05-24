import { NavLink } from 'react-router-dom'
import MoreBtn from '../../component/_common/MoreBtn'

function TripContTop({triplink, tripcontTitle, tripcontText}) {
  return (
    <NavLink to={triplink} className='trip-main-con-top' >
      <div className='trip-main-con-title'>
        <h3>{tripcontTitle}</h3>
        <span>{tripcontText}</span>
      </div>
      <MoreBtn/>
    </NavLink>
)
}

export default TripContTop