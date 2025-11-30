import PostForm from '@/components/admin/PostForm';
import { getCategories, getTags } from '@/lib/actions';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }

  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags()
  ]);

  return <PostForm categories={categories} tags={tags} initialData={post} />;
}
