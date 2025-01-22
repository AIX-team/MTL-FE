import React from 'react';
import LinkList from './LinkList';          // 링크 목록 컴포넌트
import SearchYoutube from './SearchYoutube';// 유튜브 검색 컴포넌트
import '../../css/linkpage/LinkPage.css';

const LinkPage = ({ activeTab, linkData, setLinkData }) => {
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

    return (
        <div className="WS-Link-Page">
            <div className="WS-Link-Content">
                {renderContent()}
            </div>
        </div>
    );
};

export default LinkPage;
