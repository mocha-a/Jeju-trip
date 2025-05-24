import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { shopNfoodNparty } from '../../api';
import DataLoading from '../../component/_common/DataLoading';
import TripContTop from '../../component/02-trip/TripContTop';
import TripSilde from '../../component/02-trip/TripSilde';

import "../../styles/02-trip/trip.scss";

function Trip() {
  
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const type = pathParts[3]; // 항상 이 위치가 type임

  const {shopNfoodNpartyData, fetchCategory} = shopNfoodNparty();
  // api호출로 받아오는 데이터, 데이터를 가져오는 액션 함수
    useEffect(()=>{
      fetchCategory('c1'); //관광지
      fetchCategory('c2'); //쇼핑
      fetchCategory('c4'); //맛집
      fetchCategory('c5'); //축제행사
      window.scrollTo(0,0);
    },[])
  
  const tourList = shopNfoodNpartyData.tour;
  const shoppingList = shopNfoodNpartyData.shopping;
  const foodList = shopNfoodNpartyData.food;
  const festivalList = shopNfoodNpartyData.festival;

  const [tripTour, setTripTour] = useState([]); // 트립메인에서 여행지 부분 랜덤값 뽑기
  const [tripFood, setTripFood] = useState([]); // 트립메인에서 맛집 부분 랜덤값 뽑기
  const [tripFestival, setTripFestival] = useState([]); // 트립메인에서 축제 부분 랜덤값 뽑기
  const [tripShopping, setTripShopping] = useState([]); // 트립메인에서 쇼핑 부분 랜덤값 뽑기

  // 트립투어 로컬스토리지 저장, 하루시간 설정 후 삭제되게 함
  useEffect(()=>{
    if (tourList && tourList.length > 0) {
      const saveTour = localStorage.getItem('tripTour'); //-> 문자열(쿠키는 원래 문자열만 저장 가능)
      const now = new Date().getTime(); //현재 시간
      const oneDay = 24 * 60 * 60 * 1000; //24시간=86400000ms

      if (saveTour) {
        try {
          const parsedTour = JSON.parse(saveTour); //저장된 값이 있으면 문자열을 객체로 변경
          const { tripmainTour, createdAt } = parsedTour; // createdAt 저장 시간이 지났는지 확인하는 용
          
          const isValidTime = createdAt && now - createdAt < oneDay; // 저장시간이 24시간 이내인지 확인 (현재시간-저장시간)
          // const hasValidData = Array.isArray(slice) && slice.length > 0 && slice[0]?.contents_id; //오류방지용
          
          if (isValidTime && tripmainTour?.length > 0) { // tripmainTour가 없을 경우를 대비해  && tripmainTour?.length > 0 넣음
            // ⏳ 아직 하루 안 지났음 → 유효
            setTripTour(tripmainTour); // 랜덤으로 하나 뽑아서 저장
            return;
          } else {
            // 하루 지남 → 제거
            localStorage.removeItem('tripTour');
          }
        } catch (e) {
          console.error("로컬스토리지 파싱 오류", e);
          localStorage.removeItem('tripTour');
        }
      }

      const excludeWords = ['호텔', '모텔', '병원', '펫', '요가', '필라테스'];
      const filterTourlist = tourList.filter(item=> !excludeWords.some(word => item.title?.includes(word)));

      // 여기로 오면 유효한 로컬스토리지 없고 새로 랜덤 생성
        const copyTourList = [...filterTourlist].sort(() => Math.random() - 0.5); // 배열을 랜덤하게 섞기 위해 sort함수에 넣어서 사용, 0-1사이 값을 주는데 -0.5를 하면 음수(앞으로) 양수(뒤로)값을 가지게 되어 순서가 바뀐다
        const sliceTour = copyTourList.slice(0, 5);
        setTripTour(sliceTour);
        const createdAt = new Date().getTime(); //현재 시각ms
        localStorage.setItem('tripTour', JSON.stringify({tripmainTour: sliceTour, createdAt})); // sliceTour은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
      }
  }, [tourList]);

  // 트립푸드 로컬스토리지 저장, 하루시간 설정 후 삭제되게 함
  useEffect(()=>{
    if (foodList && foodList.length > 0) {
      const saveFood = localStorage.getItem('tripFood'); //-> 문자열(쿠키는 원래 문자열만 저장 가능)
      const now = new Date().getTime(); //현재 시간
      const oneDay = 24 * 60 * 60 * 1000; //24시간=86400000ms

      if (saveFood) {
        try {
          const parsedFood = JSON.parse(saveFood); //저장된 값이 있으면 문자열을 객체로 변경
          const { tripmainFood, createdAt } = parsedFood; // createdAt 저장 시간이 지났는지 확인하는 용
          
          const isValidTime = createdAt && now - createdAt < oneDay; // 저장시간이 24시간 이내인지 확인 (현재시간-저장시간)
          // const hasValidData = Array.isArray(slice) && slice.length > 0 && slice[0]?.contents_id; //오류방지용
          
          if (isValidTime && tripmainFood?.length > 0) { // tripmainFood가 없을 경우를 대비해  && tripmainFood?.length > 0 넣음
            // ⏳ 아직 하루 안 지났음 → 유효
            setTripFood(tripmainFood); // 랜덤으로 하나 뽑아서 저장
            return;
          } else {
            // 하루 지남 → 제거
            localStorage.removeItem('tripFood');
          }
        } catch (e) {
          console.error("로컬스토리지 파싱 오류", e);
          localStorage.removeItem('tripFood');
        }
      }
      // 여기로 오면 유효한 로컬스토리지 없고 새로 랜덤 생성
        const copyFoodList = [...foodList].sort(() => Math.random() - 0.5); // 배열을 랜덤하게 섞기 위해 sort함수에 넣어서 사용, 0-1사이 값을 주는데 -0.5를 하면 음수(앞으로) 양수(뒤로)값을 가지게 되어 순서가 바뀐다
        const sliceFood = copyFoodList.slice(0, 5);
        setTripFood(sliceFood);
        const createdAt = new Date().getTime(); //현재 시각ms
        localStorage.setItem('tripFood', JSON.stringify({tripmainFood: sliceFood, createdAt})); // sliceFood은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
      }
  }, [foodList]);

  // 트립페스티벌 로컬스토리지 저장, 하루시간 설정 후 삭제되게 함
  useEffect(()=>{
    if (festivalList && festivalList.length > 0) {
      const saveFestival = localStorage.getItem('tripFestival'); //-> 문자열(쿠키는 원래 문자열만 저장 가능)
      const now = new Date().getTime(); //현재 시간
      const oneDay = 24 * 60 * 60 * 1000; //24시간=86400000ms

      if (saveFestival) {
        try {
          const parsedFestival = JSON.parse(saveFestival); //저장된 값이 있으면 문자열을 객체로 변경
          const { tripmainFestival, createdAt } = parsedFestival; // createdAt 저장 시간이 지났는지 확인하는 용
          
          const isValidTime = createdAt && now - createdAt < oneDay; // 저장시간이 24시간 이내인지 확인 (현재시간-저장시간)
          // const hasValidData = Array.isArray(slice) && slice.length > 0 && slice[0]?.contents_id; //오류방지용
          
          if (isValidTime && tripmainFestival?.length > 0) { // tripmainFestival이 없을 경우를 대비해  && tripmainFestival?.length > 0 넣음
            // ⏳ 아직 하루 안 지났음 → 유효
            setTripFestival(tripmainFestival); // 랜덤으로 하나 뽑아서 저장
            return;
          } else {
            // 하루 지남 → 제거
            localStorage.removeItem('tripFestival');
          }
        } catch (e) {
          console.error("로컬스토리지 파싱 오류", e);
          localStorage.removeItem('tripFestival');
        }
      }
      // 여기로 오면 유효한 로컬스토리지 없고 새로 랜덤 생성
        const copyFestivalList = [...festivalList].sort(() => Math.random() - 0.5); // 배열을 랜덤하게 섞기 위해 sort함수에 넣어서 사용, 0-1사이 값을 주는데 -0.5를 하면 음수(앞으로) 양수(뒤로)값을 가지게 되어 순서가 바뀐다
        const sliceFestival = copyFestivalList.slice(0, 5);
        setTripFestival(sliceFestival);
        const createdAt = new Date().getTime(); //현재 시각ms
        localStorage.setItem('tripFestival', JSON.stringify({tripmainFestival: sliceFestival, createdAt})); // sliceFood은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
      }
  }, [festivalList]);

  // 트립쇼핑 로컬스토리지 저장, 하루시간 설정 후 삭제되게 함
  useEffect(()=>{
    if (shoppingList && shoppingList.length > 0) {
      const saveShopping = localStorage.getItem('tripShopping'); //-> 문자열(쿠키는 원래 문자열만 저장 가능)
      const now = new Date().getTime(); //현재 시간
      const oneDay = 24 * 60 * 60 * 1000; //24시간=86400000ms

      if (saveShopping) {
        try {
          const parsedShopping = JSON.parse(saveShopping); //저장된 값이 있으면 문자열을 객체로 변경
          const { tripmainShopping, createdAt } = parsedShopping; // createdAt 저장 시간이 지났는지 확인하는 용
          
          const isValidTime = createdAt && now - createdAt < oneDay; // 저장시간이 24시간 이내인지 확인 (현재시간-저장시간)
          // const hasValidData = Array.isArray(slice) && slice.length > 0 && slice[0]?.contents_id; //오류방지용
          
          if (isValidTime && tripmainShopping?.length > 0) { // tripmainShopping이 없을 경우를 대비해  && tripmainShopping?.length > 0 넣음
            // ⏳ 아직 하루 안 지났음 → 유효
            setTripShopping(tripmainShopping); // 랜덤으로 하나 뽑아서 저장
            return;
          } else {
            // 하루 지남 → 제거
            localStorage.removeItem('tripShopping');
          }
        } catch (e) {
          console.error("로컬스토리지 파싱 오류", e);
          localStorage.removeItem('tripShopping');
        }
      }
      // 여기로 오면 유효한 로컬스토리지 없고 새로 랜덤 생성
        const copyShoppingList = [...shoppingList].sort(() => Math.random() - 0.5); // 배열을 랜덤하게 섞기 위해 sort함수에 넣어서 사용, 0-1사이 값을 주는데 -0.5를 하면 음수(앞으로) 양수(뒤로)값을 가지게 되어 순서가 바뀐다
        const sliceShopping = copyShoppingList.slice(0, 5);
        setTripShopping(sliceShopping);
        const createdAt = new Date().getTime(); //현재 시각ms
        localStorage.setItem('tripShopping', JSON.stringify({tripmainShopping: sliceShopping, createdAt})); // sliceFood은 배열이니까 쿠키에 직접 저장이 되지 않아 문자열로 변경하여 저장
      }
  }, [shoppingList]);

  // 로딩 : 모든 데이터가 준비됐을 때 로딩 종료
  useEffect(() => {
    if (
      tripTour.length > 0 &&
      tripFood.length > 0 &&
      tripFestival.length > 0 &&
      tripShopping.length > 0
    ) {
      setLoading(false); // 모든 데이터가 준비됐으면 로딩 종료
    }
  }, [tripTour, tripFood, tripFestival, tripShopping]);

  return (
    <div className='trip-mainpage'>
      <h2 className='trip-main-title'> Trip </h2>

        {
          loading ? (
            <DataLoading className={'trip-main-loading'}/>
          ) : (
            <>
              <TripContTop triplink={'/trip/triplist/tour'} tripcontTitle={'제주 여행 트렌드를 한눈에!'} tripcontText={'핫플부터 숨은 명소까지'}/>
              <TripSilde slidedata={tripTour || []} detailurl={'/trip/triplist/tour/tripdetail'}/> 
              {/* || [] 사용은 state상태가 있을 때만 넘기기 */}
              
              <TripContTop triplink={'/trip/triplist/food'} tripcontTitle={'제주도민이 인정한 맛집'} tripcontText={'맛 따라 떠나는 제주'}/>
              <TripSilde slidedata={tripFood || []} detailurl={'/trip/triplist/food/tripdetail'}/> 
              
              <TripContTop triplink={'/trip/triplist/festival'} tripcontTitle={'놓치면 아쉬운 축제&행사'} tripcontText={'지금 주목해야 할 제주'}/>
              <TripSilde slidedata={tripFestival || []} detailurl={'/trip/triplist/festival/tripdetail'}/> 
              
              <TripContTop triplink={'/trip/triplist/shopping'} tripcontTitle={'감성가득! 소품샵&갤러리'} tripcontText={'특별한 감성 공간'}/>
              <TripSilde slidedata={tripShopping || []} detailurl={'/trip/triplist/shopping/tripdetail'}/> 
            </>
          )
        }

    </div>
  )
}

export default Trip