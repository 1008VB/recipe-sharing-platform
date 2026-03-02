'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { createClient } from '@/lib/supabase/server'

interface AuthState {
  error: string
}

export interface ProfileState {
  error?: string
  success?: string
}

export interface RecipeState {
  error?: string
  success?: string
}

interface RecipePayload {
  title: string
  ingredients: string[]
  instructions: string
  cooking_time: number | null
  difficulty: string | null
  category: string | null
}

function normalizeUsername(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export async function login(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}

export async function signup(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const displayName = String(formData.get('display_name') ?? '').trim()

  const username = normalizeUsername(displayName || email.split('@')[0] || 'user')
  const fullName = displayName || username

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    const userId = data.user?.id
    if (!userId) {
      return { error: 'Signup succeeded but no user ID was returned.' }
    }

    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: userId,
        username,
        full_name: fullName,
      },
      { onConflict: 'id' }
    )

    if (profileError) {
      return { error: profileError.message }
    }

    redirect('/')
  } catch (error) {
    if (isRedirectError(error)) throw error

    const message = error instanceof Error ? error.message.toLowerCase() : ''
    if (message.includes('fetch failed') || message.includes('timeout')) {
      return { error: 'Cannot reach auth server, check internet/firewall.' }
    }

    return { error: 'Unexpected error during signup. Please try again.' }
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Please log in to update your profile.' }
  }

  const usernameRaw = String(formData.get('username') ?? '')
  const fullNameRaw = String(formData.get('full_name') ?? '')

  const username = normalizeUsername(usernameRaw)
  if (username.length < 3) {
    return { error: 'Username must be at least 3 characters.' }
  }

  const fullName = fullNameRaw.trim() || null

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      username,
      full_name: fullName,
    },
    { onConflict: 'id' }
  )

  if (error) {
    return { error: error.message }
  }

  return { success: 'Profile updated successfully.' }
}

function parseIngredients(rawIngredients: string) {
  return rawIngredients
    .split(/\n|,/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
}

function parseRecipePayload(formData: FormData): {
  payload?: RecipePayload
  error?: string
} {
  const title = String(formData.get('title') ?? '').trim()
  const instructions = String(formData.get('instructions') ?? '').trim()
  const ingredientsInput = String(formData.get('ingredients') ?? '')
  const ingredients = parseIngredients(ingredientsInput)
  const cookingTimeInput = String(formData.get('cooking_time') ?? '').trim()
  const difficultyInput = String(formData.get('difficulty') ?? '').trim()
  const categoryInput = String(formData.get('category') ?? '').trim()

  if (!title) {
    return { error: 'Title is required.' }
  }

  if (!ingredients.length) {
    return { error: 'Add at least one ingredient.' }
  }

  if (!instructions) {
    return { error: 'Instructions are required.' }
  }

  const cookingTimeValue = cookingTimeInput ? Number(cookingTimeInput) : null
  if (
    cookingTimeValue !== null &&
    (!Number.isInteger(cookingTimeValue) || cookingTimeValue <= 0)
  ) {
    return { error: 'Cooking time must be a positive number.' }
  }

  return {
    payload: {
      title,
      ingredients,
      instructions,
      cooking_time: cookingTimeValue,
      difficulty: difficultyInput || null,
      category: categoryInput || null,
    },
  }
}

export async function createRecipe(
  _prevState: RecipeState,
  formData: FormData
): Promise<RecipeState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Please log in to create a recipe.' }
  }

  const { payload, error: payloadError } = parseRecipePayload(formData)
  if (payloadError || !payload) {
    return { error: payloadError ?? 'Invalid recipe data.' }
  }

  const { error } = await supabase.from('recipes').insert({
    user_id: user.id,
    ...payload,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Recipe created successfully.' }
}

export async function updateRecipe(
  _prevState: RecipeState,
  formData: FormData
): Promise<RecipeState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Please log in to edit your recipe.' }
  }

  const recipeId = String(formData.get('recipe_id') ?? '').trim()
  if (!recipeId) {
    return { error: 'Recipe ID is missing.' }
  }

  const { payload, error: payloadError } = parseRecipePayload(formData)
  if (payloadError || !payload) {
    return { error: payloadError ?? 'Invalid recipe data.' }
  }

  const { data: updatedRecipe, error } = await supabase
    .from('recipes')
    .update(payload)
    .eq('id', recipeId)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle()

  if (error) {
    return { error: error.message }
  }

  if (!updatedRecipe) {
    return { error: 'You are not allowed to edit this recipe.' }
  }

  revalidatePath('/')
  revalidatePath('/dashboard')
  revalidatePath(`/recipes/${recipeId}`)

  return { success: 'Recipe updated successfully.' }
}

export async function deleteRecipe(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const recipeId = String(formData.get('recipe_id') ?? '').trim()
  if (!recipeId) {
    return
  }

  const { data: deletedRecipe, error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle()

  if (error) {
    return
  }

  if (!deletedRecipe) {
    return
  }

  revalidatePath('/')
  revalidatePath('/dashboard')
  revalidatePath(`/recipes/${recipeId}`)
  redirect('/dashboard')
}
