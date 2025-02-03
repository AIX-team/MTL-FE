import React, { useState, useMemo } from "react";
import "./GuidebookList.css";

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

  // 이름 수정 핸들러
  const handleEditClick = (id) => {
    const guide = guideBookData.find((g) => g.id === id);
    setEditingTitle(guide.title); // 현재 제목으로 초기화
    setSelectedGuideId(id); // 선택된 가이드북 ID 저장
    setIsEditing(true);
    setShowModal(false);
  };

  // 이름 수정 저장
  const handleEditSubmit = (id) => {
    try {
      setGuideBookData((prev) =>
        prev.map((guide) =>
          guide.id === id ? { ...guide, title: editingTitle } : guide
        )
      );
      console.log("제목 수정됨:", editingTitle); // 디버깅용
      setIsEditing(false);
      setSelectedGuideId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
    }
  };

  // 나중에 백엔드 연동 시 사용할 API 함수 미리 준비 ⭐️⭐️⭐️
  const updateGuidebookTitle = async (id, newTitle) => {
    // TODO: 백엔드 API 호출
    // const response = await api.put(`/guidebook/${id}`, { title: newTitle });
    // return response.data;
  };

  // 삭제 모달 열기
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowModal(false);
  };

  // 삭제 확인
  const handleDeleteConfirm = () => {
    // 실제 구현에서는 여기에 삭제 로직 추가
    setShowDeleteModal(false);
  };

  return (
    <div className="guidebook-list">
      {/* 필터 버튼 */}
      <div className="SJ-filter-buttons">
        <button
          className={`SJ-filter-btn ${
            activeFilter === "latest" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("latest")}
        >
          최신순
        </button>
        <button
          className={`SJ-filter-btn ${
            activeFilter === "created" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("created")}
        >
          생성일
        </button>
        <button
          className={`SJ-filter-btn ${
            activeFilter === "favorite" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("favorite")}
        >
          즐겨찾기
        </button>
      </div>

      {/* 검색창 */}
      <div className="SJ-search-container">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="SJ-search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {searchText && (
          <button className="SJ-search-clear" onClick={() => setSearchText("")}>
            ✕
          </button>
        )}
        <button className="SJ-search-button">🔍</button>
      </div>

      <div className="guide-container">
        {sortedGuideBooks.map((guide) => (
          <div key={guide.id} className="SJ-guide-card">
            <div className="SJ-guide-content">
              {pinnedGuides.has(guide.id) && (
                <span className="SJ-pin-icon">📌</span>
              )}
              <div className="SJ-guide-category">{guide.category}</div>
              <div className="SJ-guide-header">
                {isEditing && selectedGuideId === guide.id ? (
                  <div className="SJ-edit-title">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      autoFocus
                    />
                    <div className="SJ-edit-buttons">
                      <button
                        onClick={() => handleEditSubmit(guide.id)}
                        className="SJ-confirm"
                      >
                        확인
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedGuideId(null);
                          setEditingTitle("");
                        }}
                        className="SJ-cancel"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="SJ-guide-title">{guide.title}</span>
                )}
                <div className="SJ-guide-score">코스 {guide.score}</div>
              </div>
              <div className="SJ-guide-footer">
                <div className="SJ-guide-date">생성일 {guide.date}</div>
                <div className="SJ-guide-tags-container">
                  <div className="SJ-guide-tags">
                    {guide.tags.map((tag, index) => (
                      <span key={index} className="SJ-guide-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="SJ-btn-frame">
              <div
                className={`favorite-button ${
                  favorites.has(guide.id) ? "filled" : "outlined"
                }`}
                onClick={() => toggleFavorite(guide.id)}
              >
                {favorites.has(guide.id) ? "♥" : "♡"}
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

      {/* 더보기 모달 */}
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
                onClick={() => handlePinClick(selectedGuideId)}
              >
                <span className="SJ-modal-icon">📌</span>
                {pinnedGuides.has(selectedGuideId) ? "고정 해제" : "고정 하기"}
              </button>
              <button
                className="SJ-modal-option"
                onClick={() => handleEditClick(selectedGuideId)}
              >
                <span className="SJ-modal-icon">✏️</span>
                이름 수정
              </button>
              <button className="SJ-modal-option" onClick={handleDeleteClick}>
                <span className="SJ-modal-icon">🗑️</span>
                삭제
              </button>
            </div>
          </div>
        </>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="SJ-delete-modal-overlay">
          <div className="SJ-delete-modal">
            <p className="SJ-delete-title">삭제하시겠습니까?</p>
            <p className="SJ-delete-subtitle">가이드북 목록에서 삭제됩니다.</p>
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
  );
}

export default GuidebookList;
