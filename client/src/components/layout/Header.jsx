import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import BurgerButton from '../UI/BurgerButton';
import SideMenu from './SideMenu';
import { navLinks } from '../../constants/navigation';
import { useWindowSize } from '../../hooks/useWindowSize';

function Header() {
  const menuWidth = 768;
  const { isMobile } = useWindowSize(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // если меньше 768px, закрываем меню
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  // запрещаем скролл при открытом меню
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const links = isAuthenticated ? navLinks.private : navLinks.public;

  return (
    <>
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              SocialNetwork
            </Link>

            {/* Десктопная навигация */}
            <nav className="hidden md:flex items-center space-x-6">
              {isAuthenticated && (
                <span className="text-gray-600">
                  Привет, {user?.firstName || 'Пользователь'}!
                </span>
              )}
              
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className={link.className}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Выйти
                </button>
              )}
            </nav>

            {/* Бургер-кнопка */}
            <BurgerButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}

export default Header;