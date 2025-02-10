import React from "react";
import "../../css/mypage/AccountSettings.css";
import GoogleLogo from "../../images/google_logo.png";

function AccountSettings({ onBack }) {
  // 나중에 구글 로그아웃 구현을 위한 주석 처리
  // const handleLogout = async () => {
  //   try {
  //     // 여기에 나중에 구글 로그아웃 로직 추가
  //     // await googleLogout();
  //     // navigate('/');
  //   } catch (error) {
  //     console.error('로그아웃 실패:', error);
  //   }
  // };

  return (
    <div className="SJ_account_settings">
      <div className="SJ_settings_header">
        <button onClick={onBack} className="SJ_back_button">
          &lt;
        </button>
        <h1>내 정보 관리</h1>
      </div>

      <div className="SJ_settings_content">
        <div className="SJ_settings_section">
          <p className="SJ_section_label">이름</p>
          <div className="SJ_section_content">
            <p>김수진</p>
          </div>
        </div>

        <div className="SJ_settings_section">
          <p className="SJ_section_label">이메일</p>
          <div className="SJ_section_content">
            <p>mytravellink.com</p>
          </div>
        </div>
      </div>

      <div className="SJ_login_options">
        <div className="SJ_google_login">
          <img src={GoogleLogo} alt="Google" className="SJ_google_icon" />
          구글로그인
        </div>
        <button
          className="SJ_logout_button"
          // onClick={handleLogout} 나중에 구현
        >
          로그아웃
        </button>
      </div>

      <div className="SJ_withdrawal">
        <button className="SJ_withdrawal_link">회원탈퇴</button>
      </div>
    </div>
  );
}

export default AccountSettings;
