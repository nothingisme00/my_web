import { getPosts, getCategories } from '@/lib/actions';
import { PostsTable } from '@/components/admin/PostsTable';
import { Post, Category } from '@prisma/client';

type PostWithCategory = Post & {
  category: Category | null;
};

export default async function PostsAdminPage() {
  const [posts, categories] = await Promise.all([
    getPosts() as Promise<PostWithCategory[]>,
    getCategories() as Promise<Category[]>,
  ]);

  return <PostsTable initialPosts={posts} categories={categories} />;
}
