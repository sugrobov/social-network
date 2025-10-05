import React from 'react'

// вспомогательная функция
function cn( ...props ) {
  return props.filter(Boolean).join(' ');
}

export default cn;