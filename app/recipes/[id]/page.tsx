import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'
import OwnerRecipeControls from './owner-recipe-controls'
import LikeButton from './like-button'
import CommentSection, { type Comment } from './comment-section'

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>
}

interface RecipeDetail {
  id: string
  user_id: string
  title: string
  ingredients: string[]
  instructions: string
  cooking_time: number | null
  difficulty: string | null
  category: string | null
  created_at: string
}

export default async function RecipeDetailPage(props: RecipeDetailPageProps) {
  const params = await props.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: recipe } = await supabase
    .from('recipes')
    .select(
      'id, user_id, title, ingredients, instructions, cooking_time, difficulty, category, created_at'
    )
    .eq('id', params.id)
    .maybeSingle()

  if (!recipe) {
    notFound()
  }

  const detail = recipe as RecipeDetail
  const isOwner = user?.id === detail.user_id

  const [likesResult, userLikeResult, commentsResult] = await Promise.all([
    supabase
      .from('recipe_likes')
      .select('id', { count: 'exact', head: true })
      .eq('recipe_id', detail.id),
    user
      ? supabase
          .from('recipe_likes')
          .select('id')
          .eq('recipe_id', detail.id)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('recipe_comments')
      .select('id, content, created_at, user_id, profiles(username, full_name)')
      .eq('recipe_id', detail.id)
      .order('created_at', { ascending: true }),
  ])

  const likeCount = likesResult.count ?? 0
  const userLiked = !!userLikeResult.data
  const comments = (commentsResult.data ?? []).map((c) => ({
    ...c,
    profiles: c.profiles?.[0] ?? null,
  })) as Comment[]

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Back to home
        </Link>

        {isOwner && (
          <OwnerRecipeControls
            recipeId={detail.id}
            title={detail.title}
            ingredients={detail.ingredients}
            instructions={detail.instructions}
            cookingTime={detail.cooking_time}
            difficulty={detail.difficulty}
            category={detail.category}
          />
        )}

        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h1 className="text-2xl font-bold text-white">{detail.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
            {detail.category && (
              <span className="rounded-full border border-zinc-700 px-2 py-1">
                {detail.category}
              </span>
            )}
            {detail.difficulty && (
              <span className="rounded-full border border-zinc-700 px-2 py-1">
                {detail.difficulty}
              </span>
            )}
            {detail.cooking_time && (
              <span className="rounded-full border border-zinc-700 px-2 py-1">
                {detail.cooking_time} min
              </span>
            )}
            <LikeButton
              recipeId={detail.id}
              initialLiked={userLiked}
              initialCount={likeCount}
              isLoggedIn={!!user}
            />
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-100">Ingredients</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
              {detail.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-100">Instructions</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
              {detail.instructions}
            </p>
          </section>
        </article>

        <CommentSection
          recipeId={detail.id}
          currentUserId={user?.id ?? null}
          initialComments={comments}
        />
      </main>
    </div>
  )
}
