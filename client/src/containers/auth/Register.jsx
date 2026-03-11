import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/feed');
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'Имя обязательно';
    if (!formData.lastName.trim()) errors.lastName = 'Фамилия обязательна';
    if (!formData.email.trim()) errors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Неверный формат email';
    if (!formData.password) errors.password = 'Пароль обязателен';
    else if (formData.password.length < 6) errors.password = 'Пароль должен быть не менее 6 символов';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Пароли не совпадают';
    
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const { confirmPassword: _confirmPassword, ...registerData } = formData;
    dispatch(registerUser(registerData));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Регистрация в SocialNetwork</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Имя"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={validationErrors.firstName}
            required
            autoComplete="given-name"
          />
          <Input
            label="Фамилия"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={validationErrors.lastName}
            required
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={validationErrors.email}
          required
          autoComplete="email"
        />

        <Input
          label="Пароль"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          helperText="Минимум 6 символов"
          required
          autoComplete="new-password"
        />

        <Input
          label="Подтверждение пароля"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={validationErrors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="text-blue-500 hover:text-blue-600">
          Войдите
        </Link>
      </p>
    </div>
  );
}

export default Register;