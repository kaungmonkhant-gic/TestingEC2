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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Search } from "lucide-react"
import { examsAPI, teachersAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentExam, setCurrentExam] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const examsData = await examsAPI.getAll()
        const teachersData = await teachersAPI.getAll()

        // Enrich exams with teacher names
        const enrichedExams = examsData.map((exam: any) => {
          const teacher = teachersData.find((t: any) => t.id === exam.teacherId)
          return {
            ...exam,
            teacherName: teacher ? teacher.name : "Unknown Teacher",
          }
        })

        setExams(enrichedExams)
        setTeachers(teachersData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch exams. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter exams based on active tab and search term
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.teacherName.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && exam.status === activeTab
  })

  return (
    <DashboardLayout userRole="admin">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Exams Overview</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Exams</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Exams List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Loading exams...
                        </TableCell>
                      </TableRow>
                    ) : filteredExams.length > 0 ? (
                      filteredExams.map((exam) => (
                        <TableRow key={exam.id}>
                          <TableCell>{exam.title}</TableCell>
                          <TableCell>{exam.subject}</TableCell>
                          <TableCell>{exam.teacherName}</TableCell>
                          <TableCell>{exam.duration} mins</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                exam.status === "published"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {exam.status === "published" ? "Published" : "Draft"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(exam.date).toLocaleDateString()}{" "}
                            {new Date(exam.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog
                              open={isViewDialogOpen && currentExam?.id === exam.id}
                              onOpenChange={(open) => {
                                setIsViewDialogOpen(open)
                                if (open) setCurrentExam(exam)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Exam Details</DialogTitle>
                                  <DialogDescription>Detailed information about the exam.</DialogDescription>
                                </DialogHeader>
                                {currentExam && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                                        <p className="text-base">{currentExam.title}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                                        <p className="text-base">{currentExam.subject}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Teacher</h3>
                                        <p className="text-base">{currentExam.teacherName}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                                        <p className="text-base">{currentExam.duration} minutes</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Total Marks</h3>
                                        <p className="text-base">{currentExam.totalMarks}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                        <p className="text-base capitalize">{currentExam.status}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
                                        <p className="text-base">
                                          {new Date(currentExam.date).toLocaleDateString()}{" "}
                                          {new Date(currentExam.date).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </p>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="text-lg font-medium mb-4">Questions</h3>
                                      {currentExam.questions.length === 0 ? (
                                        <p className="text-muted-foreground">No questions added yet.</p>
                                      ) : (
                                        <div className="space-y-4">
                                          {currentExam.questions.map((question: any, index: number) => (
                                            <div key={question.id} className="border rounded-md p-4">
                                              <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium">Question {index + 1}</h4>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm text-muted-foreground">
                                                    {question.marks} marks
                                                  </span>
                                                  <span className="text-sm bg-muted px-2 py-1 rounded-md capitalize">
                                                    {question.type}
                                                  </span>
                                                </div>
                                              </div>
                                              <p>{question.text}</p>
                                            </div>
                                          ))}
                                        </div>
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
                        <TableCell colSpan={7} className="text-center py-4">
                          No exams found. Try a different search term or filter.
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
