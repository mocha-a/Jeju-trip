import Heart_fill_red from '../icons/Heart_fill_red'
import Heart_stroke_red from '../icons/Heart_stroke_red'

function LikeRed({className, liked}) {
  return (
    <div className={className}>
      {liked ? <Heart_fill_red className={'heart-fill-red'} /> : <Heart_stroke_red className={'heart-stroke-red'} />}
    </div>
    // 컴포넌트 PlaceItem에서 사용방법 : 
    // 칠해진 빨간 하트 <LikeRed liked={true} />
    // 라인만 있는 하트 <LikeRed liked={false} />
  )
}

export default LikeRed