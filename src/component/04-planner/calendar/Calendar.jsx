import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { DateRange } from 'react-date-range';
import { eachDayOfInterval, format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { mode, plan } from '../../../api';
import Button from '../../_common/Button';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../../../styles/04-planner/calendar.scss'

function Calendar({btnName, type, onClick}) {
  let allDays = JSON.parse(localStorage.getItem('allDays'));
  const { planData, editModeDate} = plan();
  const { enterEditMode, isEditMode } = mode();
  const { id } = useParams(); // url에서 id 가져오기
  const navigate = useNavigate();

  const generateId = () => {
      const datePart = Date.now().toString(36);
      const randPart = Math.random().toString(36).substring(2, 5);
      return `${datePart}${randPart}`;
  }

  function generateTitle(planData) {
    // 객체의 값들 중 title만 추출
    const titles = Object.values(planData).map(item => item.title);
    let i = 1;
    while (titles.includes(`나의 제주 여행 ${i}`)) {
      i++;
    }
    return `나의 제주 여행 ${i}`;
  }
  const date = allDays;
  
  //일정 추가하러가기 버튼 눌렀을 때 실행 할 함수
  function handleNoPlan() {
      const newId = generateId();
      const title = generateTitle(planData);

      enterEditMode()
      navigate(`/planner/plannerdetail/${newId}`, {
      //useLocation.state로 빈 배열 값 보내주기
      state: {
        isEdit: true,
        id: newId,
        title,
        date: date,
        item: {
          days: [...new Set(Array.isArray(date) ? date : [date])].map((day) => ({
            day: format(parse(day, 'yyyy.MM.dd', new Date()), 'M.d/eee', { locale: ko }),
            plans: [],
          }))
        }
      }
      });
  };

  //편집 모드에서 날짜 선택 했을 때
  function changeDate () {
    const state = {
      id: id,
      title : planData?.title,
      date: date,
      item: {
        days: [...new Set(Array.isArray(date) ? date : [date])].map((day) => ({
          day: format(parse(day, 'yyyy.MM.dd', new Date()), 'M.d/eee', { locale: ko }),
          plans: [],
        }))
      }
    }
    localStorage.setItem('state', JSON.stringify(state));
    editModeDate(state)
  }
  
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleChange = (item) => {
    const start = item.selection.startDate;
    const end = item.selection.endDate;
    
    // 상태 업데이트
    setRange([item.selection]);

    // 시작일과 종료일이 같다면 하루만 저장
    if (format(start, 'yyyy.MM.dd') === format(end, 'yyyy.MM.dd')) {
      allDays = [format(start, 'yyyy.MM.dd')];
    } else {
      // 중간 날짜들만 추출
      const allDates = eachDayOfInterval({ start, end });
      const apiMiddleDates = allDates
        .slice(1, -1) // 첫날, 마지막날 제외
        .map((date) => format(date, 'yyyy.MM.dd'));

      const startDay = format(start, 'yyyy.MM.dd');
      const endDay = format(end, 'yyyy.MM.dd');

      allDays = [startDay, ...apiMiddleDates, endDay];
    }

    // localStorage에 저장
    localStorage.setItem('allDays', JSON.stringify(allDays));
  };

  return (
    <div className="calendar">
      <div style={{ height: '63vh', overflowY: 'hidden' }}>
        <DateRange
          editableDateInputs={false}
          onChange={handleChange}
          moveRangeOnFirstSelection={false}
          ranges={range}
          months={3} // 3달 표시 (원하면 6~12까지 가능)
          direction="vertical" // 세로 스크롤
          scroll={{ enabled: true }}
          locale={ko}
          monthDisplayFormat="yyyy.MM"
        />
      </div>
        <button 
        onClick={ type == "list" ? handleNoPlan : ()=>{onClick(); changeDate();}} 
        className="calendar_button"
        >
          <Button className={"calendar_button"}>
            {format(range[0].startDate, 'yyyy.MM.dd')} - {format(range[0].endDate, 'yyyy.MM.dd')} / {btnName}
          </Button>
        </button>
      </div>
  );
}

export default Calendar;
