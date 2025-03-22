import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Left Section - Branding */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Live Video Call</h2>
          <p className="text-sm text-gray-400">
            Stay connected with seamless video calls.
          </p>
        </div>

        {/* Middle Section - Navigation Links */}
        <nav className="flex space-x-6">
          <a href="#" className="hover:text-orange-400">Home</a>
          <a href="#" className="hover:text-orange-400">Features</a>
          <a href="#" className="hover:text-orange-400">About</a>
          <a href="#" className="hover:text-orange-400">Contact</a>
        </nav>

        {/* Right Section - Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>

      {/* Bottom Copyright Text */}
      <div className="text-center text-gray-500 text-sm mt-4">
        © 2025 Live Video Call. All rights reserved.
      </div>
    </footer>
  );
}
