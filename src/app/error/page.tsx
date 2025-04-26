import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An unexpected error occurred'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle className="text-2xl font-bold">Error</CardTitle>
          </div>
          <CardDescription>
            Something went wrong
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 py-3 px-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </p>
          <p className="text-sm text-muted-foreground">
            Please try again or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link href="/login" className="w-full">
            <Button variant="default" className="w-full">
              Back to Login
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 