import React, { useEffect, useState, useRef } from "react";
import "./Loading.css";
import loadingEarth from "../../images/loading_earth.png";
import loadingSunglass from "../../images/loading_sunglass.png";
import loadingBag from "../../images/loading_bag.png";
import loadingMap from "../../images/loading_map.png";
import loadingAirplane from "../../images/loading_airplane.png";

function Loading({ type = "default" }) {
  // type prop 추가
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const animationFrameRef = useRef();
  const lastUpdateTimeRef = useRef(Date.now());
  const speedFactor = useRef(1);
  const loadingImages = [loadingEarth, loadingSunglass, loadingBag, loadingMap];

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
    }, 1500);

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
    const performanceCheck = () => {
      const start = performance.now();
      setTimeout(() => {
        const end = performance.now();
        const diff = end - start;
        speedFactor.current = 1.2;
      }, 16);
    };

    performanceCheck();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTimeRef.current;

      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0;
        }
        return prevProgress + (deltaTime / 2000) * 100 * speedFactor.current;
      });

      lastUpdateTimeRef.current = currentTime;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 비행기와 프로그레스 바의 진행을 동일하게 맞춤
  const airplanePosition = progress;

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
              left: `calc(${airplanePosition}%)`,
              willChange: "left",
            }}
          />
          <div className="SJ_progress_container">
            <div
              className="SJ_progress_bar_main"
              style={{
                width: `${Math.max(0, progress)}%`,
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
