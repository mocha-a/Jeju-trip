
function Ranking({rank, word, onClick}) {  
  return (
    <div className='rankingOne' onClick={onClick}>
      <b>{rank}</b>
      <span>{word}</span>
    </div>
  )
}

export default Ranking