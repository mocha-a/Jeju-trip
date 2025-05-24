import { useEffect, useRef, useState } from 'react'

function SwipeHand() {
  const path = useRef(null);
  const handIcon = useRef(null);
  const [display, setDisplay] = useState(true);

  useEffect(()=>{
    if (path.current) {
      path.current.style.animation = "swipe-dot 2s 0.5s 2 forwards";
    }
    if (handIcon.current) {
      handIcon.current.style.animation = "swipe-hand 2s 2 forwards";
    }
  },[])
  
  return (
    display && ( //display가 && 참일때만 ()괄호 안 실행
    <div className="swipe" onAnimationEnd={() => setDisplay(false)}> 
      <div ref={path} className="path"></div>
      <div ref={handIcon} className="hand-icon"></div>
    </div>
    )
  )
}

export default SwipeHand