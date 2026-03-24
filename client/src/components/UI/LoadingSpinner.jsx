import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

function LoadingSpinner({ className = '' }) {
  return (
    <div className={cn("flex justify-center items-center py-12", className)}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

LoadingSpinner.propTypes = {
  className: PropTypes.string
};

export default LoadingSpinner;