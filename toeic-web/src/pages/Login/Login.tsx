import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../config/axios.js";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // dùng api instance
      const res = await api.post("/auth/login", { email, password });

      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("fullname", res.data.data.user.fullname);
        localStorage.setItem("email", res.data.data.user.email);
        localStorage.setItem("phone", res.data.data.user.phone);
        localStorage.setItem("avatarUrl", res.data.data.user.avatarUrl);
        localStorage.setItem("role", res.data.data.user.role);
        alert("Login successfull! Hello " + res.data.data.user.fullname);
        window.location.href = "/";
      } else {
        alert(res.data.message);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex max-w-4xl bg-white  rounded-lg w-full overflow-hidden items-center">
        {/* Left Side - Welcome message and image */}
        <div className="flex-1 p-8 max-sm:hidden">
          <h2 className="text-xl font-bold text-gray-800">
            Chào mừng bạn đến với TOEIC MASTER! 
          </h2>
          <div className="mt-4">
            <img src="src\assets\images\ai-image.png"  alt="illustration"  className="w-full"/>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-8 bg-blue-100">
          <h2 className="text-3xl font-bold mb-6 text-center">Đăng nhập</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email" className="text-gray-700 text-sm font-medium"> Email </label>
              <input type="email" id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required/>
            </div>
            <div>
              <label htmlFor="password" className="text-gray-700 text-sm font-medium"> Mật khẩu</label>
              <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" minLength={5} required />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"> {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />} </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> Nhớ mật khẩu </label>
              <Link to={"/forgot-password"} className="text-sm text-blue-500 font-medium hover:underline">Quên mật khẩu?</Link>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition">Đăng nhập</button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm"> Bạn chưa có tài khoản?{" "}
              <Link className="text-blue-500 font-medium hover:underline" to={"/register"}> Đăng ký </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
