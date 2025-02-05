import React, { useState, useEffect, useMemo } from "react";
import "../../css/travel/TravelList.css";
import osakaImg from "../../images/osaka.png";
import matsuyamaImg from "../../images/matsuyama.png";
import tokyoImg from "../../images/tokyo.png";
import TravelPageModal from "./TravelPageModal";
import { FaSearch, FaTimes } from 'react-icons/fa';

const TravelList = () => {
  const [travelItems, setTravelItems] = useState([
    {
      id: 1,
      title: "오사카 여행",
      date: "2025-05-18",
      period: "일정 3일",
      image: osakaImg, // import한 이미지 사용
      isFavorite: true,
      isPinned: false,
    },
    {
      id: 2,
      title: "마쓰야마 여행",
      date: "2025-03-27",
      period: "일정 5일",
      image: matsuyamaImg, // import한 이미지 사용
      isFavorite: true,
      isPinned: false,
    },

    {
      id: 3,
      title: "도쿄 여행",
      date: "2025-02-21",
      period: "일정 4일",
      image: tokyoImg, // import한 이미지 사용
      isFavorite: false,
      isPinned: false,
    },
    {
      id: 4,
      title: "교토 여행",
      date: "2025-02-21",
      period: "일정 4일",
      image: tokyoImg, // import한 이미지 사용
      isFavorite: false,
      isPinned: false,
    },
    {
      id: 5,
      title: "교토 여행",
      date: "2025-02-21",
      period: "일정 4일",
      image: tokyoImg, // import한 이미지 사용
      isFavorite: false,
      isPinned: false,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("latest");
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [pinnedItems, setPinnedItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // 고정 토글 핸들러
  const handlePinClick = (itemId) => {
    if (pinnedItems.includes(itemId)) {
      setPinnedItems((prev) => prev.filter((id) => id !== itemId));
    } else {
      setPinnedItems((prev) => [...prev, itemId]);
    }
    setShowModal(false);
  };

  // 즐겨찾기 토글 함수
  const toggleFavorite = (id) => {
    setTravelItems(
      travelItems.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleMoreOptionsClick = (id) => {
    setSelectedItemId(id);
    setShowModal(true);
  };


  // 데이터 구조 확인
  useEffect(() => {
    console.log("데이터 구조 확인:", travelItems);
    console.log("첫 번째 아이템:", travelItems[0]);
  }, [travelItems]);

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    // activeFilter가 'favorite'일 때만 즐겨찾기 필터링 적용
    if (activeFilter === "favorite") {
      return travelItems.filter((item) => item.isFavorite === true);
    }
    return travelItems;
  }, [travelItems, activeFilter]);

  // 필터링 및 정렬된 데이터 계산
  const sortedAndFilteredData = useMemo(() => {
    let filtered = [...filteredData];

    // 고정된 항목을 최상단으로 정렬
    return filtered.sort((a, b) => {
      // 둘 다 고정되었거나 둘 다 고정되지 않은 경우 기존 정렬 유지
      const isPinnedA = pinnedItems.includes(a.id);
      const isPinnedB = pinnedItems.includes(b.id);

      if (isPinnedA === isPinnedB) {
        // 날짜 기준 정렬
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return activeFilter === "latest" ? dateB - dateA : dateA - dateB;
      }
      // 고정된 항목을 위로
      return isPinnedB ? 1 : -1;
    });
  }, [filteredData, activeFilter, pinnedItems]);

  // 데이터 확인용 콘솔 로그
  console.log("전체 데이터:", travelItems);
  console.log("필터링된 데이터:", filteredData);

  // 아이템 이름 수정 함수
  const handleUpdateTitle = (itemId, newTitle) => {
    setTravelItems(travelItems.map(item =>
      item.id === itemId ? { ...item, title: newTitle } : item
    ));
  };

  // 아이템 삭제 함수
  const handleDeleteItem = (itemId) => {
    setTravelItems(travelItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="SJ-Travel-List">
      <div className="SJ-travel-container">
        <div className="SJ-filter-buttons">
          <button
            className={`SJ-filter-btn ${activeFilter === "latest" ? "active" : ""
              }`}
            onClick={() => handleFilterClick("latest")}
          >
            최신순
          </button>
          <button
            className={`SJ-filter-btn ${activeFilter === "created" ? "active" : ""
              }`}
            onClick={() => handleFilterClick("created")}
          >
            생성일
          </button>
          <button
            className={`SJ-filter-btn ${activeFilter === "favorite" ? "active" : ""
              }`}
            onClick={() => handleFilterClick("favorite")}
          >
            즐겨찾기
          </button>
        </div>

        <div className="SJ-search-Container">
          <input
            type="text"
            placeholder="내가 만든 여행을 검색하세요"
            className="SJ-search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="SJ-search-button-container">
            {searchText && (
              <button className="SJ-search-clear" onClick={() => setSearchText("")}>
                <FaTimes />
              </button>
            )}
            <button className="SJ-search-icon"><FaSearch /></button>
          </div>
        </div>

        <div className="SJ-travel-grid">
          {sortedAndFilteredData.map((item) => (

            <div key={item.id} className="SJ-travel-card">

              {pinnedItems.includes(item.id) && (
                <div className="SJ-pin-icon">📌</div>
              )}

              <div className="SJ-travel-img">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="SJ-card-content">

                <div
                  className={`WS-favorite-button ${item.isFavorite ? "filled" : "outlined"
                    }`}
                  onClick={() => toggleFavorite(item.id)}
                >
                  {item.isFavorite ? "♥" : "♡"}
                </div>

                <div className="SJ-card-header">
                  <div className="SJ-card-title">{item.title}</div>
                </div>

                <div className="SJ-card-footer">
                  <span className="SJ-card-period">{item.period}</span>
                  <span className="SJ-card-date">{item.date}</span>
                </div>

                <button
                  className="SJ-more-button"
                  onClick={() => handleMoreOptionsClick(item.id)}
                >
                  ⋮
                </button>
              </div>
            </div>
          ))}
        </div>
        <TravelPageModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedItemId={selectedItemId}
          handlePinToggle={handlePinClick}
          pinnedItems={pinnedItems}
          onUpdateTitle={handleUpdateTitle}
          onDeleteItem={handleDeleteItem}
          items={travelItems}
        />
      </div>
    </div>
  );
};

export default TravelList;
