
function CardItem({item}) {
  return (
    <div className='swipeactionmemo'>
        <h2 className='card_title'>{item.title}</h2>
        <p>{item.introduction}</p>
        <p>{`${item.contents_label} • ${item.road_address}`}</p> 
    </div>
  )
}

export default CardItem