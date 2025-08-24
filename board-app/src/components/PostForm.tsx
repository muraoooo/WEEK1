'use client';

import { useState } from 'react';
import { CreatePostInput } from '@/types/post';

interface PostFormProps {
  onSubmit: (data: CreatePostInput) => Promise<void>;
  initialData?: Partial<CreatePostInput>;
  isEdit?: boolean;
}

export default function PostForm({ onSubmit, initialData, isEdit = false }: PostFormProps) {
  const [formData, setFormData] = useState<CreatePostInput>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    author: initialData?.author || '',
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.content || !formData.author) {
      setError('すべてのフィールドを入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!isEdit) {
        setFormData({ title: '', content: '', author: '' });
      }
    } catch (err) {
      setError('投稿の送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isEdit ? '投稿を編集' : '新規投稿'}
      </h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            投稿者名
          </label>
          <input
            id="author"
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isEdit}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? '送信中...' : (isEdit ? '更新' : '投稿')}
        </button>
      </form>
    </div>
  );
}