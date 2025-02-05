// React 및 필요한 라이브러리 import
import React, { useState, useEffect } from 'react';
import { usePDF } from 'react-to-pdf';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import downloadbtn from '../../images/download.png';
import backArrow from '../../images/backArrow.svg';
import { useParams } from 'react-router-dom';
// CSS 파일 import
import '../../css/GuideBookList.css';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});
  

// GuideBookList 컴포넌트 정의
const GuideBook = () => {
    // 네비게이션 훅 사용
    const navigate = useNavigate();
    // 상태 변수 정의
    const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 코스 탭
    const [activePage, setActivePage] = useState(1); // 현재 활성화된 페이지
    const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 활성화 여부
    const [showMoveModal, setShowMoveModal] = useState(false); // 이동 모달 표시 여부
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 표시 여부
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 장소들
    const [targetCourse, setTargetCourse] = useState(null); // 이동할 대상 코스
    const [places, setPlaces] = useState([]); // 현재 코스의 장소들
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const {toPDF, targetRef} = usePDF({filename: 'guidebook.pdf'});
    const { guideBookId } = useParams();

    const [guideBook, setGuideBook] = useState({
        success: '',
        message: '',
        guideBookTitle: '',
        travelInfoTitle: '',
        travelInfoId: '',
        courseCnt: '',
        courses: {}
    });

    // 테스트용 더미 데이터

    const dummyData = {
        1: [
            { id: 1, name: '오사카 성', type: '역사적 장소', image: '/images/osaka_castle.jpg', description: '오사카의 상징적인 성입니다.' },
            { id: 2, name: '도톤보리', type: '쇼핑 거리', image: '/images/dotonbori.jpg', description: '유명한 쇼핑 및 엔터테인먼트 거리입니다.' }
        ],
        2: [
            { id: 3, name: '유니버설 스튜디오 재팬', type: '테마파크', image: '/images/usj.jpg', description: '유명한 테마파크입니다.' }
        ],
        3: [
            { id: 4, name: '신사이바시', type: '쇼핑 거리', image: '/images/shinsaibashi.jpg', description: '쇼핑의 중심지입니다.' }
        ],
        4: [
            { id: 5, name: '오사카 수족관', type: '수족관', image: '/images/aquarium.jpg', description: '세계 최대의 수족관 중 하나입니다.' }
        ],
        5: [
            { id: 6, name: '오사카 과학 박물관', type: '박물관', image: '/images/science_museum.jpg', description: '과학을 체험할 수 있는 박물관입니다.' }
        ]
    };

    // 가이드북 데이터 가져오기
    const getGuideBook = async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/travels/guidebooks/${guideBookId}`);
            console.log(response.data);
            setGuideBook(response.data);
            setPlaces(response.data.courses[0].coursePlaces || []);
        } catch (error) {
            console.error('Error fetching guidebook:', error);
        }
    }   

    useEffect(() => {
        getGuideBook();
    }, []);

    // 코스 탭 클릭 핸들러
    const handleTabClick = (courseNumber) => {
        setIsEditMode(false); // 편집 모드 해제
        setShowMoveModal(false); // 이동 모달 닫기
        setActiveTab(Number(courseNumber) + 1); // 활성화된 탭 변경
    };

    // 편집 버튼 클릭 핸들러
    const handleEditClick = () => {
        setIsEditMode(!isEditMode); // 편집 모드 토글
    };

    // 이동 버튼 클릭 핸들러
    const handleMoveClick = () => {
        setShowMoveModal(true); // 이동 모달 표시
    };

    // 대상 코스 선택 핸들러
    const handleTargetCourseSelect = (courseNumber) => {
        setIsEditMode(false); // 편집 모드 해제
        setShowMoveModal(false); // 이동 모달 닫기
        setTargetCourse(courseNumber); // 대상 코스 설정
    };

    // 코스 변경 시 장소 데이터 가져오기
    useEffect(() => {
        const coursesArray = Object.values(guideBook.courses);
        const currentCourse = coursesArray.find(course => course.courseNum === activeTab);
        setPlaces(currentCourse?.coursePlaces || []);
    }, [activeTab]);

    // 이동 확인 핸들러
    const handleMoveConfirm = async () => {
        if (targetCourse) {
            try {
                await axiosInstance.post(`/api/courses/move`, {
                    places: selectedItems,
                    targetCourse
                });
                setShowMoveModal(false); // 이동 모달 닫기
                setIsEditMode(false); // 편집 모드 해제
            } catch (error) {
                console.error('Error moving places:', error);
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
            await axiosInstance.post(`/api/courses/delete`, {
                places: selectedItems
            });
            setShowDeleteModal(false); // 삭제 모달 닫기
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

            // 가이드북 데이터 구조 예시        
            // {
            //     "success": "success",
            //     "message": "success",
            //     "guideBookTitle": "Alice's Coastal Guide",
            //     "travelInfoTitle": "Alice's",
            //     "travelInfoId": "ti1",
            //     "courseCnt": 2,
            //     "courses": [
            //       {
            //         "courseId": "c1",
            //         "courseNum": 1,
            //         "coursePlaces": [
            //           {
            //             "placeNum": 1,
            //             "placeId": "p1",
            //             "placeName": "Sunny Beach",
            //             "placeType": "beach",
            //             "placeDescription": "A beautiful beach",
            //             "placeImage": "https://example.com/images/beach.jpg",
            //             "placeAddress": "123 Beach Road",
            //             "placeHours": "08:00 - 18:00",
            //             "placeIntro": "Relaxing beach",
            //             "placeLatitude": "36.15964562",
            //             "placeLongitude": "138.02694563"
            //           },
            //           {
            //             "placeNum": 2,
            //             "placeId": "p3",
            //             "placeName": "Urban Park",
            //             "placeType": "park",
            //             "placeDescription": "A peaceful park in the city",
            //             "placeImage": "https://example.com/images/park.jpg",
            //             "placeAddress": "789 City Center",
            //             "placeHours": "08:00 - 18:00",
            //             "placeIntro": "City escape",
            //             "placeLatitude": "43.06630501",
            //             "placeLongitude": "141.36674663"
            //           }
            //         ]
            //       },
            //       {
            //         "courseId": "c2",
            //         "courseNum": 2,
            //         "coursePlaces": [
            //           {
            //             "placeNum": 1,
            //             "placeId": "p1",
            //             "placeName": "Sunny Beach",
            //             "placeType": "beach",
            //             "placeDescription": "A beautiful beach",
            //             "placeImage": "https://example.com/images/beach.jpg",
            //             "placeAddress": "123 Beach Road",
            //             "placeHours": "08:00 - 18:00",
            //             "placeIntro": "Relaxing beach",
            //             "placeLatitude": "36.15964562",
            //             "placeLongitude": "138.02694563"
            //           }
            //         ]
            //       }
            //     ]
            //   }
      

    // 콘텐츠 렌더링
    const renderContent = () => {
        return (
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="places">
                    {(provided) => (
                        <div className="YC-GuideBook-place" {...provided.droppableProps} ref={provided.innerRef}>
                            {places.map((place, index) => (
                                <Draggable key={place.id.toString()} draggableId={place.id.toString()} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`YC-GuideBook-place-Container ${snapshot.isDragging ? 'dragging' : ''} ${isEditMode ? 'edit-mode' : ''}`}
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
                                            <div className="YC-GuideBook-place-draggable" onClick={() => handlePlaceClick(place)}
                                            >
                                                {isEditMode && (
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="drag-handle"
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
        <div className="YC-GuideBookList-Container" ref={targetRef}>
            <div className="HG-GuideBookList-Header">
            <div className="HG-GuideBookList-Header-contents">
                {/* 이곳에는 상위 여행 정보 경로 추가 해야함*/}
                <Link to={`/travelInfos/${guideBook.travelInfoId}`} id="YC-GuideBook-Header-contents-recommandations">{guideBook.travelInfoTitle}</Link>
                <h3 id="YC-GuideBook-Tittle">{guideBook.guideBookTitle}</h3>
                </div>
                <div>
                    <img src={downloadbtn} alt="여행 정보 이미지" 
                    onClick={() => toPDF(targetRef)}/>
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
                {isEditMode && (
                    <div className="YC-GuideBookList-editOptions">
                        <button onClick={handleMoveClick}>코스 이동</button>
                        <button onClick={handleDeleteClick}>삭제</button>
                    </div>
                )}
            </div>
            {/* 구글 맵 예시로 띄워 놓은 것이니, 장소에 대한 좌표를 받은후 맵을 띄워주는 것으로 변경 필요, 마커 + 마커끼리 연결 필요 */}
            <div className="YC-GuideBookList-map">
                <iframe className="YC-GuideBookList-map-iframe" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3269.8668888888887!2d135.5016858152176!3d34.69373778042199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e68f5ddb6b43%3A0x1c5edc85620f065e!2z7J207Iqk7Yq466-47J207Iqk7Yq466-4!5e0!3m2!1sko!2skr!4v1716418888888!5m2!1sko!2skr" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>


            {/* 이동 모달 */}
            {showMoveModal && (
                <div className="YC-GuideBookList-moveModal">
                    <p id="YC-GuideBookList-moveModal-title">다른 코스로 이동하시겠습니까?</p>
                    {[1, 2, 3, 4, 5].filter(course => course !== activeTab).map(course => (
                        <button key={course} onClick={() => handleTargetCourseSelect(course)}>
                            코스 {course}
                        </button>
                    ))}
                    <button id="YC-GuideBookList-moveModal-confirm" onClick={handleMoveConfirm} disabled={!targetCourse}>예</button>
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
                                <iframe 
                                className="YC-GuideBook-detail-modal-map-iframe" 
                                title={`${selectedPlace.name} 위치 지도`}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedPlace.name)}+(${selectedPlace.latitude},${selectedPlace.longitude})&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                />
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