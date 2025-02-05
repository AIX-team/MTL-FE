import React, { useState, useEffect } from 'react';
import LinkList from './LinkList';          // 링크 목록 컴포넌트
import SearchYoutube from './SearchYoutube';// 유튜브 검색 컴포넌트
import '../../css/linkpage/LinkPage.css';
import { FaCheck } from 'react-icons/fa'; // 체크 아이콘 import
import youtubeIcon from '../../images/youtube.png'; // YouTube 로고 이미지 import


const LinkPage = () => {
    const [activeTab, setActiveTab] = useState('youtube');
    const [linkData, setLinkData] = useState(() => {
        const savedLinks = localStorage.getItem('linkListData');
        return savedLinks ? JSON.parse(savedLinks) : [];
    });
    const [linkCount, setLinkCount] = useState(() => {
        const linkListData = JSON.parse(localStorage.getItem('linkListData') || '[]');
        return linkListData.length;
    });

    const renderContent = () => {
        switch (activeTab) {
            case 'links':
                return <LinkList linkData={linkData} setLinkData={setLinkData} />;
            case 'youtube':
                return <SearchYoutube linkData={linkData} />;
            default:
                return null;
        }
    };

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

    return (
        <div className="WS-Link-Page">

            {/* 탭 영역 */}
            <nav className="WS-Link-Tab-Container">
                {/* 유튜브검색 탭 */}
                <div className="WS-Link-Tabs">
                    <div
                        id="WS-Link-youtube-tab"
                        className={`WS-Link-Tab ${activeTab === 'youtube' ? 'active' : ''}`}
                        onClick={() => setActiveTab('youtube')}
                    >

                        <div className="WS-Link-Tab-Content">
                            <img src={youtubeIcon} alt="YouTube" className="WS-youtube-icon" />
                            <span className="WS-Link-Tab-text">유튜브 검색</span>
                        </div>

                    </div>

                    {/* 링크 탭 */}
                    <div
                        id="WS-Link-links-tab"
                        onClick={() => setActiveTab('links')}
                        className={`WS-Link-Tab ${activeTab === 'links' ? 'active' : ''}`}
                    >
                        <div className="WS-Link-Tab-Content">
                            <span className="WS-Link-Tab-text">링크</span>

                            {linkCount >= 5 ? (
                                <span className="WS-check-icon">
                                    <FaCheck />
                                </span>
                            ) : (
                                <span className="WS-Count">{linkCount}</span>
                            )}

                        </div>
                    </div>
                </div>

                <div className="SJ-Tab-Indicator-Container">
                    <div
                        className="SJ-Tab-Indicator"
                        style={{
                            transform: `translateX(${activeTab === 'youtube' ? '0' : '100%'})`,
                        }}
                    ></div>
                </div>
            </nav>

            <div className="WS-Link-Page-Content">
                {renderContent()}
            </div>
        </div>
    );
};

export default LinkPage;

// 완료 ===================================================================