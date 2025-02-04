import React, { useState, useEffect } from 'react';
import TravelList from './TravelList';
import GuidebookList from './GuidebookList';

import '../../css/travel/TravelTab.css';

const TravelTab = () => {
    const [activeTab, setActiveTab] = useState('travel');

    return (
        <div className="SJ-Travel-List">
            <div className="SJ-Travel-Tab-Container">
                <div className="SJ-Travel-Tabs">
                    <div
                        className={`SJ-Travel-Tab ${activeTab === "travel" ? "active" : ""}`}
                        onClick={() => setActiveTab("travel")}
                    >
                        여행 목록
                    </div>
                    <div
                        className={`SJ-Travel-Tab ${activeTab === "guide" ? "active" : ""}`}
                        onClick={() => setActiveTab("guide")}
                    >
                        가이드북 목록
                    </div>
                </div>
                <div className="SJ-Tab-Indicator-Container">
                    <div
                        className="SJ-Tab-Indicator"
                        style={{
                            transform: `translateX(${activeTab === "travel" ? "0" : "100%"})`,
                        }}
                    ></div>
                </div>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="SJ-Travel-Page">
                <div className="SJ-Travel-Page-Content">
                    {activeTab === 'travel' ? (
                        <TravelList />
                    ) : (
                        <GuidebookList />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelTab;

// 완료 ===================================================================