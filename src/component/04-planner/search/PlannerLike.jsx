import { useEffect, useState } from 'react'
import { plan, shopNfoodNparty } from '../../../api';
import { useLocation, useNavigate } from 'react-router-dom';
import NoLikePlace from '../../_common/NoLikePlace';
import Button from '../../_common/Button';
import DataLoading from '../../_common/DataLoading';
import Btn1Popup from '../../popups/Btn1Popup';
import SearchItem from './SearchItem';

function PlannerLike({selectedTab}) {
    const { LikeData } = plan();
    const [likePosts, setLikePosts] = useState([]); // 좋아요 누른 게시물들 가져오기
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user?.id;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [checkItem, setCheckItem] = useState([]);
  
    const {shopNfoodNpartyData, fetchCategory} = shopNfoodNparty();

    useEffect(() => {
        Promise.all([
          fetchCategory('c1'), // 관광지
          fetchCategory('c2'), // 쇼핑
          fetchCategory('c4'), // 맛집
          fetchCategory('c5'), // 축제&행사
        ]).then(([res1, res2, res3, res4]) => {
            setLoading(false)
        });
      }, []);
      
    const tourList = shopNfoodNpartyData?.tour;
    const shoppingList = shopNfoodNpartyData?.shopping;
    const foodList = shopNfoodNpartyData?.food;
    const festivalList = shopNfoodNpartyData?.festival;
  
    const allContents = [
      ...(tourList || []), 
      ...(shoppingList || []), 
      ...(foodList || []), 
      ...(festivalList || [])
    ];
    
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/").filter(Boolean)
    const idx = path[4]
    
    useEffect(()=>{
      const userLikePost = async ()=>{
        const res = await fetch(`${process.env.REACT_APP_APIURL}/triplike/liked-posts?userId=${userId}`);

        const data = await res.json();
        setLikePosts(data.likedPostIds);
      };
      if(userId) userLikePost();
    },[userId])
  
    const clickbtn = (item) => {
      const selectList = {
        "contents_id": item.contentsid,
        "contents_label": item.contentscd.label,
        "title": item.title,
        "road_address": item.roadaddress,
        "introduction": item.introduction,
        "latitude": item.latitude,
        "longitude": item.longitude
        }
      setCheckItem((prev) => {
          const exists = prev.some((i) => i.contents_id === item.contentsid);

          return exists
              ? prev.filter((i) => i.contents_id !== item.contentsid) // 체크 해제
              : [...prev, selectList]; // 체크
      });
  }

  const myLikedData = allContents.filter(item => likePosts.includes(item.contentsid));
    
  return (
    loading ? (
    <DataLoading  className={"searchLoading"}/>
    ):(
      myLikedData.length === 0 ? (
          <NoLikePlace/>  // 게시물 리스트가 비어있을 때 NoLikePlace 컴포넌트
        ) : (
        <>
          {myLikedData.map((item, idx) => (
              <SearchItem
              key={item.contentsid}
              item={item}
              idx={idx}
              searchListItem={checkItem}
              checkbox={clickbtn}
              selectedTab={selectedTab}
              />
            ))
          }

          <div className='place_btn_fixed'>
            <button
            className='place_btn'
            onClick={() => {
              localStorage.setItem('searchListItem', JSON.stringify(checkItem))
              LikeData(checkItem, idx);
              navigate(-1);
            }}>
                <Button
                btn={ `선택 완료 / ${checkItem.length}개`}
                className={"place_btn"}/></button>
          </div>
          <Btn1Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} type={"select"}/>
        </>     
      )
    )
  )
}

export default PlannerLike