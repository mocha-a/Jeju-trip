import LikeWhite from '../../_common/LikeWhite';

function TripDetailItem({img, title, address, introduction, phone, liked, onClick}) {
  return (
    <div className="trip-detail-item">
      <div className='trip-detail-top'>
        <div className='trip-detail-img'>
          <img src={img} alt="상세이미지" />
        </div>
        <LikeWhite className={'likewhite'} liked={liked} onClick={onClick}/>
      </div>
      <div className='trip-detail-text'>
        <h3>{title}</h3>
        <b>{address}</b>
        <p>{introduction}</p>
        <span>전화번호 : {phone}</span>
      </div>

        
    </div>
  );
}

export default TripDetailItem