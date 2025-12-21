import React from "react";
import "./MainContent.scss";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return <div className="main-content">{children}</div>;
};

export default MainContent;
