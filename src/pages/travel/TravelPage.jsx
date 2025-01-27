import React from "react";
import { Routes, Route } from "react-router-dom";
import TravelList from "./TravelList/TravelList";

const TravelPage = () => {
  return (
    <div className="travel-content">
      <Routes>
        <Route path="/" element={<TravelList />} />
      </Routes>
    </div>
  );
};

export default TravelPage;
