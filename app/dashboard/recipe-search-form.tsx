import Link from 'next/link'

interface RecipeSearchFormProps {
  query: string
}

export default function RecipeSearchForm({ query }: RecipeSearchFormProps) {
  return (
    <form
      action="/dashboard"
      method="get"
      className="mb-4 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:flex-row sm:items-center"
    >
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Search by title, ingredients, category, difficulty, or instructions"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Search
        </button>
        {query ? (
          <Link
            href="/dashboard"
            className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  )
}
