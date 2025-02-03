import React, { useState } from 'react';
import '../../css/travel/TravelModal.css';
import ReactDOM from 'react-dom';

function TravelPageModal({
    showModal,
    setShowModal,
    selectedItemId,
    handlePinToggle,
    pinnedItems,
    handleEditClick
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    if (!showModal) return null;

    // 삭제 모달 열기
    const handleDeleteClick = (itemId) => {
        setShowDeleteModal(true);
        // ⭐️임시로 console.log만 추가⭐️
        console.log("삭제 기능은 백엔드 연동 후 구현 예정");
    };

    // 삭제 확인 (임시로 모달만 닫기)
    const handleDeleteConfirm = () => {
        setShowDeleteModal(false);
        setShowModal(false);
        // ⭐️실제 삭제 로직은 주석 처리⭐️
        // setData(prev => prev.filter(item => item.id !== itemToDelete));
    };

    return ReactDOM.createPortal(
        <div className="SJ-Travel-Modal">
            {/* 모달 */}
            {showModal && (
                <>
                    <div
                        className="SJ-modal-overlay"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="SJ-modal-bottom">
                        <div className="SJ-modal-content">
                            <button
                                className="SJ-modal-option"
                                onClick={() => {
                                    handlePinToggle(selectedItemId);
                                    setShowModal(false);
                                }}
                            >
                                <span className="SJ-modal-icon">📌</span>
                                {pinnedItems.includes(selectedItemId)
                                    ? "고정 해제"
                                    : "고정 하기"}
                            </button>
                            <button
                                className="SJ-modal-option"
                                onClick={() => handleEditClick(selectedItemId)}
                            >
                                <span className="SJ-modal-icon">✏️</span>
                                이름 수정
                            </button>
                            <button
                                className="SJ-modal-option"
                                onClick={() => {
                                    setShowDeleteModal(true);
                                    setShowModal(false);
                                }}
                            >
                                <span className="SJ-modal-icon">🗑️</span>
                                삭제
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ⭐️삭제 확인 모달 (기능만 비활성화)⭐️ */}
            {showDeleteModal && (
                <div className="SJ-delete-modal-overlay">
                    <div className="SJ-delete-modal">
                        <p className="SJ-delete-title">삭제하시겠습니까?</p>
                        <p className="SJ-delete-subtitle">여행 목록에서 삭제됩니다.</p>
                        <div className="SJ-delete-buttons">
                            <button
                                className="SJ-delete-button cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="SJ-delete-button confirm"
                                onClick={() => {
                                    handleDeleteConfirm(selectedItemId);
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
}

export default TravelPageModal;