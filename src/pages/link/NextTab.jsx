import React, { useState } from 'react';
import '../../css/linkpage/NextTab.css';

const NextTab = ({ onClose }) => {
    const [selectedStyles, setSelectedStyles] = useState({
        landmark: false,  // 관광
        relax: false,    // 휴양
        food: false,     // 먹방
        alone: false,    // 1인여행
        family: false,   // 가족
        friend: false,   // 친구
        couple: false,   // 연인
        child: false,    // 아이
        parents: false   // 부모님
    });

    const handleStyleClick = (style) => {
        setSelectedStyles(prev => ({
            ...prev,
            [style]: !prev[style]
        }));
    };

    // 스타일 버튼 데이터
    const styleButtons = [
        [
            { key: 'landmark', label: '관광' },
            { key: 'relax', label: '휴양' },
            { key: 'food', label: '먹방' }
        ],
        [
            { key: 'alone', label: '1인여행' },
            { key: 'family', label: '가족' },
            { key: 'friend', label: '친구' }
        ],
        [
            { key: 'couple', label: '연인' },
            { key: 'child', label: '아이' },
            { key: 'parents', label: '부모님' }
        ]
    ];

    return (
        <div className="WS-NextTab">
            <div className="WS-NextTab-Header">
                <button className="WS-NextTab-CloseButton" onClick={onClose}>×</button>
                <h1>여행 스타일을 알려주세요!</h1>
                <p>당신만을 위한 여행 플랜 추천</p>
                <div className="WS-NextTab-Progress">1/3</div>
            </div>

            <div className="WS-NextTab-Styles">
                {styleButtons.map((row, rowIndex) => (
                    <div key={rowIndex} className="WS-NextTab-Row">
                        {row.map(({ key, label }) => (
                            <button
                                key={key}
                                className={`WS-NextTab-Style ${selectedStyles[key] ? 'active' : ''}`}
                                onClick={() => handleStyleClick(key)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            <button 
                className="WS-NextTab-Button"
                onClick={() => {
                    // 다음 단계 로직
                    onClose(); // 임시로 닫기만 처리
                }}
            >
                다음
            </button>
        </div>
    );
};

export default NextTab;
