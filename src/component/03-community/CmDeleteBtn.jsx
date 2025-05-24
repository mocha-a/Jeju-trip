import { useState } from "react";
import { createPortal } from "react-dom";
import Btn1Popup from "../popups/Btn1Popup";
import Btn2Popup from "../popups/Btn2Popup"; 

function CmDeleteBtn({ selectedCommentIds, handleDeleteComment }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const hasSelected = selectedCommentIds && selectedCommentIds.length > 0;

  return (
    <>
      <button className="cm-delete-btn" onClick={() => setIsPopupOpen(true)}>
        삭제하기
      </button>

      {isPopupOpen &&
        createPortal(
          <div className="popup-wrapper">
            {hasSelected ? (
              <Btn2Popup
                isOpen={isPopupOpen}
                setIsOpen={setIsPopupOpen}
                type="delete"
                onConfirm={() => {
                  selectedCommentIds.forEach((id) => handleDeleteComment(id)); // 삭제 함수 호출
                  setIsPopupOpen(false);  // 팝업 닫기
                }}
              />
            ) : (
              <Btn1Popup
                isOpen={isPopupOpen}
                setIsOpen={setIsPopupOpen}
                type="select"
                onConfirm={() => setIsPopupOpen(false)}
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
}

export default CmDeleteBtn;