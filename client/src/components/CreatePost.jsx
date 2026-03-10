import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/slices/postsSlice';

// создание поста
function CreatePost() {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await dispatch(createPost({ content })).unwrap();
            setContent('');
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start space-x-4">
                <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt={user?.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <form onSubmit={handleSubmit} className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Что у вас нового?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                    />
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-4">
                            {/* Можно добавить иконки для медиа */}
                            <button
                                type="button"
                                className="text-gray-500 hover:text-blue-500 transition-colors"
                            >
                                📷 Фото
                            </button>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-blue-500 transition-colors"
                            >
                                🎥 Видео
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;