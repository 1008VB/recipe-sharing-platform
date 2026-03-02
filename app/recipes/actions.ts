'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface LikeResult {
  liked: boolean
  count: number
  error?: string
}

export interface CommentState {
  error?: string
  success?: string
}

export async function toggleLike(recipeId: string): Promise<LikeResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { liked: false, count: 0, error: 'Please log in to like recipes.' }
  }

  const { data: existing } = await supabase
    .from('recipe_likes')
    .select('id')
    .eq('recipe_id', recipeId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('recipe_likes')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', user.id)
  } else {
    await supabase
      .from('recipe_likes')
      .insert({ recipe_id: recipeId, user_id: user.id })
  }

  const { count } = await supabase
    .from('recipe_likes')
    .select('id', { count: 'exact', head: true })
    .eq('recipe_id', recipeId)

  revalidatePath(`/recipes/${recipeId}`)

  return { liked: !existing, count: count ?? 0 }
}

export async function addComment(
  _prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Please log in to comment.' }
  }

  const recipeId = String(formData.get('recipe_id') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()

  if (!recipeId) {
    return { error: 'Recipe ID is missing.' }
  }

  if (!content) {
    return { error: 'Comment cannot be empty.' }
  }

  if (content.length > 1000) {
    return { error: 'Comment must be 1000 characters or fewer.' }
  }

  const { error } = await supabase
    .from('recipe_comments')
    .insert({ recipe_id: recipeId, user_id: user.id, content })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/recipes/${recipeId}`)

  return { success: 'Comment added.' }
}

export async function deleteComment(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const commentId = String(formData.get('comment_id') ?? '').trim()
  const recipeId = String(formData.get('recipe_id') ?? '').trim()

  if (!commentId || !recipeId) return

  await supabase
    .from('recipe_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  revalidatePath(`/recipes/${recipeId}`)
}
