import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MainContent from "./components/MainContent/MainContent";
import Home from "./components/Home/Home";
import Phones from "./components/Phones/Phones";
import TestPhoneService from "./components/TestPhoneService/TestPhoneService";
import "./App.scss";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <MainContent>
          <Routes>
            <Route path="/mobile/home" element={<Home />} />
            <Route path="/mobile/phones" element={<Phones />} />
            <Route path="/mobile/test" element={<TestPhoneService />} />
            <Route path="/" element={<Navigate to="/mobile/home" replace />} />
          </Routes>
        </MainContent>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
