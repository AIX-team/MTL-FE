import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import FooterComponent from './Footer';
import '../css/layout/MainLayout.css';

// 전체 레이아웃을 구성하는 메인 컴포넌트
// 헤더, 본문 영역, 푸터를 포함하는 기본 레이아웃 구조를 정의
const HeaderlessLayout = () => {
    const location = useLocation();
    
    // 현재 경로가 /link로 시작하는지 확인
    const showSubHeader = location.pathname.toLowerCase().startsWith('/link');

    return (
        <div className="WS-Main-Layout">
            
            <main className="WS-Main-Container-Headerless">
                <Outlet />  {/* 라우팅된 컴포넌트가 렌더링되는 영역 */}
            </main>
            <FooterComponent />  {/* 하단 네비게이션 바 */}
        </div>
    );
};
export default HeaderlessLayout;