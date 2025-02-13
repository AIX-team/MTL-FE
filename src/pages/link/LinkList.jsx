import React, { useState, useEffect } from "react";
import Modal from "../../layouts/AlertModal";
import "../../css/linkpage/LinkList.css";
import { FaMinus } from "react-icons/fa";
import SelectDayTab from "./SelectDayTab";
import axios from "axios";

const LinkList = ({ linkData, setLinkData, refreshLinks }) => {
  const [inputLink, setInputLink] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDayTab, setShowDayTab] = useState(false);

  // 모달 표시 함수
  const showModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  // URL 유효성 검사 함수
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // 링크 타입 확인 함수
  const getLinkType = (url) => {
    const loweredUrl = url.toLowerCase();
    if (loweredUrl.includes("youtube.com") || loweredUrl.includes("youtu.be")) {
      return "youtube";
    } else if (
      loweredUrl.includes("naver.com") ||
      loweredUrl.includes("blog.naver")
    ) {
      return "blog";
    }
    return null;
  };

  // URL 중복 체크 함수
  const isLinkDuplicate = (url) => {
    return linkData.some((link) => {
      const normalizeUrl = (url) => {
        try {
          const normalized = new URL(url);
          return normalized.hostname + normalized.pathname + normalized.search;
        } catch {
          return url;
        }
      };
      return normalizeUrl(link.url) === normalizeUrl(url);
    });
  };

  // 링크 추가 처리
  const handleAddLink = async () => {
    const trimmedUrl = inputLink.trim();
    if (!isValidUrl(trimmedUrl)) {
      alert('올바른 URL을 입력하세요.');
      return;
    }
    if (isLinkDuplicate(trimmedUrl)) {
      alert('중복된 URL입니다.');
      return;
    }

    // '@' 기호 제거
    const finalUrl = trimmedUrl.startsWith('@') ? trimmedUrl.slice(1) : trimmedUrl;
    let title, author;
    const linkType = getLinkType(finalUrl);

    if (linkType === "youtube") {
      // 유튜브 링크라면 oEmbed API를 통해 실제 제목과 작성자 가져오기
      try {
        const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
          finalUrl
        )}&format=json`;
        const response = await axios.get(oEmbedUrl);
        title = response.data.title;        // 실제 제목
        author = response.data.author_name;   // 실제 작성자
      } catch (error) {
        console.error("유튜브 메타데이터 가져오기 실패:", error);
        // 실패 시 기본값 사용
        title = "유튜브 영상 제목";
        author = "유튜브";
      }
    } else if (linkType === "blog") {
      title = finalUrl;
      author = "직접 추가";
    } else {
      title = finalUrl;
      author = "직접 추가";
    }

    const requestPayload = {
      url: finalUrl,
      title: title,
      author: author
    };

    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8080/user/save", requestPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInputLink("");
      refreshLinks(); // 저장 후 링크 목록 갱신
    } catch (error) {
      console.error("URL 추가 실패:", error);
      let msg = "URL 추가 실패";
      if (error.response && error.response.data) {
        msg = error.response.data.message || JSON.stringify(error.response.data);
      }
      alert(msg);
    }
  };

  // 링크 삭제 함수
  const handleDeleteLink = async (link) => {
    if (!window.confirm(`${link.url}을(를) 삭제하시겠습니까?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/user/delete?url=${encodeURIComponent(link.url)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshLinks();
    } catch (error) {
      console.error("URL 삭제 실패:", error);
      let msg = "URL 삭제 실패";
      if (error.response && error.response.data) {
        msg = error.response.data.message || JSON.stringify(error.response.data);
      }
      alert(msg);
    }
  };

  const handleNextClick = () => {
    setShowDayTab(true);
  };

  const handleBack = () => {
    setShowDayTab(false);
  };

  // 백엔드 값이 없을 경우를 대비한 링크 타입 판별 함수
  const detectLinkType = (link) => {
    if (link.type) {
      return link.type;
    }
    if (link.url) {
      const loweredUrl = link.url.toLowerCase().trim();
      if (loweredUrl.includes("youtube.com") || loweredUrl.includes("youtu.be")) {
        return "youtube";
      }
    }
    return "blog";
  };

  if (showDayTab) {
    return <SelectDayTab onBack={handleBack} />;
  }

  return (
    <div className="WS-LinkList">
      <div className="WS-Link-Input-Container">
        <input
          id="WS-Link-Input"
          type="text"
          placeholder="유튜브 또는 블로그 링크 붙여넣기"
          className="WS-Link-Input"
          value={inputLink}
          onChange={(e) => setInputLink(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddLink();
            }
          }}
        />
        <button className="WS-LinkList-AddButton" onClick={handleAddLink}>
          {" "}
          +{" "}
        </button>
      </div>

      <div className="WS-LinkList-Items">
        {linkData.map((link, index) => {
          // 저장된 링크 데이터의 실제 제목은 link.title 에 있다 가정합니다.
          const displayTitle = link.title || link.url || "제목 없음";
          const typeValue = detectLinkType(link);
          return (
            <div key={index} className={`WS-LinkList-Item ${typeValue}`}>
              <div className="WS-LinkList-Content">
                <span className="WS-LinkList-Badge">
                  {typeValue === "youtube" ? "YOUTUBE" : "BLOG"}
                </span>
                <span className="WS-LinkList-Text" title={displayTitle}>
                  {displayTitle.length > 25
                    ? `${displayTitle.substring(0, 25)}...`
                    : displayTitle}
                </span>
              </div>
              <button
                className="WS-LinkList-DeleteButton"
                onClick={() => handleDeleteLink(link)}
                title="삭제"
              >
                <FaMinus />
              </button>
            </div>
          );
        })}

        <div className="WS-LinkList-Next-Container">
          <div className="WS-LinkList-Counter">{linkData.length}/5</div>
          <button
            className="WS-LinkList-NextButton"
            disabled={linkData.length === 0}
            onClick={handleNextClick}
          >
            다음
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default LinkList;
