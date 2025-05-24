import PlaceItem from '../../_common/PlaceItem'

function TripPlaceItem({title, roadaddress, tag, imgpath, heartType, likeCount}) {
  return (
    <div className='place-item-all'>
      <PlaceItem 
        imgpath={imgpath}
        title={title} 
        roadaddress={roadaddress} 
        tag={tag} 
        heartType={heartType}
      />
      <div className='place-like-count'>
        <span>{likeCount}</span>
      </div>
    </div>
  )
}

export default TripPlaceItem