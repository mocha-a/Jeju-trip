import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import CmNewPost from "../../component/03-community/post/CmNewPost";

import "../../styles/03-community/cmPostPage.scss";
import "../../styles/03-community/_res-community.scss";

function CmPostPage() {
  const navigate = useNavigate();
  const postForm = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    const newPost = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      createdAt: dayjs().format("YYYY.MM.DD HH:mm"),
      author: {
        id: 2,
        nickname: "새 사용자",
        imageUri: "https://via.placeholder.com/40",
      },
      likes: [],
      hasVote: false,
      voteCount: 0,
      commentCount: 0,
    };

    navigate("/community", { state: { newPost } }); // 작성한 글 데이터 전달
  };

  return (
    <FormProvider {...postForm}>
      <form onSubmit={postForm.handleSubmit(onSubmit)}  className="cm-post-page">
        <CmNewPost />
      </form>
    </FormProvider>
  );
}

export default CmPostPage