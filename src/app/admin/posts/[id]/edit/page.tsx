import PostForm from "@/components/admin/PostForm";
import { getCategories } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const categories = await getCategories();

  return <PostForm categories={categories} initialData={post} />;
}
