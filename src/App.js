import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LinkPage from './pages/link/LinkPage';
import MyPage from './pages/mypage/MyPage';
import TravelPage from './pages/travel/TravelPage';
import Wish from './layouts/Wish';
import TravelInfo from './pages/link/travelInfo/TravelInfo';
import GuideBook from './pages/link/guideBook/GuideBook';
import Loading from './components/Loading/Loading';  // 추가
import './css/styles/variables.css';


import Login from "./pages/user/Login";
import LoginSuccess from "./pages/user/LoiginSuccess";
import GoogleMapsWrapper from './components/GoogleMapsWrapper';

import LandingPage from "./components/LandingPage/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <GoogleMapsWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* 로그인 페이지  */}
          <Route path="/login" element={<Login />} />
          <Route path="/loginSuccess" element={<LoginSuccess />} />

          {/* 로딩 페이지 추가 */}
          <Route path="/loading" element={<Loading message="여행 기간에 맞는 영상 정보 준비중" />} />

          {/* MainLayout을 모든 페이지의 기본 레이아웃으로 사용 */}
          <Route path="/" element={<MainLayout />}>
            {/* Link 페이지와 하위 라우트들 */}
            <Route path="link/*" element={<LinkPage />} />

            {/* MyPage */}
            <Route path="mypage/*" element={<MyPage />} />

            {/* Wish */}
            <Route path="wish/*" element={<Wish />} />

            {/* Travel 페이지 */}
            <Route path="travel/*" element={<TravelPage />} />

            {/* TravelInfos */}
            <Route path="travelinfos/:travelInfoId" element={<TravelInfo />} />

            {/* GuideBook */}
            <Route path="guidebooks/:guidebookId" element={<GuideBook />} />
          </Route>
        </Routes>
      </GoogleMapsWrapper>
    </BrowserRouter>
  );
}

export default App;
