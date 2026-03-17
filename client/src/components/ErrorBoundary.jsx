import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-red-500 text-lg">Что-то пошло не так</p>
          <p className="text-gray-400 mt-2">
            Попробуйте обновить страницу
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

ErrorBoundary.defaultProps = {
  fallback: null
};

export default ErrorBoundary;