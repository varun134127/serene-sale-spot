
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container-custom mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">EcomShop</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="hover:text-blue-200 transition">Orders</Link>
                <div className="flex items-center">
                  <span className="mr-2">{user?.username}</span>
                  <button 
                    onClick={logout}
                    className="hover:text-blue-200 transition"
                    aria-label="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="flex items-center hover:text-blue-200 transition">
                <User size={20} className="mr-1" />
                <span>Login</span>
              </Link>
            )}
            
            <Link to="/cart" className="relative flex items-center hover:text-blue-200 transition">
              <ShoppingCart size={20} className="mr-1" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 pb-6">
            <Link 
              to="/" 
              className="block px-4 py-2 hover:bg-blue-700 rounded transition"
              onClick={toggleMenu}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/orders" 
                  className="block px-4 py-2 hover:bg-blue-700 rounded transition"
                  onClick={toggleMenu}
                >
                  Orders
                </Link>
                <div className="flex items-center justify-between px-4 py-2">
                  <span>{user?.username}</span>
                  <button 
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="hover:text-blue-200 transition"
                    aria-label="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block px-4 py-2 hover:bg-blue-700 rounded transition flex items-center"
                onClick={toggleMenu}
              >
                <User size={20} className="mr-2" />
                <span>Login</span>
              </Link>
            )}
            
            <Link 
              to="/cart" 
              className="block px-4 py-2 hover:bg-blue-700 rounded transition flex items-center justify-between"
              onClick={toggleMenu}
            >
              <div className="flex items-center">
                <ShoppingCart size={20} className="mr-2" />
                <span>Cart</span>
              </div>
              {totalItems > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
