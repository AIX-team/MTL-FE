import React from "react";
import TravelList from "./TravelList";
import GuidebookList from "./GuidebookList";
import TravelTab from "./TravelTab";
import '../../css/travel/TravelPage.css';

const TravelPage = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'TravelList':  
        return <TravelList />;
      case 'GuidebookList':
        return <GuidebookList />;
      default:
        return null;
    }
  };

  return (
    <div className="SJ-Travel-Page">
      <TravelTab />
      <div className="SJ-Travel-Page-Content">
        {renderContent()}
      </div>
    </div>
  );
};

export default TravelPage;
