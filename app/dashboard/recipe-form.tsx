'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createRecipe, type RecipeState } from '@/app/auth/actions'

const initialState: RecipeState = {}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-500/50"
    >
      {pending ? 'Creating...' : 'Create recipe'}
    </button>
  )
}

export default function RecipeForm() {
  const [state, formAction] = useActionState(createRecipe, initialState)

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
    >
      {state.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {state.success}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium text-zinc-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          placeholder="Spicy tomato pasta"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="ingredients"
          className="text-sm font-medium text-zinc-300"
        >
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          rows={5}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          placeholder="List one ingredient per line or separate with commas."
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="instructions"
          className="text-sm font-medium text-zinc-300"
        >
          Instructions
        </label>
        <textarea
          id="instructions"
          name="instructions"
          required
          rows={6}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          placeholder="Describe the cooking steps clearly."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label
            htmlFor="cooking_time"
            className="text-sm font-medium text-zinc-300"
          >
            Cooking time (minutes)
          </label>
          <input
            id="cooking_time"
            name="cooking_time"
            type="number"
            min={1}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="30"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="difficulty"
            className="text-sm font-medium text-zinc-300"
          >
            Difficulty
          </label>
          <input
            id="difficulty"
            name="difficulty"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="Easy"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="category" className="text-sm font-medium text-zinc-300">
            Category
          </label>
          <input
            id="category"
            name="category"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="Dinner"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
