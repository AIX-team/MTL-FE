import React, { useState, useEffect, useMemo } from "react";
import "./TravelList.css";
import osakaImg from "../../../images/osaka.png";
import matsuyamaImg from "../../../images/matsuyama.png";
import tokyoImg from "../../../images/tokyo.png";
import GuidebookList from "../GuidebookList/GuidebookList";

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
  ]);

  const [activeFilter, setActiveFilter] = useState("latest"); // 'latest', 'created', 'favorite'
  const [showModal, setShowModal] = useState(false); // 모달 버튼
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // 이름 수정
  const [editingTitle, setEditingTitle] = useState(""); // 수정 적용 구현
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const [pinnedItems, setPinnedItems] = useState([]); // 고정된 항목 관리
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("travel"); // 가이드북 탭 관리

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // 고정 토글 핸들러
  const handlePinToggle = (itemId) => {
    if (pinnedItems.includes(itemId)) {
      setPinnedItems((prev) => prev.filter((id) => id !== itemId));
    } else {
      setPinnedItems((prev) => [...prev, itemId]);
    }
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
  // 고정핀 클릭 or 해제
  const handlePinClick = (id) => {
    setTravelItems(
      travelItems.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    );
    setShowModal(false);
  };
  // 여행 이름 수정
  const handleEditClick = (id) => {
    const item = travelItems.find((item) => item.id === id);
    setEditingTitle(item.title);
    setIsEditing(true);
    setShowModal(false);
  };
  // 여행 이름 저장
  const handleEditSubmit = (id) => {
    setTravelItems(
      travelItems.map((item) =>
        item.id === id ? { ...item, title: editingTitle } : item
      )
    );
    setIsEditing(false);
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

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (option) => {
    console.log("정렬 옵션 변경:", option);
    setSortOption(option);
  };

  // 즐겨찾기 토글 핸들러
  const handleFavoriteToggle = () => {
    setShowFavorites((prev) => !prev);
    //setShowFavorites(!showFavorites);
    console.log("즐겨찾기 필터:", !showFavorites);
  };

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
  console.log("현재 showFavorites 상태:", showFavorites);

  // 삭제 모달 열기
  const handleDeleteClick = (itemId) => {
    setShowDeleteModal(true);
    // ⭐️임시로 console.log만 추가⭐️
    console.log("삭제 기능은 백엔드 연동 후 구현 예정");
  };

  // 삭제 확인 (임시로 모달만 닫기)
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setShowModal(false);
    // ⭐️실제 삭제 로직은 주석 처리⭐️
    // setData(prev => prev.filter(item => item.id !== itemToDelete));
  };

  return (
    <div className="travel-list">
      <div className="tab-container">
        <div className="tabs">
          <div
            className={`tab ${activeTab === "travel" ? "active" : ""}`}
            onClick={() => setActiveTab("travel")}
          >
            여행 목록
          </div>
          <div
            className={`tab ${activeTab === "guide" ? "active" : ""}`}
            onClick={() => setActiveTab("guide")}
          >
            가이드북 목록
          </div>
        </div>
        <div
          className="tab-indicator"
          style={{
            transform: `translateX(${activeTab === "travel" ? "0" : "100%"})`,
          }}
        ></div>
      </div>

      {activeTab === "travel" ? ( // 가이드북 탭
        <div className="travel-container">
          <div className="SJ-filter-buttons">
            <button
              className={`SJ-filter-btn ${
                activeFilter === "latest" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("latest")}
            >
              최신순
            </button>
            <button
              className={`SJ-filter-btn ${
                activeFilter === "created" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("created")}
            >
              생성일
            </button>
            <button
              className={`SJ-filter-btn ${
                activeFilter === "favorite" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("favorite")}
            >
              즐겨찾기
            </button>
          </div>

          <div className="search-section">
            <span className="search-title">내가 찾았던 여행</span>
            <div className="search-bar">
              <input type="text" placeholder="검색어를 입력하세요" />
              <button className="search-icon">🔍</button>
            </div>
          </div>

          <div className="travel-grid">
            {sortedAndFilteredData.map((item) => (
              <div key={item.id} className="travel-card">
                {pinnedItems.includes(item.id) && (
                  <div className="SJ-pin-icon">📌</div>
                )}
                <div className="travel-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="SJ-card-content">
                  <div className="SJ-card-header">
                    {isEditing && selectedItemId === item.id ? (
                      <div className="SJ-edit-title">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          autoFocus
                        />
                        <div className="SJ-edit-buttons">
                          <button
                            onClick={() => handleEditSubmit(item.id)}
                            className="SJ-confirm"
                          >
                            확인
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="SJ-cancel"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </div>
                  <div className="SJ-card-footer">
                    <span className="SJ-period">{item.period}</span>
                    <span className="SJ-date">{item.date}</span>
                  </div>
                </div>
                <div className="SJ-btn-frame">
                  <div
                    className={`favorite-button ${
                      item.isFavorite ? "filled" : "outlined"
                    }`}
                    onClick={() => toggleFavorite(item.id)}
                  >
                    {item.isFavorite ? "♥" : "♡"}
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

          {/* 모달 */}
          {showModal && (
            <>
              <div
                className="SJ-modal-overlay"
                onClick={() => setShowModal(false)}
              />
              <div className="SJ-modal-bottom">
                <div className="SJ-modal-content">
                  <button
                    className="SJ-modal-option"
                    onClick={() => {
                      handlePinToggle(selectedItemId);
                      setShowModal(false);
                    }}
                  >
                    <span className="SJ-modal-icon">📌</span>
                    {pinnedItems.includes(selectedItemId)
                      ? "고정 해제"
                      : "고정 하기"}
                  </button>
                  <button
                    className="SJ-modal-option"
                    onClick={() => handleEditClick(selectedItemId)}
                  >
                    <span className="SJ-modal-icon">✏️</span>
                    이름 수정
                  </button>
                  <button
                    className="SJ-modal-option"
                    onClick={() => handleDeleteClick(selectedItemId)}
                  >
                    <span className="SJ-modal-icon">🗑️</span>
                    삭제
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ⭐️삭제 확인 모달 (기능만 비활성화)⭐️ */}
          {showDeleteModal && (
            <div className="SJ-delete-modal-overlay">
              <div className="SJ-delete-modal">
                <p className="SJ-delete-title">삭제하시겠습니까?</p>
                <p className="SJ-delete-subtitle">여행 목록에서 삭제됩니다.</p>
                <div className="SJ-delete-buttons">
                  <button
                    className="SJ-delete-button cancel"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    취소
                  </button>
                  <button
                    className="SJ-delete-button confirm"
                    onClick={handleDeleteConfirm}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <GuidebookList />
      )}
    </div>
  );
};

export default TravelList;
