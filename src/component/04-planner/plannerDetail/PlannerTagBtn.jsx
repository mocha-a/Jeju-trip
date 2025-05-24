import { NavLink } from 'react-router-dom';
import { mode } from '../../../api';
import TagBtn from '../../_common/TagBtn';

function PlannerTagBtn({id, checkData, checkListId, setIsPopupOpenDelete, setIsPopupOpenCheckList, setIsPopupOpenPickPlan }) {
    const { isEditMode } = mode();

    return (
    <div className='planner_tagbtn'>
        { checkData.filter(item=>item.planId == id).length==1 &&
        <NavLink
        onClick={(e) => {
            if (isEditMode) {
                e.preventDefault();
                setIsPopupOpenCheckList(true);
            } else {
                checkListId();
            }
        }}>
            <TagBtn tagbtn={"체크리스트"}/></NavLink>
        }
        <NavLink
        to={isEditMode ? undefined : "/planner/pickplan"}
        onClick={(e) => {
            if (isEditMode == true) {
                e.preventDefault();
                setIsPopupOpenPickPlan(true);
            }}}>
        <TagBtn tagbtn={"추천 일정 보러가기"}/>
        </NavLink>

        <button onClick={() => {setIsPopupOpenDelete(true);}}><TagBtn tagbtn={"전체 일정 삭제"}/></button>
    </div>

    )
}

export default PlannerTagBtn
