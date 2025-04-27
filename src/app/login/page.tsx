import Image from 'next/image'
import Link from 'next/link'

import LoginForm from './LoginForm'

// Diese Komponente ist jetzt synchron
export default function LoginPage() {
  // searchParams werden jetzt im Client-Component LoginForm geholt
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src="/images/Reflectify_Logo.png"
          alt="Reflectify Logo"
          width={64}
          height={64}
          className="mx-auto rounded-full"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Login to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* redirectTo wird jetzt innerhalb von LoginForm geholt */}
          <LoginForm />
        </div>
      </div>
    </div>
  )
} 