'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  deleteRecipe,
  updateRecipe,
  type RecipeState,
} from '@/app/auth/actions'

interface OwnerRecipeControlsProps {
  recipeId: string
  title: string
  ingredients: string[]
  instructions: string
  cookingTime: number | null
  difficulty: string | null
  category: string | null
}

const initialState: RecipeState = {}

function SaveButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-500/50"
    >
      {pending ? 'Saving...' : 'Save changes'}
    </button>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-red-500/60 px-6 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Deleting...' : 'Delete recipe'}
    </button>
  )
}

export default function OwnerRecipeControls({
  recipeId,
  title,
  ingredients,
  instructions,
  cookingTime,
  difficulty,
  category,
}: OwnerRecipeControlsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [state, formAction] = useActionState(updateRecipe, initialState)

  return (
    <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
            Owner controls
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Only you can edit or delete this recipe.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing((value) => !value)}
          className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
        >
          {isEditing ? 'Cancel edit' : 'Edit recipe'}
        </button>
      </div>

      {state.error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {state.success}
        </div>
      )}

      {isEditing && (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="recipe_id" value={recipeId} />

          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-medium text-zinc-300">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={title}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
              defaultValue={ingredients.join('\n')}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
              defaultValue={instructions}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
                defaultValue={cookingTime ?? ''}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
                defaultValue={difficulty ?? ''}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="category"
                className="text-sm font-medium text-zinc-300"
              >
                Category
              </label>
              <input
                id="category"
                name="category"
                defaultValue={category ?? ''}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <SaveButton />
        </form>
      )}

      <form
        action={deleteRecipe}
        onSubmit={(event) => {
          const confirmed = window.confirm(
            'Delete this recipe permanently? This cannot be undone.'
          )
          if (!confirmed) {
            event.preventDefault()
          }
        }}
        className="mt-4"
      >
        <input type="hidden" name="recipe_id" value={recipeId} />
        <DeleteButton />
      </form>
    </section>
  )
}
