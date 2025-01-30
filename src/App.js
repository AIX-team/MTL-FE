import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LinkPage from './pages/link/LinkPage';
import TravelPage from './pages/travel/TravelPage';
import MyPage from './pages/mypage/MyPage';
import Login from "./pages/user/Login";
import LoginSuccess from "./pages/user/LoiginSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 경로를 /link로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/link" replace />} />

        {/* 로그인 페이지  */}
        <Route path="/login" element={<Login />} />
        <Route path="/loginSuccess" element={<LoginSuccess/>}/>

        {/* MainLayout을 모든 페이지의 기본 레이아웃으로 사용 */}
        <Route path="/" element={<MainLayout />}>
          {/* Link 페이지와 하위 라우트들 */}
          <Route path="link/*" element={<LinkPage />} />
          
          {/* Travel 페이지 */}
          <Route path="travel/*" element={<TravelPage />} />
          
          {/* MyPage */}
          <Route path="mypage/*" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;