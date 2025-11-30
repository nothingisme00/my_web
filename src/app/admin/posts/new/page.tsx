import PostForm from '@/components/admin/PostForm';
import { getCategories, getTags } from '@/lib/actions';

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags()
  ]);

  return <PostForm categories={categories} tags={tags} />;
}
