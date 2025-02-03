import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LogoHeader from './LogoHeader';
import FooterComponent from './Footer';
import '../css/layout/MainLayout.css';
import Wish from './Wish';

/**
 * 전체 레이아웃을 관리하는 메인 컴포넌트
 * 로고 헤더, 메인 컨텐츠, 푸터로 구성
 */
const MainLayout = () => {
    const location = useLocation();

    return (
        <div className="WS-Main-Layout">
            {/* 로고 헤더 영역 */}
            <LogoHeader className="WS-Main-Header" />

            {/* 메인 컨텐츠 영역 */}
            <main className="WS-Main-Container">
                <Wish className="WS-Main-Wish"/>
                <Outlet />
            </main>

            {/* 푸터 영역 */}
            <FooterComponent className="WS-Main-Footer" />
        </div>
    );
};

export default MainLayout;

// 완료 ==================================================================