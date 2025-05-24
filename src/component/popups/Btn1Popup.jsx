import Warning from '../icons/Warning';

function Btn1Popup({ isOpen, setIsOpen, type, onConfirm, className='' }) {

  // type별 팝업 내용
  const popupContent = {
    logout: {
      txt: '로그아웃되었습니다'
    },
    save: {
      txt: '저장되었습니다'
    },
    delete: {
      txt: '삭제되었습니다'
    },
    select: {
      txt: '선택된 항목이 없습니다',
      icon: <Warning className={'popup-warningicon'}/>
    }
  }

  // 팝업 배경 클릭 시 팝업 닫힘
  function closePopup(e) {
    if(e.target.classList.contains('popup-box')) {
      setIsOpen(false);
    }
  }

  // 팝업이 닫혀있으면 랜더링 하지 않음.
  if (!isOpen) return null;
  
  return (
    <div className={className ? className : 'popup-box'} onClick={closePopup}>
      <div className='popup'>

        <div className='popup-cont'>
          {popupContent[type]?.icon}
          <p>{popupContent[type]?.txt}.</p>
        </div>

        <div className='popup-btns-box'>
          <button className='btn1popup-btn' onClick={() => {
            if (onConfirm) onConfirm();  // 조건부 실행
            else setIsOpen(false); 
          }}>
            확인
          </button>
        </div>

      </div>
    </div>
  )
}

export default Btn1Popup