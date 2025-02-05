import React, { useState, useMemo } from "react";
import "../../css/travel/GuidebookList.css";
import TravelPageModal from "./TravelPageModal";
import { FaSearch, FaTimes } from 'react-icons/fa';


function GuidebookList() {
  const [activeFilter, setActiveFilter] = useState("latest");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("guidebookFavorites");
    return new Set(saved ? JSON.parse(saved) : []);
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pinnedGuides, setPinnedGuides] = useState(() => {
    try {
      const saved = localStorage.getItem("guidebookPinned");
      return new Set(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error("Error initializing pinnedGuides:", error);
      return new Set(); // 에러 발생 시 빈 Set 반환
    }
  });
  const [searchText, setSearchText] = useState("");
  const [guideBookData, setGuideBookData] = useState([
    {
      id: 1,
      category: "오사카 여행",
      title: "오사카! 진돌이랑 유니버셜스튜디오",
      date: "2025-05-18",
      isPin: true,
      tags: ["꾸준", "산본노트", "인생유튜버의세계여행", "내일뭐하지"],
      score: 6,
    },
    {
      id: 2,
      category: "마쓰야마 여행",
      title: "마쓰야마 여행 4일|혼자|먹방",
      date: "2025-03-27",
      tags: ["에이엘A-EL", "빠니보틀", "원지의하루", "꾸준", "산본노트"],
      score: 4,
    },
    {
      id: 3,
      category: "마쓰야마 여행",
      title: "마쓰야마 여행 5일|혼자|먹방|온천",
      date: "2025-03-25",
      tags: ["에이엘A-EL", "빠니보틀", "원지의하루", "꾸준", "산본노트"],
      score: 5,
    },
    {
      id: 4,
      category: "마쓰야마 여행",
      title: "센과치히로의,온천여행⭐️",
      date: "2025-03-19",
      tags: ["에이엘A-EL", "빠니보틀", "원지의하루", "꾸준", "산본노트"],
      score: 3,
    },
  ]);

  // 정렬된 가이드북 데이터 계산
  const sortedGuideBooks = useMemo(() => {
    let sorted = [...guideBookData];

    // 먼저 고정된 항목을 최상단으로 정렬
    sorted.sort((a, b) => {
      const isPinnedA = pinnedGuides.has(a.id);
      const isPinnedB = pinnedGuides.has(b.id);
      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;

      // 고정 상태가 같은 경우 날짜순 정렬
      if (isPinnedA === isPinnedB) {
        return activeFilter === "latest"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

    // 즐겨찾기 필터 적용
    if (activeFilter === "favorite") {
      sorted = sorted.filter((guide) => favorites.has(guide.id));
    }

    return sorted;
  }, [guideBookData, activeFilter, favorites, pinnedGuides]);

  // 즐겨찾기 토글 함수
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      // localStorage에 저장
      localStorage.setItem(
        "guidebookFavorites",
        JSON.stringify([...newFavorites])
      );
      return newFavorites;
    });
  };

  // 고정하기 토글 함수
  const handlePinClick = (id) => {
    setPinnedGuides((prev) => {
      try {
        const newPinnedGuides = new Set([...prev]);
        if (newPinnedGuides.has(id)) {
          newPinnedGuides.delete(id);
        } else {
          newPinnedGuides.add(id);
        }
        // localStorage에 배열로 변환하여 저장
        localStorage.setItem(
          "guidebookPinned",
          JSON.stringify([...newPinnedGuides])
        );
        return newPinnedGuides;
      } catch (error) {
        console.error("Error in handlePinClick:", error);
        return prev; // 에러 발생 시 이전 상태 유지
      }
    });
    setShowModal(false);
  };

  // 더보기 버튼 클릭 핸들러
  const handleMoreOptionsClick = (id) => {
    setSelectedGuideId(id);
    setShowModal(true);
  };

  // 제목 업데이트 함수 추가
  const handleUpdateTitle = (itemId, newTitle) => {
    setGuideBookData(guideBookData.map(guide =>
      guide.id === itemId ? { ...guide, title: newTitle } : guide
    ));
  };

  return (
    <div className="SJ-guidebook-list">
      {/* 필터 버튼 */}
      <div className="SJ-filter-buttons">
        <button
          className={`SJ-filter-btn ${activeFilter === "latest" ? "active" : ""
            }`}
          onClick={() => setActiveFilter("latest")}
        >
          최신순
        </button>
        <button
          className={`SJ-filter-btn ${activeFilter === "created" ? "active" : ""
            }`}
          onClick={() => setActiveFilter("created")}
        >
          생성일
        </button>
        <button
          className={`SJ-filter-btn ${activeFilter === "favorite" ? "active" : ""
            }`}
          onClick={() => setActiveFilter("favorite")}
        >
          즐겨찾기
        </button>
      </div>

      <div className="SJ-search-Container">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
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

      <div className="WS-guide-container">
        {sortedGuideBooks.map((guide) => (

          <div key={guide.id} className="SJ-guide-card">

            <div className="SJ-guide-content">

              {pinnedGuides.has(guide.id) && (
                <div className="SJ-pin-icon">📌</div>
              )}

              <div className="SJ-guide-category">{guide.category}</div>

              <div
                className={`WS-favorite-button  ${favorites.has(guide.id) ? "filled" : "outlined"
                  }`}
                onClick={() => toggleFavorite(guide.id)}
              >
                {favorites.has(guide.id) ? "♥" : "♡"}
              </div>

              <div className="SJ-guide-header">
                <div className="SJ-guide-title">{guide.title}</div>
                <div className="SJ-guide-score">코스 {guide.score}</div>
              </div>
              <div className="SJ-guide-footer">
                <div className="SJ-guide-date">생성일 {guide.date}</div>
                <div className="SJ-guide-tags">
                  {guide.tags.map((tag, index) => (
                    <span key={index} className="SJ-guide-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="SJ-more-button"
                onClick={() => handleMoreOptionsClick(guide.id)}
              >
                ⋮
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* 모달 컴포넌트 추가 */}
      <TravelPageModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedItemId={selectedGuideId}

        handlePinToggle={handlePinClick}
        pinnedItems={Array.from(pinnedGuides)}
        onUpdateTitle={handleUpdateTitle}
        items={guideBookData}
      />
    </div>
  );
}

export default GuidebookList;
