import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa'; // 체크 아이콘 import
import LinkList from './LinkList';
import SearchYoutube from './SearchYoutube';
import youtubeIcon from '../../images/youtube.png'; // YouTube 로고 이미지 import
import '../../css/layout/SubHeader.css';

/**
 * 서브 헤더 컴포넌트
 * 링크, 유튜브검색, 선택 탭으로 구성
 * 현재 선택된 탭 아래에 빨간색 인디케이터 표시
 */

const SubHeader = () => {
    const [activeTab, setActiveTab] = useState('youtube');
    const [linkData, setLinkData] = useState(() => {
        const savedLinks = localStorage.getItem('linkListData');
        return savedLinks ? JSON.parse(savedLinks) : [];
    });
    const [linkCount, setLinkCount] = useState(() => {
        const linkListData = JSON.parse(localStorage.getItem('linkListData') || '[]');
        return linkListData.length;
    });

    // localStorage 관련 useEffect
    useEffect(() => {
        const updateLinkCount = () => {
            const linkListData = JSON.parse(localStorage.getItem('linkListData') || '[]');
            const selectedLinks = JSON.parse(localStorage.getItem('selectedYoutubeLinks') || '[]');
            setLinkCount(linkListData.length + selectedLinks.length);
        };

        updateLinkCount();
        window.addEventListener('storage', updateLinkCount);
        const interval = setInterval(updateLinkCount, 300);

        return () => {
            window.removeEventListener('storage', updateLinkCount);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const updateLinkData = () => {
            const savedLinks = localStorage.getItem('linkListData');
            const currentLinks = savedLinks ? JSON.parse(savedLinks) : [];
            setLinkData(currentLinks);

            const selectedLinks = localStorage.getItem('selectedYoutubeLinks');
            if (selectedLinks) {
                const newLinks = JSON.parse(selectedLinks);
                if (newLinks && Array.isArray(newLinks) && newLinks.length > 0) {
                    setLinkData(prevLinks => {
                        const combinedLinks = [...prevLinks, ...newLinks];
                        localStorage.setItem('linkListData', JSON.stringify(combinedLinks));
                        localStorage.removeItem('selectedYoutubeLinks');
                        return combinedLinks;
                    });
                }
            }
        };

        updateLinkData();
        const interval = setInterval(updateLinkData, 300);
        return () => clearInterval(interval);
    }, []);

    const getClassName = (path) => {
        const tabMapping = {
            'links': '/link',
            'youtube': '/link/searchYouTube'
        };
        return `WS-SubHeader-Tab${tabMapping[activeTab] === path ? ' active' : ''}`;
    };

    return (
        <>
            {/* 서브헤더 영역 */}
            <nav className="WS-Main-Layout-SubHeader">
                {/* 유튜브검색 탭 */}
                <div 
                    id="WS-Link-SubHeader-youtube-tab-Container" 
                    onClick={() => setActiveTab('youtube')} 
                    className={getClassName('/link/searchYouTube')}
                >
                    <div className="WS-SubHeader-Tab" id="WS-SubHeader-Link-youtube-tab">
                        <img src={youtubeIcon} alt="YouTube" className="WS-youtube-icon" id="WS-SubHeader-youtube-icon" />
                        <span id="WS-Link-SubHeader-text">유튜브 검색</span>
                    </div>
                </div>

                {/* 링크 탭 */}
                <div 
                    id="WS-Link-SubHeader-link-tab-Container" 
                    onClick={() => setActiveTab('links')} 
                    className={`${getClassName('/link')} ${linkCount >= 5 ? 'complete' : ''}`}
                >
                    <div className="WS-SubHeader-Tab" id="WS-SubHeader-Link-Link-tab">
                        <span id="WS-Link-SubHeader-text">링크</span>
                        {linkCount >= 5 ? (
                            <span className="WS-check-icon">
                                <FaCheck />
                            </span>
                        ) : (
                            <span className="WS-Count">{linkCount}</span>
                        )}
                    </div>
                </div>

                <div className="WS-indicator" id="WS-SubHeader-link-indicator" />
            </nav>

            {/* 컨텐츠 영역 */}
            <div className="WS-Link-Page">
                <div className="WS-Link-Page-Content">
                    {activeTab === 'links' ? (
                        <LinkList linkData={linkData} setLinkData={setLinkData} />
                    ) : (
                        <SearchYoutube linkData={linkData} />
                    )}
                    
                </div>
            </div>
        </>
    );
};

export default SubHeader;

// 완료 ===================================================================