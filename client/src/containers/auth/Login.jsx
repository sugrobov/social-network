import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/feed');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Вход в SocialNetwork</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <Input
          label="Пароль"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        Нет аккаунта?{' '}
        <Link to="/register" className="text-blue-500 hover:text-blue-600">
          Зарегистрируйтесь
        </Link>
      </p>
    </div>
  );
}

export default Login;