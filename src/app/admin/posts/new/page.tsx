import PostForm from '@/components/admin/PostForm';
import { getCategories, getTags } from '@/lib/actions';

export default async function NewPostPage() {
  const categories = await getCategories();
  const tags = await getTags();

  return <PostForm categories={categories} tags={tags} />;
}
