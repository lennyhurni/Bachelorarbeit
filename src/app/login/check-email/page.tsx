import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Reflectify</h1>
          <h2 className="mt-2 text-xl font-bold text-gray-700">Überprüfe deine E-Mails</h2>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Wir haben dir einen Magic Link an deine E-Mail-Adresse geschickt.
            Bitte überprüfe deine E-Mails und klicke auf den Link, um dich einzuloggen.
          </p>
          
          <p className="mt-4 text-gray-600">
            Falls du keine E-Mail erhalten hast, überprüfe bitte deinen Spam-Ordner
            oder versuche es erneut.
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Zurück zum Login
          </Link>
        </div>
      </div>
    </div>
  )
} 