import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { plan } from '../../api';
import axios from 'axios';

import PopupAction from '../../component/_common/PopupAction';
import DataLoading from '../../component/_common/DataLoading';
import ListPage from '../../component/_common/ListPage';
import NoPlan from '../../component/_common/NoPlan';
import Newpost from '../../component/icons/Newpost';
import Close from '../../component/icons/Close';
import Btn2Popup from '../../component/popups/Btn2Popup';
import Calendar from '../../component/04-planner/calendar/Calendar';

import "../../styles/04-planner/plannerList.scss";

function PlannerList() {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const userId = storedUser?.id;
    
    const { planData, PlanListData, removePlan } = plan();
    const [loading, setLoading] = useState(true);
    const [calendar, setCalendar] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [isDonePopupOpen, setIsDonePopupOpen] = useState(false);
    const [trashClick, setTrashClick] = useState({});
    const [deleteTarget, setDeleteTarget] = useState({ index: null, type: null });
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            setIsPopupOpen(true);
            return;
        }
        PlanListData(userId)
        .then((res) => {
            if (!res || res?.length === 0) {
              setCalendar(true); // 데이터 없으면 달력 열기
            } else {
              setCalendar(false); // 데이터 있으면 달력 닫기
            }
            setLoading(false);
        });
    }, [userId, successful]);

    const trash = (id) => {   
        setTrashClick((prev) => ({
          ...prev, // 기존 값 유지
          [id]: false, // 해당 id의 trash 상태만 false로 변경
        }));
        // 삭제 팝업 열고 삭제 대상 저장
        setDeleteTarget({ id });
    };

    //여행 일정리스트 삭제
    function deletePlanData() {
        const { id } = deleteTarget;
        const stingID = String(userId)
        if (id !== null) {
            removePlan(id, stingID);
            setTrashClick({});
            setSuccessful((prev) => !prev);
        }
    }

    function checkListDel () {
        const { id } = deleteTarget;
        const stingId = String(userId)
        
        if (id !== null) {
            axios.put(`${process.env.REACT_APP_APIURL}/check/plan/del`, { userId : stingId, planId: id })
            .catch(err => {
                console.error(err);
                alert('삭제에 실패했습니다.');
            });
        } else {
            console.log('No item to delete. deleteIndex is null');
        }
    }

    if(!loading){<DataLoading/>;}

    return (
        <div className='plannerList'>
            { userId &&
                <>
                { userId && planData?.length > 0 &&
                    <>
                    <ListPage
                        page={"plan"}
                        listData={planData}
                        trashClick={trashClick}
                        loading={loading}
                        trash={(id) => trash(id)}
                        onConfirm={() => {
                            deletePlanData();
                            checkListDel();
                            setIsDonePopupOpen(true); // 여기서 열기
                        }}
                        isDonePopupOpen={isDonePopupOpen}
                        setIsDonePopupOpen={setIsDonePopupOpen}
                        />
                        <div onClick={() =>{setCalendar(true)}} className='add-check-btn-wrap'>
                            <Newpost className={'add-check-btn'}/>
                        </div>
                    </>
                }
                { userId && planData?.length == 0 && 
                    <div className='listpage'>
                        <h2>나의 여행 보기</h2>
                        <NoPlan/>
                        <div onClick={() =>{setCalendar(true)}} className='add-check-btn-wrap'>
                            <Newpost className={'add-check-btn'}/>
                        </div>
                    </div>
                }
                    <>
                    {calendar && <div className="overlay"/>}
                    <PopupAction className={"calendar_popup"} useState={calendar}>
                    <div className="calendar_top">
                        <button onClick={()=>{setCalendar(false)}}><Close className={"calendar_close"}/></button>
                        <h2>여행 일정 등록</h2>
                    </div>
                    <div className="calendar_content"><Calendar type={'list'} btnName={"여행 준비 시작하기"}/></div>
                    </PopupAction>
                    </>
                </>
            }
            <Btn2Popup 
            isOpen={isPopupOpen} 
            setIsOpen={setIsPopupOpen} 
            type={"login"}  
            onConfirm={() => {
                navigate(`/login`)
                }}
            onCancel={()=>{
                navigate(-1)
                setIsPopupOpen(false)
            }}
            />
        </div>
    )
}

export default PlannerList
