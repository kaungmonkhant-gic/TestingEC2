"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { examsAPI, resultsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Calendar, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock student ID for demo purposes
const STUDENT_ID = 1

export default function StudentDashboard() {
  const [upcomingExams, setUpcomingExams] = useState<any[]>([])
  const [recentResults, setRecentResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Fetch exams and results from the API
        const exams = await examsAPI.getAll()
        const results = await resultsAPI.getByStudent(STUDENT_ID)

        // Filter upcoming exams (those without results)
        const examIds = results.map((result: any) => result.examId)
        const upcoming = exams
          .filter((exam: any) => !examIds.includes(exam.id))
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3)

        // Sort results by date (most recent first)
        const recent = results
          .map((result: any) => {
            const exam = exams.find((e: any) => e.id === result.examId)
            return {
              ...result,
              examTitle: exam?.title || "Unknown Exam",
              subject: exam?.subject || "Unknown Subject",
            }
          })
          .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
          .slice(0, 3)

        setUpcomingExams(upcoming)
        setRecentResults(recent)
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

  return (
    <DashboardLayout userRole="student">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingExams.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled exams</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentResults.length > 0
                  ? Math.round(
                      recentResults.reduce((sum, result) => sum + (result.score / result.totalMarks) * 100, 0) /
                        recentResults.length,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Based on recent exams</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Enrolled subjects</p>
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
                <CardDescription>Your scheduled exams for the next few days</CardDescription>
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
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{exam.duration} mins</span>
                          </div>
                          <p className="text-sm">
                            {new Date(exam.date).toLocaleDateString()}{" "}
                            {new Date(exam.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-center">
                      <Link href="/student/exams">
                        <Button variant="outline">View All Exams</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No upcoming exams scheduled.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Your most recent exam results</CardDescription>
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
                          <p className="text-sm text-muted-foreground">{result.subject}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              (result.score / result.totalMarks) * 100 >= 80
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : (result.score / result.totalMarks) * 100 >= 70
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : (result.score / result.totalMarks) * 100 >= 60
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {result.score}/{result.totalMarks} ({Math.round((result.score / result.totalMarks) * 100)}%)
                          </div>
                          <p className="text-sm">{new Date(result.submittedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-center">
                      <Link href="/student/results">
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
