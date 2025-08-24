'use client';

import { format } from 'date-fns';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            投稿者: {post.author} | {format(new Date(post.createdAt), 'yyyy年MM月dd日 HH:mm')}
          </p>
          <p className="text-gray-800 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button 
            onClick={() => onEdit(post._id!.toString())}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
            aria-label="edit"
          >
            編集
          </button>
          <button 
            onClick={() => onDelete(post._id!.toString())}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
            aria-label="delete"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}