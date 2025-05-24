
function Comment(className) {
  return (
    <div
      className={className}
      style={{
        width: '19.5px',
        height: '19.5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <img
        src="/imgs/_icons/Comment.svg"
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', 
          display: 'block',
        }}
      />
    </div>
  );
}


export default Comment