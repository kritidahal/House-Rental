import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdOutlineLocationOn, MdOutlinePhone, MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <div className="bg-blue-800 border-t border-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl text-white font-extrabold tracking-tight">
                HotelBooking.com
              </span>
            </div>
            <p className="text-blue-200 text-sm">
              Discover your perfect stay with our curated selection of luxury hotels worldwide.
            </p>
            <div className="flex space-x-4">
              <FaFacebook className="h-6 w-6 text-white hover:text-blue-200 cursor-pointer transition-colors" />
              <FaTwitter className="h-6 w-6 text-white hover:text-blue-200 cursor-pointer transition-colors" />
              <FaInstagram className="h-6 w-6 text-white hover:text-blue-200 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-2">Contact Us</h3>
            <div className="flex items-center space-x-2">
              <MdOutlineLocationOn className="h-5 w-5 text-blue-200" />
              <span className="text-blue-200 text-sm">Imadol, Lalitpur</span>
            </div>
            <div className="flex items-center space-x-2">
              <MdOutlinePhone className="h-5 w-5 text-blue-200" />
              <span className="text-blue-200 text-sm">+977-9875487854</span>
            </div>
            <div className="flex items-center space-x-2">
              <MdOutlineEmail className="h-5 w-5 text-blue-200" />
              <span className="text-blue-200 text-sm">mithilesh@hotelbooking.com</span>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-2">Legal</h3>
            <ul className="space-y-2">
              <li className="text-blue-200 text-sm hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="text-blue-200 text-sm hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li className="text-blue-200 text-sm hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
              <li className="text-blue-200 text-sm hover:text-white cursor-pointer transition-colors">Accessibility</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-700 pt-6">
          <p className="text-center text-blue-300 text-sm">
            © {new Date().getFullYear()} HotelBooking.com. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;