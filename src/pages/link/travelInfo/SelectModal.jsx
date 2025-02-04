import backArrow from '../../../images/backArrow.svg';
import { useState, useEffect } from 'react';
import selectIcon from '../../../images/select.svg';
import isSelectedIcon from '../../../images/isselect.svg';
import allSelectIcon from '../../../images/select_check_deactive.svg';
import xIcon from '../../../images/x-btn.svg';
import '../../../css/SelectModal.css';

const SelectModal = ({ isOpen, onClose, selectedPlaces, onPlaceSelect, travelDays }) => {

  
  const [isSelected, setIsSelected] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(['전체보기']);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 필터 타입을 매핑하는 객체 추가
  const filterTypeMap = {
    '전체보기': ['all', 'landmark', 'restaurant', 'etc'],
    '관광지': 'landmark',
    '음식/카페': 'restaurant',
    '그 외': 'etc'
  };

  const handlePlaceSelect = (placeId) => {
    setIsSelected(prev => {
      const isExist = prev.some(item => item.placeId === placeId);
      if (isExist) {
        return prev.filter(item => item.placeId !== placeId);
      }
      const selectedPlace = selectedPlaces.find(place => place.placeId === placeId);
      return [...prev, selectedPlace];
    });
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilters(prev => {
      if (filter === '전체보기') {
        return ['전체보기'];
      }
      
      const newFilters = prev.filter(f => f !== '전체보기');
      if (prev.includes(filter)) {
        return newFilters.filter(f => f !== filter);
      }
      return [...newFilters, filter];
    });
  };

  const handleDelete = () => {
    if (deleteTarget === 'all') {
      setIsSelected([]);
      onPlaceSelect([]); // 전체 삭제 시 빈 배열 전달
    } else if (deleteTarget) {
      handlePlaceSelect(deleteTarget);
      // selectedPlaces에서 해당 항목을 제외한 새 배열을 생성하여 전달
      const updatedPlaces = selectedPlaces.filter(place => place.placeId !== deleteTarget);
      onPlaceSelect(updatedPlaces);
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (placeId) => {
    setDeleteTarget(placeId || 'all');
    setShowDeleteModal(true);
  };

  // 유효성 검사 및 가이드북 생성 핸들러 추가
  const handleGuidebookCreate = () => {
    const minPlaces = travelDays * 2;
    const maxPlaces = travelDays * 5;
    
    if (isSelected.length < minPlaces) {
      alert(`최소 ${minPlaces}개의 장소를 선택해주세요.`);
      return;
    }
    
    if (isSelected.length > maxPlaces) {
      alert(`최대 ${maxPlaces}개까지만 선택 가능합니다.`);
      return;
    }
    
    // 여기에 가이드북 생성 로직 추가
    onClose();
  };

  // useEffect를 사용하여 모달 상태에 따라 body 클래스 토글
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // 컴포넌트 언마운트 시 클래스 제거
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    setIsSelected(selectedPlaces);
  }, [selectedPlaces]);

    return (
      <div className={` ${isOpen ? 'HG-select-modal-container' : 'none'}`}>
        <div className='HG-select-modal-header'>
          <img src={backArrow} alt="backArrow" onClick={onClose} />
          <span>선택</span>
        </div>
        <div className='HG-select-modal-title'>
          <div>AI 추천 장소입니다.</div>
          <div className='HG-select-modal-title-sub'>평점/리뷰가 좋고 동선이 가까운 순으로 추천됩니다.</div>
        </div>
        <div className='HG-select-modal-filter'>
          <div className='HG-select-modal-filter-btns'>
            {['전체보기', '관광지', '음식/카페', '그 외'].map((filter) => (
              <span 
                key={filter}
                className={`HG-select-modal-filter-btn ${selectedFilters.includes(filter) ? 'active' : ''}`}
                onClick={() => handleFilterSelect(filter)}
              >
                <input 
                  value={filterTypeMap[filter]}
                  type="checkbox"
                  checked={selectedFilters.includes(filter)}
                  onChange={() => {}}
                />
                {filter}
              </span>
            ))}
          </div>
          <div className='HG-select-modal-select-frame'>
            <span className='HG-select-modal-select-btn'
              onClick={() => setIsSelected(prev => prev.length === selectedPlaces.length ? [] : selectedPlaces)}
            >
              <img src={selectedPlaces.length > 0 && isSelected.length === selectedPlaces.length ? isSelectedIcon : allSelectIcon} alt="selectIcon" />
              전체 선택</span>
            <span className='HG-select-modal-select-delete'
              onClick={() => handleDeleteClick()}
            >선택 삭제</span>
          </div>
        </div>
        <div className='HG-select-modal-select-list'>
          {Object.entries({
            'landmark': '관광지',
            'restaurant': '음식/카페',
            'etc': '그 외'
          }).map(([type, koreanType]) => {
            const placesOfType = selectedPlaces.filter(place => {
              if (type === 'etc') {
                // etc 타입일 경우 landmark와 restaurant가 아닌 모든 항목 필터링
                return !['landmark', 'restaurant'].includes(place.placeType);
              }
              // 그 외의 경우 일치하는 타입만 필터링
              return place.placeType === type;
            });

            return placesOfType.length > 0 && (
              <div className='HG-select-modal-select-list-type' key={type}>
                <div className="HG-select-modal-type-header">{koreanType}</div>
                {placesOfType.map((place, index) => (
                  <div key={index} className='HG-select-modal-select-list-item'>
                    <div className='HG-select-modal-select-list-item-content'>
                      <span>
                        <img 
                          className='HG-trevelinfo-content-frame-select' 
                          onClick={() => handlePlaceSelect(place.placeId)}
                          src={isSelected.some(item => item.placeId === place.placeId) ? isSelectedIcon : selectIcon} 
                          alt="selectIcon" />
                      </span>
                      <span onClick={() => handlePlaceSelect(place.placeId)}>
                        <img className='HG-select-modal-select-list-item-place-img' src={place.placeImage}
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/600/300';
                      }}
                      alt="placeImage" />
                      </span>
                      <div onClick={() => handlePlaceSelect(place.placeId)}>
                        <div className='HG-select-modal-select-list-item-place-info-name'>{place.placeName}</div>
                        <div className='HG-select-modal-select-list-item-place-info-intro'>{place.intro}</div>
                      </div>
                      <div className='HG-select-modal-select-list-item-place-delete'>
                        <img src={xIcon} alt="xIcon" onClick={() => handleDeleteClick(place.placeId)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className='HG-select-modal-footer'>
          <div className='HG-select-modal-footer-text-frame'>
            <span className='HG-select-modal-footer-text-bold'>!{travelDays}일 기준:</span>
            <span className='HG-select-modal-footer-text'>최소 {travelDays * 2}개 - 최대 {travelDays * 5}개까지 선택가능합니다</span>
            </div>
          <div className='HG-select-modal-footer-btn' onClick={handleGuidebookCreate}>
            가이드북 생성 {isSelected.length}
          </div>
        </div>

        {/* 삭제 확인 모달 추가 */}
        {showDeleteModal && (
          <div className="HG-delete-confirm-modal">
            <div className="HG-delete-confirm-content">
              <p>정말 삭제하시겠습니까?</p>
              <div className="HG-delete-confirm-buttons">
                <button onClick={() => setShowDeleteModal(false)}>취소</button>
                <button onClick={handleDelete}>확인</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default SelectModal;