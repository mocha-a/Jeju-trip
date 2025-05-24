import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import Burger from './Burger';
import List from '../icons/List'
import Search from '../icons/Search'
import Arrow from '../icons/Arrow';

function Header() {
  const [burgerActive, setBurgerActive] = useState(false); //버거 상태 기본값false

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const slash = pathname.split('/').length - 1; // '/'의 개수 세기

  let head;
  if(pathname==='/'){
    head = <img src='/imgs/logo_blue.svg' alt=''/>;
  } else if (slash >= 2) {
    head = <Arrow className={'header-back'} onClick={()=>navigate(-1)}/>;
  } else {
    head = "";
  }

  const hiddenPaths = ["/login", "/community/cmpostpage", "/community/cmeditpage", "/community/cmsubjectpage", "/search", "/search/searchdetail", "/splash"];
  // location이 pathname을 가지고 있어서 안보이게 할 페이지를 지정
  const hideHeader = hiddenPaths.includes(location.pathname) || location.pathname.startsWith("/search/searchdetail");
  // SearchDetail 페이지에서 검색했을 때 헤더가 안보여야하기때문에 location.pathname.startsWith 추가함

  if (hideHeader) return null; // 해당 경로가 true일 때 렌더링 X

  return (
    <header className='header'>
      <h2> {head} </h2>
      <div className='header-rig'>
        <NavLink to='/search'>
          <Search className={'header-search'}/>
        </NavLink>
        <List className={'header-list'} onClick={()=>setBurgerActive(true)}/>
        <Burger isOpen={burgerActive} onClose={()=>setBurgerActive(false)}/>
      </div>
    </header>
  )
}

export default Header