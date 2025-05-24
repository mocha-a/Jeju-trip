import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import DataLoading from '../../_common/DataLoading';
import Top from '../../icons/Top';

function CmSlideImg() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const loadImages = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const response = await axios.get(`${process.env.REACT_APP_APIURL}/post/images?page=${page}`);
        const posts = response.data;
        setImages((prevImages) => [...prevImages, ...posts]);
      } catch (error) {
        console.error('이미지 불러오기 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [page]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleClick = async (id,item) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId =  user?.id.toString() || null;
    try {
      const res = await fetch(`${process.env.REACT_APP_APIURL}/like/user-liked?userId=${userId}`);
      const data = await res.json();
      let hasVote = data.likedPostIds.includes(item._id);

      localStorage.post = JSON.stringify({...item,hasVote});
      navigate(`/community/cmdetail/${id}`);
    } catch (err) {
      console.error("유저 좋아요 목록 조회 실패:", err);
    }
  };

  const scrollToTop = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
     <>
      <div
        className="image-container"
        onScroll={handleScroll}
        ref={imageContainerRef}
        style={{ height: '100vh', overflowY: 'scroll' }} // Masonry 안 보이면 여기에 높이 설정
      >
        <Box sx={{ px: 2 }}>
          <ImageList variant="masonry" cols={3} gap={8}>
            {images.map((imgObj) => {
              const url = imgObj.imageUrl.includes('?')
                ? `${imgObj.imageUrl}&w=248&fit=crop&auto=format`
                : `${imgObj.imageUrl}?w=248&fit=crop&auto=format`;

              return (
                <ImageListItem key={imgObj.id}>
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    onClick={() => handleClick(imgObj.id, imgObj.post)}
                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        </Box>

        {loading && <DataLoading className="list_loading" />}
      </div>

      {/* Top 버튼 */}
      <div className="add-check-btn-wrap3">
        <div className="add-check-btn3" onClick={scrollToTop}>
          <Top />
        </div>
      </div>
    </>
  );
}

export default CmSlideImg;