import { useRef } from "react";
import { Box } from "@mui/material";
import Photo from "../../icons/Photo";

function CmUploadImg({ selectedImages = [], setSelectedImages,imageUrls, setImageUrls}) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    // 이미지가 4개 이상이면 업로드 불가
    if (files.length + selectedImages.length > 4) {
      alert("이미지는 최대 4개까지 업로드할 수 있습니다.");
      return;
    }

    // 미리보기용 Base64 변환
    const previewImages = [];
    [...selectedImages,...files].forEach((file) => {
      previewImages.push(URL.createObjectURL(file));  // 미리보기용 URL 생성
    });

    setSelectedImages([...selectedImages,...files]);

      // 업로드 실패 시 이미지 URL 초기화
      setImageUrls(previewImages);
  }

  return (
    <Box className="photoContainer">
      <Box className="photoBox" onClick={handleImageClick}>
        <Photo className="nw-photo" />
      </Box>
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      {imageUrls.length > 0 && (
        <Box className="imagePreview">
          {imageUrls.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`선택한 이미지 ${index + 1}`}
              className="photoImage"
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CmUploadImg;