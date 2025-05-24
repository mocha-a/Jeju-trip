import { useNavigate } from 'react-router-dom'
import Left_black from '../../icons/Left_black'
import Right_black from '../../icons/Right_black'

function BackNext({prevPath, nextPath, filterList}) {
  const navigate  = useNavigate();

  return (
    <div className="backnext">
      <button 
        onClick={()=>{
          if (prevPath) navigate(prevPath, { state: { filterList } });
          // if(이전항목이 있다면 실행) (경로이동, {페이지 이동시 전달할 데이터})
        }}
      >
        <Left_black className={'backnext-btn'}/>
        이전
      </button>
      <button
        onClick={() => {
          if (nextPath) navigate(nextPath, { state: { filterList } });
        }}
      >
        이후
        <Right_black className={'backnext-btn'}/>
      </button>
    </div>
  )
}

export default BackNext