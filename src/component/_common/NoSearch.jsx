import Smile from '../icons/Smile';

const NoSearch = ({className}) => {
    return (
    <div className={`NoSearch ${className}`}>
      <Smile className={"smileIcon"}/>
      <b>검색결과가 없습니다.</b>
    </div>
)
}
  
  export default NoSearch