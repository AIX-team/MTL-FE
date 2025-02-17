import React, { useState, useMemo, useEffect } from "react";
import "../../css/travel/GuidebookList.css";
import TravelPageModal from "./TravelPageModal";
import { FaSearch, FaTimes } from "react-icons/fa";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import axiosInstance from "../../components/AxiosInstance";

function GuidebookList() {
  const [activeFilter, setActiveFilter] = useState("latest");
  const [showModal, setShowModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [guideBookData, setGuideBookData] = useState([]);

  useEffect(() => {
    getGuideBookList();
  }, []);

  // 가이드북 목록 조회 api
  const getGuideBookList = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/travels/guidebooks/list"
      );
      setGuideBookData(response.data.guideBooks || []);
      console.log(response.data.guideBooks);
    } catch (error) {
      console.error("가이드북 목록을 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  // 즐겨찾기 업데이트 api
  const putFavorite = async (id, favorite) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/travels/guidebooks/${id}/favorite`,
        {
          isTrue: favorite,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("즐겨찾기 업데이트 중 오류가 발생했습니다:", error);
    }
  };

  // 고정 업데이트 api
  const putPin = async (id, pin) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/travels/guidebooks/${id}/fixed`,
        {
          isTrue: pin,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("고정 업데이트 중 오류가 발생했습니다:", error);
    }
  };

  // 제목 업데이트 api
  const putUpdateTitle = async (id, title) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/travels/guidebooks/${id}/title`,
        {
          value: title,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("제목 업데이트 중 오류가 발생했습니다:", error);
    }
  };

  // 가이드북 삭제 api
  const deleteGuideBook = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/api/v1/travels/guidebooks/${id}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("가이드북 삭제 중 오류가 발생했습니다:", error);
    }
  };

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    // travelItems가 없거나 배열이 아닐 경우 빈 배열 반환
    if (!guideBookData || !Array.isArray(guideBookData)) {
      return [];
    }
    console.log("searchText:", searchText);
    // 검색어로 먼저 필터링
    let filtered = guideBookData;
    if (searchText.trim()) {
      filtered = guideBookData.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    console.log("filtered:", filtered);

    // activeFilter가 'favorite'일 때만 즐겨찾기 필터링 적용
    if (activeFilter === "favorite") {
      return filtered.filter((item) => item.isFavorite === true);
    }
    if (activeFilter === true) {
      // 최신순 정렬
      return filtered.sort((a, b) => {
        const dateA = new Date(a.createAt);
        const dateB = new Date(b.createAt);
        return dateB - dateA;
      });
    } else if (activeFilter === false) {
      // 오래된 순 정렬
      return filtered.sort((a, b) => {
        const dateA = new Date(a.createAt);
        const dateB = new Date(b.createAt);
        return dateA - dateB;
      });
    }
    return filtered;
  }, [guideBookData, activeFilter, searchText]);

  // 정렬된 가이드북 데이터 계산
  const sortedGuideBooks = useMemo(() => {
    let sorted = [...filteredData];

    // 먼저 고정된 항목을 최상단으로 정렬
    sorted.sort((a, b) => {
      const isPinnedA = a.fixed;
      const isPinnedB = b.fixed;
      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;

      // 고정 상태가 같은 경우 날짜순 정렬
      if (isPinnedA === isPinnedB) {
        if (sortAsc) {
          return new Date(b.createAt) - new Date(a.createAt);
        } else {
          return new Date(a.createAt) - new Date(b.createAt);
        }
      }
      return 0;
    });

    // 즐겨찾기 필터 적용
    if (activeFilter === "favorite") {
      sorted = sorted.filter((guide) => guide.isFavorite);
    }

    return sorted;
  }, [filteredData, activeFilter, sortAsc]);

  // 즐겨찾기 토글 함수
  const toggleFavorite = (id) => {
    // 즐겨찾기 상태 변경
    const favorite = guideBookData.find((guide) => guide.id === id).isFavorite;
    putFavorite(id, !favorite);
    setGuideBookData(
      guideBookData.map((guide) =>
        guide.id === id ? { ...guide, isFavorite: !guide.isFavorite } : guide
      )
    );
  };

  // 고정 토글 핸들러
  const handlePinClick = (item) => {
    // 고정 상태 변경
    setGuideBookData(
      guideBookData.map((guide) =>
        guide.id === item.id ? { ...guide, fixed: !guide.fixed } : guide
      )
    );
    putPin(item.id, !item.fixed);
    setShowModal(false);
  };

  // 더보기 버튼 클릭 핸들러
  const handleMoreOptionsClick = (item) => {
    setSelectedGuide(item);
    setShowModal(true);
  };

  // 제목 업데이트 함수 추가
  const handleUpdateTitle = (item, newTitle) => {
    try {
      console.log(item.id, newTitle);
      putUpdateTitle(item.id, newTitle);
      setGuideBookData(
        guideBookData.map((guide) =>
          guide.id === item.id ? { ...guide, title: newTitle } : guide
        )
      );
    } catch (error) {
      console.error(
        "가이드북 제목을 업데이트하는 중 오류가 발생했습니다:",
        error
      );
    }
  };

  const handleFilterClick = (filter) => {
    console.log(filter);
    console.log(sortAsc);
    if (filter === true) {
      setSortAsc(filter);
      setActiveFilter(filter);
    } else if (filter === false) {
      setSortAsc(filter);
      setActiveFilter(filter);
    } else {
      setActiveFilter(filter);
    }
  };

  const handleDeleteItem = (item) => {
    setGuideBookData(guideBookData.filter((guide) => guide.id !== item.id));
    deleteGuideBook(item.id);
    setShowModal(false);
  };

  return (
    <div className="SJ-guidebook-list">
      {/* 필터 버튼 */}
      <div className="SJ-filter-buttons">
        <button
          className={`SJ-filter-btn ${
            activeFilter === "favorite" ? "" : "active"
          }`}
          //activeFilter가 favorite일 때 sortAsc, 아닐 때 !sortAsc
          onClick={() =>
            handleFilterClick(activeFilter === "favorite" ? sortAsc : !sortAsc)
          }
        >
          생성일{" "}
          {sortAsc === true ? (
            <HiChevronDown style={{ verticalAlign: "middle" }} />
          ) : (
            <HiChevronUp style={{ verticalAlign: "middle" }} />
          )}
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

      <div className="SJ-guidebook-search-Container">
        <input
          type="text"
          placeholder="가이드북 제목을 검색하세요"
          className="SJ-guidebook-search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="SJ-search-button-container">
          <button className="SJ-search-icon">
            {!searchText ? (
              <FaSearch />
            ) : (
              <FaTimes onClick={() => setSearchText("")} />
            )}
          </button>
        </div>
      </div>

      <div className="WS-guide-container">
        {Array.isArray(sortedGuideBooks) &&
          sortedGuideBooks.map((guide) => (
            <div key={guide.id} className="SJ-guide-card">
              <div className="SJ-guide-content">
                {guide.fixed && <div className="SJ-pin-icon">📌</div>}

                <div className="SJ-guide-category">{guide.travelInfoTitle}</div>

                <div
  className="WS-favorite-button"
  onClick={() => toggleFavorite(guide.id)}
>
  <span className={guide.isFavorite ? "filled-heart" : "empty-heart"}>
    {guide.isFavorite ? "♥" : "♡"}
  </span>
</div>

                <div className="SJ-guide-header">
                  <div className="SJ-guide-title">{guide.title}</div>
                  <div className="SJ-guide-score">코스 {guide.courseCount}</div>
                </div>
                <div className="SJ-guide-footer">
                  <div className="SJ-guide-date">생성일 {guide.createAt}</div>
                  <div className="SJ-guide-tags">
                    {Array.isArray(guide.authors) &&
                      guide.authors.map((author, index) => (
                        <span key={index} className="SJ-guide-tag">
                          #{author}
                        </span>
                      ))}
                  </div>
                </div>
                <button
                  className="SJ-more-button"
                  onClick={() => handleMoreOptionsClick(guide)}
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
        selectedItem={selectedGuide}
        handlePinToggle={handlePinClick}
        onUpdateTitle={handleUpdateTitle}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
}

export default GuidebookList;
