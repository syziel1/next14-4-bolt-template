import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Welcome to your protected dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Email: </span>
              <span className="text-slate-900 dark:text-slate-100">{user.email}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">User ID: </span>
              <span className="text-slate-900 dark:text-slate-100 font-mono text-sm">{user.id}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Created: </span>
              <span className="text-slate-900 dark:text-slate-100">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protected Content</CardTitle>
            <CardDescription>This page is only accessible to authenticated users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300">
              🎉 You&apos;re seeing this content because you&apos;re logged in! 
              This route is protected by middleware, which automatically redirects 
              unauthenticated users to the login page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
