import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { mode } from '../../../api';
import PlaceItem from '../../_common/PlaceItem'
import TagBtn from '../../_common/TagBtn'

function SearchItem({item, searchListItem, checkbox, selectedTab}) {
  const [checked, setChecked] = useState(false);
  const {exitEditMode}=mode();
  const navigate = useNavigate();

  let type;
  switch(item.contentscd.value){
    case 'c1' : type='tour'; break;
    case 'c2' : type='shopping'; break;
    case 'c4' : type='food'; break;
    case 'c5' : type='festival'; break;
  }

  return (
  <label>
    <input 
    className='search_input'
    type='checkbox' 
    checked={searchListItem.some(i => i.contents_id === item.contentsid)}
    onChange={() => {checkbox(item); setChecked((prev) => !prev)}}/>
        <div className='searchItem'>
          <div><TagBtn tagbtn={"선택"} className={"searchbtn"}/></div>
          <div onClick={()=>{exitEditMode(); navigate(`/trip/triplist/${type}/tripdetail/${item.contentsid}`); localStorage.setItem("edit", "true");}}>
            <PlaceItem
            ClassName={"planner_Like"}
            title={item.title}
            roadaddress={item.roadaddress || '주소 정보가 없습니다.'}
            tag={item.tag}
            imgpath={item.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'}
            heartType={ selectedTab === 0 ? null : 'red-fill'}
            />
          </div>
        </div>
  </label>
  )
}

export default SearchItem