import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TabPage from '../../component/_common/TabPage';
import CmSlideImg from '../../component/03-community/img/CmSlideImg';
import CmFeedList from '../../component/03-community/CmFeedList';

import "../../styles/03-community/cmList.scss";
import "../../styles/03-community/_res-community.scss";

function CmList() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.setSelectedTab === 1) {
      setSelectedTab(1);
    } else if (location.state?.setSelectedTab === 0) {
      setSelectedTab(0);
    }
    window.scrollTo(0, 0);
  }, [location.state]);

  return (
    <div style={{ padding: "92px 0 150px" }}>
      {!loginPopupOpen && (
        <TabPage
          type="community"
          onTabChange={setSelectedTab}
          selectedTab={selectedTab}
        />
      )}
      {selectedTab === 0 ? (
        <CmFeedList setLoginPopupOpenFromParent={setLoginPopupOpen} />
      ) : (
        <CmSlideImg />
      )}
    </div>
  );
}

export default CmList;