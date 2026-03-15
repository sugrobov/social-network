import React from 'react';
import PropTypes from 'prop-types';

function Avatar({ user, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  // Массив градиентов
  const gradients = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-teal-400',
    'from-yellow-400 to-orange-400',
    'from-green-400 to-cyan-400',
    'from-indigo-400 to-purple-400',
    'from-red-400 to-yellow-400',
    'from-pink-400 to-purple-400',
    'from-teal-400 to-blue-400'
  ];

  // Функция для получения инициалов
  const getInitials = () => {
    if (!user) return '?';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const email = user.email || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return '?';
  };

  // Функция для получения градиента на основе имени пользователя
  const getGradient = () => {
    if (!user) return gradients[0];
    
    // Используем сумму кодов символов для выбора градиента
    const str = `${user.firstName || ''}${user.lastName || ''}${user.email || ''}`;
    const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return gradients[hash % gradients.length];
  };

  // Если есть аватар - показываем его
if (user?.avatar && user.avatar.trim() !== '') {
  return (
    <img
      src={user.avatar}
      alt={user?.firstName || 'User'}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
    />
  );
}

  // Иначе показываем градиентный аватар с инициалами
  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br ${getGradient()} rounded-full flex items-center justify-center text-white font-semibold shadow-sm ${className}`}
    >
      {getInitials()}
    </div>
  );
}

Avatar.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string
  }),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string
};

export default Avatar;