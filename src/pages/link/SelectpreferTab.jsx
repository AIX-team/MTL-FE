import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/linkpage/SelectpreferTab.css";

function SelectpreferTab({ onBack }) {
  const [selectedPrefer, setSelectedPrefer] = useState(null);
  const navigate = useNavigate();

  const preferOptions = [
    { id: "fast", text: "빼곡한 일정 선호" },
    { id: "moderate", text: "적당한 일정 선호" },
    { id: "relaxed", text: "널널한 일정 선호" },
  ];

  const handlePreferSelect = (preferId) => {
    setSelectedPrefer(preferId);
  };

  const handleNext = () => {
    if (selectedPrefer) {
      navigate("/loading"); // Loading 컴포넌트로 이동
    }
  };

  return (
    <div className="SJ_prefer_container">
      <h1 className="SJ_prefer_title">
        선호하는
        <br />
        여행 일정은?
      </h1>

      <div className="SJ_prefer_options">
        {preferOptions.map((option) => (
          <button
            key={option.id}
            className={`SJ_prefer_button ${
              selectedPrefer === option.id ? "active" : ""
            }`}
            onClick={() => handlePreferSelect(option.id)}
          >
            {option.text}
          </button>
        ))}
      </div>

      <div className="SJ_prefer_navigation">
        <button className="SJ_prefer_prev_button" onClick={onBack}>
          이전
        </button>
        <button
          className={`SJ_prefer_next_button ${selectedPrefer ? "active" : ""}`}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default SelectpreferTab;
