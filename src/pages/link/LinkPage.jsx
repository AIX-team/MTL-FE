import React, { useState, useEffect } from 'react';
import LinkList from './LinkList';          // 링크 목록 컴포넌트
import SearchYoutube from './SearchYoutube';// 유튜브 검색 컴포넌트
import '../../css/linkpage/LinkPage.css';
import { FaCheck } from 'react-icons/fa'; // 체크 아이콘 import
import youtubeIcon from '../../images/youtube.png'; // YouTube 로고 이미지 import
import { useNavigate } from 'react-router-dom'; // 추가


const LinkPage = () => {
    const navigate = useNavigate(); // 추가
    const [activeTab, setActiveTab] = useState('youtube');
    const [linkData, setLinkData] = useState([]); // 빈 배열로 초기화
    const [linkCount, setLinkCount] = useState(0); // 0으로 초기화

    const renderContent = () => {
        switch (activeTab) {
            case 'links':
                return <LinkList linkData={linkData} setLinkData={setLinkData} />;
            case 'youtube':
                return <SearchYoutube linkData={linkData} setLinkData={setLinkData} />;
            default:
                return null;
        }
    };

    // 토큰 검사 useEffect
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    // linkCount 업데이트
    useEffect(() => {
        setLinkCount(linkData.length);
    }, [linkData]);

  return (
    <div className="WS-Link-Page">
      {/* 탭 영역 */}
      <nav className="WS-Link-Tab-Container">
        {/* 유튜브검색 탭 */}
        <div className="WS-Link-Tabs">
          <div
            id="WS-Link-youtube-tab"
            className={`WS-Link-Tab ${activeTab === "youtube" ? "active" : ""}`}
            onClick={() => setActiveTab("youtube")}
          >
            <div className="WS-Link-Tab-Content">
              <img
                src={youtubeIcon}
                alt="YouTube"
                className="WS-youtube-icon"
              />
              <span className="WS-Link-Tab-text">유튜브 검색</span>
            </div>
          </div>

          {/* 링크 탭 */}
          <div
            id="WS-Link-links-tab"
            onClick={() => setActiveTab("links")}
            className={`WS-Link-Tab ${activeTab === "links" ? "active" : ""}`}
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
              transform: `translateX(${
                activeTab === "youtube" ? "0" : "100%"
              })`,
            }}
          ></div>
        </div>
      </nav>

      <div className="WS-Link-Page-Content">{renderContent()}</div>
    </div>
  );
};

export default LinkPage;

// 완료 ===================================================================
