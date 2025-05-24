import Heart_broken from '../icons/Heart_broken';

const NoLikePost = () => {  
  return (
    <div className="NoLikePost">
    <Heart_broken className={"heartBrokenIcon"}/>
    <b>좋아요 누른 게시물이 없습니다.</b>
    <span>커뮤니티에서 좋아요를 누르고
    나만의 저장소를 만들어보세요!</span>
</div>
)
}

export default NoLikePost