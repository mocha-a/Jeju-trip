import { useEffect, useRef, useState } from 'react'
import { mode, plan } from '../../api';
import { addDays, format, parse } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ko } from 'date-fns/locale';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import TagBtn from '../../component/_common/TagBtn';
import Button from '../../component/_common/Button';
import Top from '../../component/icons/Top';
import Btn2Popup from '../../component/popups/Btn2Popup';
import PickPlanItem from '../../component/04-planner/PickPlanItem';

import "../../styles/04-planner/pickplan.scss";

function PickPlan() {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const userId = storedUser?.id;

    const { pinkPlanData, planData } = plan();
    const { nullMode, enterEditMode } = mode();
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataMap, setDataMap] = useState({});
    const [dates, setDates] = useState('');
    const [select, setSelect] = useState('');

    //parseInt() : 문자열에서 앞에 있는 숫자만 뽑아서 정수로 바꿔줌
    const nights = parseInt(dates);
    const days = nights + 1;
    const navigate = useNavigate();

    const button = []
    for(let i=1; i<=days; i++){
        button.push(i)
    }

    useEffect(() => {
        if (
            planData.length >= 5 &&
            planData[0]?.n1d2 &&
            planData[1]?.n2d3 &&
            planData[2]?.n3d4 &&
            planData[3]?.n4d5 &&
            planData[4]?.n5d6
        ) {
            const map = {
                "1days": planData[0].n1d2[0],
                "2days": planData[1].n2d3[0],
                "3days": planData[2].n3d4[0],
                "4days": planData[3].n4d5[0],
                "5days": planData[4].n5d6[0],
            };
            setDataMap(map);
        }
    }, [planData]);

    useEffect(()=>{
        pinkPlanData()
    }, [])

    const tagBtn = useRef([]);
    const scroll = (idx) => {
        const target = tagBtn?.current[idx];  // 이동할 대상 요소
        const targetOffsetTop = target.offsetTop;  // 해당 요소의 상단 위치

        window.scrollTo({
          top: targetOffsetTop -100,  // 해당 요소로 스크롤
          behavior: 'smooth',    // 부드러운 스크롤
        });
    };

    const handleChange = (e) => {
        setDates(e.target.value);
        setSelect(e.target.value);
        nullMode();
    };
    const generateId = () => {
        const datePart = Date.now().toString(36);
        const randPart = Math.random().toString(36).substring(2, 5);
        return `${datePart}${randPart}`;
    }
    
    function generateTitle(planData) {
    // 객체의 값들 중 title만 추출
    const titles = Object?.values(planData).map(item => item?.title);
    let i = 1;
    while (titles.includes(`추천 일정 ${i}`)) {
        i++;
    }
    return `추천 일정 ${i}`;
    }
    
    //일정 추가하러가기 버튼 눌렀을 때 실행 할 함수
    function handleNoPlan(dataMap) {
        const baseDate = new Date()
        const date = dataMap?.days?.map(item => {
            const date = addDays(baseDate, item.day - 1);
            return format(date, 'yyyy.MM.dd');
        });
        
        const newId = generateId();
        const title = generateTitle(planData);

        navigate(`/planner/plannerdetail/${newId}`, {
            //useLocation.state로 빈 배열 값 보내주기
            state: {
                isEdit: true,
                id: newId,
                title,
                date: date,
                item: {days: date.map((day, index) => ({
                    day: format(parse(day, 'yyyy.MM.dd', new Date()), 'M.d/eee', { locale: ko }),
                    plans: dataMap.days?.[index]?.plans || []
                }))},
            }
        });
    };
    



    return (
        <div className='pickplan_content'>
            <h2 className='pickplan_title'>몇 박으로 계획 중이세요?</h2>
            <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ mt: 2.5, mb: 2.5, minWidth: 120, zIndex: 999 }} size="small">
                <InputLabel id="trips">선택</InputLabel>
                <Select
                labelId="trips"
                id="demo-simple-select"
                value={dates}
                label="Age"
                onChange={handleChange}
                >
                <MenuItem value={"1days"}>1박 2일</MenuItem>
                <MenuItem value={"2days"}>2박 3일</MenuItem>
                <MenuItem value={"3days"}>3박 4일</MenuItem>
                <MenuItem value={"4days"}>4박 5일</MenuItem>
                <MenuItem value={"5days"}>5박 6일</MenuItem>
                </Select>
            </FormControl>
            </Box>
            <p className='pickplan_title'><span className='pickplan_title_color'>추천 일정</span> 입니다.</p>
            <p>떠나봅서에서 추천한 일정으로 여행을 떠나보세요.</p>
            <div className="pickplan_btn">
                {button?.map((day, idx) => (
                <button onClick={()=>{scroll(idx)}} key={day}>
                    <TagBtn tagbtn={`Day ${day}`}/>
                </button>
                ))}
            </div>

            {dataMap[select] && (
            <>
            <PickPlanItem planData={dataMap[select]} tagBtn={tagBtn} />
            <button onClick={() => { 
                if (!userId) {
                    setIsPopupOpen(true)
                }else{
                    handleNoPlan(dataMap[select]); enterEditMode();
                }
            }} 
            className="cardbtn">
                <Button btn={"전체 일정 가져가기"} className={"planner_save"} />
            </button>
            <Top/>
            </>
            )}
            
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

export default PickPlan