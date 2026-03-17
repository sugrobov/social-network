import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile, fetchUserPosts } from '../../store/slices/profileSlice';
import Avatar from '../../components/UI/Avatar';
import Button from '../../components/UI/Button';
import Post from '../../components/Post';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Tabs from '../../components/UI/Tabs';

function Profile() {
  const { userId } = useParams(); // для просмотра чужого профиля
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user: currentUser } = useSelector((state) => state.auth);
  const { profile, posts, loading, error } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUser = isOwnProfile ? currentUser : profile;

  useEffect(() => {
    if (!isOwnProfile && userId) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchUserPosts(userId));
    }
  }, [userId, isOwnProfile, dispatch]);

  if (loading && !profileUser) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Назад
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: 'Посты', count: posts?.length },
    { id: 'media', label: 'Медиа' },
    { id: 'likes', label: 'Лайки' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Шапка профиля */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar user={profileUser} size="xl" className="flex-shrink-0" />
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {profileUser?.firstName} {profileUser?.lastName}
              </h1>
              <p className="text-gray-500">@{profileUser?.username}</p>
            </div>

            <p className="text-gray-700 mb-4">
              {profileUser?.bio || 'Пользователь пока не добавил информацию о себе.'}
            </p>

            <div className="flex justify-center sm:justify-start space-x-6 mb-4">
              <div className="text-center">
                <span className="block font-bold text-xl">{profileUser?.postsCount || 0}</span>
                <span className="text-gray-500 text-sm">постов</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-xl">{profileUser?.followersCount || 0}</span>
                <span className="text-gray-500 text-sm">подписчиков</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-xl">{profileUser?.followingCount || 0}</span>
                <span className="text-gray-500 text-sm">подписок</span>
              </div>
            </div>

            {isOwnProfile ? (
              <Button
                variant="primary"
                onClick={() => navigate('/profile/edit')}
                className="w-full sm:w-auto"
              >
                Редактировать профиль
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1 sm:flex-none">
                  Подписаться
                </Button>
                <Button variant="secondary" className="flex-1 sm:flex-none">
                  Написать
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Табы */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Контент табов */}
      <div className="mt-6">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts?.length > 0 ? (
              posts.map((post) => <Post key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg">У пользователя пока нет постов</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">Медиа пока не поддерживаются</p>
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">Лайки пока не поддерживаются</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;