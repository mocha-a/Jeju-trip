import LikeRed from './LikeRed';

function PlaceItem({title, roadaddress, tag, imgpath, heartType, ClassName}) {

  let heartElement = null;

  if(heartType === 'red-fill'){
    heartElement = <LikeRed liked={true}/>
  }else if(heartType === 'red-stroke'){
    heartElement = <LikeRed liked={false}/>
  }

  const tagLimit = (tag || "")
  .split(/[,#]/)           // 쉼표나 # 기준으로 나누기
  .slice(0, 4)             // 최대 4개만
  .map(tag => tag.trim())  // trim 공백 제거 (" " -> "")
  .filter(Boolean);        // 빈문자열, 언디파인드 등을 제거하고 값이 있는것만 줌

  return (
    <div className="place">
      <div className='place-img-txt'>
        <div className="place-img">
          <img src={imgpath} alt="장소이미지" />
        </div>
        <div className={`place-txt ${ClassName}`}>
          <h2>{title}</h2>
          <p>{roadaddress}</p>
          <div className='place-tag'>
            {tagLimit.map((tag, i)=>
              <span key={i}>{tag}{i !== tagLimit.length - 1 && '·'}</span>
              // i(0,1,2,3)가 총length4-1인 3이 아니라면 가운데 점 붙이기
            )}
          </div>
        </div>
      </div>
      <div className="placeheart">
        {heartElement}
        {/* 여기에 heartType을 넣으면 아이콘이 아닌 글자가 출력됨 
        결과값을 출력하는 heartElement를 넣어 원하는 걸 보여달라고 해야함
        */}
      </div>
    </div>
    // 사용방법 : 사용할 곳에 가서 PlaceItme 컴포넌트를 부르고 
    // heartType="red-fill"  /  heartType="red-stroke"  /  heartType="none"
  )
}

export default PlaceItem