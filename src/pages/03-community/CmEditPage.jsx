import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import CmEditPost from "../../component/03-community/post/CmEditPost";

import "../../styles/03-community/cmPostPage.scss";
import "../../styles/03-community/_res-community.scss";

function CmEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post;

  const postForm = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handlePostUpdate = async (updatedPost) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_APIURL}/post/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) throw new Error("게시물 수정 실패");

      const data = await response.json();

      navigate(`/community/cmdetail/${post._id}`);
      localStorage.post = JSON.stringify(updatedPost);
    } catch (error) {
      console.error("게시물 수정 에러:", error);
    }
  };

  return (
    <div style={{ padding: "50px 0 150px" }}>
      <FormProvider {...postForm}>
        <form onSubmit={postForm.handleSubmit(handlePostUpdate)}>
          <CmEditPost postData={post} onSubmit={handlePostUpdate} />
        </form>
      </FormProvider>
    </div>
  );
}

export default CmEditPage;