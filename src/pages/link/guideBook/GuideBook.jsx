// React 및 필요한 라이브러리 import
import React, { useState, useEffect, forwardRef, useCallback, useRef } from 'react';
import { usePDF } from 'react-to-pdf';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Polyline } from '@react-google-maps/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import downloadbtn from '../../../images/download.png';
import backArrow from '../../../images/backArrow.svg';
import { useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';  // html2canvas 라이브러리 추가 필요
import TitleEditModal from './GuideBookTitleEditModal';
import axiosInstance from '../../../components/AxiosInstance';
// CSS 파일 import

import '../../../css/linkpage/GuideBook/GuideBook.css';

// 구글 맵 컴포넌트(경로)
const MapComponent = React.memo(({ places }) => {
    if (!places) return null;

    const mapContainerStyle = {
        width: '100%',
        height: '100%'
    };

    // places가 배열인 경우와 단일 객체인 경우 처리
    const isArray = Array.isArray(places);

    const center = isArray ? {
        lat: parseFloat(places[0].latitude),
        lng: parseFloat(places[0].longitude)
    } : {
        lat: parseFloat(places.latitude),
        lng: parseFloat(places.longitude)
    };

    // places 배열을 num 순서대로 정렬하여 path 생성
    const path = isArray ? [...places]
        .map(place => ({
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude)
        })) : null;


    const onLoad = (map) => {
        if (!window.google) {
            console.error('Google Maps API not loaded');
            return;
        }

        try {
            // bounds 객체 생성            
            const bounds = new window.google.maps.LatLngBounds();


            // 마커 생성 전에 좌표 유효성 로깅
            places.forEach((place, index) => {
                const lat = parseFloat(place.latitude);
                const lng = parseFloat(place.longitude);

                // 좌표 유효성 검사
                if (isNaN(lat) || isNaN(lng)) {
                    console.error(`Invalid coordinates for place ${place.name}:`, {
                        lat: place.latitude,
                        lng: place.longitude
                    });
                    return;
                }

                const position = {
                    lat: lat,
                    lng: lng
                };

                try {
                    bounds.extend(position);

                    // 마커 생성
                    const markerView = new window.google.maps.marker.AdvancedMarkerElement({
                        position,
                        map,
                        title: place.name,
                        content: new window.google.maps.marker.PinElement({
                            glyph: `${index + 1}`,  // place.num 대신 index + 1 사용
                            glyphColor: '#FFFFFF',
                            background: '#4285f4',
                            borderColor: '#4285f4'
                        }).element
                    });

                    // InfoWindow 설정
                    markerView.addListener('click', () => {
                        const infoWindow = new window.google.maps.InfoWindow({
                            content: `
                                    <div style="padding: 10px;">
                                        <img src="${place.image}" alt="장소 이미지" style="width: 100%; height: 100px; object-fit: cover;">
                                        <h3>${index + 1}. ${place.name}</h3>
                                        <p>${place.address || ''}</p>
                                        <p>${place.intro || ''}</p>
                                    </div>
                                `
                        });
                        infoWindow.open(map, markerView);
                    });
                } catch (markerError) {
                    console.error(`Error creating marker for ${place.name}:`, markerError);
                }
            });
            // 지도 범위 조정
            map.fitBounds(bounds);

            // 줌 레벨 조정
            const listener = map.addListener('idle', () => {
                const currentZoom = map.getZoom();
                if (currentZoom > 16) map.setZoom(16);
                window.google.maps.event.removeListener(listener);
            });

        } catch (error) {
            console.error('Error in onLoad:', error);
        }
    };

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            onLoad={onLoad}
            options={{
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                rotateControl: true,
                fullscreenControl: true,
                mapId: process.env.REACT_APP_GOOGLE_MAPS_ID
            }}
        >
            {isArray && path && (
                <Polyline
                    path={path}
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        geodesic: true
                    }}
                />
            )}
        </GoogleMap>
    );
}, (prevProps, nextProps) => {
    // places 배열의 실제 내용이 변경되었을 때만 리렌더링
    return JSON.stringify(prevProps.places) === JSON.stringify(nextProps.places);
});



// GuideBookList 컴포넌트 정의
const GuideBook = () => {
    // 상태 변수 정의
    const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 코스 탭
    const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 활성화 여부
    const [showMoveModal, setShowMoveModal] = useState(false); // 이동 모달 표시 여부
    const [showCopyModal, setShowCopyModal] = useState(false); // 복사 모달 표시 여부
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 표시 여부
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 장소들
    const [targetCourse, setTargetCourse] = useState([]); // 이동할 대상 코스
    const [places, setPlaces] = useState([]); // 현재 코스의 장소들
    const [originalPlaces, setOriginalPlaces] = useState([]); // 장소 이동 기능 원래 장소들
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const { guidebookId } = useParams();
    const navigate = useNavigate();
    const isPlaceNumChanged = (oldPlaces, newPlaces) => {
        if (oldPlaces.length !== newPlaces.length) {
            return true;
        }
        for (let i = 0; i < oldPlaces.length; i++) {
            if (oldPlaces[i] !== newPlaces[i]) {
                return true;
            }
        }
        return false;
    }
    const [isTitleEditModalOpen, setIsTitleEditModalOpen] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    const [guideBook, setGuideBook] = useState({
        success: '',
        message: '',
        guideBookTitle: '',
        travelInfoTitle: '',
        travelInfoId: '',
        courseCnt: '',
        courses: {}
    });



    const CoursePlaceRequest = {
        id: 0,
        placeIds: []
    }

    // 가이드북 데이터 가져오기
    const getGuideBook = async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/travels/guidebooks/${guidebookId}`);
            setGuideBook(response.data);
            setPlaces(response.data.courses[0].coursePlaces || []);
        } catch (error) {
            console.error('Error fetching guidebook:', error);
        }
    }

    useEffect(() => {
        getGuideBook();
    }, []);

    const putCoursePlacesNum = async (coursePlaceRequest) => {
        try {
            await axiosInstance.put(`/api/v1/courses/`, coursePlaceRequest);
        } catch (error) {
            //자세한 에러 정보 출력
            console.error('Error putting course places num:', {
                data: error.response.data,
            });
        }
    }

    // 코스 탭 클릭 핸들러
    const handleTabClick = (courseNumber) => {
        setActiveTab(Number(courseNumber) + 1); // 활성화된 탭 변경
        setTargetCourse([]);
    };


    // 편집 버튼 클릭 핸들러
    const handleEditClick = () => {
        if (isEditMode) {
            // 맵 컴포넌트 강제 리렌더링을 위한 키 업데이트
            setMapKey(prev => prev + 1);  // 새로운 상태 추가 필요

            const coursesArray = Object.values(guideBook.courses);
            const currentCourse = coursesArray.find(course => course.courseNum === activeTab);
            if (currentCourse?.coursePlaces) {
                const oldPlaceRespList = originalPlaces.map(place =>
                    place.id.toString().replace(/\u0000/g, '').trim());
                const newPlaceRespList = places.map(place =>
                    place.id.toString().replace(/\u0000/g, '').trim());
                if (isPlaceNumChanged(oldPlaceRespList, newPlaceRespList)) {
                    //updatedPlaces 순서대로 리스트 형태로 변환
                    CoursePlaceRequest.id = currentCourse.courseId;
                    CoursePlaceRequest.placeIds = newPlaceRespList;

                    putCoursePlacesNum(CoursePlaceRequest);
                }
            }
        }
        else {
            setOriginalPlaces(places);
        }
        setIsEditMode(!isEditMode); // 편집 모드 토글
        setSelectedItems([]);
    };

    const putGuideBookTitle = async (title) => {
        try {
            await axiosInstance.put(`/api/v1/travels/guidebooks/${guidebookId}/title`, {
                title: title
            });
            setGuideBook(prevGuideBook => ({
                ...prevGuideBook,
                guideBookTitle: title
            }));
        } catch (error) {
            console.error('Error posting guidebook title:', error);
        }
    }

    const putTravelInfoMove = async (travelInfoMoveRequest) => {
        try {
            await axiosInstance.put(`/api/v1/courses/place/move`, travelInfoMoveRequest);
        } catch (error) {
            console.error('Error posting travel info move:', error);
        }
    }

    // 제목 편집 모달 클릭 핸들러
    const handleTitleSave = (newTitle) => {
        putGuideBookTitle(newTitle);
        setIsTitleEditModalOpen(false);
    }


    // 이동 버튼 클릭 핸들러
    const handleMoveClick = () => {
        setTargetCourse([]);
        setShowMoveModal(true); // 이동 모달 표시
    };

    const handleCopyClick = () => {
        setTargetCourse([]);
        setShowCopyModal(true); // 복사 모달 표시
    };


    // 대상 코스 선택 핸들러
    const handleTargetCourseSelect = (courseNumber) => {
        if (targetCourse.includes(courseNumber)) {
            setTargetCourse(prevCourse => {
                const newCourse = prevCourse.filter(course => course !== courseNumber);
                return newCourse;
            });
        } else {
            setTargetCourse(prevCourse => {
                const newCourse = [...prevCourse, courseNumber];
                return newCourse;
            });
        }
    };

    // 코스 탭 변경 시 장소 데이터 가져오기
    useEffect(() => {
        const coursesArray = Object.values(guideBook.courses);
        const currentCourse = coursesArray.find(course => course.courseNum === activeTab);
        if (currentCourse?.coursePlaces) {
            const updatedPlaces = currentCourse.coursePlaces.map((place, index) => ({
                ...place,
                num: index + 1
            }));
            if (places !== updatedPlaces) {
                setPlaces(updatedPlaces);

            }
        }
    }, [activeTab]);


    const handlePlaceMove = () => {
        if (selectedItems.length > 1) {
            alert("이동할 장소를 1개만 선택해주세요.");
            return;
        }

        // 이동할 코스 정보 가져오기
        const coursesArray = Object.values(guideBook.courses);
        const targetCourseInfo = coursesArray.find(course => course.courseId === targetCourse[0]);
        if (targetCourseInfo.coursePlaces.some(place => place.id === selectedItems[0])) {
            alert("이미 코스에 추가된 장소입니다.");
            return;
        }

        try {
            // 1. API 요청
            const travelInfoMoveRequest = {
                beforeCourseId: guideBook.courses[activeTab - 1].courseId,
                afterCourseId: targetCourse[0],
                placeId: selectedItems[0]
            }
            putTravelInfoMove(travelInfoMoveRequest);

            // 2. 프론트엔드 상태 업데이트
            if (targetCourse.length > 0) {

                setGuideBook(prevGuideBook => {
                    // 업데이트 할 전체 코스 정보 가져오기
                    const updatedCourses = { ...prevGuideBook.courses };


                    // 이동할 장소 정보 저장
                    const placeToMove = updatedCourses[activeTab - 1].coursePlaces.find(
                        place => selectedItems.includes(place.id)
                    );

                    // 기존 코스에서 장소 제거
                    updatedCourses[activeTab - 1].coursePlaces = updatedCourses[activeTab - 1].coursePlaces
                        .filter(place => !selectedItems.includes(place.id));

                    // 기존 코스 장소 순서 재정렬
                    updatedCourses[activeTab - 1].coursePlaces.sort((a, b) => a.num - b.num);

                    // 대상 코스에 장소 추가
                    if (placeToMove) {
                        // targetCourseInfo의 인덱스 찾기
                        const targetCourseIndex = Object.keys(updatedCourses).find(
                            key => updatedCourses[key].courseId === targetCourse[0]
                        );
                        const targetCoursePlacesCnt = targetCourseInfo.coursePlaces.length;
                        placeToMove.num = targetCoursePlacesCnt + 1;
                        targetCourseInfo.coursePlaces.push(placeToMove);
                        updatedCourses[targetCourseIndex] = targetCourseInfo;
                    }

                    return {
                        ...prevGuideBook,
                        courses: updatedCourses
                    };
                });
            }

            setShowMoveModal(false);
            setTargetCourse([]);
            setSelectedItems([]);
        } catch (error) {
            console.error('Error moving places:', error);
        }
    }

    // 장소 추가 핸들러
    const handlePlaceAdd = async () => {
        // 이동할 코스와 선택된 장소가 선택 된 경우
        if (targetCourse.length > 0 && selectedItems.length > 0) {
            try {
                // DB 코스 장소 추가 요청
                await axiosInstance.put(`/api/v1/courses/places/add`, {
                    courseIds: targetCourse,
                    placeIds: selectedItems,
                });
                setShowMoveModal(false); // 이동 모달 닫기
                setShowCopyModal(false); // 복사 모달 닫기
            } catch (error) {
                console.error('Error moving places:', error);
            }

            try {
                // 모든 업데이트를 한 번에 처리하도록 수정
                setGuideBook(prevGuideBook => {
                    const updatedCourses = { ...prevGuideBook.courses };

                    // 선택된 모든 코스에 대해 처리
                    targetCourse.forEach(courseId => {
                        const courseIndex = Object.keys(updatedCourses).find(key =>
                            updatedCourses[key].courseId === courseId
                        );

                        if (courseIndex !== undefined) {
                            // 추가할 새로운 장소들 필터링
                            const updateCoursePlaces = selectedItems
                                .filter(selectedId =>
                                    !updatedCourses[courseIndex].coursePlaces
                                        .some(place => place.id === selectedId)
                                )
                                .map(selectedId => ({
                                    ...places.find(place => place.id === selectedId),
                                    num: updatedCourses[courseIndex].coursePlaces.length + 1
                                }));

                            // 코스 업데이트
                            updatedCourses[courseIndex] = {
                                ...updatedCourses[courseIndex],
                                coursePlaces: [
                                    ...updatedCourses[courseIndex].coursePlaces,
                                    ...updateCoursePlaces
                                ]
                            };
                        }
                    });

                    return {
                        ...prevGuideBook,
                        courses: updatedCourses
                    };
                });

                setShowMoveModal(false); // 이동 모달 닫기
                setShowCopyModal(false);
                setSelectedItems([]);

            } catch (error) {
                console.error('Error updating courses:', error);
            }
        }
    };

    // 삭제 버튼 클릭 핸들러
    const handleDeleteClick = () => {
        setShowDeleteModal(true); // 삭제 모달 표시
    };

    // 삭제 확인 핸들러
    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/api/v1/courses/places/delete`, {
                data: {
                    courseId: guideBook.courses[activeTab - 1].courseId,
                    placeIds: selectedItems
                }
            });
            setShowDeleteModal(false); // 삭제 모달 닫기
        } catch (error) {
            console.error('Error deleting places:', error);
        }

        try {
            setPlaces(prevPlaces => {
                return prevPlaces.filter(place => !selectedItems.includes(place.id));
            });
            setGuideBook(prevGuideBook => {
                const updatedCourses = { ...prevGuideBook.courses };

                // 선택된 장소들 삭제
                selectedItems.forEach(item => {
                    updatedCourses[activeTab - 1].coursePlaces = updatedCourses[activeTab - 1].coursePlaces.filter(place => place.id !== item);
                });
                setShowDeleteModal(false);
                setSelectedItems([]);

                return {
                    ...prevGuideBook,
                    courses: updatedCourses
                };

            });
        } catch (error) {
            console.error('Error deleting places:', error);
        }
    };

    // 모달 닫기 핸들러
    const handleModalClose = () => {
        setShowMoveModal(false); // 이동 모달 닫기
        setShowCopyModal(false); // 복사 모달 닫기
        setShowDeleteModal(false); // 삭제 모달 닫기
    };

    // 체크박스 변경 핸들러
    const handleCheckboxChange = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id)); // 선택 해제
        } else {
            setSelectedItems([...selectedItems, id]); // 선택 추가
        }
    };

    // 드래그 앤 드롭 핸들러
    const handleOnDragEnd = (result) => {
        document.body.style.touchAction = 'pan-y';

        if (!result.destination) return;

        const newPlaces = Array.from(places);
        const [removed] = newPlaces.splice(result.source.index, 1);
        newPlaces.splice(result.destination.index, 0, removed);

        // 상태 업데이트를 즉시 수행
        setPlaces(newPlaces);

        // 나머지 업데이트는 약간의 지연 후 수행
        setTimeout(() => {
            setGuideBook(prevGuideBook => {
                const updatedCourses = { ...prevGuideBook.courses };
                updatedCourses[activeTab - 1] = {
                    ...updatedCourses[activeTab - 1],
                    coursePlaces: newPlaces
                };
                return {
                    ...prevGuideBook,
                    courses: updatedCourses
                };
            });
        }, 0);
    };


    // 장소 클릭 핸들러
    const handlePlaceClick = (place) => {
        if (!isEditMode) {
            setSelectedPlace(place);
            setShowDetailModal(true);
        }
    };

    // 모달 닫기 핸들러
    const handleDetailModalClose = () => {
        setShowDetailModal(false);
        setSelectedPlace(null);
    };

    const handleDragStart = (start) => {
        // 드래그 시작 시 스크롤 이벤트 조정
        document.body.style.touchAction = 'none';
    };

    const handleDragEnd = (result) => {
        // 드래그 종료 시 스크롤 이벤트 복구
        document.body.style.touchAction = 'pan-y';
        handleOnDragEnd(result);
    };

    // 콘텐츠 렌더링
    const renderContent = () => {
        return (
            <DragDropContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <Droppable droppableId="places">
                    {(provided) => (
                        <div
                            className="YC-GuideBook-place"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {places.map((place, index) => (
                                <Draggable key={place.id} draggableId={place.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`YC-GuideBook-place-Container ${isEditMode ? 'edit-mode' : ''}`}
                                        >
                                            {isEditMode ? (
                                                <input
                                                    type="checkbox"
                                                    className="YC-GuideBook-place-checkbox"
                                                    onChange={() => handleCheckboxChange(place.id)}
                                                />
                                            ) : (
                                                <div id="YC-GuideBook-place-number">{index + 1}</div>
                                            )}
                                            <div
                                                className="YC-GuideBook-place-draggable"
                                                onClick={() => handlePlaceClick(place)}
                                            >
                                                {isEditMode && (
                                                    <div className="drag-handle"
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <span></span>
                                                    </div>
                                                )}

                                                <img
                                                    id="YC-GuideBook-place-image"
                                                    src={place.image || "https://placehold.co/90x70?text=No+Image"}
                                                    alt="관광지 이미지"
                                                    crossOrigin="anonymous"
                                                    onError={(e) => {
                                                        e.target.src = "https://placehold.co/90x70?text=No+Image";
                                                    }}
                                                />

                                                <div className="YC-GuideBook-place-info">
                                                    <span id="YC-GuideBook-place-name">{place.name}</span>
                                                    <span id="YC-GuideBook-place-type">{place.type}</span>
                                                    <p id="YC-GuideBook-place-description">{place.intro}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    };

    // 컴포넌트 렌더링
    return ReactDOM.createPortal(
        <div className="WS-GuideBook-Container">
            <div className="WS-GuideBook-Header">
                <div className="WS-GuideBook-Header-Left-Container">
                    <div className="WS-GuideBook-Header-Back-Btn-Container">
                        <Link to={`/travelInfos/${guideBook.travelInfoId}`}>
                            <img className="WS-GuideBook-Header-Back-Btn"
                                src={backArrow}
                                alt="뒤로가기"
                                onClick={() => navigate(-1)} />
                        </Link>
                    </div>

                    <div className="WS-GuideBook-Header-Left-Text-Container">
                        <div className="WS-GuideBook-Header-Left-Text-Container-Title">{guideBook.travelInfoTitle}</div>

                        <div className="WS-GuideBook-Header-Left-Text-Contents-Title-Container">
                            <div className="WS-GuideBook-Header-Left-Text-Contents-Title">{guideBook.guideBookTitle}</div>
                            <div className="WS-GuideBook-Header-Left-Text-Contents-Title-Edit" onClick={() => setIsTitleEditModalOpen(true)}>편집</div>
                        </div>
                    </div>
                </div>
                <div className='WS-GuideBook-Header-Right-Container'>
                    <img src={downloadbtn} alt="여행 정보 이미지" />
                </div>

            </div>

            <div className="WS-GuideBook-Body">
                {/* 구글 맵 예시로 띄워 놓은 것이니, 장소에 대한 좌표를 받은후 맵을 띄워주는 것으로 변경 필요, 마커 + 마커끼리 연결 필요 */}
                <div className="WS-GuideBook-Map">
                    {places && places.length > 0 && (
                        <MapComponent
                            key={`map-${activeTab}-${places.length}-${mapKey}`}
                            places={places}
                        />
                    )}
                </div>

                <div className="WS-GuideBook-Button-Container">
                    <div className="WS-GuideBook-Buttons-On-Container">
                        {Object.keys(guideBook.courses).map((courseNumber) => (
                            <button
                                key={courseNumber}
                                className={activeTab === Number(courseNumber) + 1 ? 'WS-GuideBook-Button-Clicked' : 'WS-GuideBook-Button-Not-Clicked'}
                                onClick={() => handleTabClick(courseNumber)}
                            >
                                코스 {Number(courseNumber) + 1}
                            </button>
                        ))}
                    </div>

                    <div className="WS-GuideBook-Buttons-Under-Container">
                        <button className="WS-GuideBook-Button-EditBtn" onClick={handleEditClick}>
                            {isEditMode ? '완료' : '편집'}
                        </button>
                    </div>
                </div>

                <div className="WS-GuideBook-Contents-List" style={{
                    height: isEditMode ? '36%' : '70%'
                }}>
                    {renderContent()}
                </div>

                {isEditMode && (
                    <div className='WS-GuideBook-Modal-Bottom' onClick={e => e.stopPropagation()}>
                        <div className="WS-Modal-Option" onClick={handleMoveClick}>
                            <span className="SJ-modal-icon">🔀</span>
                            이동
                        </div>
                        <div className="WS-Modal-Option" onClick={handleCopyClick}>
                            <span className="SJ-modal-icon">📄</span>
                            장소 복사</div>
                        <div className="WS-Modal-Option" onClick={handleDeleteClick}>
                            <span className="SJ-modal-icon">🗑️</span>
                            삭제</div>
                    </div>
                )}
            </div>

            {/* 장소 이동 모달 */}
            {showMoveModal && (
                <div className="WS-second-Modal-Overlay" onClick={handleModalClose}>
                    <div className='WS-GuideBook-Modal-Bottom' onClick={e => e.stopPropagation()}>
                        <div className="WS-Copy-Modal-Option">
                            {Object.keys(guideBook.courses).filter(courseNum => Number(courseNum) + 1 !== activeTab).map((courseNumber) => (
                                <div className='WS-Modal-Option2' key={courseNumber}>
                                    <label className='WS-Select-Option-checkbox-Container'>
                                        <input type="checkbox" onChange={() => handleTargetCourseSelect(guideBook.courses[courseNumber].courseId)} />
                                        <div className='WS-Select-Option-checkbox-text'>코스 {Number(courseNumber) + 1}</div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="WS-Copy-Modal-Button-Container">
                            <button className="WS-Copy-Modal-Button" onClick={handleModalClose}>취소</button>
                            <button className="WS-Copy-Modal-Button" onClick={handlePlaceMove} disabled={!targetCourse}>이동</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 장소 복사 모달 */}
            {showCopyModal && (
                <div className="WS-second-Modal-Overlay" onClick={handleModalClose}>
                    <div className='WS-GuideBook-Modal-Bottom' onClick={e => e.stopPropagation()}>
                        <div className="WS-Copy-Modal-Option">
                            {Object.keys(guideBook.courses).filter(courseNum => Number(courseNum) + 1 !== activeTab).map((courseNumber) => (
                                <div className='WS-Modal-Option2' key={courseNumber}>
                                    <label className='WS-Select-Option-checkbox-Container'>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleTargetCourseSelect(guideBook.courses[courseNumber].courseId)}
                                        />
                                        <div className='WS-Select-Option-checkbox-text'>코스 {Number(courseNumber) + 1}</div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="WS-Copy-Modal-Button-Container">
                            <button className="WS-Copy-Modal-Button" onClick={handleModalClose}>취소</button>
                            <button className="WS-Copy-Modal-Button" onClick={handlePlaceAdd} disabled={!targetCourse}>복사</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 제목 편집 모달 */}
            {
                isTitleEditModalOpen && (
                    <TitleEditModal
                        isOpen={isTitleEditModalOpen}
                        onClose={() => setIsTitleEditModalOpen(false)}
                        title={guideBook.guideBookTitle}
                        onSave={(e) => handleTitleSave(e)}
                    />
                )
            }

            {/* 삭제 모달 */}
            {
                showDeleteModal && (
                    <div className="WS-second-Modal-Overlay">
                        <div id="WS-Delete-Modal-Content">
                            <div className="WS-Delete-Modal-Message-Container">
                                <div className="WS-Delete-Modal-Title">삭제하시겠습니까?</div>
                                <div className="WS-Delete-Modal-Message">삭제된 장소는 복구할 수 없습니다.</div>
                            </div>
                            <div className="WS-second-Modal-Button-Container">
                                <button className="WS-second-Modal-Button" onClick={handleModalClose}>취소</button>
                                <button className="WS-second-Modal-Button" onClick={handleDeleteConfirm}>확인</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* 장소 상세 모달 */}
            {showDetailModal && selectedPlace && (
                <div className="WS-GuideBook-Container">
                    <div className="YC-GuideBook-detail-modal">
                        <div className="HG-GuideBook-detail-modal-header">
                            <button className="YC-GuideBook-detail-modal-back" onClick={handleDetailModalClose}>
                                <img src={backArrow} alt="뒤로가기" />
                            </button>
                            <div className="HG-GuideBookList-Header-contents">
                                <div className="HG-GuideBookList-Header-contents-title">{guideBook.guideBookTitle}</div>
                                <div className="HG-GuideBookList-Header-contents-course">코스 {activeTab}</div>
                            </div>
                        </div>
                        <div className="YC-GuideBook-detail-modal-content">
                            <div className="YC-GuideBook-detail-modal-info">
                                <h3 className="YC-GuideBook-detail-modal-title">{selectedPlace.name}</h3>
                                <img
                                    className="YC-GuideBook-detail-modal-image"
                                    src={selectedPlace.image}
                                    alt={selectedPlace.name}
                                    onError={(e) => {
                                        e.target.src = "https://placehold.co/400x300?text=No+Image";
                                    }}
                                />
                                <div className="YC-GuideBook-detail-modal-address">
                                    주소: {selectedPlace.address}
                                </div>
                                <div className="YC-GuideBook-detail-modal-hours">
                                    운영시간: {selectedPlace.hours} ⓘ
                                </div>
                                <div className="YC-GuideBook-detail-modal-recommended-time">
                                    추천 관광시간: 2-3시간
                                </div>
                                <div className="YC-GuideBook-detail-modal-description-title">
                                    {selectedPlace.intro}
                                </div>
                                <p className="YC-GuideBook-detail-modal-description">
                                    {selectedPlace.description}
                                </p>
                            </div>
                            <div className="YC-GuideBook-detail-modal-map">
                                {selectedPlace &&
                                    <MapComponent
                                        key={`map-${activeTab}-${places.length}-${mapKey}`}
                                        places={[selectedPlace]}
                                    />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};

// 컴포넌트 export
export default GuideBook;