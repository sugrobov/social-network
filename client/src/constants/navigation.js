// Конфигурация навигационных ссылок
export const navLinks = {
  // Ссылки для неавторизованных пользователей
  public: [
    {
      to: '/login',
      label: 'Войти',
      className: 'text-gray-700 hover:text-blue-600 transition-colors'
    },
    {
      to: '/register',
      label: 'Регистрация',
      className: 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
    }
  ],
  
  // Ссылки для авторизованных пользователей
  private: [
    {
      to: '/feed',
      label: 'Лента',
      className: 'text-gray-700 hover:text-blue-600 transition-colors'
    },
    {
      to: '/profile',
      label: 'Профиль',
      className: 'text-gray-700 hover:text-blue-600 transition-colors'
    }
  ]
};

// Мобильные ссылки (для SideMenu) - могут отличаться от десктопных
export const mobileNavLinks = {
  public: [
    { to: '/login', label: 'Войти' },
    { to: '/register', label: 'Регистрация', isHighlighted: true }
  ],
  private: [
    { to: '/feed', label: 'Лента' },
    { to: '/profile', label: 'Профиль' },
    { type: 'divider' },
    { type: 'logout', label: 'Выйти', isDanger: true }
  ]
};