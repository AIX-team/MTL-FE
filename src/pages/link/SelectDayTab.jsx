import React, { useState } from "react";
import { FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa"; // 아이콘 사용을 위한 import
import { useNavigate } from "react-router-dom"; // 네비게이션 훅 추가
import "../../css/linkpage/SelectDayTab.css";

const SelectDayTab = ({ onBack }) => {
  const [days, setDays] = useState(1); // 기본값 1일
  const [showPreferTab, setShowPreferTab] = useState(false); // 추가⭐️⭐️⭐️
  const [isLoading, setIsLoading] = useState(false); // 로딩페이지로 전환⭐️⭐️⭐️
  const navigate = useNavigate(); // 네비게이션 훅 사용

  const increaseDays = () => {
    if (days < 7) {
      // 최대 7일로 제한
      setDays((prev) => prev + 1);
    }
  };

  const decreaseDays = () => {
    if (days > 1) {
      // 최소 1일로 제한
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
    // 포커스를 잃었을 때 빈 값이거나 범위 밖이면 1로 설정
    if (days === "" || days < 1) {
      setDays(1);
    } else if (days > 7) {
      setDays(7);
    }
  };

  // 다음 버튼 클릭 핸들러 추가⭐️⭐️⭐️
  const handleNext = async () => {
    setIsLoading(true);
    try {
      // 여기에 필요한 데이터 처리 로직 추가
      // 예시: 2초 대기

      // 로딩이 끝나면 다음 페이지로 이동
      navigate("/loading", { state: { days: days } });
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="WS-SelectDayTab">
      <div className="WS-SelectDayTab-Title-Container">
        <div className="WS-SelectDayTab-Title">총 여행 기간은?</div>
        <div className="WS-SelectDayTab-SubTitle">여행 일정을 알려주세요!</div>
        <div className="WS-SelectDayTab-SubTitle">( 최대 7일 )</div>
      </div>
      <div className="WS-SelectDayTab-Counter">
        <button
          className="WS-Counter-Button"
          onClick={decreaseDays}
          disabled={days <= 1}
        >
          <FaMinus />
        </button>
        <div className="WS-Counter-Input-Container">
          <input
            type="text"
            className="WS-Counter-Value"
            value={days}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength={1}
          />
        </div>
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
          onClick={handleNext} // 클릭 핸들러 추가⭐️⭐️⭐️
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SelectDayTab;
