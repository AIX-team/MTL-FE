import React from "react";
import "./TravelList.css";

const TravelList = () => {
  const travelItems = [
    {
      id: 1,
      title: "오사카 여행",
      date: "2025-05-18",
      period: "일정 3일",
      image: "/images/osaka.png",
      isFavorite: true,
    },
    {
      id: 2,
      title: "마쓰야마 여행",
      date: "2025-03-27",
      period: "일정 5일",
      image: "/images/matsuyama.png",
      isFavorite: true,
    },
    {
      id: 3,
      title: "도쿄 여행",
      date: "2025-02-21",
      period: "일정 4일",
      image: "/images/tokyo.jpg",
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
            <img src={item.image} alt={item.title} />
            <div className="card-content">
              <div className="card-header">
                <h3>{item.title}</h3>
                <span className="date">{item.date}</span>
              </div>
              <p className="period">{item.period}</p>
              <button className="more-options">⋮</button>
            </div>
            <button
              className={`favorite-button ${
                item.isFavorite ? "filled" : "outlined"
              }`}
            >
              {item.isFavorite ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelList;
