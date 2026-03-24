import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/slices/postsSlice';
import Avatar from './UI/Avatar';

// создание поста
function CreatePost() {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // console.log('CreatePost user:', user);

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
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 w-full">
            <div className="flex items-start space-x-3 sm:space-x-4">
                <Avatar user={user} size="md" className="flex-shrink-0" />
                <form onSubmit={handleSubmit} className="flex-1 min-w-0">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Что у вас нового?"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        rows="3"
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-3">
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className="text-sm sm:text-base text-gray-500 hover:text-blue-500 transition-colors"
                            >
                                📷 Фото
                            </button>
                            <button
                                type="button"
                                className="text-sm sm:text-base text-gray-500 hover:text-blue-500 transition-colors"
                            >
                                🎥 Видео
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="w-full sm:w-auto bg-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                        >
                            {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

CreatePost.propTypes = {
  // компонент не принимает пропсы  
};

export default CreatePost;