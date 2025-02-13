import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa"; // 아이콘 사용을 위한 import
import { useNavigate } from "react-router-dom"; // 네비게이션 훅 추가
import axios from "axios";
import "../../css/linkpage/SelectDayTab.css";

const SelectDayTab = ({ onBack, linkData }) => {
  const [days, setDays] = useState(1); // 기본값 1일
  const [showPreferTab, setShowPreferTab] = useState(false); // 추가 기능용 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 전환
  const navigate = useNavigate(); // 네비게이션 훅 사용

  // 현재 로그인된 사용자의 이메일 (로컬스토리지 등에서 가져온다고 가정)
  const email = localStorage.getItem("userEmail");

  // 증가, 감소, 입력 관련 함수들
  const increaseDays = () => {
    if (days < 7) {
      setDays((prev) => prev + 1);
    }
  };

  const decreaseDays = () => {
    if (days > 1) {
      setDays((prev) => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
    const numValue = parseInt(value) || 0;

    if (value === "") {
      setDays(value); // 입력 중인 빈 값 허용
    } else if (numValue >= 1 && numValue <= 7) {
      setDays(numValue);
    }
  };

  const handleBlur = () => {
    // 포커스를 잃었을 때 빈 값이거나 범위 밖이면 1 또는 7로 강제 설정
    if (days === "" || days < 1) {
      setDays(1);
    } else if (days > 7) {
      setDays(7);
    }
  };

  // 백엔드와 payload 형식을 맞추어 분석 API 호출 (필요한 경우에만 호출)
  const callAnalysisAPI = async () => {
    try {
      const token = localStorage.getItem("token");
      const normalizedUrls = linkData.map(link => {
        try {
          const normalized = new URL(link.url);
          // origin + pathname + search 형식으로 반환
          return normalized.origin + normalized.pathname + normalized.search;
        } catch (error) {
          return link.url;
        }
      });

      // 백엔드의 UrlRequest DTO에 맞춘 payload 작성
      const payload = {
        email: localStorage.getItem("userEmail"),
        urls: normalizedUrls,
        travelInfoId: ""    // 만약 필요 없다면 이 부분도 제거 가능
      };

      const { data } = await axios.post(
        "http://localhost:8080/url/analysis",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("분석 완료 결과:", data);
    } catch (error) {
      console.error("URL 분석 API 호출 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 분석 API 호출 (분석 API 호출이 필요하지 않다면 이 부분을 제거하세요)
  useEffect(() => {
    callAnalysisAPI();
  }, []);

  // "다음" 버튼 클릭 시 실행되는 함수 (axios 호출 없이 나머지 작업만 수행)
  const handleNext = () => {
    console.log("다음 버튼 클릭 - handleNext의 나머지 로직 실행");
    // 예: 다음 페이지로 이동
    setIsLoading(true);
  };

  return (
    <div className="WS-SelectDayTab">
      <div className="WS-SelectDayTab-Title-Container">
        <div className="WS-SelectDayTab-Title">총 여행 기간은?</div>
        <div className="WS-SelectDayTab-SubTitle">여행 일정을 알려주세요!</div>
        <div className="WS-SelectDayTab-SubTitle-date">( 최대 7일 )</div>
      </div>
      <div className="WS-SelectDayTab-Counter">
        <button
          className="WS-Counter-Button"
          onClick={decreaseDays}
          disabled={days <= 1}
        >
          <FaMinus />
        </button>
        <input
          type="text"
          className="WS-Counter-Input"
          value={days}
          onChange={handleInputChange}
          onBlur={handleBlur}
          maxLength={1}
        />
        <button
          className="WS-Counter-Button"
          onClick={increaseDays}
          disabled={days >= 7}
        >
          <FaPlus />
        </button>
      </div>
      <div className="WS-SelectDayTab-Button-Container">
        <button className="WS-SelectDayTab-BackButton" onClick={onBack}>
          이전
        </button>
        <button
          className={`WS-SelectDayTab-NextButton ${days >= 1 ? "active" : ""}`}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SelectDayTab;
