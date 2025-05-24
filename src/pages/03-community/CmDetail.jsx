import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Heart_stroke_red from '../../component/icons/Heart_stroke_red';
import Heart_fill_red from '../../component/icons/Heart_fill_red';
import Comment from '../../component/icons/Comment';
import Dot from '../../component/icons/Dot';
import Btn1Popup from '../../component/popups/Btn1Popup'; 
import Btn2Popup from '../../component/popups/Btn2Popup';
import CmComment from '../../component/03-community/comment/CmComment';
import Detail from '../../component/03-community/CmDetail';

import 'swiper/css';
import 'swiper/css/pagination';
import "../../styles/03-community/cmDetail.scss";

const init = [];

function CmDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const post =  JSON.parse(localStorage.post);
  const loggedInUserId = JSON.parse(sessionStorage.getItem("user"));

  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [comments, setComments] = useState(init);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const isAuthor = loggedInUserId.id === post?.userId; // 작성자인지 확인

  const handleDotClick = () => {
    setShowDeleteBtn((prev) => !prev);
  };


  const handleLikeClick = async (e) => {
    e.stopPropagation();
        const updatedPost = {
          ...post,
          hasVote: !post.hasVote,
          likeCount: post.hasVote ? post.likeCount - 1 : post.likeCount + 1,
        };
        localStorage.post = JSON.stringify(updatedPost);
        updateLikeStatus(post._id, updatedPost.hasVote, updatedPost);
  };

  const updateLikeStatus = async (postId, liked, updatedPost) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const userId = String(user.id);
      const res = await fetch(`${process.env.REACT_APP_APIURL}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId, liked, post }),
      });
      setLikeCount(updatedPost.likeCount)
      if (!res.ok) throw new Error("좋아요 상태 업데이트 실패");
    } catch (error) {
      console.error("좋아요 상태 업데이트 오류:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_APIURL}/post/${post._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeletePopupOpen(false);
        setIsDeleteConfirmOpen(true);
      
      } else {
        console.error("게시물 삭제 실패");
      }
    } catch (error) {
      console.error("서버 요청 실패:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post || !loggedInUserId) return;

    const savedLiked = JSON.parse(localStorage.getItem(`liked-${post._id}`)) || false;
    setLiked(savedLiked);

    fetch(`${process.env.REACT_APP_APIURL}/like/count?postId=${post._id}`)
      .then(res => res.json())
      .then(data => {
        setLikeCount(data.count);
      })
      .catch(err => console.error("좋아요 수 불러오기 실패:", err));
  }, [post, loggedInUserId]);

  if (!post) {
    return <div className="p-4">잘못된 접근입니다. 게시글 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-4" style={{ padding: "92px 0 150px" }}>
      <Detail post={post}>
        {post.imageUrls && (
          <div className="mt-4">
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              loop={post.imageUrls.length > 1}
            >
              {post.imageUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={url}
                    className="swiper-image"
                    alt={`Post Image ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </Detail>

      <div className="interaction-container">
        <div className="like-group" onClick={handleLikeClick}>
          {post.hasVote ? (
            <Heart_fill_red className={"fe-heart"} />
          ) : (
            <Heart_stroke_red className={"fe-heart2"} />
          )}
          <span className="like-count">
            {likeCount === 0 ? "좋아요" : likeCount}
          </span>
        </div>
        <div className="comment-group">
          <Comment className={"user-commnet"} />
          <span className="comment-count">
            {comments.length === 0 ? "댓글" : comments.length}
          </span>
        </div>
        {isAuthor && (
          <div className="dot" onClick={handleDotClick}>
            <Dot className={"user-dot"} />
          </div>
        )}
      </div>

      <CmComment
        postId={post._id}
        comments={comments}
        setComments={setComments}
        showDeleteBtn={showDeleteBtn}
        setShowDeleteBtn={setShowDeleteBtn}
      />

      {isAuthor && (
        <div className="cusor">
          <div className="comment-actions">
            <span
              className="cursor-pointer1"
              onClick={() => navigate("/community/cmeditpage", { state: { post } })}
            >
              수정
            </span>
            <span
              className="cursor-pointer2"
              onClick={() => setIsDeletePopupOpen(true)}
            >
              삭제
            </span>
          </div>
        </div>
      )}

      <Btn2Popup
        isOpen={isDeletePopupOpen}
        setIsOpen={setIsDeletePopupOpen}
        type="delete"
        onConfirm={handleDelete}
      />

      <Btn1Popup
        isOpen={isDeleteConfirmOpen}
        setIsOpen={setIsDeleteConfirmOpen}
        type="delete"
        onConfirm={() => {
          setIsDeleteConfirmOpen(false);
          navigate("/community");
        }}
      />
    </div>
  );
}

export default CmDetail;