import Heart_fill_white from '../icons/Heart_fill_white'
import Heart_stroke_white from '../icons/Heart_stroke_white'

function LikeWhite({className, onClick, liked}) {
  return (
    <div className={className} onClick={onClick}>
      {liked ? <Heart_fill_white className={'heart-fill-white'} /> : <Heart_stroke_white className={'heart-stroke-white'} />}
    </div>
    // 사용방법 : 
    // 칠해진 하얀 하트 <LikeWhite liked={true} />
    // 라인만 있는 하트 <LikeWhite liked={false} />
  )
}

export default LikeWhite