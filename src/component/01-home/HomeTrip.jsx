
function HomeTrip({className, onClick, imgpath, title, roadaddress}) {
  return (
    <div className={className} onClick={onClick}>
      <div className='home-triptab'>
        <p>
          <img src={imgpath} alt="" />
        </p>
        <div className='home-triptab-text'>
          <b>{title}</b>
          <span>{roadaddress}</span>
        </div>
      </div>
    </div>
  )
}

export default HomeTrip