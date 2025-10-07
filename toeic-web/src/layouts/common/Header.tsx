import React, { useState, useEffect, useRef } from "react";
import api, { setAccessToken } from "../../config/axios.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaClipboardList, FaFileAlt, FaSearch, FaCrown, FaSignOutAlt, FaHistory, FaUser } from "react-icons/fa";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fullname, setFullname] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("/img/avatar/default_avatar.jpg");
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateUser = () => {
    setFullname(localStorage.getItem("fullname"));
    const avatar = localStorage.getItem("avatarUrl");
    setAvatarUrl(avatar || "/img/avatar/default_avatar.jpg");
  };

  useEffect(() => {
    // Set initial user
    updateUser();

    const handleUserUpdated = () => updateUser();
    window.addEventListener("userUpdated", handleUserUpdated);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);
    };
  }, []);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout server failed:", err);
    } finally {
      localStorage.clear();
      setAccessToken(null);
      setFullname(null);
      window.dispatchEvent(new Event("userUpdated"));
      setAvatarUrl("/img/avatar/default_avatar.jpg");
      setOpenMenu(false);
      navigate("/login");
    }
  };


  const navLinks = [
    { to: "/", label: "Trang chủ", icon: <FaHome className="text-xl" /> },
    { to: "/practice", label: "Flashcards", icon: <FaClipboardList className="text-xl" /> },
    { to: "/tests", label: "Thi thử", icon: <FaFileAlt className="text-xl" /> },
    { to: "/resource", label: "Tài nguyên", icon: <FaSearch className="text-xl" /> },
    { to: "/payment", label: "Premium", icon: <FaCrown className="text-xl text-yellow-500" />, premium: true },
  ];

  return (
    <header className="bg-white shadow-md px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <span className="text-blue-600 font-extrabold text-xl tracking-wide">TOEIC MASTER</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to}
            className={`hidden sm:block relative transition-colors duration-200 ${
              location.pathname === link.to
                ? link.premium ? "text-yellow-600 font-semibold" : "text-blue-600 font-semibold"
                : link.premium ? "text-yellow-500 hover:text-yellow-600" : "text-gray-600 hover:text-blue-500"
            }`}>
            {link.label}
            {location.pathname === link.to && (
              <span
                className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                  link.premium ? "bg-yellow-600" : "bg-blue-600"
                }`}
              ></span>
            )}
          </Link>
        ))}

        {/* Mobile icons */}
        {navLinks.map((link) => (
          <Link key={link.to + "-mobile"} to={link.to}
            className={`sm:hidden transition-colors duration-200 ${
              location.pathname === link.to ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
            }`}>
            {link.icon}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="relative" ref={dropdownRef}>
        {fullname ? (
          <div className="relative">
            <button onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition">
              <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-medium text-gray-700 hidden sm:block">{fullname}</span>
            </button>

            {/* Dropdown */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 transition transform duration-200 ease-out scale-100 opacity-100">
                <Link to="/settings" onClick={() => setOpenMenu(false)}
                  className="flex items-center px-4 py-3 gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium">
                  <FaUser className="text-lg" />
                  Thông tin cá nhân
                </Link>
                <Link to="/history" onClick={() => setOpenMenu(false)}
                  className="flex items-center px-4 py-3 gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium">
                  <FaClipboardList className="text-lg" />
                  <span>Lịch sử làm bài</span>
                </Link>
                <Link to="/purchase-history" onClick={() => setOpenMenu(false)}
                  className="flex items-center px-4 py-3 gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium">
                  <FaHistory className="text-lg" />
                  Lịch sử mua hàng
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 gap-2 text-gray-700 hover:bg-red-50 hover:text-red-500 transition font-medium">
                  <FaSignOutAlt className="text-lg" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white px-4 py-2 rounded-full font-medium transition">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
