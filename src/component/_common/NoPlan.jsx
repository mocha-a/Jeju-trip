import Smile from '../icons/Smile';

const NoPlan = () => {
  return (
    <div className="NoWritePost">
        <Smile className={"smileIcon"}/>
        <b>등록된 여행 일정이 없습니다.</b>
        <span>새로운 여행을 등록하고<br/>
          아름다운 제주로 떠나보세요!</span>
    </div>
  )
}

export default NoPlan