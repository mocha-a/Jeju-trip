import Heart_broken from '../icons/Heart_broken';

const NoLikePlace = () => {
  return (
    <div className="NoLikePlace">
        <Heart_broken className={'heartBrokenIcon'}/>
        <b>좋아요 누른 장소가 없습니다.</b>
        <span>트립에서 좋아요를 누르고
        나만의 저장소를 만들어보아요!</span>
    </div>
  )
}

export default NoLikePlace