import { useState, useEffect } from 'react';

export function useWindowSize(breakpoint = 768) {
  // Состояние для хранения размеров окна
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= breakpoint,
  });

  useEffect(() => {
    // Функция обработки изменения размера
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= breakpoint,
      });
    };

    // Добавляем слушатель
    window.addEventListener('resize', handleResize);

    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]); // Перезапускаем эффект, если изменились зависимости

  return windowSize;
}