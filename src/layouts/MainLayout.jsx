import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LogoHeader from './LogoHeader';
import FooterComponent from './Footer';
import SubHeader from '../pages/link/LinkSubHeader';
import '../css/layout/MainLayout.css';

/**
 * 전체 레이아웃을 관리하는 메인 컴포넌트
 * 로고 헤더, 서브 헤더(조건부), 메인 컨텐츠, 푸터로 구성
 */
const MainLayout = () => {
    const location = useLocation();

    // SubHeader를 표시할 경로 확인
    const subHeaderPaths = ['/link', '/link/searchYouTube'];
    const shouldShowSubHeader = subHeaderPaths.includes(location.pathname);

    return (
        <div className="WS-Main-Layout">
            {/* 로고 헤더 영역 */}
            <LogoHeader className="WS-Main-Header" />

            {/* 메인 컨텐츠 영역 */}
            <main className="WS-Main-Container">
                {/* 서브 헤더 영역 - 특정 경로에서만 표시 */}
                {shouldShowSubHeader && <SubHeader className="WS-Main-Layout-SubHeader" />}
                <Outlet />
            </main>

            {/* 푸터 영역 */}
            <FooterComponent className="WS-Main-Footer" />
        </div>
    );
};

export default MainLayout;

// 완료 ==================================================================