import React from 'react';
import { Routes, Route } from 'react-router-dom';

const MyPage = () => {
    return (
        <div className="mypage-page">
            <div className="mypage-content">
                <h1>My Page</h1>
                <Routes>
                    <Route path="/" element={<div>MyPage Main Content</div>} />
                </Routes>
            </div>
        </div>
    );
};

export default MyPage;
