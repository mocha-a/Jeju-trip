import { useNavigate } from 'react-router-dom';
import Right_black from '../icons/Right_black'

function ListItem({ id, title, date, page }) {
  const navigate = useNavigate();

  function changeLink() {
    if(page === 'check') {
      navigate(`/my/checklist/checkdetail/${id}`)
    } else if(page === 'plan') {
      navigate(`/planner/plannerdetail/${id}`,)
    }
  }

  return (
    <div className='listitem' onClick={changeLink}>
      <div>
        <p>{title}</p>
        <span> {date.length > 1 ? `${date[0]} - ${date[date.length-1]}` : date} </span>
      </div>
      <Right_black className={'listitem-icon'}/>
    </div>
  )
}

export default ListItem