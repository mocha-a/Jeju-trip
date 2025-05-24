
function TagBtn({isActive, onClick, tagbtn, className}) {
  return (
    <div className={`tagbtn ${isActive? 'active' : ''} ${className}`} onClick={onClick}>{tagbtn}</div>
  )
}

export default TagBtn