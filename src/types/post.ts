import { ObjectId } from 'mongodb';

export interface Post {
  _id?: ObjectId | string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostInput {
  title: string;
  content: string;
  author: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  author?: string;
}