import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  Sprout,
  Users,
  Tractor,
  Wheat,
  Droplets,
  HandHeart,
} from "lucide-react"

function Landing() {
  return (
    <div className="min-h-screen bg-[#f7faf6] text-slate-900">

      {/* NAVBAR */}
      <nav className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white shadow-lg shadow-green-700/20">
              <Sprout size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                VillageConnect
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-green-700">
                Local work. Local people.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="transition hover:text-green-700">
              Services
            </a>
            <a href="#how" className="transition hover:text-green-700">
              How it works
            </a>
            <a href="#about" className="transition hover:text-green-700">
              About
            </a>
          </div>

          <button className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800">
            Get Started
          </button>
        </div>
      </nav>


      {/* HERO */}
      <main>

        <section className="relative overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute -left-32 top-64 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

            {/* LEFT */}
            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                Empowering local communities
              </div>

              <h2 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
                Find the right
                <span className="text-green-700"> people </span>
                for your work.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Connect farmers and families with trusted skilled workers
                from your own village — quickly, simply and reliably.
              </p>

              {/* SEARCH BOX */}
              <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50 sm:flex-row">

                <div className="flex flex-1 items-center gap-3 px-3">
                  <Search size={21} className="text-slate-400" />

                  <input
                    type="text"
                    placeholder="What service do you need?"
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                  />
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800">
                  Find a worker
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Trusted local workers
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Quick assignment
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Simple & transparent
                </div>
              </div>
            </div>


            {/* RIGHT VISUAL */}
            <div className="relative">

              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 p-1 shadow-2xl shadow-green-900/20">

                <div className="rounded-[1.8rem] bg-gradient-to-br from-green-900/30 to-transparent p-8">

                  <div className="mb-16 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-100">
                        Available near you
                      </p>
                      <p className="mt-1 text-2xl font-bold text-white">
                        Local workers
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                      <Users size={24} />
                    </div>
                  </div>

                  {/* WORKER CARD */}
                  <div className="rounded-2xl bg-white p-5 shadow-xl">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
                        RK
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            Ramesh Kumar
                          </h3>

                          <ShieldCheck
                            size={17}
                            className="text-green-600"
                          />
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          Farming & field services
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-slate-900">4.9 ★</p>
                        <p className="text-xs text-slate-400">
                          32 jobs
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={16} className="text-green-600" />
                        1.2 km away
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Available
                      </span>

                    </div>

                  </div>

                  {/* FLOATING JOB */}
                  <div className="mt-4 rounded-2xl bg-white/10 p-4 text-white backdrop-blur-md">

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                        <Tractor size={20} />
                      </div>

                      <div>
                        <p className="text-xs text-green-100">
                          New service request
                        </p>
                        <p className="font-semibold">
                          2 acres • Pesticide spraying
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

              {/* DECORATION */}
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Wheat size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Jobs completed
                    </p>
                    <p className="font-bold text-slate-900">
                      2,450+
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* STATS */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">

            <div className="p-7 text-center">
              <p className="text-3xl font-bold text-slate-950">500+</p>
              <p className="mt-1 text-sm text-slate-500">Local workers</p>
            </div>

            <div className="p-7 text-center">
              <p className="text-3xl font-bold text-slate-950">1,200+</p>
              <p className="mt-1 text-sm text-slate-500">Farmers connected</p>
            </div>

            <div className="p-7 text-center">
              <p className="text-3xl font-bold text-slate-950">2,450+</p>
              <p className="mt-1 text-sm text-slate-500">Jobs completed</p>
            </div>

            <div className="p-7 text-center">
              <p className="text-3xl font-bold text-slate-950">20+</p>
              <p className="mt-1 text-sm text-slate-500">Villages</p>
            </div>

          </div>
        </section>


        {/* SERVICES */}
        <section id="services" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-2xl">
            <p className="font-semibold text-green-700">
              SERVICES
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              One place for everyday village work.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Find experienced people for farming, equipment and essential
              local services.
            </p>
          </div>


          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <ServiceCard
              icon={<Sprout />}
              title="Pesticide spraying"
              text="Find experienced field workers."
            />

            <ServiceCard
              icon={<Wheat />}
              title="Planting & harvesting"
              text="Get reliable help when you need it."
            />

            <ServiceCard
              icon={<Tractor />}
              title="Tractor work"
              text="Connect with local equipment operators."
            />

            <ServiceCard
              icon={<Droplets />}
              title="Irrigation"
              text="Find people for water and field work."
            />

          </div>
        </section>


        {/* HOW IT WORKS */}
        <section id="how" className="bg-slate-950 py-24 text-white">

          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="max-w-2xl">
              <p className="font-semibold text-green-400">
                HOW IT WORKS
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                From a request to a completed job.
              </h2>
            </div>


            <div className="mt-14 grid gap-8 md:grid-cols-3">

              <Step
                number="01"
                title="Tell us what you need"
                text="Create a simple request with the work, date and location."
              />

              <Step
                number="02"
                title="We find the right person"
                text="Our platform helps identify suitable available workers."
              />

              <Step
                number="03"
                title="Get the work done"
                text="Connect, complete the work and share your experience."
              />

            </div>

          </div>

        </section>


        {/* CTA */}
        <section id="about" className="px-6 py-24">

          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-green-700 px-8 py-16 text-center shadow-2xl shadow-green-900/20 sm:px-16">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
              <HandHeart size={28} />
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-white">
              Stronger villages start with connected people.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-green-50">
              Helping local skills reach local opportunities — one job at a time.
            </p>

            <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-green-800 shadow-lg transition hover:bg-green-50">
              Join VillageConnect
              <ArrowRight size={18} />
            </button>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Sprout size={18} className="text-green-700" />
            VillageConnect
          </div>

          <p>
            Connecting villages. Creating opportunities.
          </p>

          <p>
            © 2026 VillageConnect
          </p>

        </div>
      </footer>

    </div>
  )
}


function ServiceCard({ icon, title, text }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/50">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700 transition group-hover:bg-green-700 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  )
}


function Step({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-7">

      <p className="text-sm font-bold tracking-[0.2em] text-green-400">
        {number}
      </p>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {text}
      </p>

    </div>
  )
}

export default Landing