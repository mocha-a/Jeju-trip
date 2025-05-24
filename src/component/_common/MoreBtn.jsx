import Right_black from '../icons/Right_black'

function MoreBtn({onClick}) {
  return (
    <div className='morebtn' onClick={onClick}>
      <b>전체보기</b>
      <span><Right_black className={'morebtn-icon'}/></span>
    </div>
  )
}

export default MoreBtn