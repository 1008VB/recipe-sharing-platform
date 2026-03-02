'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleLike } from '@/app/recipes/actions'

interface LikeButtonProps {
  recipeId: string
  initialLiked: boolean
  initialCount: number
  isLoggedIn: boolean
}

export default function LikeButton({
  recipeId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (_current, next: { liked: boolean; count: number }) => next
  )

  function handleClick() {
    if (!isLoggedIn) return

    const nextLiked = !optimistic.liked
    const nextCount = optimistic.count + (nextLiked ? 1 : -1)

    startTransition(async () => {
      setOptimistic({ liked: nextLiked, count: nextCount })
      await toggleLike(recipeId)
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || !isLoggedIn}
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-sm transition-colors hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
      title={isLoggedIn ? (optimistic.liked ? 'Unlike' : 'Like') : 'Log in to like'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={optimistic.liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        className={`h-4 w-4 transition-colors ${optimistic.liked ? 'text-red-500' : 'text-zinc-400'}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      <span className="text-xs font-medium text-zinc-300">
        {optimistic.count}
      </span>
    </button>
  )
}
