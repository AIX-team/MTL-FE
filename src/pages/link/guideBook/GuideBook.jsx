// React 및 필요한 라이브러리 import
import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { usePDF } from 'react-to-pdf';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Polyline } from '@react-google-maps/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import downloadbtn from '../../../images/download.png';
import backArrow from '../../../images/backArrow.svg';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';  // html2canvas 라이브러리 추가 필요
// CSS 파일 import

import '../../../css/guide/GuideBook.css';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

// 구글 맵 컴포넌트(경로)
const MapComponent = ({ places }) => {
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

    // 배열인 경우에만 path 생성
    const path = isArray ? places.map(place => ({
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

            if (isArray) {
                // 여러 장소에 대한 마커 처리
                places.forEach((place, index) => {
                    const position = {
                        lat: parseFloat(place.latitude),
                        lng: parseFloat(place.longitude)
                    };
                    
                    // bounds에 위치 추가
                    bounds.extend(position);

                    const markerView = new window.google.maps.marker.AdvancedMarkerElement({
                        position,
                        map,
                        title: place.name,
                        content: new window.google.maps.marker.PinElement({
                            glyph: `${place.num}`,
                            glyphColor: '#FFFFFF',
                            background: '#4285f4',
                            borderColor: '#4285f4'
                        }).element
                    });

                    markerView.addListener('click', () => {
                        const infoWindow = new window.google.maps.InfoWindow({
                            content: `
                                <div style="padding: 10px;">
                                    <h3>${place.num}. ${place.name}</h3>
                                    <p>${place.address || ''}</p>
                                </div>
                            `
                        });
                        infoWindow.open(map, markerView);
                    });
                });

                // 모든 마커가 보이도록 맵 조정
                map.fitBounds(bounds);

                // 선택적: 최소/최대 줌 레벨 설정
                const listener = map.addListener('idle', () => {
                    if (map.getZoom() > 16) map.setZoom(16);
                    window.google.maps.event.removeListener(listener);
                });
            } else {
                // 단일 장소에 대한 마커 처리
                const position = {
                    lat: parseFloat(places.latitude),
                    lng: parseFloat(places.longitude)
                };
                
                bounds.extend(position);

                map.fitBounds(bounds);
                
                // 단일 마커의 경우 적절한 줌 레벨 설정
                map.setZoom(15);
            }
        } catch (error) {
            console.error('Error creating markers:', error);
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
};

// GuideBookList 컴포넌트 정의
const GuideBook = () => {
    // 상태 변수 정의
    const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 코스 탭
    const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 활성화 여부
    const [showMoveModal, setShowMoveModal] = useState(false); // 이동 모달 표시 여부
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 표시 여부
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 장소들
    const [targetCourse, setTargetCourse] = useState([]); // 이동할 대상 코스
    const [places, setPlaces] = useState([]); // 현재 코스의 장소들
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const { guidebookId } = useParams();
    const isPlaceNumChanged = (oldPlaces, newPlaces) => {
        if(oldPlaces.length !== newPlaces.length) {
            return true;
        }
        for(let i = 0; i < oldPlaces.length; i++) {
            if(oldPlaces[i] !== newPlaces[i]) {
                return true;
            }
        }
        return false;
    }
    
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
            console.log('CoursePlaceRequest :', coursePlaceRequest);
            console.log('Stringified CoursePlaceRequest :', JSON.stringify(coursePlaceRequest));

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
        if(isEditMode) {
            
            // 맵 컴포넌트 강제 리렌더링을 위한 키 업데이트
            setMapKey(prev => prev + 1);  // 새로운 상태 추가 필요

            const coursesArray = Object.values(guideBook.courses);
            const currentCourse = coursesArray.find(course => course.courseNum === activeTab);
            if (currentCourse?.coursePlaces) {
                const guideBookPlaces = currentCourse.coursePlaces.map((place) => ({
                    ...place
                }));

                const oldPlaceRespList = guideBookPlaces.map(place => 
                    place.id.toString().replace(/\u0000/g, '').trim());
                const newPlaceRespList = places.map(place => 
                    place.id.toString().replace(/\u0000/g, '').trim());

                if(isPlaceNumChanged(oldPlaceRespList, newPlaceRespList)) {
                    //updatedPlaces 순서대로 리스트 형태로 변환
                    CoursePlaceRequest.id = currentCourse.courseId;
                    CoursePlaceRequest.placeIds = newPlaceRespList;

                    putCoursePlacesNum(CoursePlaceRequest);
                    }
                }
            }
        setIsEditMode(!isEditMode); // 편집 모드 토글
        setSelectedItems([]);
    };

    // 이동 버튼 클릭 핸들러
    const handleMoveClick = () => {
        setShowMoveModal(true); // 이동 모달 표시
    };

    // 대상 코스 선택 핸들러
    const handleTargetCourseSelect = (courseNumber) => {
        if(targetCourse.includes(courseNumber)) {
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

    // 코스 변경 시 장소 데이터 가져오기
    useEffect(() => {
        const coursesArray = Object.values(guideBook.courses);
        const currentCourse = coursesArray.find(course => course.courseNum === activeTab);
        if (currentCourse?.coursePlaces) {
            const updatedPlaces = currentCourse.coursePlaces.map((place, index) => ({
                ...place,
                num: index + 1
            }));
            if(places !== updatedPlaces) {
                setPlaces(updatedPlaces);
            }
        }
    }, [activeTab, guideBook.courses]);

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
                setIsEditMode(false); // 편집 모드 해제
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
                
                setShowMoveModal(false);
                setIsEditMode(false);
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
            setGuideBook(prevGuideBook => {
                const updatedCourses = { ...prevGuideBook.courses };

                // 선택된 장소들 삭제
                selectedItems.forEach(item => {
                    updatedCourses[activeTab - 1].coursePlaces = updatedCourses[activeTab - 1].coursePlaces.filter(place => place.id !== item);
                });
                setShowDeleteModal(false);
                setIsEditMode(false);
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
        if (!result.destination) return;
        const items = Array.from(places);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPlaces(items);
        setGuideBook(prevGuideBook => {
            const updatedCourses = { ...prevGuideBook.courses };
            updatedCourses[activeTab - 1] = {
                ...updatedCourses[activeTab - 1],
                coursePlaces: items
            };
            return {
                ...prevGuideBook,
                courses: updatedCourses
            };
        });
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
                            style={{ 
                                height: '100%',
                                minHeight: '100px',
                                overflow: 'visible' // 스크롤을 비활성화
                            }}
                        >
                            {places.map((place, index) => (
                                <Draggable key={place.id} draggableId={place.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
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
    return (
        <div className="YC-GuideBookList-Container">
            <div className="HG-GuideBookList-Header">
            <div className="HG-GuideBookList-Header-contents">
                {/* 이곳에는 상위 여행 정보 경로 추가 해야함*/}
                <Link to={`/travelInfos/${guideBook.travelInfoId}`} id="YC-GuideBook-Header-contents-recommandations">{guideBook.travelInfoTitle}</Link>
                <h3 id="YC-GuideBook-Tittle">{guideBook.guideBookTitle}</h3>
                </div>
                <div>
                    <img src={downloadbtn} alt="여행 정보 이미지" />
                </div>
            </div>
            <div className="YC-GuideBookList-menus">
                <div className="YC-GuideBookList-menus-menu">
                    {Object.keys(guideBook.courses).map((courseNumber) => (
                        <button
                            key={courseNumber}
                            className={activeTab === Number(courseNumber) + 1 ? 'HG-button-clicked' : 'YC-GuideBookList-menus-menu-button'}
                            onClick={() => handleTabClick(courseNumber)}
                        >
                            코스 {Number(courseNumber) + 1}
                        </button>
                    ))}
                </div>
                <div className="YC-GuideBookList-menus-editBtn">
                    <button id="YC-GuideBookList-menus-editBtn-edit" onClick={handleEditClick}>
                        {isEditMode ? '완료' : '편집'}
                    </button>
                </div>

                <div className="YC-GuideBookList-content">
                    {renderContent()}
                </div>
                {isEditMode && selectedItems.length > 0 && (
                    <div className="YC-GuideBookList-editOptions">
                        <div onClick={handleMoveClick}>코스 이동</div>
                        <div onClick={handleDeleteClick}>삭제</div>
                    </div>
                )}
                {/* 구글 맵 예시로 띄워 놓은 것이니, 장소에 대한 좌표를 받은후 맵을 띄워주는 것으로 변경 필요, 마커 + 마커끼리 연결 필요 */}
                <div className="YC-GuideBookList-map">
                    {places && places.length > 0 && (
                        <MapComponent 
                            key={`map-${activeTab}-${places.length}-${mapKey}`}
                            places={places} 
                        />                    
                    )}
                </div>
            </div>



            {/* 이동 모달 */}
            {showMoveModal && (
                <div className="YC-GuideBookList-moveModal">
                    <p id="YC-GuideBookList-moveModal-title">다른 코스로 복사하시겠습니까?</p>

                    {Object.keys(guideBook.courses).filter(courseNum => Number(courseNum) + 1 !== activeTab).map((courseNumber) => (
                        <div className='HG-Select-Course' key={courseNumber}>
                            <input type="checkbox" className='HG-Select-Course-checkbox' onChange={() => handleTargetCourseSelect(guideBook.courses[courseNumber].courseId)} />
                                코스 {Number(courseNumber) + 1}
                        </div>
                    ))}

                    <button id="YC-GuideBookList-moveModal-confirm" onClick={handlePlaceAdd} disabled={!targetCourse}>예</button>
                    <button id="YC-GuideBookList-moveModal-cancel" onClick={handleModalClose}>아니오</button>
                </div>
            )}

            {/* 삭제 모달 */}
            {showDeleteModal && (
                <div className="YC-GuideBookList-deleteModal">
                    <div className="YC-GuideBookList-deleteModal-content">
                        <p id="YC-GuideBookList-deleteModal-title">삭제하시겠습니까?</p>
                        <p id="YC-GuideBookList-deleteModal-description">삭제된 장소는 복구할 수 없습니다.</p>
                    </div>
                    <div className="YC-GuideBookList-deleteModal-buttons">
                        <button id="YC-GuideBookList-deleteModal-cancel" onClick={handleModalClose}>취소</button>
                        <button id="YC-GuideBookList-deleteModal-confirm" onClick={handleDeleteConfirm}>확인</button>
                    </div>
                </div>
            )}

            {/* 장소 상세 모달 */}
            {showDetailModal && selectedPlace && (
                <div className="YC-GuideBook-detail-modal-overlay">
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
                                    src={selectedPlace.image || "https://placehold.co/400x300?text=No+Image"}
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
                                {selectedPlace && <MapComponent places={selectedPlace} />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 컴포넌트 export
export default GuideBook;