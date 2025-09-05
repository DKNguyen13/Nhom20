import React from "react";
import {
  CiFacebook,
  CiInstagram,
  CiLocationOn,
  CiMail,
  CiPhone,
  CiYoutube,
} from "react-icons/ci";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-700 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-4 md:space-x-8">
            <p className="text-left max-w-[300px]">
              Nền tảng luyện thi TOEIC hàng đầu giúp bạn nâng cao kỹ năng, thi
              thử và theo dõi tiến độ dễ dàng.
              <div className="flex space-x-4 text-left justify-start mt-5">
                <a href="#" className="text-white hover:text-gray-300">
                  <CiFacebook size={20} />
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <i className="fab fa-youtube"></i>
                  <CiYoutube size={20} />
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <i className="fab fa-instagram"></i>
                  <CiInstagram size={20} />
                </a>
              </div>
            </p>
          </div>
          <div className="text-left align-middle space-y-2">
            <h5 className="text-xl font-bold">Thông tin liên hệ</h5>
            <p className="flex items-center">
              <CiPhone className="mr-2" size={20} /> +84 123456780
            </p>
            <p className="flex items-center">
              <CiMail className="mr-2" size={20} /> abc@gmail.com
            </p>
            <p className="flex items-center">
              <CiLocationOn className="mr-2" size={20} /> Địa chỉ
            </p>
          </div>
        </div>
      </div>
      <div className="m- w-screen h-[1px] bg-white mt-3"></div>
      <div className="mt-8 text-center flex items-center align-middle justify-between container mx-auto px-4">
        <div>
          <p className="text-sm">2023. All Rights Reserved.</p>
        </div>
        <div className="flex justify-center space-x-8  items-center">
          <a href="#" className="text-white hover:text-gray-300 text-sm">
            Điều Khoản & Điều Kiện
          </a>
          <a href="#" className="text-white hover:text-gray-300 text-sm">
            Chính Sách Bảo Mật
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
