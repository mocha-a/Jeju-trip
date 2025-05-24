import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { plan, shopNfoodNparty } from '../../../api';
import Button from '../../_common/Button';
import NoSearch from '../../_common/NoSearch';
import DataLoading from '../../_common/DataLoading';
import Btn1Popup from '../../popups/Btn1Popup';
import CategoryItem from './CategoryItem'
import SearchItem from './SearchItem';

function Category({selectedTab}) {
    const { searchData } = plan();
    const { shopNfoodNpartyData, fetchCategory } = shopNfoodNparty()
    const [selectedBtn, setSelectedBtn] = useState(false); //선택 완료 버튼
    const [citySelect, setcitySelect] = useState(''); //제주 선택
    const [catSelect, setCatSelect] = useState(''); //카테고리 선택
    const [searchListItem, setSearchListItem] = useState([]); //검색 결과 선택 (input)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listCount, setListCount] = useState(30); // 리스트 갯수 처음 30개만 보임
    
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/").filter(Boolean)
    const idx = path[4]

    //새로고침 절대 못해
    useEffect(() => {
        const blockKey = (e) => {
            if ((e.key === 'F5') || (e.ctrlKey && e.key === 'r')) {
            e.preventDefault();
            }
        };

        window.addEventListener('keydown', blockKey);

        return () => {
            window.removeEventListener('keydown', blockKey);
        };
    }, []);
    
    const checkbox = (item) => {
        const selectList = {
            "contents_id": item.contentsid,
            "contents_label": item.contentscd.label,
            "title": item.title,
            "road_address": item.roadaddress,
            "introduction": item.introduction,
            "latitude": item.latitude,
            "longitude": item.longitude
            }
            setSearchListItem((prev) => {
                const exists = prev.some((i) => i.contents_id === item.contentsid);
            
                return exists
                    ? prev.filter((i) => i.contents_id !== item.contentsid) // 체크 해제
                    : [...prev, selectList]; // 체크
            });
    }

    const search = {
        "제주시" : ["구좌", "애월", "우도", "제주시내", "조천", "추자도", "한경", "한림"],
        "서귀포시" : ["가파도", "남원", "대정", "마라도", "서귀포시내", "성산", "안덕", "중문", "표선"],
        "카테고리" : ["관광지", "맛집", "축제&행사", "쇼핑"]
    }

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
    
    const shoppingList = shopNfoodNpartyData.shopping;
    const foodList = shopNfoodNpartyData.food;
    const festivalList = shopNfoodNpartyData.festival;
    const tourList = shopNfoodNpartyData.tour?.filter(item =>
        !item.title.includes('호텔') && !item.title.includes('모텔') && !item.title.includes('병원') && !item.title.includes('펫') && !item.title.includes('요가') && !item.title.includes('필라테스')
      ); //호텔, 모텔, 병원, 펫, 요가, 필라테스 단어 컨텐츠 제외

    const categoryList = {
        "관광지": tourList,
        "맛집": foodList,
        "축제&행사": festivalList,
        "쇼핑": shoppingList,
    };
    const List = categoryList[catSelect]?.filter((item) =>
        item.region2cd?.label?.includes(citySelect)
    );
    
    return (
    <div>
        {selectedBtn ? (
        <div className='place_search'>
            <div className='search_list_title'>
                <h3>{`${citySelect} / ${catSelect}`}</h3><span>{`${List.length}`}</span>
            </div>
            {loading ? (
            <DataLoading className={"searchLoading"}/>
            ) : ( /* 검색 결과 */
            List.length === 0 ? (
                <NoSearch />
            ) : (
                <>
                {List.slice(0, listCount).map(item => (
                    <SearchItem
                    key={item.contentsid}
                    item={item}
                    searchListItem={searchListItem}
                    checkbox={checkbox}
                    selectedTab={selectedTab}
                    />
                ))}
                </>
            )
            )}
        </div>
        ):(
        <> {/* 카테고리 선택 */}
        
        <div className='place_search'>
            <CategoryItem data={search} category="제주" title={["제주시", "서귀포시"]} onClick={(city)=>{setcitySelect(city)}}/>
            <CategoryItem data={search} category="카테고리" title={["카테고리"]} onClick={(cat)=>{setCatSelect(cat)}}/>
        </div>
        </>
        )}
        <div className='place_btn_fixed'>
            <button
            className='place_btn'
            onClick={() => {
                if (selectedBtn && searchListItem) {
                    localStorage.setItem('searchListItem', JSON.stringify(searchListItem))
                    searchData(searchListItem, idx);
                    navigate(-1)
                } else {
                    if(!citySelect || !catSelect){
                        setIsPopupOpen(true)
                    }else{
                        setSelectedBtn(true);
                    }
                }
            }}>
                <Button
                btn={selectedBtn? `선택 완료 / ${searchListItem.length}개` : "선택 완료"}
                className={"place_btn"}/></button>
        </div>

        <Btn1Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} type={"select"}/>
    </div>
    
    )
    
}

export default Category