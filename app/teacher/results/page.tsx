"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Eye, Search } from "lucide-react"
import { examsAPI, resultsAPI, studentsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Mock teacher ID for demo purposes
const TEACHER_ID = 1

export default function TeacherResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentResult, setCurrentResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Fetch all necessary data
        const examsData = await examsAPI.getByTeacher(TEACHER_ID)
        const studentsData = await studentsAPI.getAll()
        const resultsData = await resultsAPI.getAll()

        // Filter results for exams created by this teacher
        const examIds = examsData.map((exam: any) => exam.id)
        const teacherResults = resultsData.filter((result: any) => examIds.includes(result.examId))

        // Enrich results with exam and student details
        const enrichedResults = teacherResults.map((result: any) => {
          const exam = examsData.find((e: any) => e.id === result.examId)
          const student = studentsData.find((s: any) => s.id === result.studentId)
          return {
            ...result,
            examTitle: exam?.title || "Unknown Exam",
            subject: exam?.subject || "Unknown Subject",
            studentName: student?.name || "Unknown Student",
            studentId: student?.studentId || "Unknown ID",
          }
        })

        setExams(examsData)
        setStudents(studentsData)
        setResults(enrichedResults)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch results data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter results based on active tab and search term
  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch

    // Filter by subject
    return matchesSearch && result.subject.toLowerCase() === activeTab.toLowerCase()
  })

  // Get unique subjects for tabs
  const subjects = [...new Set(results.map((result) => result.subject))]

  const handleUpdateResult = async () => {
    if (!currentResult) return

    try {
      setIsLoading(true)
      const updatedResult = await resultsAPI.update(currentResult.id, currentResult)

      // Update the results array with the updated result
      setResults(
        results.map((result) =>
          result.id === updatedResult.id
            ? {
                ...updatedResult,
                examTitle: result.examTitle,
                subject: result.subject,
                studentName: result.studentName,
                studentId: result.studentId,
              }
            : result,
        ),
      )

      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Result updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update result. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout userRole="teacher">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Exam Results</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Subjects</TabsTrigger>
              {subjects.map((subject) => (
                <TabsTrigger key={subject} value={subject.toLowerCase()}>
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Results List</CardTitle>
                <CardDescription>
                  View and manage student results for {activeTab === "all" ? "all subjects" : activeTab}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Loading results...
                        </TableCell>
                      </TableRow>
                    ) : filteredResults.length > 0 ? (
                      filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.examTitle}</TableCell>
                          <TableCell>{result.studentName}</TableCell>
                          <TableCell>{result.studentId}</TableCell>
                          <TableCell>
                            {result.score}/{result.totalMarks} ({Math.round((result.score / result.totalMarks) * 100)}%)
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
                          <TableCell>{new Date(result.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog
                                open={isViewDialogOpen && currentResult?.id === result.id}
                                onOpenChange={(open) => {
                                  setIsViewDialogOpen(open)
                                  if (open) setCurrentResult(result)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>View Result</DialogTitle>
                                    <DialogDescription>Detailed view of student's exam result.</DialogDescription>
                                  </DialogHeader>
                                  {currentResult && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Exam</h3>
                                          <p className="text-base">{currentResult.examTitle}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                                          <p className="text-base">{currentResult.subject}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Student</h3>
                                          <p className="text-base">{currentResult.studentName}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Student ID</h3>
                                          <p className="text-base">{currentResult.studentId}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Score</h3>
                                          <p className="text-base">
                                            {currentResult.score}/{currentResult.totalMarks} (
                                            {Math.round((currentResult.score / currentResult.totalMarks) * 100)}%)
                                          </p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Grade</h3>
                                          <p className="text-base">{currentResult.grade}</p>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Feedback</h3>
                                        <p className="text-base mt-1">{currentResult.feedback}</p>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Answers</h3>
                                        <div className="space-y-4 mt-2">
                                          {currentResult.answers?.map((answer: any, index: number) => (
                                            <div key={answer.questionId} className="border rounded-md p-3">
                                              <div className="flex justify-between">
                                                <h4 className="font-medium">Question {index + 1}</h4>
                                                <span className="text-sm">{answer.score} marks</span>
                                              </div>
                                              <p className="text-sm mt-1">{answer.answer}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              <Dialog
                                open={isEditDialogOpen && currentResult?.id === result.id}
                                onOpenChange={(open) => {
                                  setIsEditDialogOpen(open)
                                  if (open) setCurrentResult({ ...result })
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Result</DialogTitle>
                                    <DialogDescription>Update student's score and feedback.</DialogDescription>
                                  </DialogHeader>
                                  {currentResult && (
                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="score">Score</Label>
                                          <Input
                                            id="score"
                                            type="number"
                                            value={currentResult.score}
                                            onChange={(e) =>
                                              setCurrentResult({
                                                ...currentResult,
                                                score: Number.parseInt(e.target.value) || 0,
                                              })
                                            }
                                            min={0}
                                            max={currentResult.totalMarks}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="grade">Grade</Label>
                                          <Select
                                            value={currentResult.grade}
                                            onValueChange={(value) =>
                                              setCurrentResult({ ...currentResult, grade: value })
                                            }
                                          >
                                            <SelectTrigger id="grade">
                                              <SelectValue placeholder="Select grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="A+">A+</SelectItem>
                                              <SelectItem value="A">A</SelectItem>
                                              <SelectItem value="B+">B+</SelectItem>
                                              <SelectItem value="B">B</SelectItem>
                                              <SelectItem value="C+">C+</SelectItem>
                                              <SelectItem value="C">C</SelectItem>
                                              <SelectItem value="D">D</SelectItem>
                                              <SelectItem value="F">F</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div>
                                        <Label htmlFor="feedback">Feedback</Label>
                                        <Textarea
                                          id="feedback"
                                          value={currentResult.feedback}
                                          onChange={(e) =>
                                            setCurrentResult({ ...currentResult, feedback: e.target.value })
                                          }
                                          rows={4}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateResult} disabled={isLoading}>
                                      {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No results found. Try a different search term or filter.
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
