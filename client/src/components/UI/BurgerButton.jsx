import React from 'react';
import PropTypes from 'prop-types';

function BurgerButton({ isOpen, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none ${className}`}
      aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
    >
      <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
      <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
      <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
    </button>
  );
}

BurgerButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default BurgerButton;