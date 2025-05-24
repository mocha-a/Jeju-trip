import Smile from '../icons/Smile';

const NoCheck = () => {
    return (
    <div className="NoWriteReply">
      <Smile className={"smileIcon"}/>
      <b>작성한 체크리스트가 없습니다.</b>
      <span>새로운 항목을 추가하여 나만의 목록을 만들어보아요!</span>
    </div>
  )
}
  
  export default NoCheck