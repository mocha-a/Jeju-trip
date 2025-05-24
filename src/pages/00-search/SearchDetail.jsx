import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { shopNfoodNparty } from '../../api';
import DataLoading from '../../component/_common/DataLoading';
import SearchBar from '../../component/00-search/SearchBar';
import PlaceItem from '../../component/_common/PlaceItem';
import NoSearch from '../../component/_common/NoSearch';
import TagBtn from '../../component/_common/TagBtn';
import Search from '../../component/icons/Search';
import Top from '../../component/icons/Top';

import "../../styles/00-search/searchDetail.scss";

function SearchDetail() {
  const navigate = useNavigate();
  const {word} = useParams();
  const [loading, setLoading] = useState(true);
  const [tempInput, setTempInput] = useState(''); //검색어 입력중
  const [searchInput, setSearchInput] = useState(''); //검색한 단어 저장
  const [filteredData, setFilteredData] = useState([]); // 검색한 단어에 대한 데이터 저장
  const [listCount, setListCount] = useState(30); // 리스트 갯수 처음 30개만 보임
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    // window.scrollTo(0,0);
  },[])
  
  const excludeWords = ['호텔', '모텔', '병원', '펫', '요가', '필라테스'];

  const tourList = shopNfoodNpartyData?.tour || [];
  const shoppingList = shopNfoodNpartyData?.shopping || [];
  const foodList = shopNfoodNpartyData?.food || [];
  const festivalList = shopNfoodNpartyData?.festival || [];

  const tourFilterList = tourList.filter(item=> !excludeWords.some(word => item.title?.includes(word)));

  useEffect(() => {
    const allData = [
      ...tourFilterList, 
      ...shoppingList, 
      ...foodList, 
      ...festivalList
    ];
    if (word && allData.length > 0) {
      setSearchInput(word);
      setTempInput(word);
      const result = allData.filter((item) =>
        item.title?.toLowerCase().includes(word.toLowerCase()) ||
        item.roadaddress?.toLowerCase().includes(word.toLowerCase()) ||
        item.tag?.toLowerCase().includes(word.toLowerCase())
      );
      setFilteredData(result);
      window.scrollTo(0, 0);
    }
  }, [word, tourList, shoppingList, foodList, festivalList]);

  const displayedData = selectedCategory === 'all' 
  ? filteredData 
  : filteredData.filter(item => {
      if (selectedCategory === 'tour') return item.contentscd?.label === '관광지';
      if (selectedCategory === 'food') return item.contentscd?.label === '음식점';
      if (selectedCategory === 'shopping') return item.contentscd?.label === '쇼핑';
      if (selectedCategory === 'festival') return item.contentscd?.label === '축제/행사';
      return true;
    });

  // 30개씩 보여주기
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

  // 컨텐츠 클릭했을 때 type값을 찾기 위한 거
  const getType = (label)=>{
    switch (label) {
      case '관광지':
        return 'tour';
      case '음식점':
        return 'food';
      case '쇼핑':
        return 'shopping';
      case '축제/행사':
        return 'festival';
    };
  }

  //TagBtn 클릭했을 때
  const tagCategoryClick = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 로딩 : 모든 데이터가 준비됐을 때 로딩 종료
  useEffect(() => {
    if (
      tourList.length > 0 &&
      shoppingList.length > 0 &&
      foodList.length > 0 &&
      festivalList.length > 0
    ) {
      setLoading(false);
    }
  }, [tourList, foodList, festivalList, shoppingList]);

  return (
    <div className='search-detail-page'>
      <div className='search-detail-top3'>
        <SearchBar showBackBtn={true} placeholder={"궁금해 제주?!"} submitbtn={<Search className={'search-btn'}/>} onClick={() => navigate(-1)}
        value={tempInput} onChange={(e)=>setTempInput(e.target.value)}
        onSubmit={(e)=>{
          e.preventDefault();
          if (!tempInput.trim()) return; // 빈 값 방지
          navigate(`/search/searchdetail/${encodeURIComponent(tempInput)}`);
        }}/>

        <div className='search-word-all'>
          <h3>{searchInput} {filteredData.length}</h3>
        </div>
        <div className='search-word-label'>
          <TagBtn tagbtn={`전체 ${filteredData.length}`} onClick={() => tagCategoryClick('all')} isActive={selectedCategory === 'all'}/>
          <TagBtn tagbtn={`관광지 ${filteredData.filter(item => item.contentscd?.label === '관광지').length}`} onClick={() => tagCategoryClick('tour')} isActive={selectedCategory === 'tour'}/>
          <TagBtn tagbtn={`맛집 ${filteredData.filter(item => item.contentscd?.label === '음식점').length}`} onClick={() => tagCategoryClick('food')} isActive={selectedCategory === 'food'}/>
          <TagBtn tagbtn={`축제&행사 ${filteredData.filter(item => item.contentscd?.label === '축제/행사').length}`} onClick={() => tagCategoryClick('festival')} isActive={selectedCategory === 'festival'}/>
          <TagBtn tagbtn={`쇼핑 ${filteredData.filter(item => item.contentscd?.label === '쇼핑').length}`} onClick={() => tagCategoryClick('shopping')} isActive={selectedCategory === 'shopping'}/>
        </div>
      </div>

      {
        loading ? (
          <DataLoading className={'search-detail-loading'}/>
        ) : (
          <div className='searchDetail-item'>
            {
              displayedData.length>0 ? (
                displayedData.slice(0, listCount).map((item)=>
                <div key={item.contentsid} onClick={()=>{
                  const contentType = getType(item.contentscd?.label);
                  navigate(`/trip/triplist/${contentType}/tripdetail/${item.contentsid}`)
                }}>
                  <PlaceItem imgpath={item.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_big_02.png'} title={item.title} roadaddress={item.roadaddress || '현재 주소 정보가 비어 있어요. 확인 중입니다.'} tag={item.tag} heartType={"none"}/>
                </div>
              )) : (
                <NoSearch className={'search-nodata'}/>
              )
            }
          </div>
        )
      }

      <Top/>
    </div>
  )
}

export default SearchDetail