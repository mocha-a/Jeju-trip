
function Top() {
  const upScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='top-btn-wrap'>
      <div className='top-btn' onClick={upScroll}>
        <img src='/imgs/_icons/Top.svg'/>
      </div>
    </div>
  )
}

export default Top