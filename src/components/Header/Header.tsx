import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__logo">
          <h1 className="header__title">Mobile Store</h1>
        </div>
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li>
              <Link
                to="/mobile/home"
                className={`header__nav-link ${
                  location.pathname === "/mobile/home" ? "active" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/mobile/phones"
                className={`header__nav-link ${
                  location.pathname === "/mobile/phones" ? "active" : ""
                }`}
              >
                Phones
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
