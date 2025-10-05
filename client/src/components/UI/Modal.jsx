import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from '../../utils/cn';
import Button from './Button';


const Modal = ({
    isOpen = false,
    onClose,
    title,
    children,
    size = 'md', // 'sm', 'md', 'lg', 'xl'
    closeOnOverlayClick = true,
    showCloseButton = true,
    actions,
    className = '',
    overlayClassName = '',
    contentClassName = '',
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Блокировка скролла при открытом модальном окне
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Обработчик клика по оверлею
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose?.();
        }
    };

    // Обработчик клавиши Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-200",
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
                overlayClassName
            )}
            onClick={handleOverlayClick}
        >
            <div
                className={cn(
                    "bg-white rounded-lg shadow-xl w-full transform transition-all duration-200",
                    sizeClasses[size],
                    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                    className
                )}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        {title && (
                            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        )}
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="!p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={cn("p-6", contentClassName)}>
                    {children}
                </div>

                {/* Actions */}
                {actions && (
                    <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        {actions}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;