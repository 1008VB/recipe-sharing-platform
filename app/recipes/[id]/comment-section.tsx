'use client'

import { useActionState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { addComment, deleteComment, type CommentState } from '@/app/recipes/actions'

export interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: { username: string | null; full_name: string | null } | null
}

interface CommentSectionProps {
  recipeId: string
  currentUserId: string | null
  initialComments: Comment[]
}

const initialState: CommentState = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-500/50"
    >
      {pending ? 'Posting...' : 'Post'}
    </button>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs text-zinc-500 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function CommentSection({
  recipeId,
  currentUserId,
  initialComments,
}: CommentSectionProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(
    async (prev: CommentState, formData: FormData) => {
      const result = await addComment(prev, formData)
      if (result.success) {
        formRef.current?.reset()
      }
      return result
    },
    initialState
  )

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-zinc-100">
        Comments{' '}
        <span className="text-sm font-normal text-zinc-500">
          ({initialComments.length})
        </span>
      </h2>

      {initialComments.length === 0 ? (
        <p className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-400">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-3">
          {initialComments.map((comment) => {
            const authorName =
              comment.profiles?.full_name ??
              comment.profiles?.username ??
              'Anonymous'
            const isOwner = currentUserId === comment.user_id

            return (
              <div
                key={comment.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-zinc-200">
                      {authorName}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  {isOwner && (
                    <form action={deleteComment}>
                      <input type="hidden" name="comment_id" value={comment.id} />
                      <input type="hidden" name="recipe_id" value={recipeId} />
                      <DeleteButton />
                    </form>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                  {comment.content}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {currentUserId ? (
        <form
          ref={formRef}
          action={formAction}
          className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
        >
          <input type="hidden" name="recipe_id" value={recipeId} />

          {state.error && (
            <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <textarea
            name="content"
            required
            rows={3}
            maxLength={1000}
            placeholder="Write a comment..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <div className="mt-3 flex justify-end">
            <SubmitButton />
          </div>
        </form>
      ) : (
        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-center text-sm text-zinc-400">
          <Link href="/login" className="text-red-400 transition-colors hover:text-red-300">
            Log in
          </Link>{' '}
          to leave a comment.
        </div>
      )}
    </section>
  )
}
