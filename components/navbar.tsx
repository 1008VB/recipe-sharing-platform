import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let displayName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, username')
      .eq('id', user.id)
      .maybeSingle()

    displayName =
      profile?.full_name ??
      profile?.username ??
      user.email?.split('@')[0] ??
      'User'
  }

  return (
    <header className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          RecipeShare
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/desk"
            className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Desk
          </Link>
          {user ? (
            <>
              <span className="text-sm text-zinc-400 hidden sm:block">
                Hi, <span className="text-zinc-200 font-medium">{displayName}</span>
              </span>
              <Link
                href="/profile"
                className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white font-medium px-4 py-1.5 rounded-full transition-colors"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1.5 rounded-full transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
