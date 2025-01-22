// React 및 필요한 라이브러리 import
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// CSS 파일 import
import '../../css/GuideBookList.css';

// GuideBookList 컴포넌트 정의
const GuideBookList = () => {
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

    // 코스 탭 클릭 핸들러
    const handleTabClick = (courseNumber) => {
        setIsEditMode(false); // 편집 모드 해제
        setShowMoveModal(false); // 이동 모달 닫기
        setActiveTab(courseNumber); // 활성화된 탭 변경
    };

    // 다음 페이지로 이동
    const handleNextPage = () => {
        setActivePage((prevPage) => (prevPage % 3) + 1);
    };

    // 이전 페이지로 이동
    const handlePreviousPage = () => {
        setActivePage((prevPage) => (prevPage === 1 ? 3 : prevPage - 1));
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
        fetchPlaces(activeTab);
        setPlaces(dummyData[activeTab] || []); // 더미 데이터 설정
    }, [activeTab]);

    // 장소 데이터 가져오기
    const fetchPlaces = async (courseNumber) => {
        try {
            const response = await axios.get(`/api/courses/${courseNumber}/places`);
            setPlaces(response.data); // 장소 데이터 설정
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    // 이동 확인 핸들러
    const handleMoveConfirm = async () => {
        if (targetCourse) {
            try {
                await axios.post(`/api/courses/move`, {
                    places: selectedItems,
                    targetCourse
                });
                setShowMoveModal(false); // 이동 모달 닫기
                setIsEditMode(false); // 편집 모드 해제
                fetchPlaces(activeTab); // 장소 데이터 갱신
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
            await axios.post(`/api/courses/delete`, {
                places: selectedItems
            });
            setShowDeleteModal(false); // 삭제 모달 닫기
            fetchPlaces(activeTab); // 장소 데이터 갱신
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
                                            className={`YC-GuideBook-place-Container ${snapshot.isDragging ? 'dragging' : ''}`}
                                        >
                                            <div id="YC-GuideBook-place-number">{index + 1}</div>
                                            {isEditMode && (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="YC-GuideBook-place-checkbox"
                                                        onChange={() => handleCheckboxChange(place.id)}
                                                    />
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="drag-handle"
                                                    >
                                                        <span></span>
                                                    </div>
                                                </>
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
                                                <p id="YC-GuideBook-place-description">{place.description}</p>
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
            <div className="YC-GuideBookList-Header">
                {/* 이곳에는 상위 여행 정보 경로 추가 해야함*/}
                <Link to="#" id="YC-GuideBook-Header-contents-recommandations">상위 여행 정보</Link>
                <h3 id="YC-GuideBook-Tittle">오사카 여행 5일 코스</h3>
            </div>
            <div className="YC-GuideBookList-menus">
                <div className="YC-GuideBookList-menus-menu">
                    <button onClick={() => handleTabClick(1)}>코스 1</button>
                    <button onClick={() => handleTabClick(2)}>코스 2</button>
                    <button onClick={() => handleTabClick(3)}>코스 3</button>
                    <button onClick={() => handleTabClick(4)}>코스 4</button>
                    <button onClick={() => handleTabClick(5)}>코스 5</button>
                </div>
                <div className="YC-GuideBookList-menus-editBtn">
                    <button id="YC-GuideBookList-menus-editBtn-edit" onClick={handleEditClick}>편집</button>
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
                    <p id="YC-GuideBookList-deleteModal-title">삭제하시겠습니까?</p>
                    <button id="YC-GuideBookList-deleteModal-confirm" onClick={handleDeleteConfirm}>예</button>
                    <button id="YC-GuideBookList-deleteModal-cancel" onClick={handleModalClose}>아니오</button>
                </div>
            )}
        </div>
    );
};

// 컴포넌트 export
export default GuideBookList;