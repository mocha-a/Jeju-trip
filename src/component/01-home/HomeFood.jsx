import { NavLink } from 'react-router-dom'

export default function HomeFood({className, onClick, imgpath, title, tag, roadaddress}) {

  const tagList = tag?.split(/[,#]/).slice(0, 4).map(t => t.trim()).filter(Boolean);
  // trim 공백 제거 (" " -> "").빈문자열,언디파인드 등을 제거하고 값이 있는것만 줌
  const tagText = tagList.join('·');
  
  return (
    <div className={className} onClick={onClick}>
      <NavLink to='/trip/triplist/food/tripdetail/:id'>
        <div className='home-foodtab'>
          <p>
            <img src={imgpath} alt="" />
          </p>
          <div className='home-foodtab-texts'>
            <div className='home-foodtab-text1'>
              <b>{title}</b>
              <span>{tagText}</span>
            </div>
            <span>{roadaddress}</span>
          </div>
        </div>
      </NavLink>
    </div>
  )
}
