import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadLimiter, getClientIdentifier } from '@/lib/rate-limit';

type ReactionType = 'love' | 'like' | 'wow' | 'fire';

const REACTION_FIELDS: Record<ReactionType, string> = {
  love: 'reactionsLove',
  like: 'reactionsLike',
  wow: 'reactionsWow',
  fire: 'reactionsFire',
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { type, oldType } = body as {
      type: ReactionType | null;
      oldType: ReactionType | null;
    };

    // Validate reaction types
    if (type && !REACTION_FIELDS[type]) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    if (oldType && !REACTION_FIELDS[oldType]) {
      return NextResponse.json(
        { error: 'Invalid old reaction type' },
        { status: 400 }
      );
    }

    // Rate limiting: 10 reactions per hour per IP (prevent spam)
    const clientId = getClientIdentifier(request.headers);
    const rateLimitResult = uploadLimiter.check(
      `reaction:${clientId}`,
      10, // 10 reactions per hour max
      60 * 60 * 1000 // 1 hour
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many reactions. Please try again later.' },
        { status: 429 }
      );
    }

    // Find post
    const post = await prisma.post.findUnique({
      where: { slug },
      select: {
        id: true,
        reactionsLove: true,
        reactionsLike: true,
        reactionsWow: true,
        reactionsFire: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, { increment?: number; decrement?: number }> = {};

    // Decrement old reaction
    if (oldType && REACTION_FIELDS[oldType]) {
      updateData[REACTION_FIELDS[oldType]] = { decrement: 1 };
    }

    // Increment new reaction
    if (type && REACTION_FIELDS[type]) {
      // If same field, we need to handle it differently
      if (oldType === type) {
        // This shouldn't happen in the client, but just in case
        return NextResponse.json(
          { error: 'Cannot change to same reaction' },
          { status: 400 }
        );
      }
      updateData[REACTION_FIELDS[type]] = { increment: 1 };
    }

    // Update post reactions
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: updateData,
      select: {
        reactionsLove: true,
        reactionsLike: true,
        reactionsWow: true,
        reactionsFire: true,
      },
    });

    return NextResponse.json({
      success: true,
      reactions: {
        love: updatedPost.reactionsLove,
        like: updatedPost.reactionsLike,
        wow: updatedPost.reactionsWow,
        fire: updatedPost.reactionsFire,
      },
    });
  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
