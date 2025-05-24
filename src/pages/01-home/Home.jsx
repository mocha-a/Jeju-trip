import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { shopNfoodNparty } from '../../api';
import axios from 'axios';
import WeatherTemp from '../../component/_common/WeatherTemp';
import PopupAction from '../../component/_common/PopupAction';
import DataLoading from '../../component/_common/DataLoading';
import Top from '../../component/icons/Top';
import Btn2Popup from '../../component/popups/Btn2Popup';
import HomeContTop from '../../component/01-home/HomeContTop'
import MonthPeople from '../../component/01-home/MonthPeople';
import HomePhoto from '../../component/01-home/HomePhoto'
import HomeFood from '../../component/01-home/HomeFood'
import MainItem from '../../component/01-home/MainItem'
import HomeTrip from '../../component/01-home/HomeTrip'
import HomeTab from '../../component/01-home/HomeTab'
import Month from '../../component/01-home/Month';

// Import Swiper styles
import "swiper/css";
import "../../styles/01-home/home.scss";

function Home() {

  const {shopNfoodNpartyData, fetchCategory} = shopNfoodNparty();
  // api호출로 받아오는 데이터, 데이터를 가져오는 액션 함수
  useEffect(()=>{
    fetchCategory('c1'); //관광지
    fetchCategory('c2'); //쇼핑
    fetchCategory('c4'); //맛집
    fetchCategory('c5'); //축제행사
    window.scrollTo(0,0);
  },[])

  const tourList = shopNfoodNpartyData?.tour || [];
  const shoppingList = shopNfoodNpartyData?.shopping || [];
  const foodList = shopNfoodNpartyData?.food || [];
  const festivalList = shopNfoodNpartyData?.festival || [];

  const [loading, setLoading] = useState(true); // api 데이터 로딩
  const [wtLoading, setWtLoading] = useState(true); // 날씨 데이터 로딩
  const [mainTrip, setMainTrip] = useState(null); // 메인 슬라이드에서 여행지 부분 랜덤값 뽑기
  const [mainFood, setMainFood] = useState(null); // 메인 슬라이드에서 맛집 부분 랜덤값 뽑기
  const [mainFestival, setMainFestival] = useState(null); // 메인 슬라이드에서 축제 부분 랜덤값 뽑기
  const [mainShopping, setMainShopping] = useState(null); // 메인 슬라이드에서 쇼핑 부분 랜덤값 뽑기
  const [activeTrip, setActiveTrip] = useState(null); // 여행지에서 클릭했을 때 active 값을 넣기 위한 useState
  const [selectedTrips, setSelectedTrips] = useState([]); // 랜덤으로 뽑을 여행지 4개를 위한 useState
  const [selectedFoods, setSelectedFoods] = useState([]); // 랜덤으로 뽑을 맛집 6개를 위한 useState
  
  const nowmonth = new Date().getMonth() +1;
  const matchMonth = nowmonth < 10 ? `0${nowmonth}` : `${nowmonth}`;
  const [selectedMonth, setSelectedMonth] = useState(matchMonth); // 어떤 월을 선택했는지
  const [month, setMonth] = useState(false); //월별 팝업 열고 닫고
  const [people, setPeople] = useState([]); //관광객 전체 데이터
  const [selectedPeopleCount, setSelectedPeopleCount] = useState(null); //선택한 관광객 전체 데이터
  
  const [mainWeather, setMainWeather] = useState([]); // 오늘의 날씨 값
  const [imgPost, setImgPost] = useState([]); // 커뮤니티에서 이미지게시물 가져온 값
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem('access'); // 세션 내 access 값이 있으면 true, 없으면 false
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.id;
  const navigate = useNavigate();

  

  // 메인트립 로컬스토리지 저장, 하루시간 설정 후 삭제되게 함
  useEffect(()=>{
    if (tourList && tourList.length > 0) {
      const saveTrip = localStorage.getItem('hometrip'); //-> 문자열(쿠키는 원래 문자열만 저장 가능)
      const now = new Date().getTime(); //현재 시간
      const oneDay = 24 * 60 * 60 * 1000; //24시간=86400000ms
      
      if (saveTrip) {
        try {
          const parsedTrip = JSON.parse(saveTrip); //저장된 값이 있으면 문자열을 객체로 변경
          const { slice, main, createdAt } = parsedTrip; // createdAt 저장 시간이 지났는지 확인하는 용

          const isValidTime = createdAt && now - createdAt < oneDay; // 저장시간이 24시간 이내인지 확인 (현재시간-저장시간)
          // const hasValidData = Array.isArray(slice) && slice.length > 0 && slice[0]?.contents_id; //오류방지용

          if (isValidTime) {
            // 아직 하루 안 지났음 → 유효
            setMainTrip(main); // 랜덤으로 하나 뽑아서 저장
            setSelectedTrips(slice);
            setActiveTrip(slice[0].contentsid);
            return;
          } else {
            // 하루 지남 → 제거
            localStorage.removeItem('hometrip');
          }
        } catch (e) {
          console.error("로컬스토리지 파싱 오류", e);
          localStorage.removeItem('hometrip');
        }
      }

      const excludeWords = ['호텔', '모텔', '병원', '펫', '요가', '필라테스'];
      const filterTourlist = tourList.filter(item=> !excludeWords.some(word => item.title?.includes(word)));

      // 여기로 오면 유효한 로컬스토리지 없고 새로 랜덤 생성
      const copyTourList = [...filterTourlist].sort(() => Math.random() - 0.5); // 배열을 랜덤하게 섞기 위해 sort함수에 넣어서 사용, 0-1사이 값을 주는데 -0.5를 하면 음수(앞으로) 양수(뒤로)값을 가지게 되어 순서가 바뀐다
      const sliceTrip = copyTourList.slice(0, 4);
      const mainTripPick = copyTourList[Math.floor(Math.random() * copyTourList.length)]; // 전체 데이터에서 랜덤으로 하나 선택
      setMainTrip(mainTripPick); // 랜덤으로 고른걸 메인슬라이드 이미지로 선택
      setSelectedTrips(sliceTrip); // 선택한 4개 여행지 저장
      setActiveTrip(sliceTrip[0]?.contentsid); // 첫번째 컨텐츠의 너비는 펼쳐진 상태로 하기 위해 tripData[0].id 적용
      
      const createdAt = new Date().getTime(); //현재 시각ms
      localStorage.setItem('hometrip', JSON.stringify({slice: sliceTrip, main: mainTripPick, createdAt})); // sliceTrip, mainTripPick은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
    }

  }, [tourList]);

  // 메인푸드 로컬스토리지 저장, 하루시간 설정 후 삭제되게 함
  useEffect(()=>{
    if (foodList && foodList.length > 0) {
      const saveFood = localStorage.getItem('homefood'); //-> 문자열(쿠키는 원래 문자열만 저장 가능)
      const now = new Date().getTime(); //현재 시간
      const oneDay = 24 * 60 * 60 * 1000; //24시간=86400000ms
      
      if (saveFood) {
        try {
          const parsedFood = JSON.parse(saveFood); //저장된 값이 있으면 문자열을 객체로 변경
          const { slice, main, createdAt } = parsedFood; // createdAt 저장 시간이 지났는지 확인하는 용
          
          const isValidTime = createdAt && now - createdAt < oneDay; // 저장시간이 24시간 이내인지 확인 (현재시간-저장시간)
          // const hasValidData = Array.isArray(slice) && slice.length > 0 && slice[0]?.contents_id; //오류방지용
          
          if (isValidTime) {
            // ⏳ 아직 하루 안 지났음 → 유효
            setMainFood(main); // 랜덤으로 하나 뽑아서 저장
            setSelectedFoods(slice);
            return;
          } else {
            // 하루 지남 → 제거
            localStorage.removeItem('homefood');
          }
        } catch (e) {
          console.error("로컬스토리지 파싱 오류", e);
          localStorage.removeItem('homefood');
        }
      }
      // 여기로 오면 유효한 로컬스토리지 없고 새로 랜덤 생성
        const copyFoodData = [...foodList].sort(() => Math.random() - 0.5); // 배열을 랜덤하게 섞기 위해 sort함수에 넣어서 사용, 0-1사이 값을 주는데 -0.5를 하면 음수(앞으로) 양수(뒤로)값을 가지게 되어 순서가 바뀐다
        const sliceFood = copyFoodData.slice(0, 6);
        const mainFoodPick = copyFoodData[Math.floor(Math.random() * copyFoodData.length)]; // 전체 데이터에서 랜덤으로 하나 선택
        setMainFood(mainFoodPick); // 랜덤으로 고른걸 메인슬라이드 이미지로 선택
        setSelectedFoods(sliceFood); // 선택한 6개 여행지 저장
        const createdAt = new Date().getTime(); //현재 시각ms
        localStorage.setItem('homefood', JSON.stringify({slice: sliceFood, main: mainFoodPick, createdAt})); // sliceFood, mainFoodPick은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
    }

  }, [foodList]);

  // 메인페스티벌 로컬스토리지 저장, 하루시간 설정 후 삭제되게 함
  useEffect(()=>{
    if (festivalList && festivalList.length > 0) {
      const saveFestival = localStorage.getItem('homefestival'); //-> 문자열(쿠키는 원래 문자열만 저장 가능)
      const now = new Date().getTime(); //현재 시간
      const oneDay = 24 * 60 * 60 * 1000; //24시간=86400000ms
      
      if (saveFestival) {
        try {
          const parsedFood = JSON.parse(saveFestival); //저장된 값이 있으면 문자열을 객체로 변경
          const { main, createdAt } = parsedFood; // createdAt 저장 시간이 지났는지 확인하는 용
          
          const isValidTime = createdAt && now - createdAt < oneDay; // 저장시간이 24시간 이내인지 확인 (현재시간-저장시간)
          // const hasValidData = Array.isArray(slice) && slice.length > 0 && slice[0]?.contents_id; //오류방지용
          
          if (isValidTime) {
            // ⏳ 아직 하루 안 지났음 → 유효
            setMainFestival(main); // 랜덤으로 하나 뽑아서 저장
            return;
          } else {
            // 하루 지남 → 제거
            localStorage.removeItem('homefestival');
          }
        } catch (e) {
          console.error("로컬스토리지 파싱 오류", e);
          localStorage.removeItem('homefestival');
        }
      }
      // 여기로 오면 유효한 로컬스토리지 없고 새로 랜덤 생성
        const copyFestivalData = [...festivalList].sort(() => Math.random() - 0.5); // 배열을 랜덤하게 섞기 위해 sort함수에 넣어서 사용, 0-1사이 값을 주는데 -0.5를 하면 음수(앞으로) 양수(뒤로)값을 가지게 되어 순서가 바뀐다
        const mainFestivalPick = copyFestivalData[Math.floor(Math.random() * copyFestivalData.length)]; // 전체 데이터에서 랜덤으로 하나 선택
        setMainFestival(mainFestivalPick); // 랜덤으로 고른걸 메인슬라이드 이미지로 선택
        const createdAt = new Date().getTime(); //현재 시각ms
        localStorage.setItem('homefestival', JSON.stringify({main: mainFestivalPick, createdAt})); // sliceFood, mainFoodPick은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
    }

  }, [festivalList]);

  // 메인쇼핑 로컬스토리지 저장, 하루시간 설정 후 삭제되게 함
  useEffect(()=>{
    if (shoppingList && shoppingList.length > 0) {
      const saveShopping = localStorage.getItem('homeshopping'); //-> 문자열(쿠키는 원래 문자열만 저장 가능)
      const now = new Date().getTime(); //현재 시간
      const oneDay = 24 * 60 * 60 * 1000; //24시간=86400000ms
      
      if (saveShopping) {
        try {
          const parsedShopping = JSON.parse(saveShopping); //저장된 값이 있으면 문자열을 객체로 변경
          const { main, createdAt } = parsedShopping; // createdAt 저장 시간이 지났는지 확인하는 용
          
          const isValidTime = createdAt && now - createdAt < oneDay; // 저장시간이 24시간 이내인지 확인 (현재시간-저장시간)
          // const hasValidData = Array.isArray(slice) && slice.length > 0 && slice[0]?.contents_id; //오류방지용
          
          if (isValidTime) {
            // ⏳ 아직 하루 안 지났음 → 유효
            setMainShopping(main); // 랜덤으로 하나 뽑아서 저장
            return;
          } else {
            // 하루 지남 → 제거
            localStorage.removeItem('homeshopping');
          }
        } catch (e) {
          console.error("로컬스토리지 파싱 오류", e);
          localStorage.removeItem('homeshopping');
        }
      }
      // 여기로 오면 유효한 로컬스토리지 없고 새로 랜덤 생성
        const copyShoppingData = [...shoppingList].sort(() => Math.random() - 0.5); // 배열을 랜덤하게 섞기 위해 sort함수에 넣어서 사용, 0-1사이 값을 주는데 -0.5를 하면 음수(앞으로) 양수(뒤로)값을 가지게 되어 순서가 바뀐다
        const mainShoppingPick = copyShoppingData[Math.floor(Math.random() * copyShoppingData.length)]; // 전체 데이터에서 랜덤으로 하나 선택
        setMainShopping(mainShoppingPick); // 랜덤으로 고른걸 메인슬라이드 이미지로 선택
        const createdAt = new Date().getTime(); //현재 시각ms
        localStorage.setItem('homeshopping', JSON.stringify({main: mainShoppingPick, createdAt})); // sliceFood, mainFoodPick은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
    }

  }, [shoppingList]);

  // 로딩 : 모든 데이터가 준비됐을 때 로딩 종료
  useEffect(() => {
    if (
      tourList?.length > 0 &&
      foodList?.length > 0 &&
      festivalList?.length > 0 &&
      shoppingList?.length > 0
    ) {
      setLoading(false); // 모든 데이터가 준비됐으면 로딩 종료
    }
  }, [tourList, foodList, festivalList, shoppingList]);

  // 트립부분 두번 클릭시 컨텐츠로 넘어감
  const tripClick = (contentsid) => {
    if (activeTrip === contentsid) {
      navigate(`/trip/triplist/tour/tripdetail/${contentsid}`);
      // 이미 펼쳐진 걸 또 클릭하면 상세 페이지 이동
    } else {
      setActiveTrip(contentsid);
    }
  };

  // 주소에서 도 제거 (제주특별자치도 제거)
  const mainAddressSelect = (address) => {
    if (!address) return "";
    const parts = address.split(" ");
    if (parts[0] === "제주특별자치도") {
      return parts.slice(1).join(" "); // 첫 번째 단어(제주특별자치도) 빼고 (" ")공백 기준으로 다시 문자열 변환
    }
    return address; // 제주특별자치도가 아니면 원래 주소로 보여주기
  };

  // 날씨
  useEffect(()=>{
    const instance = axios.create({
      baseURL : `${process.env.REACT_APP_APIURL}/mainWeather`,
    });
    instance.get('./')
    .then((res)=>{
      setMainWeather(res.data)
      setWtLoading(false)
      // console.log(res.data);
    })
  },[])

  //날씨 아이콘
  function weatherIcon(wf){
    switch (wf){
      case "맑음":
        return <img src='/imgs/weather_clear_01.png'/>
      case "구름많음":
        return <img src='/imgs/weather_partly_cloudy_01.png'/>
      case "흐림":
        return <img src='/imgs/weather_cloudy_01.png'/>
      case "흐림 / 비":
        return <img src='/imgs/weather_cloudy_rain_01.png'/>
      case "흐림 / 비/눈":
        return <img src='/imgs/weather_sleet_01.png'/>
      case "흐림 / 눈":
        return <img src='/imgs/weather_snow_01.png'/>
      case "흐림 / 빗방울":
        return <img src='/imgs/weather_partly_rain.png'/>
      case "흐림 / 눈날림":
        return <img src='/imgs/weather_partly_snow.png'/>
      case "흐림 / 빗방울 눈날림":
        return <img src='/imgs/weather_partly_rain_snow.png'/>
      case "구름많음 / 비":
        return <img src='/imgs/weather_cloudy_rain_01.png'/>
      case "구름많음 / 비/눈":
        return <img src='/imgs/weather_sleet_01.png'/>
      case "구름많음 / 빗방울":
        return <img src='/imgs/weather_raindrop.png'/>
      case "구름많음 / 눈날림":
        return <img src='/imgs/weather_snow_01.png'/>
      case "구름많음 / 빗방울 눈날림":
        return <img src='/imgs/weather_sleet_01.png'/>
    }
  }



  // 관광객수 api 불러오기
  useEffect(()=>{
    const fetchPeople = ()=>{
      axios.get('https://api.odcloud.kr/api/3083546/v1/uddi:4a4ea6e8-33e6-45c3-9c19-b8efe36ffd3b',{
        params: {
          serviceKey:'UO/VNFIHUBaYIX80pdY4xpWRnNWmKO89qSyEZrhhwobVU599onCKVvNnb0jHHcbQiQ1qcLqZWP21BSzibjqC4Q==',
          perPage: 100,
        },
      })
      .then((res)=>{
        setPeople(res.data.data)
      })
      .catch((error) => {
        console.error("관광객수 불러오기 실패", error);
      });
    };
    fetchPeople();
  },[])

  // 관광객 수 뽑기
  useEffect(()=>{
    if (selectedMonth && people.length > 0) {
      const selectedData = people.find((item) => item["구분연월"] === `2023-${selectedMonth}`);
      
      let count = 0;
      if (selectedData && selectedData["목적별(휴양및관람)"]) {
        const value = selectedData["목적별(휴양및관람)"];
        const numericValue = typeof value ==="string" ? value.replace(/,/g, "") : value;
        count = Number(numericValue);
      }

      setSelectedPeopleCount(count);
    }
  }, [selectedMonth, people]);

  // db 관련 커뮤니티 목록에서 이미지 가져오기
  useEffect(()=>{
    const fetchPostImg = async ()=>{
      const res = await fetch(`${process.env.REACT_APP_APIURL}/post/images`);
      if(res.ok){
        const result = await res.json();
        const imgPosts = result.filter(post=>post.post.subject==='떠나팁')
        .flatMap(post => post.imageUrl ? [{ imageUrl: post.imageUrl, postId: post.id, post: post }] : [])
        .slice(0, 5);
        setImgPost(imgPosts);
      }
    }
    fetchPostImg();
  },[])
  
  // 인생샷 클릭했을 때 로그인 확인하기
  const photoClick = async (target, post)=>{
    if (target === 'photo') {
      if (!post || (!post.id && !post._id)) {
        console.error('Invalid post object or missing id');
        return;
      }
    }
    

    if(!isLoggedIn){
      setIsPopupOpen(true);
    }else if(target ==='top'){
      navigate('/community', { state: { setSelectedTab: 1 } });
    }else if(target ==='photo'){
      const res = await fetch(`${process.env.REACT_APP_APIURL}/like/user-liked?userId=${userId}`);
      const data = await res.json();      
      const likedPostIds = data?.likedPosts?.map(post => post.postId) || [];
      let hasVote = likedPostIds.includes(post.post._id);
      
      localStorage.post = JSON.stringify({...post.post,hasVote});
      // localStorage.setItem('post', JSON.stringify(post.post)); 
      navigate(`/community/cmdetail/${post.id.toString()}`, { state: { setSelectedTab: 1 } });
    }
  }

  return (
    <div className='home-main'>
      {
        loading ? (
          <DataLoading className={'home-main-loading'}/>
        ) : 
        <Swiper 
        className="mySwiper mainSwiper"
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        >
          {mainTrip && (
            //mainTrip이 존재할때만 슬라이드 렌더링되게하기
            <SwiperSlide>
              <MainItem className={'home-mainimg'} detailurl={`/trip/triplist/tour/tripdetail/${mainTrip.contentsid}`} homeMainPhoto={mainTrip.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'} tripTitle={<>오늘, <br/>이곳 어때</>} title={mainTrip.title} introduction={mainTrip.introduction}/>
              <div className='img-overlay'></div>
            </SwiperSlide>
          )}
          {mainFood && (
            <SwiperSlide>
              <MainItem className={'home-mainimg'} detailurl={`/trip/triplist/food/tripdetail/${mainFood.contentsid}`} homeMainPhoto={mainFood.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'} tripTitle={<>제주<br/>맛집 지도</>} title={mainFood.title} introduction={mainFood.introduction}/>
              <div className='img-overlay'></div>
            </SwiperSlide>
          )}
          {mainFestival && (
            <SwiperSlide>
              <MainItem className={'home-mainimg'} detailurl={`/trip/triplist/festival/tripdetail/${mainFestival.contentsid}`} homeMainPhoto={mainFestival.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'} tripTitle={<>제주의<br/>축제 행사</>} title={mainFestival.title} introduction={mainFestival.introduction}/>
              <div className='img-overlay'></div>
            </SwiperSlide>
          )}
          {mainShopping && (
            <SwiperSlide>
              <MainItem className={'home-mainimg'} detailurl={`/trip/triplist/shopping/tripdetail/${mainShopping.contentsid}`} homeMainPhoto={mainShopping.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'} tripTitle={<>특별한<br/>감성 공간</>} title={mainShopping.title} introduction={mainShopping.introduction}/>
              <div className='img-overlay'></div>
            </SwiperSlide>
          )}
        </Swiper>
      }

      <div className='home-tabmenu'>
        <HomeTab tabLink={'/trip/triplist/tour'} imgurl={'home_tabtour_00.png'} tabTitle={'Tour'}/>
        <HomeTab tabLink={'/trip/triplist/food'} imgurl={'home_tabfood_00.png'} tabTitle={'Food'}/>
        <HomeTab tabLink={'/trip/triplist/festival'} imgurl={'home_tabfestival_00.png'} tabTitle={'Festival'}/>
        <HomeTab tabLink={'/trip/triplist/shopping'} imgurl={'home_tabshopping_00.png'} tabTitle={'Shopping'}/>
      </div>

      <div className='home-weather'>
        <HomeContTop homecontTitle={'오늘, 제주 날씨는 '} homecontEmoji={'☀'} showMore={false}/>
        {
          wtLoading ? (
            <DataLoading className={'home-main-wt-loading'}/>
          ) : (
            mainWeather.map((item)=>
              <div className='home-weather-content' key={item.fcstDate}>
                <div className='home-weather-today'>
                  <p>{weatherIcon(item.fcstValue)}</p>
                  <div>
                    <span>현재</span>
                    <b>{item.tem}°</b>
                  </div>
                </div>
                <div className='home-weather-etc'>
                  <b><WeatherTemp tmn={item.tmn} tmx={item.tmx}/></b>
                  <div className='home-weather-windy'>
                    <span>바람</span>
                    <b>{item.wsd}</b>
                    <b>m/s</b>
                  </div>
                </div>
              </div>
            )
          )
        }
      </div>

      <div className='home-tripmenu'>
        <HomeContTop homecontTitle={'오늘, 이곳 어때? '} homecontEmoji={'🚗'} to={'/trip/triplist/tour'}/>
        <div className='home-tripContent'>
          {
            loading ? (
              <DataLoading className={'home-main-loading'}/>
            ) : 
            selectedTrips.map((item, i)=>
              <HomeTrip 
                key={item.contentsid}
                className={`home-trip ${activeTrip === item.contentsid ? 'active' : ''}`}
                onClick={()=>tripClick(item.contentsid)}
                imgpath={item.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'}
                title={item.title}
                roadaddress={mainAddressSelect(item.roadaddress) || '현재 주소 정보가 비어 있어요. 확인 중입니다.'}
              />
            )
          }
        </div>
      </div>

      <div className='home-foodmenu'>
        <HomeContTop homecontTitle={'제주 맛집 지도 '} homecontEmoji={'🍽'} to={'/trip/triplist/food'}/>
        <div className='home-foodContent'>
    {/* {console.log("✅ selectedFoods check:", selectedFoods, 'length:', selectedFoods.length)} */}
          {
            loading ? (
              <DataLoading className={'home-main-loading'}/>
            ) : 
            selectedFoods.map((item) => 
                <HomeFood 
                  key={item.contentsid}
                  className={'home-food'}
                  onClick={()=>navigate(`/trip/triplist/food/tripdetail/${item.contentsid}`, { replace: true })} // replace: true -> 뒤로가기 눌렀을 때 라우터 url로 이동해서 이걸 작성하면 브라우저에 히스토리가 쌓이지 않고 뒤로가기 잘 됨
                  imgpath={item.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'}
                  title={item.title}
                  tag={item.tag}
                  roadaddress={mainAddressSelect(item.roadaddress) || '현재 주소 정보가 비어 있어요. 확인 중입니다.'}
                />
              )
          }
        </div>
      </div>

      <div className='home-photomenu'>
        <HomeContTop 
        homecontTitle={'꼭 남겨야 할 인생샷 스팟 '} homecontEmoji={'📸'} 
        to={'/community'} state={{setSelectedTab: 1}}
        onClick={()=>photoClick('top', {})}/>
        
        {isPopupOpen && (
          <Btn2Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} type={'login'} 
          onConfirm={() => navigate('/login')}/>
        )}

        <div className='photoswiper-wrapper'>
          <Swiper
          slidesPerView={'auto'}
          spaceBetween={10}
          className="mySwiper photoSwiper"
          >
            {
              imgPost.map((item, i)=>
                <SwiperSlide key={i}>
                  <HomePhoto className={'home-photo'} to={`/community/cmdetail/${item.post.id.toString()}`} img={item} state={{setSelectedTab: 1}} onClick={()=>{ if(item.post){photoClick('photo', item.post)}}}/>
                </SwiperSlide>
              )
            }
          </Swiper>
        </div>
      </div>
      
      <div className='home-peoplemenu'>
        <HomeContTop homecontTitle={'언제 가장 많이 왔을까? '} homecontEmoji={'✈️'} showMore={false}/>
        <div className='home-people-text'>
          <p><img src="/imgs/home_trippeople_02.png" alt="" /></p>
          <div className='home-people-q'>
            <span>지난</span>
            <div className='home-people-input' onClick={()=>setMonth(true)}>
              <input type="text" value={selectedMonth || '선택'} placeholder='선택' readOnly/>
              <span className="arrow"></span>
            </div>
            <span>월에는</span>
            <span>이만큼이나 제주도를 방문했어요!</span>
          </div>
        </div>
        <div className='home-people-num'>
          <p><img src="/imgs/home_trippeople_01.png" alt="" /></p>
          <span>※ 2024년 기준</span>
          {
            selectedPeopleCount !== null ? (
              <MonthPeople count={selectedPeopleCount}/>
            ) : (
              <b>0</b>
            )
          }
        </div>
        {month && <div className="month-overlay" onClick={()=>setMonth(false)}/>}
        <PopupAction className={'home-month-popup-action'} useState={month}>
          <Month onComplete={(month)=>{
            setSelectedMonth(month);
            setMonth(false);}}
            onClose={()=>setMonth(false)}/> 
        </PopupAction>
      </div>

      <footer className='footer'>
        <b>(주)떠나봅서</b>
        <p>통신판매업 신고번호 2025-0000-0000 <br />
          서울시 강남구 테헤란로 000 <br />
          고객센터 1588-0000 <br />
          (주)떠나봅서는 통신판매중개자로서 통신판매의 당사자가 아니며  <br />
          상품 거래정보 및 거래 등에 대한 책임을 지지 않습니다.</p>
      </footer>

      <Top/>

    </div>
  )
}

export default Home