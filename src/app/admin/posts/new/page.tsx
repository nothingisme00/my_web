import PostForm from "@/components/admin/PostForm";
import { getCategories } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const categories = await getCategories();

  return <PostForm categories={categories} />;
}
