import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { shopNfoodNparty } from '../../api';
import DataLoading from '../../component/_common/DataLoading';
import Btn2Popup from '../../component/popups/Btn2Popup';
import TripDetailItem from '../../component/02-trip/tripDetail/TripDetailItem';
import BackNext from '../../component/02-trip/tripDetail/BackNext';
import TripTag from '../../component/02-trip/tripDetail/TripTag';
import Around from '../../component/02-trip/tripDetail/Around'

import "../../styles/02-trip/tripDetail.scss";

function TripDetail() {

  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { filterList } = location.state || {}; //TripList에서 작성한 filterList를 받음
  const pathParts = location.pathname.split('/');
  const type = pathParts[3]; // 항상 이 위치가 type임
  const { id } = useParams();

  const postId = id;
  const [liked, setLiked] = useState(false); // 좋아요 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem('access'); // 세션 내 access 값이 있으면 true, 없으면 false
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.id;

  const {shopNfoodNpartyData, fetchCategory} = shopNfoodNparty();
  // api호출로 받아오는 데이터, 데이터를 가져오는 액션 함수
    useEffect(()=>{
      fetchCategory('c1'); //관광지
      fetchCategory('c2'); //쇼핑
      fetchCategory('c4'); //맛집
      fetchCategory('c5'); //축제행사
      window.scrollTo(0,0);
    },[id])
  
  const tourList = shopNfoodNpartyData?.tour;
  const shoppingList = shopNfoodNpartyData?.shopping;
  const foodList = shopNfoodNpartyData?.food;
  const festivalList = shopNfoodNpartyData?.festival;

  const getItemById = () => {
    let list = [];
    const excludeWords = ['호텔', '모텔', '병원', '펫', '요가', '필라테스'];
    if(type === 'tour') {
      const rawData = tourList || [];
      const filterTourlist = rawData.filter(item=> !excludeWords.some(word => item.title?.includes(word)));
      list = filterTourlist;
    }
    if (type === 'food') list = foodList;
    if (type === 'festival') list = festivalList;
    if (type === 'shopping') list = shoppingList;

    return list.find(item => String(item?.contentsid) === id);
  };
  const detailItem = getItemById();

  // 로딩 : 모든 데이터가 준비됐을 때 로딩 종료
  useEffect(() => {
    if (type === 'tour' && Array.isArray(shopNfoodNpartyData.tour)  && shopNfoodNpartyData.tour.length > 0) {
      setLoading(false);
    }
    if (type === 'food' && Array.isArray(shopNfoodNpartyData.food)  && shopNfoodNpartyData.food.length > 0) {
      setLoading(false);
    }
    if (type === 'festival' && Array.isArray(shopNfoodNpartyData.festival)  && shopNfoodNpartyData.festival.length > 0) {
      setLoading(false);
    }
    if (type === 'shopping' && Array.isArray(shopNfoodNpartyData.shopping)  && shopNfoodNpartyData.shopping.length > 0) {
      setLoading(false);
    }
  }, [shopNfoodNpartyData]);

  // 이전, 이후 버튼 계산
  let list = filterList || [];
  const excludeWords = ['호텔', '모텔', '병원', '펫', '요가', '필라테스'];
  if (list.length===0){
    if (type === 'tour') {
      const rawData = tourList || [];
      const filterTourlist = rawData.filter(item=> !excludeWords.some(word => item.title?.includes(word)));
      list = filterTourlist;
    }
    if (type === 'food') list = foodList;
    if (type === 'festival') list = festivalList;
    if (type === 'shopping') list = shoppingList;
  }
  const currentIndex = list.findIndex(item => String(item.contentsid) === id);
  const prevItem = list[currentIndex - 1];
  const nextItem = list[currentIndex + 1];
  const prevPath = prevItem ? `/trip/triplist/${type}/tripdetail/${prevItem.contentsid}` : null;
  const nextPath = nextItem ? `/trip/triplist/${type}/tripdetail/${nextItem.contentsid}` : null;

  // 전화번호가 잘못됐을 경우
  const formatPhone = (rawPhone) => {
    if (!rawPhone || rawPhone.trim() === "" || rawPhone.trim() === "--") {
      return "현재 등록되어 있지 않아요. 조금만 기다려 주세요.";
    }
  
    const trimmed = rawPhone.trim().replace(/^[-]+/, ""); // 앞 하이픈 제거
    const parts = trimmed.split('-');
  
    // 올바른 3파트(지역번호 포함) 형태
    if (parts.length === 3 && parts[0].startsWith('0')) {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
  
    // 2파트: 지역번호가 없고 숫자 길이만 맞는 경우 (예: 123-4567, 794-1234 등)
    if (
      parts.length === 2 &&
      parts[0].length === 3 &&
      parts[1].length === 4
    ) {
      return `064-${parts[0]}-${parts[1]}`;
    }
  
    // 혹시라도 숫자만 있는 경우 등
    return trimmed;
  };

  // 주소에서 지역 추출 (서귀포시 안덕면/읍/동 00리")
  const addressSelect = (address) => {
    const parts = address?.split(" ") || []; //띄어쓰기 자르기
    if (parts.length >= 3) {
      return `${parts[1]} ${parts[2]}`; // 1:서귀포시 2:안덕면
    }
    // if (parts.length >= 4) {
    //   return `${parts[1]} ${parts[2]} ${parts[3]}`; // 1:서귀포시 2:안덕면 3:00리
    // } else if(parts.length >= 3) {
    //   return `${parts[1]} ${parts[2]}`; // 1:서귀포시 2:안덕면
    // }
    return "";
  };

  // 같은 지역의 콘텐츠 목록 추출
  const getSameItems = () => {
    if (!detailItem) return []; // undefined 방지
    const address = detailItem.roadaddress;
    const region = addressSelect(address); //선택한 컨텐츠의 주소값

    let list = [];
    if (type === 'tour') list = tourList;
    if (type === 'food') list = foodList;
    if (type === 'festival') list = festivalList;
    if (type === 'shopping') list = shoppingList;

    // 선택한 컨텐츠와 같은 지역인데, 선택한 컨텐츠 제외하고 거르기
    return list.filter(item => {
      const itemAddress = item.roadaddress || "";
      const itemId = String(item.contentsid);
      return itemAddress.includes(region) && itemId !== id;
    });
  };

  // 태그 불러오기
  const getTag=()=>{
    if (!detailItem || !detailItem.tag) return []; // undefined 방지
    const showTags = detailItem.tag;
    const cleanSign = showTags.replace(/#/g, ',') // #을 쉼표로 통일시킴
    const splitTags = cleanSign.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    return splitTags;
  }

  const tag = getTag();
  const aroundData = getSameItems();



  // db관련 : 좋아요 버튼을 눌렀을 때 저장
  const likeClick = async ()=>{
    if(!isLoggedIn){
      setIsPopupOpen(true);
      return;
    }

    const triplike = {
      userId,
      postId, 
      liked: !liked
    };

    const response = await fetch(`${process.env.REACT_APP_APIURL}/triplike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(triplike),
    });

    if (response.ok) {
      const result = await response.json();
      setLiked(result.liked);
    }
  }

  // db관련 : 좋아요 버튼을 눌렀을 때 화면에 보여짐
  useEffect(() => {
    const fetchLiked = async () => {
      if (!userId || !postId) return;
      const response = await fetch(`${process.env.REACT_APP_APIURL}/triplike?userId=${userId}&postId=${postId}`);
      if(response.ok) {
        const result = await response.json();
        setLiked(result.liked);
      } 
    };
  
    if (!loading) {
      fetchLiked();
    }
  }, [loading, userId, postId]);

  return (
    <div className='trip-detail-Page'>

      {
        loading ? (
          <DataLoading className={'trip-detail-loading'}/>
        ) : 
        <>
          <TripDetailItem 
          img={detailItem.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_big_02.png'} 
          title={detailItem.title} 
          address={detailItem.roadaddress || '현재 주소 정보가 비어 있어요. 확인 중입니다.'} 
          introduction={detailItem.introduction} 
          phone={formatPhone(detailItem.phoneno)}
          liked={liked}
          onClick={likeClick}/>

          {isPopupOpen && (
            <Btn2Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} type={'login'} 
            onConfirm={() => navigate('/login')}/>
          )}

          <TripTag tag={tag}/>

          {type !== 'festival' && (
            <div className='trip-around-part'>
              <h3>이 곳은 어때?</h3>
              {aroundData.length > 0 ? ( 
                <Around arounddata={aroundData}/> 
              ) : (
                <p>선택한 장소 근처의 다른 추천지는 준비 중입니다.</p>
              )}
            </div>
          )}
        </>
      }

      <div>
        <BackNext prevPath={prevPath} nextPath={nextPath} filterList={list}/>
      </div>
    </div>
  )
}

export default TripDetail