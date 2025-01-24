import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import youtubeIcon from '../../images/youtube_icon.svg';
import blogIcon from '../../images/blog_icon.svg';
import '../../css/TravelInfo.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import planeIcon from '../../images/Plane.svg';
import selectIcon from '../../images/select.svg';
import isSelectedIcon from '../../images/isselect.svg';

const TravelInfo = () => {

  const [placeType, setPlaceType] = useState({}); 
  const [activeSpan, setActiveSpan] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    setPlaceType("landmark");
    setActiveSpan("span1");
  }, []);

  const travelInfo = {
    "success": true,
    "message": "여행 정보 조회 성공",
    "travelInfoId": "1",
    "travelInfoTitle": "여행 정보 제목",
    "urlCnt": 5,
    "urlList": [
      {
        "url": "https://www.youtube.com"
      },
      {
        "url": "https://www.youtube.com"
      },
      {
        "url": "https://www.youtube.com"
      },
      {
        "url": "https://www.youtube.com"
      },
      {
        "url": "https://blong.naver.com"
      }
    ]
  }

const data = {
  "success": true,
  "message": "여행 정보 장소 조회 성공",
  "extId": "1", //추출 장소 목록 ID
  "page": 1,
  "totalPage": 2,
  "elementCnt": 5,
  "content": 
  [
    {
      "placeId": "1",
      "placeType": "restaurant", 
      "placeName": "맛집1",
      "placeAddress": "서울시 강남구",
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "맛집1 설명",
      "intro": "맛집1 소개"
    },
    {
      "placeId": "2",
      "placeType": "restaurant",
      "placeName": "맛집2", 
      "placeAddress": "서울시 강남구",
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "맛집2 설명",
      "intro": "맛집2 소개"
    },
    {
      "placeId": "3",
      "placeType": "landmark",
      "placeName": "명소1",
      "placeAddress": "서울시 강남구", 
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "명소1 설명",
      "intro": "명소1 소개"
    },
    {
      "placeId": "4",
      "placeType": "landmark",
      "placeName": "명소2",
      "placeAddress": "서울시 강남구",
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "명소2 설명",
      "intro": "명소2 소개"
    },
    {
      "placeId": "5",
      "placeType": "restaurant",
      "placeName": "맛집5",
      "placeAddress": "서울시 강남구",
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "맛집5 설명",
      "intro": "맛집5 소개"
    }
  ]
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  arrows: true,
};

const handleSpanClick = (spanId) => {
  setActiveSpan(spanId);
};

const handlePlaceClick = (placeId) => {
  setSelectedPlaces(prev => {
    if (prev.includes(placeId)) {
      return prev.filter(id => id !== placeId);
    } else {
      return [...prev, placeId];
    }
  });
};

return (
  <main>
    <h1 className='none'>여행 정보</h1>
    <div className='HG-TravelInfo-Title-Frame'>
      <span>
        <h2 className='HG-TravelInfo-Title'>{travelInfo.travelInfoTitle}</h2> {/* DATA: 여행 정보 제목 데이터 바인딩 */}
      </span>
      <span className='HG-TravelInfo-Btn'>
        <span className='HG-TravelInfo-Select-Btn' >선택 </span><img src={planeIcon} alt="selectIcon" /> {/* FEAT: 선택 버튼 선택 여행지 모달 팝업 */}
        <span className='HG-TravelInfo-Select-Cnt'>{selectedPlaces.length}</span> {/* DATA: 선택 여행지 갯수 카운트 */}
      </span>
    </div>
    <div className='HG-TravelInfo-Content-Frame'>
      <h3 className='HG-TravelInfo-Content-Frame-Title'>
        영상정보
      </h3>
      <div className='HG-travelinfo-content-frame-list'>
        <span className={`HG-travelinfo-content-frame-url ${activeSpan === 'span1' ? 'HG-underline' : ''}`} onClick={() => handleSpanClick('span1')}>
          전체보기
        </span>
        {travelInfo.urlList.map((item, index) => (
          item.url.includes("youtube") ?
          <span 
            className={`HG-travelinfo-content-frame-url ${activeSpan === `span${index + 2}` ? 'HG-underline' : ''}`}
            key={index}
            onClick={() => handleSpanClick(`span${index + 2}`)}
          >
            영상{index + 1}
          </span>
          :
          <span 
            className={`HG-travelinfo-content-frame-url ${activeSpan === `span${index + 2}` ? 'HG-underline' : ''}`}
            key={index}
            onClick={() => handleSpanClick(`span${index + 2}`)}
          >
            블로그{index + 1}
          </span>
        ))}
      </div>
      <div className='HG-TravelInfo-Content-Frame-Place-Type-List'>
        <h3 className='none'>장소정보</h3>
        <span 
          className={`${placeType === "landmark" ? 'HG-TravelInfo-Content-Frame-Place-Selected-Type' : 'HG-TravelInfo-Content-Frame-Place-Type'}`} 
          onClick={() => setPlaceType("landmark")}
        >
          관광지
        </span>
        <span className={`${placeType === "restaurant" ? 'HG-TravelInfo-Content-Frame-Place-Selected-Type' : 'HG-TravelInfo-Content-Frame-Place-Type'}`}
         onClick={() => setPlaceType("restaurant")}>
          맛집
          </span>
        <span className={`${placeType === "etc" ? 'HG-TravelInfo-Content-Frame-Place-Selected-Type' : 'HG-TravelInfo-Content-Frame-Place-Type'}`} 
        onClick={() => setPlaceType("etc")}>
          그 외
          </span>
      </div>   
        {data.content.map((item, index) => (
          item.placeType === placeType ?
          <div 
            key={index} 
            className={`carousel-item ${selectedPlaces.includes(item.placeId) ? 'HG-select-place' : ''}`}
            onClick={() => handlePlaceClick(item.placeId)}
          >
            <img className='HG-trevelinfo-content-frame-select' src={`${selectedPlaces.includes(item.placeId) ? isSelectedIcon : selectIcon}`} alt="selectIcon" />
            <span>{item.placeName}</span>
            <span>{item.intro}</span>
            <Slider {...sliderSettings}>
              {/* 첫 번째 슬라이드 */}
              <div >
                <img className="HG-slide-content-image" src={item.placeImage} alt="placeImage" />
              </div>
              
              {/* 두 번째 슬라이드 */}
              <div className="slide-content">
                <span>{item.placeDescription}</span>
                <p>{item.placeAddress}</p>
              </div>
              
              {/* 세 번째 슬라이드 */}
              <div className="slide-content">
                {/* 구글 맵 */}
              </div>
            </Slider>
          </div>
          : null
        ))}
    </div>
  </main>
  );
};
export default TravelInfo; 