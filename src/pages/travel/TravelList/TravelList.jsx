import React from "react";
import "./TravelList.css";
import osakaImg from "../../../images/osaka.png"; 
import matsuyamaImg from "../../../images/matsuyama.png";
import tokyoImg from "../../../images/tokyo.png";

const TravelList = () => {
  const travelItems = [
    {
      id: 1,
      title: "오사카 여행",
      date: "2025-05-18",
      period: "일정 3일",
      image: osakaImg,     // import한 이미지 사용
      isFavorite: true,
    },
    {
      id: 2,
      title: "마쓰야마 여행",
      date: "2025-03-27",
      period: "일정 5일",
      image: matsuyamaImg,  // import한 이미지 사용
      isFavorite: true,
    },
    {
      id: 3,
      title: "도쿄 여행",
      date: "2025-02-21",
      period: "일정 4일",
      image: tokyoImg,  // import한 이미지 사용
      isFavorite: false,
    },
  ];

  return (
    <div className="travel-list">
      <div className="tab-container">
        <div className="tabs">
          <button className="tab active">여행 목록</button>
          <button className="tab">가이드북 목록</button>
        </div>
      </div>

      <div className="filter-buttons">
        <button className="active">최신순</button>
        <button>생성일</button>
        <button>즐겨찾기</button>
      </div>

      <div className="search-section">
        <span className="search-title">내가 찾았던 여행</span>
        <div className="search-bar">
          <input type="text" placeholder="검색어를 입력하세요" />
          <button className="search-icon">🔍</button>
        </div>
      </div>

      <div className="travel-grid">
        {travelItems.map((item) => (
          <div key={item.id} className="travel-card">
            <div className="travel-img">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="card-content">
              <div className="card-header">
                <span>{item.title}</span>
                <span className="date">{item.date}</span>
              </div>
              <p className="period">{item.period}</p>
            </div>
            <div className="SJ-btn-frame">
            <div
              className={`favorite-button ${
                item.isFavorite ? "filled" : "outlined"
              }`}
            >
              {item.isFavorite ? "♥" : "♡"}
            </div>
            <div className="more-options">⋮</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelList;
