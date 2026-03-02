'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/dist/client/link'
import { signup } from '@/app/auth/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
    >
      {pending ? 'Creating account…' : 'Create account'}
    </button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, null)

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Minimal header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            🍴 RecipeShare
          </Link>
        </div>
      </header>

      {/* Form card */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Create an account</h1>
            <p className="text-zinc-400 text-sm">Join RecipeShare and start sharing your recipes</p>
          </div>

          <form action={formAction} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-5">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {state.error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="display_name" className="text-sm font-medium text-zinc-300">
                Display name
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                autoComplete="name"
                required
                placeholder="Gordon Ramsay"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition"
              />
            </div>

            <SubmitButton />

            <p className="text-center text-xs text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="text-red-400 hover:text-red-300 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
