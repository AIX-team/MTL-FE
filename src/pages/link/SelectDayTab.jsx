import React, { useState } from "react";
import { FaPlus, FaMinus} from "react-icons/fa"; // 아이콘 사용을 위한 import
import "../../css/linkpage/SelectDayTab.css";
import Loading from "../../components/Loading/Loading";
import axiosInstance from "../../components/AxiosInstance";
import { useNavigate } from "react-router-dom";

const SelectDayTab = ({ onBack, linkData }) => {
  const [days, setDays] = useState(1); // 기본값 1일
  const [isLoading, setIsLoading] = useState(false); // 로딩페이지로 전환⭐️⭐️⭐️
  const navigate = useNavigate();

  const runApiCalls = async () => {
    try {
      const token = localStorage.getItem('token'); // 토큰 가져오기
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const payload = { urls: linkData };
      // 분석 API 호출
      const analysisResponse = await axiosInstance.post(
        "/url/analysis",
        payload,
        { headers }
      );
      console.log("API 응답 (analysis):", analysisResponse.data);

      // 매핑 API 호출 (요청 body에 days 추가)
      const mappingPayload = {
        urls: linkData,
        days: days
      };
      const mappingResponse = await axiosInstance.post(
        "/url/mapping",
        mappingPayload,
        { headers }
      );
      console.log("API 응답 (mapping):", mappingResponse.data);

      const travelInfoId = mappingResponse.data.travelInfoId;
      // 매핑 작업 완료 후 travelinfos 페이지로 이동
      navigate(`/travelinfos/${travelInfoId}`, {
        state: { days, analysisResult: analysisResponse.data }
      });
    } catch (error) {
      console.error("API 요청 에러:", error.response?.data || error);
    }
  };


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
      runApiCalls();
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div>
          <Loading type="travelInfo" />
        </div>
      )}
      {!isLoading && (
        <div>
          <div className="WS-SelectDayTab">
          {!isLoading && (
            <div>
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
      )}
      {isLoading && <Loading type="travelInfo" />}
    </div>
    </div>
  )}
  </div>
  );
};

export default SelectDayTab;
