import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import Avatar from './Avatar';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { followUser, unfollowUser } from '../../store/slices/profileSlice';

function UserListModal({ isOpen, onClose, title, users, loading, currentUserId, onFollowChange }) {
  const dispatch = useDispatch();
  const [processingIds, setProcessingIds] = useState([]);

  const handleToggleFollow = async (user) => {
    if (processingIds.includes(user.id)) return;
    setProcessingIds(prev => [...prev, user.id]);
    try {
      if (user.isFollowing) {
        await dispatch(unfollowUser(user.id)).unwrap();
      } else {
        await dispatch(followUser(user.id)).unwrap();
      }
      if (onFollowChange) onFollowChange();
    } catch (error) {
      console.error('Toggle follow error:', error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== user.id));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      {loading ? (
        <div className="py-8 text-center">Загрузка...</div>
      ) : users.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {title === 'Подписчики' ? 'Нет подписчиков' : 'Нет подписок'}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Avatar user={user} size="md" />
                <div>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              {user.id !== currentUserId && (
                <Button
                  variant={user.isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleFollow(user)}
                  disabled={processingIds.includes(user.id)}
                >
                  {processingIds.includes(user.id)
                    ? '...'
                    : user.isFollowing
                      ? 'Отписаться'
                      : 'Подписаться'
                  }
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

UserListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  users: PropTypes.array,
  loading: PropTypes.bool,
  currentUserId: PropTypes.string,
  onFollowChange: PropTypes.func,
};

export default UserListModal;