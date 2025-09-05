import React from "react";
import { CiUser } from "react-icons/ci";
import {
  FaHome,
  FaClipboardList,
  FaFileAlt,
  FaSearch,
  FaCrown,
} from "react-icons/fa"; // Import icons for each tab
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  console.log(location);

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

      {/* Login Button */}
      <div className="flex items-center space-x-4">
        <Link to={"/settings"}>
          <CiUser size={20} />
        </Link>

        <Link
          to={"/login"}
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
