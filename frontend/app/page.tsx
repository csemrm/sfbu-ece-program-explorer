export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          SFBU ECE Program Explorer
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Interactive curriculum visualization platform for the Electrical and Computer Engineering
          Department at San Francisco Bay University.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {['BSCS', 'MSCS', 'MSEE'].map((program) => (
            <span
              key={program}
              className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800"
            >
              {program}
            </span>
          ))}
        </div>
        <p className="mt-10 text-sm text-gray-400">
          Epic 001 — Foundation · Application under development
        </p>
      </div>
    </main>
  );
}
