import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { mobileNavLinks } from '../../constants/navigation';
import Avatar from '../UI/Avatar';

function SideMenu({ isOpen, onClose, isAuthenticated, user, onLogout }) {
    const links = isAuthenticated ? mobileNavLinks.private : mobileNavLinks.public;

    return (
        <>
            {/* Затемнение */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* меню */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-6">
                    {/* Заголовок */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Меню</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Информация о пользователе */}
                    {isAuthenticated && user && (
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Avatar user={user} size="md" />
                                <div>
                                    <p className="font-semibold">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Навигация */}
                    <nav className="flex flex-col space-y-2">
                        {links.map((item, index) => {
                            if (item.type === 'divider') {
                                return <hr key={index} className="border-gray-200 my-1" />;
                            }

                            if (item.type === 'logout') {
                                return (
                                    <button
                                        key={index}
                                        onClick={onLogout}
                                        className={`text-left py-1.5 transition-colors ${
                                            item.isDanger
                                                ? 'text-red-500 hover:text-red-600'
                                                : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            }

                            return (
                                <NavLink
                                    key={index}
                                    to={item.to}
                                    className={({ isActive }) => {
                                        let baseClass = 'py-1.5 transition-colors';
                                        if (isActive) {
                                            return `${baseClass} text-blue-600 font-medium`;
                                        }
                                        if (item.isHighlighted) {
                                            return `${baseClass} text-blue-500 hover:text-blue-600 font-medium`;
                                        }
                                        return `${baseClass} text-gray-700 hover:text-blue-600`;
                                    }}
                                    onClick={onClose}
                                >
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}

SideMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
};

export default SideMenu;