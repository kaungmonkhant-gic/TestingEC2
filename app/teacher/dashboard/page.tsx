"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { examsAPI, resultsAPI, studentsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, FileText, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock teacher ID for demo purposes
const TEACHER_ID = 1

export default function TeacherDashboard() {
  const [exams, setExams] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Fetch data from the API
        const examsData = await examsAPI.getByTeacher(TEACHER_ID)
        const studentsData = await studentsAPI.getAll()
        const resultsData = await resultsAPI.getAll()

        setExams(examsData)
        setStudents(studentsData)
        setResults(resultsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Calculate statistics
  const totalExams = exams.length
  const publishedExams = exams.filter((exam) => exam.status === "published").length
  const draftExams = exams.filter((exam) => exam.status === "draft").length

  // Get upcoming exams (next 7 days)
  const now = new Date()
  const nextWeek = new Date(now)
  nextWeek.setDate(now.getDate() + 7)

  const upcomingExams = exams
    .filter((exam) => {
      const examDate = new Date(exam.date)
      return examDate >= now && examDate <= nextWeek && exam.status === "published"
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  // Get recent results
  const recentResults = results
    .filter((result) => {
      const exam = exams.find((e) => e.id === result.examId)
      return exam !== undefined
    })
    .map((result) => {
      const exam = exams.find((e) => e.id === result.examId)
      const student = students.find((s) => s.id === result.studentId)
      return {
        ...result,
        examTitle: exam?.title || "Unknown Exam",
        subject: exam?.subject || "Unknown Subject",
        studentName: student?.name || "Unknown Student",
      }
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

  return (
    <DashboardLayout userRole="teacher">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExams}</div>
              <p className="text-xs text-muted-foreground">
                {publishedExams} published, {draftExams} drafts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(exams.map((exam) => exam.subject)).size}</div>
              <p className="text-xs text-muted-foreground">Teaching subjects</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
            <TabsTrigger value="recent">Recent Results</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>Exams scheduled for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">Loading upcoming exams...</div>
                ) : upcomingExams.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingExams.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <h3 className="font-medium">{exam.title}</h3>
                          <p className="text-sm text-muted-foreground">{exam.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{new Date(exam.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exam.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-center">
                      <Link href="/teacher/exams">
                        <Button variant="outline">Manage Exams</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No upcoming exams scheduled for the next 7 days.</p>
                    <div className="mt-4">
                      <Link href="/teacher/exams">
                        <Button variant="outline">Create New Exam</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Latest exam submissions from students</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">Loading recent results...</div>
                ) : recentResults.length > 0 ? (
                  <div className="space-y-4">
                    {recentResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <h3 className="font-medium">{result.examTitle}</h3>
                          <p className="text-sm text-muted-foreground">{result.studentName}</p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              (result.score / result.totalMarks) * 100 >= 80
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : (result.score / result.totalMarks) * 100 >= 70
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : (result.score / result.totalMarks) * 100 >= 60
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {result.score}/{result.totalMarks}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-center">
                      <Link href="/teacher/results">
                        <Button variant="outline">View All Results</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No exam results available yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
