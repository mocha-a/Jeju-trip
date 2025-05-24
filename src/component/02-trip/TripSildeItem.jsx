import { NavLink } from 'react-router-dom';

function TripSildeItem({detailurl, id, img, title}) {
  return (
    <NavLink to={`${detailurl}/${id}`} className="trip-main-slide">
        <img className="trip-main-slide-img" src={img} alt="" />
        <span>{title}</span>
    </NavLink>
  )
}

export default TripSildeItem