import { useState } from 'react'
import { useSwipeable } from 'react-swipeable';
import Trash from '../icons/Trash';

function SwipeActionMemo({children, className, setTrashClick}) {
    const [swipe, setSwipe] = useState(0); // 현재 이동 거리
    const [trashbtn, setTrashbtn] = useState(false); // 스와이프 상태 관리

    const handlers = useSwipeable({
        onSwiping: (e) => {
            // 스와이프 중 → 드래그처럼 이동
            let deltaX = e.deltaX; // 이동 거리
            if (trashbtn) deltaX -= 240; // 이미 열려있다면 80px을 빼고 계산
            setSwipe(Math.max(Math.min(deltaX, 240), -240));
            },
        onSwiped: (eventData) => {
            // 스와이프 끝났을 때 → 최종 위치 결정
            if (eventData.deltaX < -80) {
                setTrashbtn(true); // 삭제 버튼 보이기
                setSwipe(-160);
            } else {
                setTrashbtn(false); // 원래대로
                setSwipe(0);
            }
            },
        trackTouch: true, // 터치 이벤트 트래킹
        trackMouse: true, // 마우스 이벤트도 트래킹 (PC에서도 가능)
    });
    
        return (
        <div className={className} style={{overflow: "none"}}>
            <div
                {...handlers}
                className="swipe-container"
                style={{
                    display: "flex",
                    transform: `translateX(${swipe}px)`, // 버튼 크기만큼 이동
                    transition: "transform 0.5s ease-in-out",
                }}
            >
                <div className='children'>{children}</div>
                <div className='memoNtrash'>
                    <div className="trashicon" onClick={() =>{ setTrashClick(true); setSwipe(0)}}><Trash/></div>
                </div>
            </div>
        </div>
    );
}

export default SwipeActionMemo
