'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProfile, type ProfileState } from '@/app/auth/actions'

interface ProfileFormProps {
  initialUsername: string
  initialFullName: string
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
    >
      {pending ? 'Saving...' : 'Save changes'}
    </button>
  )
}

const initialState: ProfileState = {}

export default function ProfileForm({
  initialUsername,
  initialFullName,
}: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, initialState)

  return (
    <form
      action={formAction}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
    >
      {state.error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl">
          {state.success}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="username" className="text-sm font-medium text-zinc-300">
          Username
        </label>
        <input
          id="username"
          name="username"
          defaultValue={initialUsername}
          minLength={3}
          required
          className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition"
          placeholder="your_username"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="full_name" className="text-sm font-medium text-zinc-300">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          defaultValue={initialFullName}
          className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition"
          placeholder="Jane Doe"
        />
      </div>

      <SaveButton />
    </form>
  )
}
