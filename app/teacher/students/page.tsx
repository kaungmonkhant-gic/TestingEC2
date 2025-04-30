"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search } from "lucide-react"
import { studentsAPI, resultsAPI, examsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [studentResults, setStudentResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true)
        const data = await studentsAPI.getAll()
        setStudents(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch students. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [toast])

  const fetchStudentResults = async (studentId: number) => {
    try {
      setIsLoading(true)
      const results = await resultsAPI.getByStudent(studentId)
      const exams = await examsAPI.getAll()

      const resultsWithExamDetails = results.map((result: any) => {
        const exam = exams.find((e: any) => e.id === result.examId)
        return {
          ...result,
          examTitle: exam?.title || "Unknown Exam",
          subject: exam?.subject || "Unknown Subject",
        }
      })

      setStudentResults(resultsWithExamDetails)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student results. Please try again later.",
        variant: "destructive",
      })
      setStudentResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout userRole="teacher">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Students</h1>

        <Card>
          <CardHeader>
            <CardTitle>Students List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={isViewDialogOpen && currentStudent?.id === student.id}
                          onOpenChange={(open) => {
                            setIsViewDialogOpen(open)
                            if (open) {
                              setCurrentStudent(student)
                              fetchStudentResults(student.id)
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Student Details</DialogTitle>
                              <DialogDescription>View student information and performance.</DialogDescription>
                            </DialogHeader>
                            {currentStudent && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                    <p className="text-base">{currentStudent.name}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Student ID</h3>
                                    <p className="text-base">{currentStudent.studentId}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                    <p className="text-base">{currentStudent.email}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Grade</h3>
                                    <p className="text-base">{currentStudent.grade}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-lg font-medium mb-2">Exam Results</h3>
                                  {isLoading ? (
                                    <p className="text-center py-4">Loading results...</p>
                                  ) : studentResults.length > 0 ? (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Exam</TableHead>
                                          <TableHead>Subject</TableHead>
                                          <TableHead>Date</TableHead>
                                          <TableHead>Score</TableHead>
                                          <TableHead>Grade</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {studentResults.map((result) => (
                                          <TableRow key={result.id}>
                                            <TableCell>{result.examTitle}</TableCell>
                                            <TableCell>{result.subject}</TableCell>
                                            <TableCell>{new Date(result.submittedAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                              {result.score}/{result.totalMarks} (
                                              {Math.round((result.score / result.totalMarks) * 100)}%)
                                            </TableCell>
                                            <TableCell>{result.grade}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    <p className="text-center py-4 text-muted-foreground">
                                      No exam results found for this student.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No students found. Try a different search term.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
