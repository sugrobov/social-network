import React, { forwardRef } from 'react';
import cn from '../../utils/cn';    

// Input UI component
const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  ...props
}, ref) => {
  const inputBaseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
  
  const inputStateClasses = disabled 
    ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
    : "bg-white text-gray-900";
  
  const inputErrorClasses = error 
    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
    : "";

  return (
    <div className={cn("mb-4", containerClassName)}>
      {label && (
        <label 
          htmlFor={props.id} 
          className={cn(
            "block text-sm font-medium text-gray-700 mb-1",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          inputBaseClasses,
          inputStateClasses,
          inputErrorClasses,
          className
        )}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={cn(
          "mt-1 text-sm",
          error ? "text-red-600" : "text-gray-500",
          errorClassName
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;