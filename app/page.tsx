import Link from 'next/link'
import Navbar from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'

interface CommunityRecipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  cooking_time: number | null
  difficulty: string | null
  category: string | null
}

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: recipes } = user
    ? await supabase
        .from('recipes')
        .select('id, title, ingredients, instructions, cooking_time, difficulty, category')
        .order('created_at', { ascending: false })
        .limit(8)
    : { data: null }

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Navbar />
      <main className="relative isolate overflow-hidden px-6 py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.2),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-red-500/10 to-transparent" />

        {!user ? (
          <section className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-4xl flex-col items-center justify-center text-center">
            <p className="mb-4 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
              Discover Recipes
            </p>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Find, save, and share recipes you will want to cook tonight.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Explore fresh ideas from home cooks, build your own collection, and
              turn everyday ingredients into memorable meals with RecipeShare.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 min-w-36 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-6 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-12 min-w-36 items-center justify-center rounded-full bg-red-500 px-6 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Discover now
              </Link>
            </div>

            <div className="mt-14 grid w-full gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                <p className="text-sm font-semibold text-red-400">Curated ideas</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Browse trending recipes and seasonal picks from the community.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                <p className="text-sm font-semibold text-red-400">
                  Personal profile
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  Keep your saved dishes and identity in one clean profile.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                <p className="text-sm font-semibold text-red-400">Share with ease</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Publish your favorite dishes and inspire your next meal.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="relative z-10 mx-auto w-full max-w-5xl">
            <div className="mb-10">
              <p className="mb-4 inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                Community Recipes
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Latest recipes from the community
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">
                Explore up to 8 newly posted recipes. Use your dashboard to create
                and manage your own recipe cards.
              </p>
            </div>

            {!recipes?.length ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 text-sm text-zinc-300">
                No recipes posted yet. Be the first to share one from your
                dashboard.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(recipes as CommunityRecipe[]).map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
                  >
                    <h2 className="text-base font-semibold text-white">
                      {recipe.title}
                    </h2>
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
                    <p className="mt-3 text-xs text-zinc-400">
                      Ingredients: {recipe.ingredients.slice(0, 4).join(', ')}
                      {recipe.ingredients.length > 4 ? '...' : ''}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
