// src/components/Footer.jsx
import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-musify-dark text-white py-6 mt-8">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Harsh Bailurkar</h2>
          <p className="text-gray-400">9423147698</p>
          <p className="text-gray-400">harshbailurkar@gmail.com</p>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <a
            href="https://github.com/Harshbailurkar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/harsh-bailurkar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://www.instagram.com/harsh_bailurkar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <FaInstagram size={24} />
          </a>
        </div>
        <div className="text-gray-400">
          © {new Date().getFullYear()} Harsh Bailurkar. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
