import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, uploadAvatar } from '../../store/slices/profileSlice';
import Avatar from '../../components/UI/Avatar';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import ImageUploader from '../../components/UI/ImageUploader';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    email: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Заполняем форму данными пользователя
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        bio: currentUser.bio || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка изменений в полях
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку поля при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Обработка выбора аватара
  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Если выбран новый аватар - загружаем его
      if (avatarFile) {
        await dispatch(uploadAvatar(avatarFile)).unwrap();
      }
      
      // Обновляем профиль
      await dispatch(updateProfile(formData)).unwrap();
      
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Редактирование профиля
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Аватар */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Фото профиля
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar 
                  user={avatarPreview ? { avatar: avatarPreview } : currentUser} 
                  size="xl" 
                />
              </div>
              <ImageUploader
                onFileSelect={handleAvatarChange}
                currentAvatar={currentUser?.avatar}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Основная информация */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Имя"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
              autoComplete="given-name"
              disabled={isSubmitting}
            />
            <Input
              label="Фамилия"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
              autoComplete="family-name"
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
            disabled // Email нельзя менять
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              О себе
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Расскажите о себе..."
              disabled={isSubmitting}
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile')}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;