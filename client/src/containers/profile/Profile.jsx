import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile, fetchUserPosts, deleteUserPost, followUser, unfollowUser, fetchFollowers, fetchFollowing } from '../../store/slices/profileSlice';
import Avatar from '../../components/UI/Avatar';
import Button from '../../components/UI/Button';
import Post from '../../components/Post';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Tabs from '../../components/UI/Tabs';
import UserListModal from '../../components/UI/UserListModal';

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { profile, posts, loading, error, followersList, followingList, followersLoading, followingLoading } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUser = isOwnProfile ? currentUser : profile;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchUserPosts(userId));
    } else if (currentUser) {
      dispatch(fetchUserPosts(currentUser.id));
    }
  }, [userId, currentUser, dispatch]);

  const handleDeletePost = async (postId) => {
    if (window.confirm('Удалить пост?')) {
      try {
        await dispatch(deleteUserPost(postId)).unwrap();
      } catch (error) {
        alert('Ошибка при удалении поста');
      }
    }
  };

  const handleFollow = async () => {
    setIsFollowingLoading(true);
    try {
      await dispatch(followUser(profileUser.id)).unwrap();
    } catch (error) {
      alert('Не удалось подписаться');
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsFollowingLoading(true);
    try {
      await dispatch(unfollowUser(profileUser.id)).unwrap();
    } catch (error) {
      alert('Не удалось отписаться');
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const handleOpenFollowers = () => {
    dispatch(fetchFollowers(profileUser.id));
    setShowFollowersModal(true);
  };

  const handleOpenFollowing = () => {
    dispatch(fetchFollowing(profileUser.id));
    setShowFollowingModal(true);
  };

  if (loading && !profileUser && !posts.length) {
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
    { id: 'posts', label: 'Посты', count: posts?.length || 0 },
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
                <span className="block font-bold text-xl">{posts?.length || 0}</span>
                <span className="text-gray-500 text-sm">постов</span>
              </div>
              <div className="text-center cursor-pointer" onClick={handleOpenFollowers}>
                <span className="block font-bold text-xl">{profileUser?.followersCount || 0}</span>
                <span className="text-gray-500 text-sm">подписчиков</span>
              </div>
              <div className="text-center cursor-pointer" onClick={handleOpenFollowing}>
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
                {profileUser?.isFollowing ? (
                  <Button
                    variant="secondary"
                    onClick={handleUnfollow}
                    disabled={isFollowingLoading}
                    className="w-full sm:w-auto"
                  >
                    {isFollowingLoading ? '...' : 'Отписаться'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleFollow}
                    disabled={isFollowingLoading}
                    className="w-full sm:w-auto"
                  >
                    {isFollowingLoading ? '...' : 'Подписаться'}
                  </Button>
                )}
                <Button variant="secondary" className="w-full sm:w-auto">
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
              posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  showDelete={isOwnProfile}
                  onDelete={handleDeletePost}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg">У пользователя пока нет постов</p>
                {isOwnProfile && (
                  <Button
                    onClick={() => navigate('/feed')}
                    variant="primary"
                    className="mt-4"
                  >
                    Создать первый пост
                  </Button>
                )}
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

      {/* Модальные окна для списков */}
      <UserListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Подписчики"
        users={followersList}
        loading={followersLoading}
        currentUserId={currentUser?.id}
        onFollowChange={() => {
          // После изменения подписки в модалке можно обновить данные профиля
          if (profileUser?.id) {
            dispatch(fetchUserProfile(profileUser.id));
            if (!isOwnProfile) {
              // Обновляем также isFollowing для текущего пользователя (если он есть в списке)
              // Но для простоты просто перезагрузим профиль
              dispatch(fetchUserProfile(profileUser.id));
            }
          }
        }}
      />
      <UserListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Подписки"
        users={followingList}
        loading={followingLoading}
        currentUserId={currentUser?.id}
        onFollowChange={() => {
          if (profileUser?.id) {
            dispatch(fetchUserProfile(profileUser.id));
          }
        }}
      />
    </div>
  );
}

export default Profile;