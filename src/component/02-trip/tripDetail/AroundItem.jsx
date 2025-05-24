
function AroundItem({img, title, address}) {
  return (
    <div className='trip-around-item'>
      <div className='trip-around-item-img'>
        <img src={img} alt="" />
      </div>
      <b>{title}</b>
      <span>{address}</span>
    </div>
  )
}

export default AroundItem