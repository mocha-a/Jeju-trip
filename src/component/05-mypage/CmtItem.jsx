
function CmtItem({title, dateTime, postTitle}) {
  return (
    <>
      <p>{title}</p>
      <span>{dateTime}</span>
      <span>{postTitle}</span>
    </>
  )
}

export default CmtItem