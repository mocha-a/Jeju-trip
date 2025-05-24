import Smile from '../icons/Smile';

const NoWriteReply = () => {
  return (
    <div className="NoWriteReply">
        <Smile className={'smileIcon'}/>
        <b>작성한 댓글이 없습니다.</b>
        <span>커뮤니티에서 댓글을 작성하고
        다른 사람들과 소통해보아요!</span>
    </div>
  )
}
export default NoWriteReply