import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import {
  FaHome,
  FaClipboardList,
  FaFileAlt,
  FaSearch,
  FaCrown,
} from "react-icons/fa"; // Import icons for each tab

import { Link, useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fullname = localStorage.getItem("fullname");
  const [openMenu, setOpenMenu] = useState(false);
    
  const handleLogout = () => {
    localStorage.removeItem("fullname");
    localStorage.removeItem("token");
    setOpenMenu(false);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md px-4 flex items-center justify-between py-5">
      {/* Logo Section */}
      <Link to={"/"} className="flex items-center">
        <span className="text-blue-600 font-bold text-lg">LOGO</span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex space-x-6">
        {/* Desktop Links */}
        <Link
          to={"/"}
          className={`hidden sm:block  ${
            location.pathname === "/" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          Trang chủ
        </Link>
        <Link
          to={"/practice"}
          className={`hidden sm:block  ${
            location.pathname === "/practice"
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          Luyện tập
        </Link>
        <Link
          to={"/mock-test"}
          className={`hidden sm:block  ${
            location.pathname === "/mock-test"
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          Thi thử
        </Link>
        <Link
          to={"/resource"}
          className={`hidden sm:block  ${
            location.pathname === "/resource"
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          Tài nguyên
        </Link>
        <Link to={"/payment"} className="hidden sm:block text-yellow-600">
          Premium
        </Link>

        {/* Mobile Icons */}
        <Link
          to={"/"}
          className={`sm:hidden  ${
            location.pathname === "/" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <FaHome className="text-xl" />
        </Link>
        <Link
          to={"/practice"}
          className={`sm:hidden  ${
            location.pathname.includes("practice")
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          <FaClipboardList className="text-xl" />
        </Link>
        <Link
          to={"/mock-test"}
          className={`sm:hidden  ${
            location.pathname === "/mock-test"
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          <FaFileAlt className="text-xl" />
        </Link>
        <Link
          to={"/resource"}
          className={`sm:hidden  ${
            location.pathname === "/resource"
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          <FaSearch className="text-xl" />
        </Link>
        <Link to={"/payment"} className="sm:hidden text-yellow-600">
          <FaCrown className="text-xl" />
        </Link>
      </nav>

      {/* Login / User Section */}
      <div className="flex items-center space-x-4 relative">
        {fullname ? (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center space-x-2 hover:text-blue-600"
            >
              <CiUser className="text-2xl" />
              <span className="font-medium text-gray-700">{fullname}</span>
            </button>

            {/* Dropdown */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2 z-50">
                <Link
                  to="/profile"
                  onClick={() => setOpenMenu(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to={"/login"}
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
