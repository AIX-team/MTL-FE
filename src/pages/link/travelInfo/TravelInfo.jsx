import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../css/TravelInfo.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import planeIcon from '../../../images/Plane.svg';
import selectIcon from '../../../images/select.svg';
import isSelectedIcon from '../../../images/isselect.svg';
import aiSelectIcon from '../../../images/select_check_deactive.svg';
import backArrowIcon from '../../../images/backArrow.svg';
import TitleEditModal from './TitleEditModal';
import SelectModal from './SelectModal';

const TravelInfo = () => {

  const [placeType, setPlaceType] = useState("landmark"); 
  const [activeSpan, setActiveSpan] = useState(1);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isAISelected, setIsAISelected] = useState(false);
  const [travelDays, setTravelDays] = useState();
  const [travelInfoTitle, setTravelInfoTitle] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  const travelInfo = {
    "success": true,
    "message": "여행 정보 조회 성공",
    "travelInfoId": "1",
    "travelInfoTitle": "여행 정보 제목",
    "travelDays": 4,
    "urlCnt": 5,
    "urlList": [
      {
        "url": "https://www.youtube.com",
        "title": "영상1: 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목"
      },
      {
        "url": "https://www.youtube.com",
        "title": "영상2: 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목"
      },
      {
        "url": "https://www.youtube.com",
        "title": "영상3: 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목"
      },
      {
        "url": "https://www.youtube.com",
        "title": "영상4: 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목"
      },
      {
        "url": "https://blong.naver.com",
        "title": "블로그1: 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목, 여행 정보 제목"
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
      "intro": "맛집1 소개",
      "placeScore": 4.4
    },
    {
      "placeId": "2",
      "placeType": "restaurant",
      "placeName": "맛집2", 
      "placeAddress": "서울시 강남구",
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "맛집2 설명",
      "intro": "맛집2 소개",
      "placeScore": 4.3
    },
    {
      "placeId": "3",
      "placeType": "landmark",
      "placeName": "명소1",
      "placeAddress": "서울시 강남구", 
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "명소1 설명",
      "intro": "명소1 소개",
      "placeScore": 4.2
    },
    {
      "placeId": "4",
      "placeType": "landmark",
      "placeName": "명소2",
      "placeAddress": "서울시 강남구",
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "명소2 설명",
      "intro": "명소2 소개",
      "placeScore": 4.1
    },
    {
      "placeId": "5",
      "placeType": "restaurant",
      "placeName": "맛집5",
      "placeAddress": "서울시 강남구",
      "placeImage": "https://placehold.co/300x200",
      "placeDescription": "맛집5 설명",
      "intro": "맛집5 소개",
      "placeScore": 4.5
    }
  ]
}

useEffect(() => {
  setTravelDays(travelInfo.travelDays);
  setTravelInfoTitle(travelInfo.travelInfoTitle);
}, []);

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

const handleSpanClick = (num) => {
  setActiveSpan(num);
};

const handlePlaceClick = (place) => {
  setSelectedPlaces(prev => {
    // placeId를 기준으로 객체가 이미 존재하는지 확인
    const isExist = prev.some(item => item.placeId === place.placeId);
    
    if (isExist) {
      return prev.filter(item => item.placeId !== place.placeId);
    } 
    return [...prev, place];
  });
};

const handleAISelected = () => {
  setIsAISelected(!isAISelected);
  setSelectedPlaces([]);
};

const handleTitleEdit = () => {
  setIsModalOpen(true);
};

const handleModalClose = () => {
  setIsModalOpen(false);
};

const handleSelectModalClose = () => {
  setIsSelectModalOpen(false);
};

const handlePlaceDelete = (placeList) => {
  // setSelectedPlaces state 초기화 후 placeList 추가
  setSelectedPlaces([]);
  setSelectedPlaces(placeList);
};

const handleTitleSave = ({days, title}) => {
  // 여기에 제목 저장 로직 추가
  setTravelDays(days);
  setTravelInfoTitle(title);
  setIsModalOpen(false);
  console.log(days, title);
};

const handleSelectBtn = () => {
  setIsSelectModalOpen(true);
};

return (
  <main className='HG-TravelInfo-Container'>
    <h1 className='none'>여행 정보</h1>
    <div className='HG-TravelInfo-Title-Frame'>
      <span className='HG-TravelInfo-Back-Btn'>
        <img src={backArrowIcon} alt="backArrowIcon" />
        <div>
        <div className='HG-TravelInfo-Travel-Days-Input'>{travelDays}일</div>
        <div className='HG-TravelInfo-Title-Edit-Frame'>
          <div className='HG-TravelInfo-Title'>{travelInfoTitle}</div>
          <span className='HG-TravelInfo-Title-Edit-text'
          onClick={handleTitleEdit}
          >편집</span>
          </div> 
        </div>
      </span>
      <span className='HG-TravelInfo-Btn'>
        <span className='HG-TravelInfo-Select-Btn' 
        onClick={handleSelectBtn}
        >선택 </span><img src={planeIcon} alt="selectIcon" /> {/* FEAT: 선택 버튼 선택 여행지 모달 팝업 */}
        <span className='HG-TravelInfo-Select-Cnt'>{selectedPlaces.length}</span> {/* DATA: 선택 여행지 갯수 카운트 */}
      </span>
    </div>
    <div className='HG-TravelInfo-Content-Frame'>
      <h3 className='HG-TravelInfo-Content-Frame-Title'>
        영상정보
      </h3>
      <div className='HG-travelinfo-content-frame-list'>
        <span className={`HG-travelinfo-content-frame-url ${activeSpan === 1 ? 'HG-underline' : ''}`} onClick={() => handleSpanClick(1)}>
          전체보기
        </span>
        {travelInfo.urlList.map((item, index) => (
          item.url.includes("youtube") ?
          <span 
            className={`HG-travelinfo-content-frame-url ${activeSpan === `${index + 2}` ? 'HG-underline' : ''}`}
            key={index}
            onClick={() => handleSpanClick(`${index + 2}`)}
          >
            영상{index + 1}
          </span>
          :
          <span 
            className={`HG-travelinfo-content-frame-url ${activeSpan === `${index + 2}` ? 'HG-underline' : ''}`}
            key={index}
            onClick={() => handleSpanClick(`${index + 2}`)}
          >
            블로그{index + 1}
          </span>
        ))}
      </div>

      <div className={` ${activeSpan === 1 ? 'HG-TravelInfo-Content-Blank' : 'HG-TravelInfo-Content-Title'}`}>
        {(() => {
          try {
            if (activeSpan === 1) {
              return '';
            }
            
            const index = activeSpan - 2;
            if (index < 0 || index >= travelInfo.urlList.length) {
              return '제목을 찾을 수 없습니다'; // 기본값 설정
            }
            
            return travelInfo.urlList[index].title;
          } catch (error) {
            console.error('제목 표시 중 오류 발생:', error);
            return '제목을 불러오는 중 오류가 발생했습니다';
          }
        })()}
      </div>

      <div className='HG-TravelInfo-Content-Frame-Place-Type-List'>
        <h3 className='none'>장소정보</h3>
        <span 
          className={`${placeType === "landmark" ? 'HG-TravelInfo-Content-Frame-Place-Selected-Type' : 'HG-TravelInfo-Content-Frame-Place-Type'}`} 
          onClick={() => setPlaceType("landmark")}
        >
          관광지
        </span>
        <span 
          className={`${placeType === "restaurant" ? 'HG-TravelInfo-Content-Frame-Place-Selected-Type' : 'HG-TravelInfo-Content-Frame-Place-Type'}`}
          onClick={() => setPlaceType("restaurant")}
        >
          맛집
          </span>
        <span className={`${placeType === "etc" ? 'HG-TravelInfo-Content-Frame-Place-Selected-Type' : 'HG-TravelInfo-Content-Frame-Place-Type'}`} 
        onClick={() => setPlaceType("etc")}>
          그 외
          </span>
      </div>   
      <div className='HG-TravelInfo-aiselect-btn'
      onClick={handleAISelected}
      >
        <img src={`${isAISelected ? isSelectedIcon : aiSelectIcon}`} alt="aiSelectIcon" />
        <span className='HG-TravelInfo-aiselect-btn-text'>AI 추천선택</span>
      </div>
      
      <div className='HG-TravelInfo-Content-Frame-Place-Slider'>
          {data.content.map((item, index) => (
            item.placeType === placeType ?
            <div 
              key={index} 
              className={`carousel-item ${selectedPlaces.some(selected => selected.placeId === item.placeId) ? 'HG-select-place' : ''}`}
            >
              <div className='HG-trevelinfo-content-frame-select-frame'
                onClick={() => handlePlaceClick(item)}
              >
                <img className='HG-trevelinfo-content-frame-select' src={`${selectedPlaces.some(selected => selected.placeId === item.placeId) ? isSelectedIcon : selectIcon}`} alt="selectIcon" />
                <span className='HG-trevelinfo-content-frame-select-name'>{item.placeName}</span>
                <span className='HG-trevelinfo-content-frame-select-intro'>{item.intro}</span>
              </div>
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
    </div>
    <TitleEditModal 
      isOpen={isModalOpen}
      onClose={handleModalClose}
      travelDays={travelDays}
      travelInfoTitle={travelInfoTitle}
      onSave={handleTitleSave}
    />
    <div className={`${isSelectModalOpen ? 'HG-TravelInfo-Select-Modal' : 'none'}`}>
      <SelectModal
        isOpen={isSelectModalOpen}
        onClose={handleSelectModalClose}
        selectedPlaces={selectedPlaces}
        onPlaceSelect={handlePlaceDelete}
        travelDays={travelDays}
      />
    </div>
  </main>
  );
};
export default TravelInfo; 