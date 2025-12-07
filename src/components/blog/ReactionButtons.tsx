'use client';

import { useState, useEffect } from 'react';

type ReactionType = 'love' | 'like' | 'wow' | 'fire';

interface ReactionCounts {
  love: number;
  like: number;
  wow: number;
  fire: number;
}

interface ReactionButtonsProps {
  slug: string;
  initialReactions: ReactionCounts;
}

const REACTIONS = [
  {
    type: 'love' as ReactionType,
    label: 'Love',
    emoji: '❤️',
    color: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      hoverBg: 'hover:bg-red-50 dark:hover:bg-red-900/20',
      text: 'text-red-500',
      hoverText: 'group-hover:text-red-500',
    },
  },
  {
    type: 'like' as ReactionType,
    label: 'Like',
    emoji: '👍',
    color: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      text: 'text-blue-500',
      hoverText: 'group-hover:text-blue-500',
    },
  },
  {
    type: 'wow' as ReactionType,
    label: 'Wow',
    emoji: '😮',
    color: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
      text: 'text-yellow-500',
      hoverText: 'group-hover:text-yellow-500',
    },
  },
  {
    type: 'fire' as ReactionType,
    label: 'Fire',
    emoji: '🔥',
    color: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
      text: 'text-orange-500',
      hoverText: 'group-hover:text-orange-500',
    },
  },
];

export function ReactionButtons({ slug, initialReactions }: ReactionButtonsProps) {
  const [reactions, setReactions] = useState<ReactionCounts>(initialReactions);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [animatingReaction, setAnimatingReaction] = useState<ReactionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's reaction from localStorage
  useEffect(() => {
    const storedReactions = localStorage.getItem('postReactions');
    if (storedReactions) {
      try {
        const parsed = JSON.parse(storedReactions);
        setUserReaction(parsed[slug] || null);
      } catch (error) {
        console.error('Error parsing stored reactions:', error);
      }
    }
  }, [slug]);

  const handleReaction = async (type: ReactionType) => {
    if (isLoading) return;

    const oldReaction = userReaction;
    const newReaction = oldReaction === type ? null : type; // Toggle or change

    // Optimistic update
    const updatedReactions = { ...reactions };

    // Remove old reaction
    if (oldReaction) {
      updatedReactions[oldReaction] = Math.max(0, updatedReactions[oldReaction] - 1);
    }

    // Add new reaction
    if (newReaction) {
      updatedReactions[newReaction] += 1;
    }

    setReactions(updatedReactions);
    setUserReaction(newReaction);
    setAnimatingReaction(newReaction);
    setIsLoading(true);

    // Update localStorage
    const storedReactions = localStorage.getItem('postReactions');
    const parsed = storedReactions ? JSON.parse(storedReactions) : {};
    if (newReaction) {
      parsed[slug] = newReaction;
    } else {
      delete parsed[slug];
    }
    localStorage.setItem('postReactions', JSON.stringify(parsed));

    try {
      const response = await fetch(`/api/posts/${slug}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newReaction,
          oldType: oldReaction,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update with server data to ensure consistency
        setReactions(data.reactions);
      } else {
        // Revert on error
        setReactions(reactions);
        setUserReaction(oldReaction);
        console.error('Failed to update reaction');
      }
    } catch (error) {
      // Revert on error
      setReactions(reactions);
      setUserReaction(oldReaction);
      console.error('Error updating reaction:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setAnimatingReaction(null), 600);
    }
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Reaction Buttons */}
      <div className="flex gap-3">
        {REACTIONS.map((reaction) => {
          const isActive = userReaction === reaction.type;
          const isAnimating = animatingReaction === reaction.type;
          const count = reactions[reaction.type];

          return (
            <button
              key={reaction.type}
              onClick={() => handleReaction(reaction.type)}
              disabled={isLoading}
              className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300
                ${isActive ? reaction.color.bg : 'bg-gray-100 dark:bg-gray-800'}
                ${!isActive && reaction.color.hoverBg}
                ${!isActive && 'hover:scale-110'}
                ${isAnimating ? 'animate-bounce' : ''}
                disabled:cursor-not-allowed disabled:opacity-50`}
              aria-label={`${reaction.label} this post`}
            >
              {/* Emoji */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <span
                  className={`text-2xl transition-all duration-300
                    ${isAnimating ? 'scale-150' : isActive ? 'scale-110' : ''}`}
                >
                  {reaction.emoji}
                </span>

                {/* Ripple effect */}
                {isAnimating && (
                  <span
                    className={`absolute inset-0 rounded-full opacity-75 animate-ping ${reaction.color.bg}`}
                  ></span>
                )}
              </div>

              {/* Count */}
              {count > 0 && (
                <span
                  className={`text-xs font-bold transition-colors duration-300
                    ${isActive ? reaction.color.text : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Total Count */}
      {totalReactions > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
          </p>
        </div>
      )}

      {/* Thank you message */}
      {userReaction && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          Thanks for your reaction! {REACTIONS.find(r => r.type === userReaction)?.emoji}
        </p>
      )}
    </div>
  );
}
