import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { format, parse } from 'date-fns'
import { ko } from 'date-fns/locale'
import { mode, plan } from '../../api'
import axios from 'axios'

import CalendarPopup from '../../component/04-planner/calendar/CalendarPopup'
import PlannerTagBtn from '../../component/04-planner/plannerDetail/PlannerTagBtn'
import PlannerTicket from '../../component/04-planner/plannerDetail/PlannerTicket'
import PlannerTitle from '../../component/04-planner/plannerDetail/PlannerTitle'
import WeatherDays from '../../component/04-planner/weather/WeatherDays'
import PlannerDay from '../../component/04-planner/plannerDetail/PlannerDay'
import Btn2Popup from '../../component/popups/Btn2Popup'
import Btn1Popup from '../../component/popups/Btn1Popup'
import Button from '../../component/_common/Button'
import Close from '../../component/icons/Close'
import Top from '../../component/icons/Top'

import "../../styles/04-planner/plannerDetail.scss";

function PlannerDetail() {
    const { planData, fetchPlanData, newPlan, updatePlan, removePlan, setPlanData } = plan();
    const { enterEditMode, exitEditMode, isEditMode } = mode();
    const { id } = useParams(); // url에서 id 가져오기

    const userId = String(JSON.parse(sessionStorage.getItem('user'))?.id);
    const searchListItem = JSON.parse(localStorage.getItem('searchListItem'));
    const allDays = JSON.parse(localStorage.getItem('allDays'));
    const edit = JSON.parse(localStorage.getItem('edit'));

    const location = useLocation();
    const navigate = useNavigate();

    const [eTitle, setETitle] = useState(""); //input에 입력하는 임시 값
    const [tripDay, setTripDay] = useState([]); // 실제 화면에 보여지는 날짜
    const [calendar, setCalendar] = useState(false); //캘린더 열고 닫고
    const [isEdit, setIsEdit] = useState(location.state?.isEdit ?? false); //캘린더에서 받아 온 값
    const [isPopupOpenDelete, setIsPopupOpenDelete] = useState(false) //삭제 팝업
    const [isPopupOpenSave, setIsPopupOpenSave] = useState(false) //저장 팝업
    const [isPopupOpenExit, setIsPopupOpenExit] = useState(false) //수정 중 나가기 팝업
    const [isPopupOpenCheckList, setIsPopupOpenCheckList] = useState(false)
    const [isPopupOpenPickPlan, setIsPopupOpenPickPlan] = useState(false)
    const [checkData, setCheckData] = useState([]) //수정 중 나가기 팝업

    const ticketDate = tripDay?.map(day =>
        format(parse(day, 'yyyy.MM.dd', new Date()), 'M.d/eee', { locale: ko })
    );
    console.log(location.state);
    
    useEffect(()=>{
        window.scrollTo(0, 0);
        if(edit){
            enterEditMode()
            localStorage.removeItem('edit');
        }
    },[])

    useEffect(() => {
        if (isEdit === true && !searchListItem) {
            const { isEdit, ...rest } = location.state;
            setPlanData(rest);
            enterEditMode(); // isEditMode를 true로 변경하는 함수
        }
        else if (isEditMode === false || isEditMode === null) {
            exitEditMode();
            fetchPlanData(userId, id);
        }
    }, [userId, id, location?.state, isEditMode]);

    useEffect(() => {
        if (planData?.date){
            setTripDay(planData.date);
            if(allDays){
                setTripDay(allDays)
            }
        }
        if (planData?.title) setETitle(planData.title);
    }, [planData?.date, calendar]);
    
    useEffect(() => {
        if(eTitle){
            localStorage.setItem(`editTitle-${id}`, eTitle);
        }
    }, [eTitle]);

    useEffect(() => {
        const savedTitle = localStorage.getItem(`editTitle-${id}`);
        if (savedTitle) {
            setETitle(savedTitle);
        } else {
            setETitle(planData?.title);
        }
    }, [planData]);
    
    // 기존 여행 일정 수정
    function updateCheckData(newList) {
        updatePlan(userId, newList)
    .catch(err => {
        alert('수정에 실패했습니다.');
    });
}

// 데이터 변경사항 확인하여 팝업 발생 관리
async function openSavePopup() {
        const isDataChanged = planData?.item?.days?.length
        
        const newData = {
            ...planData,
            title: eTitle,
            date: tripDay
        };

        if(isDataChanged) {
            setIsPopupOpenSave(true);
            
        if (location.state?.isEdit !== true) {
            // 기존 체크리스트일 경우 PUT
            updateCheckData(newData);
            localStorage.removeItem('allDays');
            localStorage.removeItem(`editTitle-${id}`);
            exitEditMode();
        } else {
            // 새 체크리스트일 경우 POST
            localStorage.removeItem('allDays');
            localStorage.removeItem(`editTitle-${id}`);
            await newPlan(userId, newData);
            setIsEdit(false)
            exitEditMode();
            
        }
        }
    }

    // 편집 모드 나가기
    function handleClose() {
        if(isEditMode == true || location.state?.isEdit == true) {
            setIsPopupOpenExit(true);
        } else {
            exitEditMode();
            setIsEdit(false)
            navigate(-1)
        }
    }

    //이건 체크리스트 데이터 비교하려면 필요행
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_APIURL}/check/user/${userId}`)
        .then(res=>{
            setCheckData(res.data);
        })
    },[])

    // 체크리스트 데이터 가져와서 링크 넘겨주기
    function checkListId () {
        axios.get(`${process.env.REACT_APP_APIURL}/check/user/${userId}`)
        .then(res=>{
            setCheckData(res.data);
            checkData.forEach(item => {
                if(id == item?.planId){
                    navigate(`/my/checklist/checkDetail/${item?.id}`);
                }
            })
        })
    }
        
    return (
        <div className='planner_detail' style={{padding:"92px 0"}}>
            <div className='weather_content'>
                <h2>제주시 날씨는</h2>
                <WeatherDays/>
            </div>
            {isEditMode ?(
            <> {/* 편집모드 */}
            <div className='checkdetail-icon-close' onClick={handleClose}><Close/></div>
            <div className='planner_content'>
                <PlannerTitle eTitle={eTitle} setETitle={setETitle} />
                <PlannerDay setCalendar={setCalendar} tripDay={tripDay} setTripDay={setTripDay}/>
                {calendar && <div className="overlay"/>}
                <CalendarPopup calendar={calendar} setCalendar={setCalendar}/>
                <PlannerTagBtn 
                    id={id} 
                    userId={userId} 
                    checkData={checkData} 
                    setCheckData={setCheckData} 
                    checkListId ={checkListId}
                    setIsPopupOpenDelete={setIsPopupOpenDelete} 
                    setIsPopupOpenCheckList={setIsPopupOpenCheckList}
                    setIsPopupOpenPickPlan={setIsPopupOpenPickPlan}
                />
                <PlannerTicket tripDay={tripDay} ticketDate={ticketDate}/>
            </div>
            <button onClick={()=>{
                    if(isEditMode == true){
                        openSavePopup()
                        localStorage.removeItem('searchListItem')
                        exitEditMode();
                    }else{
                        exitEditMode();
                    }
                }}
                className='cardbtn'
            >
                    <Button btn={"전체 일정 저장하기"} className={"planner_save"}/>
            </button>
            </>
            ):(
            <> {/* 읽기모드 */}
            <div className='planner_content readonly'>
                <PlannerTitle eTitle={eTitle} setETitle={setETitle} planData={planData}/>
                <PlannerDay tripDay={tripDay} setTripDay={setTripDay}/>
                <PlannerTagBtn 
                    id={id} 
                    userId={userId} 
                    checkData={checkData} 
                    setCheckData={setCheckData} 
                    checkListId ={checkListId}
                    setIsPopupOpenDelete={setIsPopupOpenDelete}
                    setIsPopupOpenCheckList={setIsPopupOpenCheckList}
                    setIsPopupOpenPickPlan={setIsPopupOpenPickPlan}
                />
            <PlannerTicket tripDay={tripDay} ticketDate={ticketDate}/>
            </div>
            </>
        )}

        <Btn1Popup //저장 안내 팝업
            isOpen={isPopupOpenSave} 
            setIsOpen={setIsPopupOpenSave} type={"save"}
            onConfirm={() => {
                if(location.state?.isEdit){
                    navigate(`/planner`);
                }else{
                    setIsPopupOpenSave(false);
                }
            }}
        />
        <Btn2Popup //수정 중 나가기 팝업
            isOpen={isPopupOpenExit}
            setIsOpen={setIsPopupOpenExit}
            type={"exit"}
            onConfirm={() => {
                if(location.state?.isEdit == true){
                    exitEditMode();
                    setIsEdit(false);
                    navigate(-1);
                }else{
                    setIsPopupOpenExit(false)
                    exitEditMode();
                }
                localStorage.removeItem('searchListItem');
            }}
            onCancel={()=>{localStorage.removeItem('searchListItem');}}
        />
        <Btn2Popup //삭제 안내 팝업
            isOpen={isPopupOpenDelete}
            setIsOpen={setIsPopupOpenDelete}
            type={"delete"}
            onConfirm={() => {
                removePlan(id, userId)
                navigate(`/planner`)
                setIsPopupOpenDelete(false)
            }}
        />
        <Btn2Popup //수정 중 체크리스트 팝업
            isOpen={isPopupOpenCheckList}
            setIsOpen={setIsPopupOpenCheckList}
            type={"exit"}
            onConfirm={() => {
                setIsPopupOpenCheckList(false)
                checkListId();
                localStorage.removeItem('searchListItem');
            }}
        />
        <Btn2Popup //수정 중 추천일정 팝업
            isOpen={isPopupOpenPickPlan}
            setIsOpen={setIsPopupOpenPickPlan}
            type={"exit"}
            onConfirm={() => {
                setIsPopupOpenPickPlan(false)
                navigate(`/planner/pickplan`);
                localStorage.removeItem('searchListItem');
                exitEditMode();
            }}
            onCancel={()=>{localStorage.removeItem('searchListItem');}}
        />
        <Top/>
        </div>
    )
}

export default PlannerDetail
