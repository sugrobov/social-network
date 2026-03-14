// client/src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Отслеживаем изменение размера окна
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Блокируем скролл при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Логотип */}
            <Link to="/" className="text-2xl font-bold text-blue-600">
              SocialNetwork
            </Link>

            {/* Десктопная навигация */}
            <nav className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/feed" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Лента
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Профиль
                  </Link>
                  <span className="text-gray-600">
                    Привет, {user?.firstName || 'Пользователь'}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </nav>

            {/* Бургер-кнопка для мобильных */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
              aria-label="Меню"
            >
              <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Затемнение фона при открытом меню - теперь с размытием */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Боковое меню (SideMenu) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Заголовок меню */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Меню</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Информация о пользователе (если авторизован) */}
          {isAuthenticated && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Навигация */}
          <nav className="flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/feed"
                  className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
                  onClick={handleLinkClick}
                >
                  Лента
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
                  onClick={handleLinkClick}
                >
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-500 hover:text-red-600 py-2 transition-colors"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
                  onClick={handleLinkClick}
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-600 py-2 transition-colors"
                  onClick={handleLinkClick}
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;