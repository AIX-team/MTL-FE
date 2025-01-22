import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/layout/SubHeader.css';

/**
 * 서브 헤더 컴포넌트
 * 링크, 유튜브검색, 선택 탭으로 구성
 * 현재 선택된 탭 아래에 빨간색 인디케이터 표시
 */
const SubHeader = () => {
    const location = useLocation();
    
    // 현재 경로에 따라 활성화된 탭 스타일 적용
    const getClassName = (path) => {
        return `WS-SubHeader-Tab${location.pathname === path ? ' active' : ''}`;
    };

    return (
        <nav className="WS-SubHeader">
            {/* 링크 탭 */}
            <Link to="/link" className={getClassName('/link')}>
                링크
            </Link>
            {/* 유튜브검색 탭 */}
            <Link to="/link/searchYouTube" className={getClassName('/link/searchYouTube')}>
                유튜브검색
            </Link>
            {/* 선택 탭 */}
            <Link to="/link/selected" className={getClassName('/link/selected')}>
                선택<span className="number">3</span>
            </Link>
            {/* 이동하는 인디케이터(빨간 선) */}
            <div className="indicator" />
        </nav>
    );
};

export default SubHeader; 