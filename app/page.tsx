import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground">Exam Management System</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>Manage users, subjects, and system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access the admin dashboard to manage students, teachers, subjects, and monitor exam results.</p>
            </CardContent>
            <CardFooter>
              <Link href="/admin/dashboard" className="w-full">
                <Button className="w-full">Admin Login</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teacher Portal</CardTitle>
              <CardDescription>Create exams and manage student results</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create and manage exams, questions, and view student performance analytics.</p>
            </CardContent>
            <CardFooter>
              <Link href="/teacher/dashboard" className="w-full">
                <Button className="w-full">Teacher Login</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Portal</CardTitle>
              <CardDescription>Take exams and view your results</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access your upcoming exams, take tests, and review your performance and feedback.</p>
            </CardContent>
            <CardFooter>
              <Link href="/student/dashboard" className="w-full">
                <Button className="w-full">Student Login</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Exam Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
