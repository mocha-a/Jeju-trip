import { useState, useRef, useEffect } from "react";
import Cicle from "../../icons/Cicle";
import ChCicle from "../../icons/ChCicle";
import CmDeleteBtn from "../CmDeleteBtn";
import Send from "../../icons/Send";
import Btn2Popup from "../../popups/Btn2Popup";

const CmComment = ({ postId, showDeleteBtn, setShowDeleteBtn, comments, setComments }) => {
  const inputRef = useRef(null);
  const deleteBtnRef = useRef(null);
  const [activeCircleCommentIds, setActiveCircleCommentIds] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedCommentIdToDelete, setSelectedCommentIdToDelete] = useState(null);
  const [isSelectPopupOpen, setIsSelectPopupOpen] = useState(false);

  const BASE_URL = `${process.env.REACT_APP_APIURL}`;

  // 로그인한 사용자 정보 가져오기
  const userStr = sessionStorage.getItem("user");
  let loggedInUser = null;
  if (userStr) {
    try {
      loggedInUser = JSON.parse(userStr);
    } catch (err) {
      console.error("로그인 정보 오류:", err);
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/reply/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (err) {
        console.error("댓글 불러오기 실패:", err);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, setComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const inputValue = inputRef.current?.value.trim();
    if (!inputValue) return;

    if (!userStr) {
      alert("로그인이 필요합니다.");
      return;
    }

    const newCommentData = {
      postId,
      userId: loggedInUser.id,
      username: loggedInUser.name || "익명",
      text: inputValue,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${BASE_URL}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommentData),
      });

      if (res.ok) {
        const savedComment = await res.json();
        setComments((prev) => [...prev, savedComment]);
        inputRef.current.value = "";
      }
    } catch (err) {
      console.error("댓글 저장 실패:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${BASE_URL}/reply/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentId));
        setShowDeleteBtn(false);
      }
    } catch (err) {
      console.error("댓글 삭제 중 오류:", err);
    }
  };

  const confirmDelete = () => {
    if (selectedCommentIdToDelete) {
      handleDeleteComment(selectedCommentIdToDelete);
      setSelectedCommentIdToDelete(null);
    }
    setIsDeletePopupOpen(false);
  };

  const toggleSelectComment = (commentId) => {
    setActiveCircleCommentIds((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleMultiDeleteClick = () => {
    if (activeCircleCommentIds.length === 0) {
      setIsSelectPopupOpen(true);
    } else {
    }
  };

  return (
    <div>
      <div className="divider3" />
      <div className="comment">댓글</div>

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <div className="comment-line">
              <span className="comment-username">{comment.username}</span>
            </div>
            <div className="comment-line">
              <p className="comment-text2">{comment.text}</p>

              {!showDeleteBtn && loggedInUser?.id === comment.userId && (
                <span
                  className="delete-text"
                  onClick={() => {
                    setSelectedCommentIdToDelete(comment._id);
                    setIsDeletePopupOpen(true);
                  }}
                >
                  삭제
                </span>
              )}

              {showDeleteBtn && (
                <div
                  className="co-circle"
                  onClick={() => toggleSelectComment(comment._id)}
                >
                  {activeCircleCommentIds.includes(comment._id) ? (
                    <ChCicle />
                  ) : (
                    <Cicle />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!showDeleteBtn && (
        <div className="comment-input-container">
          <form onSubmit={handleCommentSubmit} className="searchbar">
            <input
              type="text"
              placeholder="댓글을 입력해주세요"
              name="search"
              ref={inputRef}
            />
            <button type="submit">
              <Send className="send-btn" />
            </button>
          </form>
        </div>
      )}

      {showDeleteBtn && (
        <div ref={deleteBtnRef} className="delete-btn-container" onClick={handleMultiDeleteClick}>
          <CmDeleteBtn selectedCommentIds={activeCircleCommentIds} handleDeleteComment={handleDeleteComment} />
        </div>
      )}

      <Btn2Popup
        isOpen={isDeletePopupOpen}
        setIsOpen={setIsDeletePopupOpen}
        type="delete"
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CmComment;