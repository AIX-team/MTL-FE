import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LinkList from './LinkList';          // 링크 목록 컴포넌트
import SearchYoutube from './SearchYoutube';// 유튜브 검색 컴포넌트
import SelectedLinks from './SelectedLinks';// 선택된 링크 컴포넌트
import '../../css/linkpage/LinkPage.css';

const LinkPage = () => {
    return (
        <div className="WS-Link-Page">
            {/* 탭 내용을 보여줄 라우트 */}
            <div className="WS-Link-Content">
                <Routes>
                    <Route path="/" element={<LinkList />} />
                    <Route path="/searchYouTube" element={<SearchYoutube />} />
                    <Route path="/selected" element={<SelectedLinks />} />
                </Routes>
            </div>
        </div>
    );
};

export default LinkPage;
