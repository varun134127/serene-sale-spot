
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container-custom mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">© {currentYear} EcomShop. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Terms
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
