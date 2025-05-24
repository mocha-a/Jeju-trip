
function TripTag({tag}) {
  if (!tag || tag.length === 0) return null;
  return (
    <div className='trip-tag'>
        {
          tag.map((item, i)=>
            <div className='trip-tag-div' key={i}>
              <span>{item}</span>
            </div>
          )
        }
    </div>
  )
}

export default TripTag