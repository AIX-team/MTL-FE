import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa'; // 체크 아이콘 import
import LinkPage from '../pages/link/LinkPage';
import '../css/layout/SubHeader.css';
import youtubeIcon from '../../src/images/youtube.png'; // YouTube 로고 이미지 import

/**
 * 서브 헤더 컴포넌트
 * 링크, 유튜브검색, 선택 탭으로 구성
 * 현재 선택된 탭 아래에 빨간색 인디케이터 표시
 */
const SubHeader = () => {
    const [activeTab, setActiveTab] = useState('youtube');
    const [linkCount, setLinkCount] = useState(0);
    const [linkData, setLinkData] = useState([]); // 빈 배열로 초기화

    // 현재 탭에 따라 활성화된 탭 스타일 적용
    const getClassName = (path) => {
        const tabMapping = {
            'links': '/link',
            'youtube': '/link/searchYouTube'
        };
        return `WS-SubHeader-Tab${tabMapping[activeTab] === path ? ' active' : ''}`;
    };

    // 링크 데이터가 변경될 때마다 카운트 업데이트
    useEffect(() => {
        setLinkCount(linkData.length);
    }, [linkData]);

    return (
        <>
            <nav className="WS-SubHeader" id="WS-Link-SubHeader-nav">

                {/* 유튜브검색 탭 */}
                <div id="WS-Link-SubHeader-youtube-tab-Container" onClick={() => setActiveTab('youtube')} className={getClassName('/link/searchYouTube')}>
                    <div className="WS-SubHeader-Tab" id="WS-SubHeader-Link-youtube-tab">
                        {/* 유튜브 검색 탭 아이콘 */}
                        <img src={youtubeIcon} alt="YouTube" className="WS-youtube-icon" id="WS-SubHeader-youtube-icon" />
                        {/* 유튜브 검색 탭 텍스트 */}
                        <span id="WS-Link-SubHeader-text">유튜브 검색</span>
                    </div>
                </div>

                {/* 링크 탭 */}
                <div id="WS-Link-SubHeader-link-tab-Container" onClick={() => setActiveTab('links')} className={`${getClassName('/link')} ${linkCount >= 5 ? 'complete' : ''}`}>
                    <div className="WS-SubHeader-Tab" id="WS-SubHeader-Link-Link-tab">
                        {/* 링크 탭 텍스트 */}
                        <span id="WS-Link-SubHeader-text">링크</span>


                        {linkCount >= 5 ? (
                            <span className="WS-check-icon">
                                {/* 링크 카운트 5 이상이면 체크 아이콘 표시 */}
                                <FaCheck />
                            </span>
                        ) : (
                            <span className="WS-Count">
                                {/* 링크 카운트 5미만이면 숫자 표시 */}
                                {linkCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* 이동하는 인디케이터(빨간 선) */}
                <div className="WS-indicator" id="WS-SubHeader-link-indicator" />

            </nav>

            <LinkPage
                activeTab={activeTab}
                linkData={linkData}
                setLinkData={setLinkData}
                isLinkLimitReached={linkCount >= 5}
            />
        </>
    );
};

export default SubHeader; 

// 완료 ===================================================================