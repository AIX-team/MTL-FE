import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Loading.css";
import loadingEarth from "../../images/loading_earth.png";
import loadingSunglass from "../../images/loading_sunglass.png";
import loadingBag from "../../images/loading_bag.png";
import loadingMap from "../../images/loading_map.png";
import loadingAirplane from "../../images/loading_airplane.png";

function Loading({ type = "default" }) {
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const animationFrameRef = useRef();
  const lastUpdateTimeRef = useRef(Date.now());
  const loadingImages = [loadingEarth, loadingSunglass, loadingBag, loadingMap];

  const navigate = useNavigate();
  const { state } = useLocation();
  const { linkData, days } = state || {};

  // API 호출 useEffect
  useEffect(() => {
    const runApiCalls = async () => {
      try {
        const token = localStorage.getItem('token'); // 토큰 가져오기
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const payload = { urls: linkData };
        // 분석 API 호출
        const analysisResponse = await axios.post(
          "http://localhost:8080/url/analysis",
          payload,
          { headers }
        );
        console.log("API 응답 (analysis):", analysisResponse.data);

        // 매핑 API 호출 (요청 body에 days 추가)
        const mappingPayload = {
          urls: linkData,
          days: days
        };
        const mappingResponse = await axios.post(
          "http://localhost:8080/url/mapping",
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

    if (linkData && days) {
      runApiCalls();
    }
  }, [linkData, days, navigate]);

  // 메시지 설정
  const messages = {
    default: {
      main: "여행 기간에 맞는\n영상 정보를\n준비중입니다.",
      sub: "최상의 결과를 위해\n잠시만 기다려 주세요.",
    },
    guidebook: {
      main: "여행 장소를 담은\n가이드북을\n준비중입니다.",
      sub: "최상의 결과를 위해\n잠시만 기다려 주세요.",
    },
  };

  const currentMessage = messages[type] || messages.default;

  useEffect(() => {
    // 이미지 순환을 위한 타이머
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % loadingImages.length
      );
    }, 2000);

    // cleanup 함수에 interval 정리 추가
    return () => {
      clearInterval(imageInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 별도의 useEffect로 분리하여 성능 체크와 애니메이션 처리
  useEffect(() => {
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTimeRef.current;

      setProgress((prevProgress) => {
        const newProgress = prevProgress + (deltaTime / 3700) * 100;

        if (newProgress >= 100) {
          setTimeout(() => {
            setProgress(0);
          }, 15);
          return 100;
        }

        return newProgress;
      });

      lastUpdateTimeRef.current = currentTime;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastUpdateTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 비행기의 투명도 계산
  const airplaneOpacity = progress >= 98 ? 0 : 1;
  // 프로그레스바 너비 계산
  const progressWidth = progress >= 100 ? 0 : progress;

  return (
    <div className="SJ_loading_container">
      <div className="SJ_loading_content">
        <div className="SJ_loading_image_container">
          <img
            src={loadingImages[currentImageIndex]}
            alt="Loading Icon"
            className="SJ_loading_earth"
          />
        </div>
        <p className="SJ_loading_message">
          {"여행 기간에 맞는\n영상 정보를\n준비중입니다."}
        </p>
        <p className="SJ_loading_sub_message">
          {"최상의 결과를 위해 잠시만 기다려 주세요."}
        </p>
        <div className="SJ_progress_wrapper">
          <img
            src={loadingAirplane}
            alt="Loading Airplane"
            className="SJ_loading_airplane"
            style={{
              left: `calc(${progress}%)`,
              willChange: "left",
              opacity: airplaneOpacity,
            }}
          />
          <div className="SJ_progress_container">
            <div
              className="SJ_progress_bar_main"
              style={{
                width: `${Math.max(0, progressWidth)}%`,
                opacity: 1,
                willChange: "width",
              }}
            />
            <div className="SJ_progress_bar_background" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
