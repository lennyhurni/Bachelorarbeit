import Image from 'next/image'
import Link from 'next/link'

export default function RegistrationConfirmationPage() {
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
          Check your email
        </h2>
        <div className="mt-4 text-center">
          <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4">
            <div className="flex">
              <div className="mx-auto">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  We've sent you a confirmation email. Please click the link in that email to verify your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              If you don't see the email, check your spam folder or{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                try signing in
              </Link>
              .
            </p>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              If you're still having trouble, contact our support team.
            </p>
            <Link
              href="/login"
              className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 