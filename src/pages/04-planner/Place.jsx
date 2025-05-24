import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { mode } from '../../api';

import PlannerLike from '../../component/04-planner/search/PlannerLike';
import Category from '../../component/04-planner/search/Category';
import TabPage from '../../component/_common/TabPage';
import Arrow from '../../component/icons/Arrow';
import Top from '../../component/icons/Top';

import "../../styles/04-planner/place.scss";

function Place() {
    // selectedTab 이용해서 탭 별 내용 넣으세요,,,! Activity.jsx 참고
    const { enterEditMode } = mode();
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();

    useEffect(()=>{
        enterEditMode()
    },[])

    return (
        <>
        <div className='planner_place'>
        <div className='Place_back'><Arrow className={'header-back'} onClick={()=>{navigate(-1); enterEditMode()}}/></div>
        <TabPage type={'plan'} onTabChange={setSelectedTab}/>
        {
        selectedTab === 0 ?
        // 지역별
        <Category selectedTab={selectedTab}/>
        :
        // 좋아요
        <PlannerLike selectedTab={selectedTab}/>
        }
        </div>
        <Top/>
        </>
    )
}

export default Place