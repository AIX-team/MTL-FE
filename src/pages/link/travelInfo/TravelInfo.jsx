import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../css/linkpage/TravelInfo/TravelInfo.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import planeIcon from '../../../images/Plane.svg';
import selectIcon from '../../../images/select.svg';
import isSelectedIcon from '../../../images/isselect.svg';
import backArrowIcon from '../../../images/backArrow.svg';
import TitleEditModal from './TitleEditModal';
import SelectModal from './SelectModal';
import aiIcon from '../../../images/chatbot.gif';


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TravelInfo = () => {

  const [placeType, setPlaceType] = useState("landmark");
  const [activeSpan, setActiveSpan] = useState(1);
  const [isAISelected, setIsAISelected] = useState(false);
  const [travelDays, setTravelDays] = useState();
  const [travelInfoTitle, setTravelInfoTitle] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { travelInfoId } = useParams();

  const [travelInfo, setTravelInfo] = useState({
    message: '',
    success: '',
    travelDays: 0,
    travelInfoId: '',
    travelInfoTitle: '',
    urlCnt: 0,
    urlList: [
      {
        author: '',
        title: '',
        urlAddress: '',
        urlId: ''
      }
    ]
  });

  const [placeList, setPlaceList] = useState({
    success: '',
    message: '',
    content: [
      {
        urlId: '',
        placeId: '',
        placeType: '',
        placeName: '',
        placeAddress: '',
        placeImage: '',
        placeDescription: '',
        intro: '',
        latitude: '',
        longitude: ''
      }
    ]
  });


  const [allPlaceList, setAllPlaceList] = useState({
    success: '',
    message: '',
    content: [
      {
        urlId: '',
        placeId: '',
        placeType: '',
        placeName: '',
        placeAddress: '',
        placeImage: '',
        placeDescription: '',
        intro: '',
        latitude: '',
        longitude: ''
      }
    ]
  });

  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedAIPlaces, setSelectedAIPlaces] = useState([]);



  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showNoData, setShowNoData] = useState(false);

  const [timer, setTimer] = useState(null);

  const getTravelInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/api/v1/travels/travelInfos/${travelInfoId}`);
      setTravelInfo(response.data);
      setTravelDays(response.data.travelDays);
      setTravelInfoTitle(response.data.travelInfoTitle);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [travelInfoId]);

  const getPlaceList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/api/v1/travels/travelInfos/${travelInfoId}/places`);
      setPlaceList(response.data);
      setAllPlaceList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [travelInfoId]);

  const getUrlPlaceList = useCallback(async (urlId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/api/v1/travels/travelInfos/urls/${urlId}`);
      setPlaceList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const putTravelInfoUpdate = useCallback(async (days, title) => {
    try {
      // 값 유효성 검사
      if (!title || !days) {
        console.error('필수 값이 누락되었습니다:', { title, days });
        return;
      }

      console.log('요청 데이터:', { travelInfoTitle, travelDays }); // 요청 데이터 로깅

      const response = await axiosInstance.put(
        `/api/v1/travels/travelInfos/${travelInfoId}`,
        {
          travelInfoTitle: title,
          travelDays: parseInt(days) // 숫자로 변환
        }
      );

      console.log('응답 데이터:', response.data); // 응답 데이터 로깅

    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [travelInfoId, travelInfoTitle, travelDays]); // 의존성 배열에 필요한 값들 추가


  const getAISelect = useCallback(async () => {
    try {
      console.log(selectedAIPlaces.length, selectedPlaces.length);
      if (selectedAIPlaces.length === 0 || selectedAIPlaces.length !== selectedPlaces.length) {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/api/v1/travels/travelInfos/${travelInfoId}/aiSelect`);
        console.log(response.data);
        setSelectedPlaces(response.data);
        setSelectedAIPlaces(response.data);
      } else {
        setSelectedPlaces(selectedAIPlaces);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  }, [travelInfoId]);

  useEffect(() => {
    if (travelInfoId) {
      getTravelInfo();
      getPlaceList();
    }
  }, [travelInfoId, getTravelInfo, getPlaceList]);

  useEffect(() => {
    console.log('현재 placeList:', placeList);
    console.log('현재 선택된 placeType:', placeType);
  }, [placeList, placeType]);

  useEffect(() => {
    if (error) {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        setShowError(true);
      }, 4000);
      setTimer(newTimer);
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      setShowError(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [error]);

  if (showLoading) return <div>로딩 중...</div>;
  if (showError) return <div>에러: {error}</div>;
  if (showNoData) return <div>데이터가 없습니다.</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    lazyLoad: false,
    swipeToSlide: true,
    adaptiveHeight: true
  };

  const handleSpanClick = (num) => {
    if (num === 1) {
      setPlaceList(allPlaceList);
    } else {
      getUrlPlaceList(travelInfo.urlList[num - 2].urlId);
    }
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
    getAISelect();
    if(!isAISelected){
      setSelectedPlaces([]);
    }
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

  const handleTitleSave = ({ days, title }) => {
    // 여기에 제목 저장 로직 추가
    setTravelDays(days);
    setTravelInfoTitle(title);
    setIsModalOpen(false);
    putTravelInfoUpdate(days, title);
  };

  const handleSelectBtn = () => {
    setIsSelectModalOpen(true);
  };

  return (
    <main className='HG-TravelInfo-Container'>

      <div className='HG-TravelInfo-Header'>
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

      <div className='HG-TravelInfo-Body'>

        <div className='HG-travelinfo-Title-list'>
          <span className={`HG-travelinfo-content-frame-url ${activeSpan === 1 ? 'HG-underline' : ''}`} onClick={() => handleSpanClick(1)}>
            전체보기
          </span>
          {travelInfo.urlList.map((item, index) => (
            item.urlAddress.includes("youtube") ?
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

        <div className='HG-TravelInfo-Type-List'>
          <span
            className={`${placeType === "landmark" ? 'HG-TravelInfo-Selected-Type' : 'HG-TravelInfo-Unselected-Type'}`}
            onClick={() => setPlaceType("landmark")}
          >
            관광지
          </span>
          <span
            className={`${placeType === "restaurant" ? 'HG-TravelInfo-Selected-Type' : 'HG-TravelInfo-Unselected-Type'}`}
            onClick={() => setPlaceType("restaurant")}
          >
            맛집
          </span>
          <span className={`${placeType !== "landmark" && placeType !== "restaurant" ? 'HG-TravelInfo-Selected-Type' : 'HG-TravelInfo-Unselected-Type'}`}
            onClick={() => setPlaceType("etc")}>
            그 외
          </span>
        </div>
        <div className='HG-TravelInfo-aiselect-btn'>
          <span className={`${isAISelected ? 'HG-TravelInfo-aiselect-btn-ai-icon-selected' : 'HG-TravelInfo-aiselect-btn-text'}`}
            onClick={handleAISelected}>
            <img className={`HG-TravelInfo-aiselect-btn-ai-icon`}
              src={aiIcon} alt="aiIcon" />
            AI 추천선택</span>
        </div>

        <div className='HG-TravelInfo-Content-Frame-Place-Slider'>
          {placeList.content.map((item, index) => {
            // placeType이 'etc'일 때는 landmark와 restaurant가 아닌 항목만 표시
            const isEtcType = placeType === 'etc' && item.placeType !== 'landmark' && item.placeType !== 'restaurant';
            // 일반적인 경우 placeType이 일치하는 항목 표시
            const isMatchingType = item.placeType === placeType;

            return (isMatchingType || isEtcType) ? (
              <div
                key={index}
                className={`WS-carousel-item ${selectedPlaces.some(selected => selected.placeId === item.placeId) ? 'HG-select-place' : ''}`}
              >
                <div className='HG-trevelinfo-select-Container'
                  onClick={() => handlePlaceClick(item)}
                >
                  <img className='HG-trevelinfo-content-frame-select' src={`${selectedPlaces.some(selected => selected.placeId === item.placeId) ? isSelectedIcon : selectIcon}`} alt="selectIcon" />
                  <span className='HG-trevelinfo-content-frame-select-name'>{item.placeName}</span>
                  <span className='HG-trevelinfo-content-frame-select-intro'>{item.intro}</span>
                </div>

                <Slider {...sliderSettings}>
                  {/* 첫 번째 슬라이드 */}
                  <div className="slide-content">
                    <img className="HG-slide-content-image" src={item.placeImage}
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/600/300';
                      }}
                      alt="placeImage" />
                  </div>

                  {/* 두 번째 슬라이드 */}
                  <div className="slide-content">
                    <span className='WS-TravelInfo-Description'>{item.placeDescription}</span>
                    <p className='WS-TravelInfo-Address'>{item.placeAddress}</p>
                  </div>

                  {/* 세 번째 슬라이드 */}
                  <div className="slide-content" key={`map-${index}`}>
                    {console.log('세 번째 슬라이드 시도')}
                    {item?.latitude && item?.longitude && (
                      <iframe
                        className="HG-TravelInfo-map-iframe"
                        title={`${item.placeName} 위치 지도`}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(item.placeName)}+(${item.latitude},${item.longitude})&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    )}
                  </div>
                </Slider>
              </div>
            ) : null;
          })}
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