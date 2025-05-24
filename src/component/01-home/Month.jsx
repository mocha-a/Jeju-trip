import { useState } from 'react'
import Button from '../_common/Button'
import Close from '../icons/Close';

function Month({onClose, onComplete}) {
  const [selectMonth, setSelectMonth] = useState(null);
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  return (
    <div className='home-month-popup'>
      <div className='popup-top'>
        <button onClick={onClose}><Close className={'month-close'}/></button>
        <p>궁금하신 월을 선택해주세요.</p>
        <button onClick={()=>{
          if(!selectMonth) return;
          onComplete(selectMonth);}}
          className={`month-finish-btn ${selectMonth ? 'active' : ''}`}>완료</button>
      </div>
      <div className='popup-month'>
        {
          months.map((item)=>
            <button onClick={()=>setSelectMonth(item)} className={'month-btn'} key={item}>
              <Button btn={item} className={`month-num ${selectMonth === item ? 'active' : ''}`}/>
            </button>
          )
        }
      </div>
    </div>
  )
}

export default Month