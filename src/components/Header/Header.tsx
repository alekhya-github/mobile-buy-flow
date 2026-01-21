import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.scss";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasCartData, setHasCartData] = useState(false);

  useEffect(() => {
    // Check if cart data exists in localStorage
    const cartData = localStorage.getItem("cartData");
    setHasCartData(!!cartData);
  }, [location]);

  const handleCartClick = () => {
    const cartData = localStorage.getItem("cartData");
    if (cartData) {
      navigate("/cart", { state: { cartData: JSON.parse(cartData) } });
    } else {
      alert("Your cart is empty");
    }
  };

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__logo">
          <h1 className="header__title">Mobile Home</h1>
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
            <li>
              <Link
                to="/mobile/server-info"
                className={`header__nav-link ${
                  location.pathname === "/mobile/server-info" ? "active" : ""
                }`}
              >
                Server Info
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header__cart" onClick={handleCartClick}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {hasCartData && <span className="header__cart-badge"></span>}
        </div>
      </div>
    </div>
  );
};

export default Header;
