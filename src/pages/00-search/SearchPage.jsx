import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DataLoading from '../../component/_common/DataLoading'
import SearchBar from '../../component/00-search/SearchBar'
import Ranking from '../../component/00-search/Ranking'
import TagBtn from '../../component/_common/TagBtn'
import Search from '../../component/icons/Search'

import "../../styles/00-search/searchPage.scss";

function SearchPage() {
  const [loading, setLoading] = useState(true); // 데이터 로딩
  const [keywordLoading, setKeywordLoading] = useState(true); // 데이터 로딩
  const [tagLoading, setTagLoading] = useState(true); // 데이터 로딩
  const [keywords, setKeywords] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const wordClick = (word)=>{
    navigate(`/search/searchdetail/${encodeURIComponent(word)}`) //encodeURIComponent(word)는 띄어쓰기나 특수문자가 있을 경우 대비하여 인코딩해줌
  }

  useEffect(()=>{
    const fetchKeywords = ()=>{
      axios.get('https://api.odcloud.kr/api/15049993/v1/uddi:04795979-fd51-411e-ad41-95a559b706eb',{
        params: {
          serviceKey:'UO/VNFIHUBaYIX80pdY4xpWRnNWmKO89qSyEZrhhwobVU599onCKVvNnb0jHHcbQiQ1qcLqZWP21BSzibjqC4Q=='
        },
      })
      .then((res)=>{
        const spacing = res.data.data.map(item =>({
          ...item, 단어: item.단어.replace(/\s/g, '')
        }))
        setKeywords(spacing)
      })
      .catch((error) => {
        console.error("인기 검색어 불러오기 실패", error);
      })
      .finally(() => {
        setKeywordLoading(false);
      });
    };
    fetchKeywords();
  },[])

  useEffect(()=>{
    const fetchTags = ()=>{
      axios.get('https://api.odcloud.kr/api/15049992/v1/uddi:ab253c7b-3e49-40e5-b8bb-f8a925519d1d',{
        params: {
          serviceKey:'NICVW7+M1Rr/a14RcX1kdhmFrvGCRRK+b6XJJjagnrepPxv+OcjSflrZ9YEkBQKG6wBcoUNyMLi32eC//h81fg=='
        },
      })
      .then((res)=>{
        setTags(res.data.data)
      })
      .catch((error) => {
        console.error("인기 태그 불러오기 실패", error);
      })
      .finally(() => {
        setTagLoading(false);
      });
    };
    fetchTags();
  },[])

  useEffect(()=>{
    if(!keywordLoading && !tagLoading){
      setLoading(false);
    }
  },[keywordLoading, tagLoading])

  if(loading){
    return (
      <div className='search-loading-contain'>
        <DataLoading className={'search-loading'}/>
      </div>
    )
  }
  return (
    <div className='search-page'>
      <SearchBar showBackBtn={true} placeholder={"궁금해 제주?!"} submitbtn={<Search className={'search-btn'}/>} onClick={() => navigate(-1)}
      value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}
      onSubmit={(e)=>{
        e.preventDefault();
        if (searchInput.trim()) {
          wordClick(searchInput);
        }
      }}/>



      <div className='pop-search'>
        <h2>인기 검색어</h2>
        <div className='popSearch-cont'>
          <span>
            {
              keywords.slice(0,5).map((item)=>
                <Ranking key={item.일련번호} rank={item.정렬순서} word={item.단어} onClick={()=>wordClick(item.단어)}/>
            )
            }
          </span>
          <span>
            {
              keywords.slice(5,10).map((item)=>
                <Ranking key={item.일련번호} rank={item.정렬순서} word={item.단어} onClick={()=>wordClick(item.단어)}/>
            )
            }
          </span>
        </div>
      </div>

      <div className='pop-tags'>
        <h2>인기 태그</h2>
        <div className='popTags-cont'>
          {
            tags.map((item)=>
              <TagBtn className={'search-tagbtn'} key={item.일련번호} tagbtn={item.태그명} onClick={()=>wordClick(item.태그명)}/>
            )
          }
        </div>
      </div>

    </div>
  )
}

export default SearchPage