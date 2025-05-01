import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Seite nicht gefunden</h2>
      <p className="text-muted-foreground mb-8">
        Die angeforderte Seite wurde nicht gefunden oder existiert nicht mehr.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Zurück zur Startseite
      </Link>
    </div>
  )
} 