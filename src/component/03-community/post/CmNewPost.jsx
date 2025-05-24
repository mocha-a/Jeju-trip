import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Right_black from "../../icons/Right_black";
import Close from "../../icons/Close";
import Btn2Popup from "../../popups/Btn2Popup";
import PopupAction from "../../_common/PopupAction";
import DataLoading from "../../_common/DataLoading"; 
import CmUploadImg from "../img/CmUploadImg";
import CmSubject from "../cmSubject";

function CmNewPost({ onClose = () => {} }) {
  const { control, setFocus, handleSubmit, reset } = useFormContext();
  const navigate = useNavigate();
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("주제선택");
  const [showSubjectAlert, setShowSubjectAlert] = useState(false);
  const [isExitPopupOpen, setIsExitPopupOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });

  const handleSubmitWrapper = (e) => {
    e.preventDefault();
    let shouldShowAlert = false;

    if (selectedItem === "주제선택") {
      setShowSubjectAlert(true);
      shouldShowAlert = true;
    } else {
      setShowSubjectAlert(false);
    }

    handleSubmit((data) => {
      if (!shouldShowAlert) {
        onSubmit(data);
      }
    })();
  };

  const onSubmit = async (data) => {
    setIsLoading(true); 
    const userId = localStorage.getItem("userId");
    const formdata = new FormData();
    selectedImages.forEach((img) => formdata.append("images", img));

    let res;
    try {
      if (selectedImages.length > 0) {
        res = await axios.post(`${process.env.REACT_APP_APIURL}/post/images`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    } catch (err) {
      console.error("이미지 업로드 실패:", err.response?.data || err.message);
      if (err.response?.status === 429) {
        alert("요청이 너무 많아 이미지 업로드가 잠시 제한되었습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("이미지 업로드에 실패했습니다. 파일 크기를 확인하거나 다시 시도해주세요.");
      }
      setIsLoading(false); 
      return;
    }

    const postData = {
      userId: JSON.parse(window.sessionStorage.user).id,
      username: JSON.parse(window.sessionStorage.user).name,
      title: data.title,
      description: data.description,
      subject: selectedItem,
      hasVote: false,
      createdAt: new Date().toISOString(),
      imageUrls: res?.data || [],
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_APIURL}/post`, postData);
      reset();
      onClose();
      navigate("/community", { state: { newPost: response.data } });
    } catch (error) {
      console.error("글 등록 실패:", error);
      alert("글 등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleCloseClick = () => {
    const isDirty = title || description || selectedItem !== "주제선택";
    if (isDirty) {
      setIsExitPopupOpen(true);
    } else {
      navigate("/community");
    }
  };

  const handleExitConfirm = () => {
    setIsExitPopupOpen(false);
    reset();
    navigate("/community");
  };

  if (isLoading) {
    return <DataLoading className={"list_loading"}/>;
  }

  return (
    <Box className="container">
      <Box className="header1">
        <div onClick={handleCloseClick}>
          <Close className="Cm-closeIcon" />
        </div>
        <button className="submitButton" onClick={(e) => handleSubmitWrapper(e)}>
          등록
        </button>
      </Box>

      <Typography className="newtitle" variant="h4" gutterBottom>
        새 게시물
      </Typography>

      <Box className="subjectContainer">
        <Box
          className={`subjectBox ${showSubjectAlert ? "subjectBox-error" : ""}`}
          onClick={() => {
            setIsSubjectOpen(true);
            setShowSubjectAlert(false);
          }}
        >
          <Typography
            className={`subjectText ${
              selectedItem === "주제선택" ? "subjectText-placeholder" : ""
            }`}
            variant="body1"
          >
            {selectedItem}
          </Typography>
          <Right_black className="nw-Right" />
        </Box>
        {showSubjectAlert && (
          <Typography className="subjectErrorText">
            주제를 선택해주세요.
          </Typography>
        )}
        <Box className="divider" />
      </Box>

      <CmUploadImg
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        setImageUrls={setImageUrls}
        imageUrls={imageUrls}
      />

      <Box className="divider" />

      <Controller
        name="title"
        control={control}
        rules={{ required: "제목을 작성해주세요." }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            autoFocus
            placeholder="제목을 작성해주세요."
            value={value ?? ""}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setFocus("description");
              }
            }}
            error={!!error}
            helperText={error?.message}
            fullWidth
            variant="standard"
            multiline
            InputProps={{
              disableUnderline: true,
              className: "inputTitle",
            }}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: "내용을 작성해주세요." }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            placeholder="내용을 작성해주세요."
            value={value ?? ""}
            onChange={onChange}
            error={!!error}
            helperText={error?.message}
            fullWidth
            variant="standard"
            multiline
            InputProps={{
              disableUnderline: true,
              className: "inputDescription",
            }}
          />
        )}
      />

      {isSubjectOpen && <div className="overlay" />}
      {isSubjectOpen && (
        <PopupAction
          className="cm-subject"
          useState={isSubjectOpen}
          onClose={() => setIsSubjectOpen(false)}
        >
          <div className="subjectWrapper">
            <CmSubject
              selectedItem={selectedItem}
              setSelectedItem={(item) => {
                setSelectedItem(item);
                setShowSubjectAlert(false);
              }}
              onClose={() => setIsSubjectOpen(false)}
            />
          </div>
        </PopupAction>
      )}

      <Btn2Popup
        isOpen={isExitPopupOpen}
        setIsOpen={setIsExitPopupOpen}
        type="exit"
        onConfirm={handleExitConfirm}
      />
    </Box>
  );
}

export default CmNewPost;