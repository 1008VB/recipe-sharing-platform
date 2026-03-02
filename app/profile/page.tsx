import { redirect } from 'next/dist/client/components/redirect'
import Navbar from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from './profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  const userId = user.id

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name')
    .eq('id', userId)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-black font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Profile settings</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Update your profile details and save your changes.
          </p>
        </div>

        <ProfileForm
          initialUsername={profile?.username ?? ''}
          initialFullName={profile?.full_name ?? ''}
        />
      </main>
    </div>
  )
}
