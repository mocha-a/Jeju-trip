import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Newpost from "../icons/Newpost";
import Heart_fill_red from "../icons/Heart_fill_red";
import Heart_stroke_red from "../icons/Heart_stroke_red";
import Comment from "../icons/Comment";
import Top from "../icons/Top";
import TagBtn from "../_common/TagBtn";
import NoWritePost from "../_common/NoWritePost";
import DataLoading from "../_common/DataLoading";
import Btn2Popup from "../popups/Btn2Popup";

import "swiper/css";
import "swiper/css/pagination";

dayjs.extend(customParseFormat);

const CmFeedList = ({ setLoginPopupOpenFromParent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const getLoggedInUserId = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      return user?.id.toString() || null;
    } catch {
      return null;
    }
  };

  const fetchCommentCount = async (postId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_APIURL}/reply/count/${postId}`);
      const data = await res.json();
      return data.count || 0;
    } catch (err) {
      console.error("댓글 수 조회 실패:", err);
      return 0;
    }
  };

  const fetchLikeCount = async (postId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_APIURL}/like/count?postId=${postId}`);
      const data = await res.json();
      return data.count || 0;
    } catch (err) {
      console.error("좋아요 수 조회 실패:", err);
      return 0;
    }
  };

  const fetchUserLikedPosts = async (userId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_APIURL}/like/user-liked?userId=${userId}`);
      const data = await res.json();
      return data.likedPostIds || [];
    } catch (err) {
      console.error("유저 좋아요 목록 조회 실패:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const userId = getLoggedInUserId();
      if (!userId) {
        setLoginPopupOpen(true);
        setLoginPopupOpenFromParent(true);
        return;
      }

      setLoginPopupOpenFromParent(false);

      try {
        const res = await fetch(`${process.env.REACT_APP_APIURL}/post`);
        const data = await res.json();
        const likedPosts = await fetchUserLikedPosts(userId);
        
        if (Array.isArray(data)) {
          const postsWithCounts = await Promise.all(
            data.map(async (post) => {
              const commentCount = await fetchCommentCount(post._id);
              const likeCount = await fetchLikeCount(post._id);
              const hasVote = likedPosts.includes(post._id);
              
              return { ...post, commentCount, likeCount, hasVote };
            })
          );
          setPosts(postsWithCounts.reverse());
        }
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const newPost = location.state?.newPost;
    if (newPost) {
      setPosts((prev) => [{ ...newPost, commentCount: 0, likeCount: 0, hasVote: false }, ...prev]);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === "전체") return true;
    return post.subject === selectedCategory;
  });

  const handleLikeClick = async (e, id) => {
    e.stopPropagation();

    const updatedPosts = posts.map((post) => {
      if (post._id === id) {
        const updatedPost = {
          ...post,
          hasVote: !post.hasVote,
          likeCount: post.hasVote ? post.likeCount - 1 : post.likeCount + 1,
        };
        updateLikeStatus(id, updatedPost.hasVote, post);
        return updatedPost;
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  const updateLikeStatus = async (postId, liked, post) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const userId = String(user.id);
      const res = await fetch(`${process.env.REACT_APP_APIURL}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId, liked, post }),
      });
      if (!res.ok) throw new Error("좋아요 상태 업데이트 실패");
    } catch (error) {
      console.error("좋아요 상태 업데이트 오류:", error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLoginConfirm = () => {
    navigate("/login");
  };

  const handleLoginCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loginPopupOpen) {
    return (
      <Btn2Popup
        isOpen={loginPopupOpen}
        setIsOpen={setLoginPopupOpen}
        type="login"
        onConfirm={handleLoginConfirm}
        onCancel={handleLoginCancel} // "아니요" 누르면 뒤로 가기
      />
    );
  }

  if (loading) {
    return <DataLoading className={"list_loading"} />;
  }

  return (
    <FormProvider {...methods}>
      <div className="cm-feed-list">
        <div className="tag-buttons">
          {["전체", "자유톡", "질문", "맛집", "장소", "떠나팁"].map((tag) => (
            <div
              key={tag}
              onClick={() => handleCategoryChange(tag)}
              style={{ display: "inline-block", cursor: "pointer" }}
            >
              <TagBtn tagbtn={tag} isActive={selectedCategory === tag} />
            </div>
          ))}
        </div>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((item) => (
            <div
              key={item._id}
              className="post-container"
              onClick={() => {
                navigate(`/community/cmdetail/${item._id}`);
                localStorage.post = JSON.stringify(item);
              }}
              style={{ cursor: "pointer" }}
            >
              <h3 className="title">{item.title}</h3>
              <div className="author-container">
                <div className="author-info">
                  <div className="nickname">{item.username || "익명"}</div>
                  <p className="date-text">{dayjs(item.createdAt).format("YYYY.MM.DD HH:mm")}</p>
                </div>
              </div>
              <p className="description">{item.description}</p>
              {item.imageUrls && (
                <div className="image-list">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    loop={(Array.isArray(item.imageUrls) ? item.imageUrls.length : 1) > 1}
                    className="custom-swiper"
                  >
                    {(Array.isArray(item.imageUrls) ? item.imageUrls : [item.imageUrls]).map((url, index) => (
                      <SwiperSlide key={index}>
                        <img src={url} className="post-image" alt={`post-${index}`} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
              <div className="interaction-container">
                <div className="like-section" onClick={(e) => handleLikeClick(e, item._id)}>
                  {item.hasVote ? <Heart_fill_red className="fe-heart" /> : <Heart_stroke_red className="fe-heart2" />}
                  <span className="vote-text">{item.likeCount === 0 ? "좋아요" : item.likeCount}</span>
                </div>
                <div className="comment-section">
                  <Comment className="fe-comment" />
                  <span className="comment-text">{item.commentCount === 0 ? "댓글" : item.commentCount}</span>
                </div>
              </div>
              <div className="divider2" />
            </div>
          ))
        ) : (
          <NoWritePost />
        )}

        <div className="new-post-button" onClick={() => navigate("/community/cmpostpage")}>
          <Newpost className={"cm-Newpost"} />
        </div>

        {/* Top 버튼 영역 */}
        <div className="add-check-btn-wrap2">
          <div className="add-check-btn2" onClick={scrollToTop}>
            <Top />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CmFeedList;