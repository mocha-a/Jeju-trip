import { mode } from '../../../api';
import SwipeHand from '../../_common/SwipeHand';

function PlannerTitle({eTitle, setETitle, planData}) {
  const { enterEditMode, isEditMode } = mode();

  return (
    <div className='planner'>
      {isEditMode ? (
        <>
          <div className='hand'><SwipeHand/></div>
          <input
              value={eTitle ?? ""}
              onChange={(e) => {setETitle(e.target.value);  enterEditMode()}}
              onBlur={(e) => setETitle(e.target.value)}
              className="planner_title"
              />
        </>
      ):(
        <h2 className="planner_title">{planData?.title}</h2>
      )}
        <button onClick={()=>{enterEditMode()}}>{isEditMode ? '편집 중' : '편집'}</button>
    </div>
  )
}

export default PlannerTitle