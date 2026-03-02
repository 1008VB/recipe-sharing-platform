import Navbar from '@/components/navbar'

const featureItems = [
  {
    title: 'Self-Adapting Lumbar Tracking',
    description:
      "Advanced sensors automatically adjust lumbar support to match your spine's natural curve throughout the day.",
  },
  {
    title: '3-Level Button Control',
    description:
      'Intuitive controls allow instant adjustment of height, tilt, and tension with precision.',
  },
  {
    title: 'Patented Ice Silk Mesh',
    description:
      'Breathable temperature-regulating mesh helps keep you cool and comfortable for long sessions.',
  },
  {
    title: 'Anti-Slip Track Base',
    description:
      'Premium base engineering keeps the chair stable on varied floor surfaces without scratches.',
  },
  {
    title: 'Ergonomic Footrest',
    description:
      'Retractable support promotes healthier leg posture and comfort during extended sitting.',
  },
  {
    title: 'Water & Oil Resistant',
    description:
      'Nano-coating technology helps protect against spills and everyday stains.',
  },
]

const specifications = [
  ['Overall Dimensions', '68W × 68D × 110-120H cm'],
  ['Seat Dimensions', '52W × 50D cm'],
  ['Backrest Height', '65 cm'],
  ['Weight Capacity', '150 kg'],
  ['Net Weight', '28 kg'],
  ['Base Material', 'Aluminum Alloy'],
  ['Upholstery', 'Ice Silk Mesh'],
  ['Warranty', '10 Years'],
]

export default function DeskPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Navbar />

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-20 lg:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.22),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-red-500/10 to-transparent" />

          <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-red-400/40 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                Premium Ergonomic Collection
              </span>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                The <span className="text-red-400">Director</span>
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                Experience premium comfort with our flagship ergonomic chair. Designed for professionals
                who demand excellence in every detail.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-red-500 px-7 text-sm font-semibold text-white transition hover:bg-red-600">
                  Buy Now - Rs 49,999
                </button>
                <button className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-700 px-7 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white">
                  Watch Demo
                </button>
              </div>
              <p className="text-sm text-zinc-400">
                <span className="font-semibold text-zinc-200">2,000+</span> happy customers
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -rotate-2 rounded-3xl bg-red-500/10" />
              <img
                src="https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&h=1000&fit=crop"
                alt="The Director ergonomic chair"
                className="relative h-[420px] w-full rounded-3xl object-cover shadow-2xl lg:h-[560px]"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Engineered for Excellence</h2>
              <p className="mt-4 text-zinc-300">
                Every component of The Director is built to provide comfort, support, and long-term
                durability throughout your workday.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featureItems.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-zinc-700"
                >
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-900/60 px-6 py-16">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Designed for the Modern Professional
              </h2>
              <p className="mt-4 text-zinc-300">
                The Director combines ergonomic research with premium materials. Every angle and mechanism
                has been refined to support your natural posture.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-200">
                <li>4D adjustable armrests for personalized positioning</li>
                <li>135-degree recline with synchronized tilt mechanism</li>
                <li>10-year warranty on frame and mechanisms</li>
                <li>Supports up to 150kg with BIFMA certification</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=500&fit=crop"
                alt="Chair detail one"
                className="h-56 w-full rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=500&fit=crop"
                alt="Chair detail two"
                className="mt-6 h-56 w-full rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=500&fit=crop"
                alt="Chair detail three"
                className="h-56 w-full rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=500&fit=crop"
                alt="Chair detail four"
                className="mt-6 h-56 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto w-full max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 lg:p-10">
            <h2 className="text-center text-3xl font-bold text-white">Technical Specifications</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {specifications.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-zinc-800 py-3 text-sm"
                >
                  <span className="text-zinc-400">{label}</span>
                  <span className="font-semibold text-zinc-100">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-red-600 px-6 py-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-600 to-red-700" />
          <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your Workspace?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-red-100">
              Join thousands of professionals who have upgraded their comfort with The Director.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <button className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-red-600 transition hover:bg-zinc-100">
                Order Now - Rs 49,999
              </button>
              <button className="inline-flex h-12 items-center justify-center rounded-full border border-white px-8 text-sm font-semibold text-white transition hover:bg-white/10">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
