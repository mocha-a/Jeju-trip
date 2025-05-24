import { useForm, FormProvider } from "react-hook-form";
import { Box } from "@mui/material"; 
import CmNewPost from "../../component/03-community/post/CmNewPost";
import CmSubject from "../../component/03-community/cmSubject";

import "../../styles/03-community/cmSubjectPage.scss";
import "../../styles/03-community/_res-community.scss";

function CmSubjectPage() {
  const methods = useForm(); 

  return (
    <FormProvider {...methods}>
      <>
        <Box style={{ margin: "92px 0 150px"}}>
          <CmNewPost />
          <CmSubject />
        </Box>
      </>
    </FormProvider>
  );
}

export default CmSubjectPage;