import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-olive-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-stone-700 mb-4">
          Pagina non trovata
        </h2>
        <p className="text-stone-600 mb-8">
          La pagina che stai cercando non esiste.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors inline-block"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  )
}
