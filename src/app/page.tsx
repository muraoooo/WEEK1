'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import PostForm from '@/components/PostForm';
import { Post, CreatePostInput } from '@/types/post';
import axios from 'axios';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts');
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('投稿の取得に失敗しました');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (data: CreatePostInput) => {
    try {
      await axios.post('/api/posts', data);
      await fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const handleUpdatePost = async (data: CreatePostInput) => {
    if (!editingPost?._id) return;
    
    try {
      await axios.put(`/api/posts/${editingPost._id}`, data);
      await fetchPosts();
      setEditingPost(null);
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const handleDeletePost = async () => {
    if (!deleteConfirmId) return;
    
    try {
      await axios.delete(`/api/posts/${deleteConfirmId}`);
      await fetchPosts();
      setDeleteConfirmId(null);
    } catch (err) {
      setError('投稿の削除に失敗しました');
      console.error('Error deleting post:', err);
    }
  };

  const handleEditClick = (id: string) => {
    const post = posts.find(p => p._id === id);
    if (post) {
      setEditingPost(post);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">掲示板</h1>

        <PostForm onSubmit={handleCreatePost} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            まだ投稿がありません
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id?.toString()}
              post={post}
              onEdit={handleEditClick}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          ))
        )}

        {/* 編集モーダル */}
        {editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">投稿を編集</h2>
                  <button
                    onClick={() => setEditingPost(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <PostForm
                  onSubmit={handleUpdatePost}
                  initialData={{
                    title: editingPost.title,
                    content: editingPost.content,
                    author: editingPost.author,
                  }}
                  isEdit
                />
              </div>
            </div>
          </div>
        )}

        {/* 削除確認モーダル */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">投稿を削除しますか？</h2>
              <p className="text-gray-600 mb-6">この操作は取り消せません。本当に削除してもよろしいですか？</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}