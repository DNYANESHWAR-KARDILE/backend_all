import { Link } from "react-router-dom";
import { Layers, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-gray-400 text-sm">
              We are a team of passionate developers building modern web applications.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            <ul>
              <li className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <Layers className="mr-2" size={16} />
                Web Development
              </li>
              <li className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <ShieldCheck className="    mr-2" size={16} />
                Security Solutions
              </li>
              <li className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <Zap className="mr-2" size={16} />
                Performance Optimization
              </li>
              <li className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <Globe className="mr-2" size={16} />
                Global Reach
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <p className="text-gray-400 text-sm">
              Email:              <a href="mailto:info@company.com" className="text-blue-400 hover:text-blue-300">
                info@company.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}