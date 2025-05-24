import { NavLink } from 'react-router-dom'

function HomePhoto({className, onClick, to, state, img}) {

  const handleMoreBtn = (e)=>{
    e.preventDefault();
    onClick();
  }
  
  return (
    <div className={className}>
      <NavLink to={to} state={state} onClick={handleMoreBtn}>
        <p className='home-photo-img'>
          <img src={img.imageUrl} alt="" />
        </p>
      </NavLink>
    </div>
  )
}

export default HomePhoto