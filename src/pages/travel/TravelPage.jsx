import React from 'react';
import { Routes, Route } from 'react-router-dom';

const TravelPage = () => {
    return (
        <div className="travel-page">
            <div className="travel-content">
                <h1>Travel Page</h1>
                <Routes>
                    <Route path="/" element={<div>Travel Main Content</div>} />
                </Routes>
            </div>
        </div>
    );
};

export default TravelPage;
