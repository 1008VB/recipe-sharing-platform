import { Skeleton } from '@/components/ui/skeleton'

function AppHeaderSkeleton() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Skeleton className="h-7 w-32 rounded-lg" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-14 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </header>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <AppHeaderSkeleton />
      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-8">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="mt-5 h-10 w-96 max-w-full" />
          <Skeleton className="mt-4 h-4 w-[32rem] max-w-full" />
          <Skeleton className="mt-2 h-4 w-[28rem] max-w-full" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <Skeleton className="h-5 w-2/3" />
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-11/12" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <AppHeaderSkeleton />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-10">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        </section>

        <section className="mb-10">
          <Skeleton className="mb-4 h-7 w-32" />
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <Skeleton className="mb-4 h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="mb-4 mt-5 h-4 w-28" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="mt-5 h-10 w-36 rounded-xl" />
          </div>
        </section>

        <section>
          <Skeleton className="mb-4 h-7 w-32" />
          <Skeleton className="mb-4 h-11 w-full rounded-xl sm:w-80" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-11/12" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <AppHeaderSkeleton />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full" />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="mb-6 h-10 w-full rounded-xl" />
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="mt-6 h-10 w-32 rounded-xl" />
        </div>
      </main>
    </div>
  )
}

export function RecipeDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <AppHeaderSkeleton />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Skeleton className="mb-6 h-4 w-24" />
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <Skeleton className="h-8 w-2/3" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          <Skeleton className="mt-8 h-6 w-32" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-2 h-4 w-4/6" />

          <Skeleton className="mt-8 h-6 w-32" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-11/12" />
          <Skeleton className="mt-2 h-4 w-10/12" />
          <Skeleton className="mt-2 h-4 w-9/12" />
        </div>
      </main>
    </div>
  )
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Skeleton className="h-7 w-36 rounded-lg" />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto h-8 w-52" />
            <Skeleton className="mx-auto mt-3 h-4 w-64" />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <Skeleton className="mb-2 h-4 w-16" />
            <Skeleton className="mb-5 h-10 w-full rounded-xl" />
            <Skeleton className="mb-2 h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="mt-6 h-10 w-full rounded-xl" />
            <Skeleton className="mx-auto mt-5 h-3 w-40" />
          </div>
        </div>
      </main>
    </div>
  )
}
