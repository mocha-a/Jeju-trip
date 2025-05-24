import { NavLink } from 'react-router-dom'
import MoreBtn from '../_common/MoreBtn'

function HomeContTop({onClick, homecontTitle, homecontEmoji, to, state, showMore = true}) {
  
  const handleMoreBtn = (e)=>{
    if(onClick){
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className='home-menu-top'>
      <h2>{homecontTitle} <span className='emoji'>{homecontEmoji}</span> </h2>
        {showMore && to ? ( <NavLink to={to} state={state}> <MoreBtn onClick={handleMoreBtn}/> </NavLink> ) : null}
        {/* 전체보기 버튼을 사용하지 않는 곳을 위해 삼항연산자를 사용하여 showMore이 필요없을때는 null */}
    </div>
  )
}

export default HomeContTop