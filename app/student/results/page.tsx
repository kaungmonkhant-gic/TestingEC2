"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye } from "lucide-react"

// Mock data for student results
const initialResults = [
  {
    id: 1,
    examTitle: "Mathematics Mid-term",
    subject: "Mathematics",
    date: "2023-04-15",
    score: 85,
    totalMarks: 100,
    grade: "A",
    feedback: "Excellent work on calculus problems. Need improvement in algebra section.",
  },
  {
    id: 2,
    examTitle: "Physics Quiz",
    subject: "Physics",
    date: "2023-04-10",
    score: 72,
    totalMarks: 100,
    grade: "B",
    feedback: "Good understanding of mechanics. Review thermodynamics concepts.",
  },
  {
    id: 3,
    examTitle: "Chemistry Lab Report",
    subject: "Chemistry",
    date: "2023-04-05",
    score: 90,
    totalMarks: 100,
    grade: "A+",
    feedback: "Outstanding lab report. Excellent analysis and conclusions.",
  },
  {
    id: 4,
    examTitle: "English Essay",
    subject: "English",
    date: "2023-03-28",
    score: 78,
    totalMarks: 100,
    grade: "B+",
    feedback: "Good writing style. Work on thesis development and supporting arguments.",
  },
]

export default function StudentResultsPage() {
  const [results] = useState(initialResults)
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentResult, setCurrentResult] = useState<any>(null)

  // Calculate overall statistics
  const totalExams = results.length
  const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalExams
  const highestScore = Math.max(...results.map((result) => result.score))
  const lowestScore = Math.min(...results.map((result) => result.score))

  // Filter results by subject if needed
  const filteredResults =
    activeTab === "all" ? results : results.filter((result) => result.subject.toLowerCase() === activeTab.toLowerCase())

  return (
    <DashboardLayout userRole="student">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">My Results</h1>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Across all exams</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highestScore}%</div>
              <p className="text-xs text-muted-foreground">Your best performance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowestScore}%</div>
              <p className="text-xs text-muted-foreground">Area for improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExams}</div>
              <p className="text-xs text-muted-foreground">Completed exams</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Subjects</TabsTrigger>
            <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
            <TabsTrigger value="physics">Physics</TabsTrigger>
            <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
            <TabsTrigger value="english">English</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Exam Results</CardTitle>
                <CardDescription>
                  View your performance in {activeTab === "all" ? "all subjects" : activeTab}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{result.examTitle}</TableCell>
                        <TableCell>{result.subject}</TableCell>
                        <TableCell>{result.date}</TableCell>
                        <TableCell>
                          {result.score}/{result.totalMarks}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              result.grade.startsWith("A")
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : result.grade.startsWith("B")
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : result.grade.startsWith("C")
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {result.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog
                            open={isViewDialogOpen && currentResult?.id === result.id}
                            onOpenChange={(open) => {
                              setIsViewDialogOpen(open)
                              if (open) setCurrentResult(result)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Result Details</DialogTitle>
                                <DialogDescription>Detailed performance for {result.examTitle}</DialogDescription>
                              </DialogHeader>
                              {currentResult && (
                                <div className="space-y-6 py-4">
                                  <div className="flex justify-center">
                                    <div className="relative h-40 w-40">
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                          <span className="text-4xl font-bold">{currentResult.score}%</span>
                                          <p className="text-sm font-medium">{currentResult.grade}</p>
                                        </div>
                                      </div>
                                      <svg className="h-full w-full" viewBox="0 0 100 100">
                                        <circle
                                          className="text-muted-foreground stroke-current"
                                          strokeWidth="8"
                                          fill="transparent"
                                          r="46"
                                          cx="50"
                                          cy="50"
                                        />
                                        <circle
                                          className="text-primary stroke-current"
                                          strokeWidth="8"
                                          strokeLinecap="round"
                                          fill="transparent"
                                          r="46"
                                          cx="50"
                                          cy="50"
                                          strokeDasharray={`${2 * Math.PI * 46}`}
                                          strokeDashoffset={`${2 * Math.PI * 46 * (1 - currentResult.score / 100)}`}
                                          transform="rotate(-90 50 50)"
                                        />
                                      </svg>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h3 className="font-medium">Exam Information</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                        <p>{currentResult.subject}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                                        <p>{currentResult.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Score</p>
                                        <p>
                                          {currentResult.score}/{currentResult.totalMarks}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Grade</p>
                                        <p>{currentResult.grade}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h3 className="font-medium">Teacher Feedback</h3>
                                    <p className="text-sm">{currentResult.feedback}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredResults.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No results found for {activeTab}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
