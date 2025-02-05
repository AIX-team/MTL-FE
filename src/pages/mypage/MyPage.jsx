import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';  // 추가
import "./MyPage.css";
import ProfileExample from "../../images/Profile_example.png";
import AccountSettings from "../AccountSettings/AccountSettings";

function MyPage() {
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();  // 추가

  if (showSettings) {
    return <AccountSettings onBack={() => setShowSettings(false)} />;
  }

  
  // 링크 페이지로 이동하는 함수
  const handleCreateLink = () => {
    navigate('/LinkPage');  // '/link'는 링크 페이지의 경로입니다
  };

  return (
    <div className="SJ_my_page">
      <div className="SJ_logo">
        <h1>My Travel Link✈️</h1>
      </div>

      <div className="SJ_profile_section">
        <div className="SJ_profile_image">
          <img src={ProfileExample} alt="Profile" className="SJ_profile_img" />
        </div>
        <div className="SJ_profile_info">
          <div className="SJ_user_name">에이엘님</div>
          <div className="SJ_travel_message">즐거운 여행되세요!</div>
          <button
            className="SJ_settings_button"
            onClick={() => setShowSettings(true)}
          >
            내 정보 관리 &gt;
          </button>
        </div>
      </div>

      <div className="SJ_main_button">
        <button className="SJ_create_link_btn">
          나만의 여행 링크 만들기!
          <p className="SJ_button_subtitle">유튜브 링크 선택하러 이동</p>
        </button>
      </div>
    </div>
  );
}

export default MyPage;
