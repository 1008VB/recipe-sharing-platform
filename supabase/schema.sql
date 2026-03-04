CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username   text,
  full_name  text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ALTER COLUMN created_at TYPE timestamp USING created_at::timestamp;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  ingredients text[] NOT NULL,
  instructions text NOT NULL,
  cooking_time int4,
  difficulty text,
  category text
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON public.recipes;
CREATE POLICY "Recipes are viewable by everyone"
  ON public.recipes
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert recipes" ON public.recipes;
CREATE POLICY "Authenticated users can insert recipes"
  ON public.recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own recipes" ON public.recipes;
CREATE POLICY "Users can update their own recipes"
  ON public.recipes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own recipes" ON public.recipes;
CREATE POLICY "Users can delete their own recipes"
  ON public.recipes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.search_user_recipes(search_term text)
RETURNS TABLE (
  id uuid,
  title text,
  ingredients text[],
  instructions text,
  cooking_time int4,
  difficulty text,
  category text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    r.id,
    r.title,
    r.ingredients,
    r.instructions,
    r.cooking_time,
    r.difficulty,
    r.category,
    r.created_at
  FROM public.recipes AS r
  WHERE r.user_id = auth.uid()
    AND (
      COALESCE(search_term, '') = ''
      OR r.title ILIKE '%' || search_term || '%'
      OR array_to_string(r.ingredients, ' ') ILIKE '%' || search_term || '%'
      OR COALESCE(r.category, '') ILIKE '%' || search_term || '%'
      OR COALESCE(r.difficulty, '') ILIKE '%' || search_term || '%'
      OR r.instructions ILIKE '%' || search_term || '%'
    )
  ORDER BY r.created_at DESC;
$$;

-- =========================
-- Recipe Likes
-- =========================

CREATE TABLE IF NOT EXISTS public.recipe_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT recipe_likes_recipe_user_unique UNIQUE (recipe_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe_id
  ON public.recipe_likes (recipe_id);

CREATE INDEX IF NOT EXISTS idx_recipe_likes_user_id
  ON public.recipe_likes (user_id);

ALTER TABLE public.recipe_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Recipe likes are viewable by everyone" ON public.recipe_likes;
CREATE POLICY "Recipe likes are viewable by everyone"
  ON public.recipe_likes
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can like recipes" ON public.recipe_likes;
CREATE POLICY "Authenticated users can like recipes"
  ON public.recipe_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own likes" ON public.recipe_likes;
CREATE POLICY "Users can remove their own likes"
  ON public.recipe_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =========================
-- Recipe Comments
-- =========================

CREATE TABLE IF NOT EXISTS public.recipe_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT recipe_comments_content_not_empty CHECK (length(trim(content)) > 0),
  CONSTRAINT recipe_comments_content_max_len CHECK (length(content) <= 1000)
);

CREATE INDEX IF NOT EXISTS idx_recipe_comments_recipe_created
  ON public.recipe_comments (recipe_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recipe_comments_user_id
  ON public.recipe_comments (user_id);

ALTER TABLE public.recipe_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Recipe comments are viewable by everyone" ON public.recipe_comments;
CREATE POLICY "Recipe comments are viewable by everyone"
  ON public.recipe_comments
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.recipe_comments;
CREATE POLICY "Authenticated users can create comments"
  ON public.recipe_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.recipe_comments;
CREATE POLICY "Users can update their own comments"
  ON public.recipe_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.recipe_comments;
CREATE POLICY "Users can delete their own comments"
  ON public.recipe_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =========================
-- Auto-create profile on signup
-- =========================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_recipe_comments_updated_at ON public.recipe_comments;
CREATE TRIGGER trg_recipe_comments_updated_at
BEFORE UPDATE ON public.recipe_comments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
