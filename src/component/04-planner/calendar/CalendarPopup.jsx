import Close from '../../icons/Close';
import PopupAction from '../../_common/PopupAction';
import Calendar from './Calendar';

function CalendarPopup({calendar, setCalendar}) {
  return (
    <PopupAction className={"calendar_popup"} useState={calendar}>
        <div className="calendar_top">
            <button onClick={()=>{setCalendar(false);}}><Close className={"calendar_close"}/></button>
            <h2>여행 일정 등록</h2>
        </div>
        <div className="calendar_content">
            <Calendar
            type={'detail'}
            btnName={"여행 일정 수정하기"}
            onClick={() => {
                setCalendar(false)
                }}/>
        </div>
    </PopupAction>
  )
}

export default CalendarPopup