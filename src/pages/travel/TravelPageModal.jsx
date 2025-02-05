import React, { useState } from 'react';
import '../../css/travel/TravelPageModal.css';
import ReactDOM from 'react-dom';

const TravelPageModal = ({
    showModal,
    setShowModal,
    selectedItemId,
    handlePinToggle,
    pinnedItems,
    onUpdateTitle,
    onDeleteItem,
    items = []
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    // 수정 클릭 핸들러 함수
    const openEditModal = (itemId) => {
        if (!items || !itemId) return;

        const selectedItem = items.find(item => item.id === itemId);
        if (selectedItem) {
            setNewTitle(selectedItem.title);
            setIsEditModalOpen(true);
        }
    };

    // 제목 수정 저장 함수
    const handleSaveTitle = () => {
        onUpdateTitle(selectedItemId, newTitle);
        setIsEditModalOpen(false);
        setShowModal(false);
    };

    // 수정 모달 취소 핸들러
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
    };

    return ReactDOM.createPortal(
        <div className="SJ-Travel-Modal">
            {showModal && (
                <>
                    <div className="SJ-modal-overlay" onClick={() => setShowModal(false)} />
                    <div className="SJ-modal-bottom">
                        <div className="SJ-modal-content">
                            <button
                                className="SJ-modal-option"
                                onClick={() => handlePinToggle(selectedItemId)}
                            >
                                <span className="SJ-modal-icon">📌</span>
                                {pinnedItems.includes(selectedItemId) ? "고정 해제" : "고정 하기"}
                            </button>

                            <button
                                className="SJ-modal-option"
                                onClick={() => openEditModal(selectedItemId)}
                            >
                                <span className="SJ-modal-icon">✏️</span>
                                이름 수정
                            </button>

                            <button
                                className="SJ-modal-option delete"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <span className="SJ-modal-icon">🗑️</span>
                                삭제
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* 수정 모달 */}
            {isEditModalOpen && (
                <div className="SJ-second-modal-overlay" style={{ zIndex: 1001 }}>
                    <div className="SJ-edit-modal">
                    <p className="SJ-delete-title">제목을 수정합니다</p>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="SJ-modal-input"
                            readOnly
                            onClick={(e) => e.target.removeAttribute('readonly')}
                        />
                        <div className="SJ-modal-buttons">
                            <button
                                className="WS-Modal-Button"
                                onClick={handleEditCancel}
                            >
                                취소
                            </button>
                            <button
                                className="WS-Modal-Button"
                                onClick={handleSaveTitle}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 삭제 모달 */}
            {showDeleteModal && (
                <div className="SJ-second-modal-overlay" style={{ zIndex: 1001 }}>
                    <div className="SJ-delete-modal">
                        <p className="SJ-delete-title">삭제하시겠습니까?</p>
                        <p className="WS-Modal-Message">여행 목록에서 삭제됩니다.</p>
                        <div className="SJ-modal-buttons">
                            <button
                                className="WS-Modal-Button"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="WS-Modal-Button"
                                onClick={() => {
                                    onDeleteItem(selectedItemId);
                                    setShowDeleteModal(false);
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};

export default TravelPageModal;