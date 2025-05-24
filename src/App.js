import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { mode } from './api';

import Header from './component/_common/Header';
import Menu from './component/_common/Menu';

import Splash from './pages/Splash';
import Home from './pages/01-home/Home';

import Trip from './pages/02-trip/Trip';
import TripList from './pages/02-trip/TripList';
import TripDetail from './pages/02-trip/TripDetail';

import CmList from './pages/03-community/CmList';
import CmPhoto from './pages/03-community/CmPhoto';
import CmDetail from './pages/03-community/CmDetail';
import CmPostPage from './pages/03-community/CmPostPage';
import CmEditPage from './pages/03-community/CmEditPage';
import CmSubjectPage from './pages/03-community/CmSubjectPage';

import Place from './pages/04-planner/Place';
import PickPlan from './pages/04-planner/PickPlan';
import PlannerList from './pages/04-planner/PlannerList';
import PlannerDetail from './pages/04-planner/PlannerDetail';

import My from './pages/05-mypage/My';
import QnA from './pages/05-mypage/QnA';
import Like from './pages/05-mypage/Like';
import Activity from './pages/05-mypage/Activity';
import CheckList from './pages/05-mypage/check/CheckList';
import CheckDetail from './pages/05-mypage/check/CheckDetail';

import Login from './pages/00-login/Login';
import SearchPage from './pages/00-search/SearchPage';
import SearchDetail from './pages/00-search/SearchDetail';
import KakaoRedirect from './pages/00-login/KakaoRedirect';
import NaverRedirect from './pages/00-login/NaverRedirect';
import GoogleRedirect from './pages/00-login/GoogleRedirect';

import './styles/_style.scss';


function App() {

  // 렌더링 전에 splash로 보낼지 판단
  const { isEditMode } = mode();
  const pathname = window.location.pathname;
  const isFirstVisit = !localStorage.getItem("visited");
  const isRoot = pathname === "/";

  if (isFirstVisit && isRoot) {
    localStorage.setItem("visited", "true");
    window.location.replace("/splash");
    return null; 
  }

  return (
    <Router>
      {!isEditMode && <Header/>}

      <main>
        <Routes>
          <Route path='/splash' element={<Splash/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/trip' element={<Trip/>}/>   
          <Route path='/trip/triplist/tour' element={<TripList/>}/>
          <Route path='/trip/triplist/food' element={<TripList/>}/>
          <Route path='/trip/triplist/festival' element={<TripList/>}/>
          <Route path='/trip/triplist/shopping' element={<TripList/>}/>
          <Route path='/trip/triplist/tour/tripdetail/:id' element={<TripDetail/>}/>
          <Route path='/trip/triplist/food/tripdetail/:id' element={<TripDetail/>}/>
          <Route path='/trip/triplist/festival/tripdetail/:id' element={<TripDetail/>}/>
          <Route path='/trip/triplist/shopping/tripdetail/:id' element={<TripDetail/>}/>
          
          <Route path='/community' element={<CmList/>}/>
          <Route path='/community/cmdetail/:id' element={<CmDetail/>}/>
          <Route path='/community/cmpostpage' element={<CmPostPage/>}/>
          <Route path='/community/cmeditpage' element={<CmEditPage/>}/>
          <Route path='/community/cmsubjectpage' element={<CmSubjectPage/>}/>
          <Route path='/community/cmphoto' element={<CmPhoto/>}/>

          <Route path='/planner' element={<PlannerList/>}/>
          <Route path='/planner/plannerdetail/:id' element={<PlannerDetail/>}/>
          <Route path='/planner/plannerdetail/:id/place/:idx' element={<Place/>}/>
          <Route path='/planner/pickplan' element={<PickPlan/>}/>

          <Route path='/my' element={<My/>}/>
          <Route path='/my/checklist' element={<CheckList/>}/>
          <Route path='/my/checklist/checkDetail/:id' element={<CheckDetail/>}/>
          <Route path='/my/like' element={<Like/>}/>
          <Route path='/my/activity' element={<Activity/>}/>
          <Route path='/my/qna' element={<QnA/>}/>

          <Route path='/login' element={<Login/>}/>
          <Route path='/login/authkakao' element={<KakaoRedirect/>}/>
          <Route path='/login/authnaver' element={<NaverRedirect/>}/>
          <Route path='/login/authgoogle' element={<GoogleRedirect/>}/>

          <Route path='/search' element={<SearchPage/>}/>
          <Route path='/search/searchdetail/:word' element={<SearchDetail/>}/>
        </Routes>
      </main>

      {!isEditMode && <Menu />}
    </Router>
  );
}

export default App;
