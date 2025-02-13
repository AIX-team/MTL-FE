import React, { useState } from "react";
import { FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa"; // 아이콘 사용을 위한 import
import { useNavigate } from "react-router-dom"; // 네비게이션 훅 추가
import "../../css/linkpage/SelectDayTab.css";
import axios from "axios";

const SelectDayTab = ({ onBack, linkData }) => {
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
    console.log("현재 linkData:", linkData);
    setIsLoading(true);
    try {
      // 문자열 배열을 각 객체의 { url } 형태로 변환하여 백엔드에 전달합니다.
      const payload = linkData.map(url => ({ url }));
      console.log("payload:", payload);

      const response = await axios.post(
        "http://localhost:8080/url/user/process",
        payload, // 수정된 payload: 배열 형태의 객체들을 전달
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("API 응답:", response.data);
      navigate("/loading", { state: { days: days } });
    } catch (error) {
      // 백엔드에서 보내는 상세 오류 메시지를 확인해보세요.
      console.error("API 요청 에러:", error.response.data);
      setIsLoading(false);
    }
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
          onClick={handleNext} // 클릭 핸들러 추가⭐️⭐️⭐️
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SelectDayTab;
