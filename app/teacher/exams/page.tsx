"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Edit, Eye, Plus, Trash2 } from "lucide-react"

// Mock data for exams
const initialExams = [
  {
    id: 1,
    title: "Mathematics Mid-term",
    subject: "Mathematics",
    duration: 60,
    totalMarks: 100,
    status: "published",
    date: "2023-05-15T10:00:00",
    questions: [
      { id: 1, text: "Solve for x: 2x + 5 = 15", type: "short-answer", marks: 5 },
      { id: 2, text: "What is the derivative of f(x) = x²?", type: "short-answer", marks: 5 },
      { id: 3, text: "Integrate ∫x³ dx", type: "short-answer", marks: 10 },
    ],
  },
  {
    id: 2,
    title: "Physics Final",
    subject: "Physics",
    duration: 120,
    totalMarks: 100,
    status: "draft",
    date: "2023-06-10T14:00:00",
    questions: [
      { id: 1, text: "Explain Newton's First Law of Motion", type: "essay", marks: 15 },
      {
        id: 2,
        text: "Calculate the force required to accelerate a 2kg mass at 5m/s²",
        type: "short-answer",
        marks: 10,
      },
      { id: 3, text: "Describe the principle of conservation of energy", type: "essay", marks: 15 },
    ],
  },
  {
    id: 3,
    title: "Chemistry Quiz",
    subject: "Chemistry",
    duration: 30,
    totalMarks: 50,
    status: "published",
    date: "2023-05-05T09:00:00",
    questions: [
      { id: 1, text: "What is the chemical formula for water?", type: "short-answer", marks: 5 },
      { id: 2, text: "Define pH scale", type: "short-answer", marks: 5 },
      { id: 3, text: "Explain the process of electrolysis", type: "essay", marks: 10 },
    ],
  },
]

export default function ExamsPage() {
  const [exams, setExams] = useState(initialExams)
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentExam, setCurrentExam] = useState<any>(null)
  const [newExam, setNewExam] = useState({
    title: "",
    subject: "Mathematics",
    duration: 60,
    totalMarks: 100,
    status: "draft",
    date: "",
    questions: [],
  })
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "short-answer",
    marks: 5,
  })

  const filteredExams = activeTab === "all" ? exams : exams.filter((exam) => exam.status === activeTab)

  const handleAddExam = () => {
    const id = exams.length > 0 ? Math.max(...exams.map((e) => e.id)) + 1 : 1
    setExams([...exams, { id, ...newExam, questions: [] }])
    setNewExam({
      title: "",
      subject: "Mathematics",
      duration: 60,
      totalMarks: 100,
      status: "draft",
      date: "",
      questions: [],
    })
    setIsAddDialogOpen(false)
  }

  const handleEditExam = () => {
    if (!currentExam) return
    setExams(exams.map((exam) => (exam.id === currentExam.id ? currentExam : exam)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteExam = () => {
    if (!currentExam) return
    setExams(exams.filter((exam) => exam.id !== currentExam.id))
    setIsDeleteDialogOpen(false)
  }

  const handleAddQuestion = () => {
    if (!currentExam) return
    const questionId =
      currentExam.questions.length > 0 ? Math.max(...currentExam.questions.map((q: any) => q.id)) + 1 : 1

    const updatedExam = {
      ...currentExam,
      questions: [...currentExam.questions, { id: questionId, ...newQuestion }],
    }

    setCurrentExam(updatedExam)
    setNewQuestion({
      text: "",
      type: "short-answer",
      marks: 5,
    })
  }

  const handleDeleteQuestion = (questionId: number) => {
    if (!currentExam) return

    const updatedExam = {
      ...currentExam,
      questions: currentExam.questions.filter((q: any) => q.id !== questionId),
    }

    setCurrentExam(updatedExam)
  }

  return (
    <DashboardLayout userRole="teacher">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Exams</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>Enter the details of the new exam.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={newExam.subject}
                      onValueChange={(value) => setNewExam({ ...newExam, subject: value })}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newExam.status} onValueChange={(value) => setNewExam({ ...newExam, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newExam.duration.toString()}
                      onChange={(e) => setNewExam({ ...newExam, duration: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input
                      id="totalMarks"
                      type="number"
                      value={newExam.totalMarks.toString()}
                      onChange={(e) => setNewExam({ ...newExam, totalMarks: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Exam Date & Time</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExam}>Create Exam</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Exams</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
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
                      <TableHead>Duration</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.title}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{exam.duration} mins</TableCell>
                        <TableCell>{exam.totalMarks}</TableCell>
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
                          <div className="flex justify-end gap-2">
                            <Dialog
                              open={isViewDialogOpen && currentExam?.id === exam.id}
                              onOpenChange={(open) => {
                                setIsViewDialogOpen(open)
                                if (open) setCurrentExam(exam)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>View Exam</DialogTitle>
                                  <DialogDescription>Exam details and questions.</DialogDescription>
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

                            <Dialog
                              open={isEditDialogOpen && currentExam?.id === exam.id}
                              onOpenChange={(open) => {
                                setIsEditDialogOpen(open)
                                if (open) setCurrentExam({ ...exam })
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Exam</DialogTitle>
                                  <DialogDescription>Update exam details and questions.</DialogDescription>
                                </DialogHeader>
                                {currentExam && (
                                  <div className="space-y-6">
                                    <div className="grid gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-title">Exam Title</Label>
                                        <Input
                                          id="edit-title"
                                          value={currentExam.title}
                                          onChange={(e) => setCurrentExam({ ...currentExam, title: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-subject">Subject</Label>
                                          <Select
                                            value={currentExam.subject}
                                            onValueChange={(value) =>
                                              setCurrentExam({ ...currentExam, subject: value })
                                            }
                                          >
                                            <SelectTrigger id="edit-subject">
                                              <SelectValue placeholder="Select subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                                              <SelectItem value="Physics">Physics</SelectItem>
                                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                                              <SelectItem value="English">English</SelectItem>
                                              <SelectItem value="History">History</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-status">Status</Label>
                                          <Select
                                            value={currentExam.status}
                                            onValueChange={(value) => setCurrentExam({ ...currentExam, status: value })}
                                          >
                                            <SelectTrigger id="edit-status">
                                              <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="draft">Draft</SelectItem>
                                              <SelectItem value="published">Published</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-duration">Duration (minutes)</Label>
                                          <Input
                                            id="edit-duration"
                                            type="number"
                                            value={currentExam.duration.toString()}
                                            onChange={(e) =>
                                              setCurrentExam({
                                                ...currentExam,
                                                duration: Number.parseInt(e.target.value) || 0,
                                              })
                                            }
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-totalMarks">Total Marks</Label>
                                          <Input
                                            id="edit-totalMarks"
                                            type="number"
                                            value={currentExam.totalMarks.toString()}
                                            onChange={(e) =>
                                              setCurrentExam({
                                                ...currentExam,
                                                totalMarks: Number.parseInt(e.target.value) || 0,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-date">Exam Date & Time</Label>
                                        <Input
                                          id="edit-date"
                                          type="datetime-local"
                                          value={currentExam.date}
                                          onChange={(e) => setCurrentExam({ ...currentExam, date: e.target.value })}
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium">Questions</h3>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setNewQuestion({
                                              text: "",
                                              type: "short-answer",
                                              marks: 5,
                                            })
                                          }}
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Question
                                        </Button>
                                      </div>

                                      <div className="space-y-4 mb-6">
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
                                                <Button
                                                  variant="destructive"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() => handleDeleteQuestion(question.id)}
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                            <p>{question.text}</p>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="border rounded-md p-4">
                                        <h4 className="font-medium mb-4">New Question</h4>
                                        <div className="grid gap-4">
                                          <div className="grid gap-2">
                                            <Label htmlFor="question-text">Question Text</Label>
                                            <Textarea
                                              id="question-text"
                                              value={newQuestion.text}
                                              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                              placeholder="Enter question text"
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                              <Label htmlFor="question-type">Question Type</Label>
                                              <Select
                                                value={newQuestion.type}
                                                onValueChange={(value) =>
                                                  setNewQuestion({ ...newQuestion, type: value })
                                                }
                                              >
                                                <SelectTrigger id="question-type">
                                                  <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                                  <SelectItem value="short-answer">Short Answer</SelectItem>
                                                  <SelectItem value="essay">Essay</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="grid gap-2">
                                              <Label htmlFor="question-marks">Marks</Label>
                                              <Input
                                                id="question-marks"
                                                type="number"
                                                value={newQuestion.marks.toString()}
                                                onChange={(e) =>
                                                  setNewQuestion({
                                                    ...newQuestion,
                                                    marks: Number.parseInt(e.target.value) || 0,
                                                  })
                                                }
                                              />
                                            </div>
                                          </div>
                                          <Button onClick={handleAddQuestion} disabled={!newQuestion.text}>
                                            Add Question
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditExam}>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog
                              open={isDeleteDialogOpen && currentExam?.id === exam.id}
                              onOpenChange={(open) => {
                                setIsDeleteDialogOpen(open)
                                if (open) setCurrentExam(exam)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Exam</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this exam? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                {currentExam && (
                                  <div className="py-4">
                                    <p>
                                      <strong>Title:</strong> {currentExam.title}
                                    </p>
                                    <p>
                                      <strong>Subject:</strong> {currentExam.subject}
                                    </p>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={handleDeleteExam}>
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredExams.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No exams found. Create a new exam to get started.
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
