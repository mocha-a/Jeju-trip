import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { shopNfoodNparty } from '../../api';
import DataLoading from '../../component/_common/DataLoading';
import Top from '../../component/icons/Top';
import TripPlaceItem from '../../component/02-trip/tripList/TripPlaceItem';
import TripFilter from '../../component/02-trip/tripList/TripFilter'

import "../../styles/02-trip/tripList.scss";

function TripList() {

  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(true);
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const type = pathParts[3]; // 항상 이 위치가 type임
  const { id } = useParams();

  const [likeData, setLikeData] = useState([]); // 여러 아이템 좋아요 정보
  const [likedPosts, setLikedPosts] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.id;

  const listNavigate = useNavigate();
  
  const [listMainImg, setListMainImg] = useState(null); // 트립 리스트 메인이미지에서 랜덤값 뽑기
  const [listCount, setListCount] = useState(30); // 리스트 갯수 처음 30개만 보임
  const [filterOption, setFilterOption] = useState('오름차순');

  const {shopNfoodNpartyData, fetchCategory} = shopNfoodNparty();
  // api호출로 받아오는 데이터, 데이터를 가져오는 액션 함수
  
  useEffect(()=>{
    if(type==='tour'){
      fetchCategory('c1');
    } else if(type==='food'){
      fetchCategory('c4');
    } else if(type==='festival'){
      fetchCategory('c5');
    } else if(type==='shopping'){
      fetchCategory('c2');
    }
    window.scrollTo(0,0);
  },[type])
  
  const textTypeInfo = {
    tour: {
      title: "관광지",
      subtitle: "제주 여행 트렌드를 한눈에!",
      intro: "핫플부터 숨은 명소까지",
      imgs: [
        "/imgs/trip_tour_01.jpg",
        "/imgs/trip_tour_02.jpg",
        "/imgs/trip_tour_03.jpg"
      ]
    },
    food: {
      title: "맛집",
      subtitle: "제주도민이 인정한 맛집",
      intro: "맛 따라 떠나는 제주",
      imgs: [
        "/imgs/trip_food_01.jpg",
        "/imgs/trip_food_02.jpg",
        "/imgs/trip_food_03.jpg"
      ]
    },
    festival: {
      title: "축제&행사",
      subtitle: "놓치면 아쉬운 축제&행사",
      intro: "지금 주목해야 할 제주",
      imgs: [
        "/imgs/trip_festival_01.jpg",
        "/imgs/trip_festival_02.jpg",
        "/imgs/trip_festival_03.jpg"
      ]
    },
    shopping: {
      title: "소품샵&갤러리",
      subtitle: "감성가득! 소품샵&갤러리",
      intro: "특별한 감성 공간",
      imgs: [
        "/imgs/trip_shopping_01.jpg",
        "/imgs/trip_shopping_02.jpg",
        "/imgs/trip_shopping_03.jpg"
      ]
    }
  };
  
  useEffect(()=>{
    const storageKey = `tripListImg_${type}`;
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    const saveImg = localStorage.getItem(storageKey);

    if(saveImg){
      try{
        const parsedImg = JSON.parse(saveImg);
        const {listImg, createdAt} = parsedImg;
        if (createdAt && now - createdAt < oneDay){
          setListMainImg(listImg);
          return;
        }
      } catch (e) {
        console.error("로컬스토리지 파싱 오류", e);
        localStorage.removeItem(storageKey);
      }
    }

    const listMainImg = textTypeInfo[type]?.imgs || [];
    const randomIndex = Math.floor(Math.random() * listMainImg.length); // 0-1사이 숫자에서 length값 곱하면 항상 0,1,2만 나옴
    const selected = listMainImg[randomIndex]; // 골라낸 값을 리턴
    setListMainImg(selected);
    const createdAt = new Date().getTime(); //현재 시각ms
    localStorage.setItem(storageKey, JSON.stringify({listImg: selected, createdAt})); // sliceFood, mainFoodPick은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
  },[type])

  useEffect(()=>{
    const handleScroll=()=>{
      const scrollY = window.scrollY; // 스크롤의 상단 값
      const windowHeight = window.innerHeight; // 한 화면에서 보여지는 브라우저 화면 높이
      const fullHeight = document.body.offsetHeight; // 전체 페이지 높이(스크롤포함)

      if(scrollY + windowHeight >= fullHeight-50) { // 사용자가 현재 보고 있는 화면의 가장 아래 위치 지점 >= 전체 페이지 바닥 -50px (바닥 근처에 왔을 때)
        setListCount((prev) => prev + 30);
      }
    };

    window.addEventListener('scroll', handleScroll); //스크롤 이벤트가 발생할 때마다 함수 실행
    return () => window.removeEventListener('scroll', handleScroll); //정리하기 : 스크롤 한번에 setListCount가 두세번 호출하지 않기 위해
  },[])

  const itemClick=(item)=>{
    const contentId = item.contents_id || item.contentsid;
    const filterList = getFilterData(); // 현재 필터링된 리스트
    listNavigate(`/trip/triplist/${type}/tripdetail/${contentId}`, {state: { filterList }});
  };

  const FilterChange=(option) => {
    setFilterOption(option); // 정렬 로직 적용
  };

  const getAllData=()=>{
    const excludeWords = ['호텔', '모텔', '병원', '펫', '요가', '필라테스'];
    if(type === 'tour') {
      const rawData = shopNfoodNpartyData.tour || [];
      const filterTourlist = rawData.filter(item=> !excludeWords.some(word => item.title?.includes(word)));
      return filterTourlist;
    }
    if(type === 'food') return shopNfoodNpartyData.food || [];
    if(type === 'festival') return shopNfoodNpartyData.festival || [];
    if(type === 'shopping') return shopNfoodNpartyData.shopping || [];
    return [];
  }

  const getFilterData=() => {
    const data = getAllData();
    const sorted = [...data];
    if (filterOption === '오름차순') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filterOption === '내림차순') {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (filterOption === '좋아요순') {
      sorted.sort((a, b) => {
        const aLikes = likeData[a.contentsid] || 0;
        const bLikes = likeData[b.contentsid] || 0;
        return bLikes - aLikes;
      });
    }
    return sorted;
  };

  // 로딩 : 모든 데이터가 준비됐을 때 로딩 종료
  useEffect(() => {
    if (type === 'tour' && Array.isArray(shopNfoodNpartyData.tour) && shopNfoodNpartyData.tour.length > 0) {
      setLoading(false);
    }
    if (type === 'food' && Array.isArray(shopNfoodNpartyData.food) && shopNfoodNpartyData.food.length > 0) {
      setLoading(false);
    }
    if (type === 'festival' && Array.isArray(shopNfoodNpartyData.festival) && shopNfoodNpartyData.festival.length > 0) {
      setLoading(false);
    }
    if (type === 'shopping' && Array.isArray(shopNfoodNpartyData.shopping) && shopNfoodNpartyData.shopping.length > 0) {
      setLoading(false);
    }
  }, [shopNfoodNpartyData]);

  
  // db관련 : 좋아요 버튼을 눌렀을 때 숫자가 화면에 보여짐
  const fetchLikeData = async (postIds) => {
    // if (!userId) return;
    
    const res = await fetch(`${process.env.REACT_APP_APIURL}/triplike/count-mult`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postIds })
    }); //서버에 게시물 id값을 보내서 좋아요 갯수 요청함
    
    const result = await res.json();
    
    const likeMap = {};
    result.forEach(item => {
      likeMap[item.postId] = item.count;
    }); // 가지고 온 좋아요 갯수를 아이디값과 함께 저장
    
    setLikeData(prev => ({ ...prev, ...likeMap }));
  };

  useEffect(()=>{ //좋아요 로딩시간이 느려서 빠르게 가져오기 위해 
    if (!loading) {
      const listData = getFilterData().slice(0, listCount);
      const postIds = listData.map(item=>item.contentsid); // 현재 리스트의 모든 게시물의 아이디값을 배열로 만듦
      fetchLikeData(postIds).then(() => setLikeLoading(false));
    }
  },[loading, listCount, type ])


  // db관련 : 사용자가 좋아요 누른 게시물 찾아서 리스트에 표시함
  const fetchUserLikedPosts = async () => {
    // if (!userId) return;
    const res = await fetch(`${process.env.REACT_APP_APIURL}/triplike/liked-posts?userId=${userId}`);
    const data = await res.json();
    
    setLikedPosts(data.likedPostIds || []);
  
    // 추가: 좋아요 숫자도 불러오기
    const likedPostIds = data.likedPostIds || [];
    if (likedPostIds.length > 0) {
      fetchLikeData(likedPostIds);
    }
  };
  useEffect(() => {
    fetchUserLikedPosts();
  }, [userId]);
  
  return (
    <div className='trip-listpage'>
      <div className='trip-list-topimg'>
        <h2 className="trip-list-title"> {textTypeInfo[type]?.title} </h2>
        <img src={listMainImg} alt="img" />
      </div>

      <div className='trip-list-cont'>
        <div className='trip-list-cont-title'>
          <h3>{textTypeInfo[type].subtitle}</h3>
          <span>{textTypeInfo[type].intro}</span>
        </div>
        <TripFilter onFilterChange={FilterChange}/>
      </div>

      {
        loading ? (
          <DataLoading className={'trip-list-loading'}/>
        ) : 
          <>
          {
            getFilterData().slice(0, listCount).map((item)=>{
              const contentsId = item.contentsid;
              const heartType = likedPosts.includes(contentsId) ? "red-fill" : "red-stroke";
              const likeCount = likeData[contentsId] || 0;

              return(
                <div className='tripList' key={contentsId} onClick={()=>itemClick(item)}>
                  <TripPlaceItem 
                  imgpath={item.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'} 
                  title={item.title} 
                  roadaddress={item.roadaddress || '현재 주소 정보가 비어 있어요. 확인 중입니다.'} 
                  tag={item.tag} 
                  heartType={heartType}
                  likeCount={likeLoading ? <img src='/imgs/loading.svg' alt=''/> : likeCount}/>
                </div>
              )
            })
          }
          </>
      }

      <Top/>

    </div>
  )
}

export default TripList
