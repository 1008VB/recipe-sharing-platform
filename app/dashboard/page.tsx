import Link from 'next/link'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'
import RecipeForm from './recipe-form'
import RecipeSearchForm from './recipe-search-form'

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  cooking_time: number | null
  difficulty: string | null
  category: string | null
  created_at: string
}

interface DashboardPageProps {
  searchParams: Promise<{ q?: string | string[] }>
}

export default async function DashboardPage(props: DashboardPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const searchParams = await props.searchParams
  const rawQuery = searchParams.q
  const query = (Array.isArray(rawQuery) ? rawQuery[0] ?? '' : rawQuery ?? '').trim()

  let recipes: Recipe[] | null = null
  if (query) {
    const { data } = await supabase.rpc('search_user_recipes', {
      search_term: query,
    })
    recipes = (data ?? []) as Recipe[]
  } else {
    const { data } = await supabase
      .from('recipes')
      .select(
        'id, title, ingredients, instructions, cooking_time, difficulty, category, created_at'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    recipes = (data ?? []) as Recipe[]
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-10">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create a new recipe and manage your published recipe cards.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            Create recipe
          </h2>
          <RecipeForm />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            My recipes
          </h2>
          <RecipeSearchForm query={query} />
          {!recipes?.length ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-300">
              {query
                ? `No recipes found for "${query}".`
                : 'You have not posted any recipes yet.'}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {(recipes as Recipe[]).map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                  <h3 className="text-base font-semibold text-white">
                    {recipe.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-300">
                    {recipe.category && (
                      <span className="rounded-full border border-zinc-700 px-2 py-1">
                        {recipe.category}
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span className="rounded-full border border-zinc-700 px-2 py-1">
                        {recipe.difficulty}
                      </span>
                    )}
                    {recipe.cooking_time && (
                      <span className="rounded-full border border-zinc-700 px-2 py-1">
                        {recipe.cooking_time} min
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-zinc-300">
                    {recipe.instructions}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
