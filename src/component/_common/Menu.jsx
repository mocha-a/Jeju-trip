import { useLocation } from 'react-router-dom';
import MapItem from '../01-home/MapItem';
import HomeItem from '../01-home/HomeItem'
import TripItem from '../01-home/TripItem';
import MypageItem from '../01-home/MypageItem';
import CommentItem from '../01-home/CommentItem';

function Menu() {
  const location = useLocation();
  const hiddenPaths = ["/login", "/community/cmpostpage", "/community/cmeditpage", "/community/cmsubjectpage", "/splash"];
  // location이 pathname을 가지고 있어서 안보이게 할 페이지를 지정
  const hideMenu = hiddenPaths.includes(location.pathname);

  if (hideMenu) return null; // 해당 경로가 true일 때 렌더링 X

  return (
      <div className='bottom-menu'>
        <HomeItem />
        <TripItem />
        <CommentItem/>
        <MapItem/>
        <MypageItem/>
      </div>
  );
}

export default Menu