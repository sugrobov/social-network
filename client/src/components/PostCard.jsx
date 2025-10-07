import React from 'react';
import { cn } from '../utils/cn';
import Button from './UI/Button';

// PostCard.jsx - компонент для отображения карточки поста
function PostCard({
    post,
    user,
    onEdit,
    onDelete,
    onLike,
    onComment,
    onShare,
    isOwner = false,
    showActions = true,
    className = '',
    imageClassName = '',
    contentClassName = '',
    footerClassName = '',
}) {

    const {
        id,
        title,
        content,
        imageUrl,
        createdAt,
        likesCount = 0,
        commentsCount = 0,
        isLiked = false,
        user: postUser = user,
    } = post;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleLike = () => {
        onLike?.(id);
    };

    const handleComment = () => {
        onComment?.(id);
    };

    const handleEdit = () => {
        onEdit?.(post);
    };

    const handleDelete = () => {
        onDelete?.(id);
    };

    return (
        <div className={cn("bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden", className)}>
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 flex-1">
                    <img
                        src={postUser?.avatarUrl || '/default-avatar.png'}
                        alt={postUser?.firstName || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {postUser?.firstName} {postUser?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {formatDate(createdAt)}
                        </p>
                    </div>
                </div>

                {isOwner && showActions && (
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEdit}
                            className="!p-2 hover:bg-blue-50 text-blue-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            className="!p-2 hover:bg-red-50 text-red-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </Button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={cn("p-4", contentClassName)}>
                {title && (
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                )}

                {content && (
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">{content}</p>
                )}

                {imageUrl && (
                    <div className="mb-4">
                        <img
                            src={imageUrl}
                            alt={title}
                            className={cn("w-full h-auto rounded-lg object-cover max-h-96", imageClassName)}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            {showActions && (
                <div className={cn("px-4 py-3 border-t border-gray-200 bg-gray-50", footerClassName)}>
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLike}
                                className={cn(
                                    "flex items-center space-x-1 !px-3 !py-1 rounded-full transition-colors",
                                    isLiked
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill={isLiked ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{likesCount}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleComment}
                                className="flex items-center space-x-1 !px-3 !py-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{commentsCount}</span>
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onShare?.(id)}
                            className="!px-3 !py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostCard;