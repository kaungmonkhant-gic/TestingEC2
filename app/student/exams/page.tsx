"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Clock, FileText } from "lucide-react"

// Mock data for student exams
const initialExams = [
  {
    id: 1,
    title: "Mathematics Mid-term",
    subject: "Mathematics",
    duration: 60,
    totalMarks: 100,
    status: "upcoming",
    date: "2023-05-15T10:00:00",
    questions: [
      { id: 1, text: "Solve for x: 2x + 5 = 15", type: "short-answer", marks: 5 },
      { id: 2, text: "What is the derivative of f(x) = x²?", type: "short-answer", marks: 5 },
      { id: 3, text: "Integrate ∫x³ dx", type: "short-answer", marks: 10 },
    ],
  },
  {
    id: 2,
    title: "Chemistry Quiz",
    subject: "Chemistry",
    duration: 30,
    totalMarks: 50,
    status: "upcoming",
    date: "2023-05-05T09:00:00",
    questions: [
      { id: 1, text: "What is the chemical formula for water?", type: "short-answer", marks: 5 },
      { id: 2, text: "Define pH scale", type: "short-answer", marks: 5 },
      { id: 3, text: "Explain the process of electrolysis", type: "essay", marks: 10 },
    ],
  },
  {
    id: 3,
    title: "English Literature Essay",
    subject: "English",
    duration: 90,
    totalMarks: 100,
    status: "completed",
    date: "2023-04-20T13:00:00",
    result: {
      score: 85,
      feedback: "Excellent analysis of the text. Good use of literary devices.",
    },
  },
]

export default function StudentExamsPage() {
  const [exams, setExams] = useState(initialExams)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [currentExam, setCurrentExam] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [examInProgress, setExamInProgress] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const filteredExams = exams.filter((exam) => activeTab === "all" || exam.status === activeTab)

  const startExam = (exam: any) => {
    setCurrentExam(exam)
    setAnswers({})
    setTimeRemaining(exam.duration * 60) // Convert minutes to seconds
    setExamInProgress(true)
    setIsExamDialogOpen(true)
  }

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const submitExam = () => {
    // In a real app, you would send the answers to the server
    // For this demo, we'll just mark the exam as completed
    setExams(
      exams.map((exam) =>
        exam.id === currentExam.id
          ? {
              ...exam,
              status: "completed",
              result: {
                score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
                feedback: "Thank you for submitting your exam. Your answers have been recorded.",
              },
            }
          : exam,
      ),
    )
    setExamInProgress(false)
    setIsExamDialogOpen(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <DashboardLayout userRole="student">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">My Exams</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Exams</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>{exam.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm">{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Marks:</span>
                        <span className="text-sm">{exam.totalMarks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Date:</span>
                        <span className="text-sm">
                          {new Date(exam.date).toLocaleDateString()}{" "}
                          {new Date(exam.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {exam.status === "completed" && exam.result && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Score:</span>
                          <span className="text-sm">
                            {exam.result.score}/{exam.totalMarks}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {exam.status === "upcoming" ? (
                      <Button className="w-full" onClick={() => startExam(exam)}>
                        Start Exam
                      </Button>
                    ) : (
                      <Dialog
                        open={isResultDialogOpen && currentExam?.id === exam.id}
                        onOpenChange={(open) => {
                          setIsResultDialogOpen(open)
                          if (open) setCurrentExam(exam)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            View Result
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Exam Result</DialogTitle>
                            <DialogDescription>Your performance in {exam.title}</DialogDescription>
                          </DialogHeader>
                          {exam.result && (
                            <div className="space-y-4 py-4">
                              <div className="flex items-center justify-center">
                                <div className="relative h-32 w-32">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold">{exam.result.score}%</span>
                                  </div>
                                  <svg className="h-full w-full" viewBox="0 0 100 100">
                                    <circle
                                      className="text-muted-foreground stroke-current"
                                      strokeWidth="10"
                                      fill="transparent"
                                      r="40"
                                      cx="50"
                                      cy="50"
                                    />
                                    <circle
                                      className="text-primary stroke-current"
                                      strokeWidth="10"
                                      strokeLinecap="round"
                                      fill="transparent"
                                      r="40"
                                      cx="50"
                                      cy="50"
                                      strokeDasharray={`${2 * Math.PI * 40}`}
                                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - exam.result.score / 100)}`}
                                      transform="rotate(-90 50 50)"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-medium">Feedback</h3>
                                <p className="text-sm">{exam.result.feedback}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardFooter>
                </Card>
              ))}

              {filteredExams.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No exams found</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "upcoming"
                      ? "You don't have any upcoming exams."
                      : activeTab === "completed"
                        ? "You haven't completed any exams yet."
                        : "No exams available."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog
          open={isExamDialogOpen}
          onOpenChange={(open) => {
            if (!open && examInProgress) {
              // Show confirmation before closing
              if (window.confirm("Are you sure you want to exit the exam? Your progress will be lost.")) {
                setIsExamDialogOpen(false)
                setExamInProgress(false)
              } else {
                setIsExamDialogOpen(true)
              }
            } else {
              setIsExamDialogOpen(open)
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentExam?.title}</DialogTitle>
              <DialogDescription>
                {currentExam?.subject} • {currentExam?.totalMarks} marks
              </DialogDescription>
            </DialogHeader>
            {currentExam && (
              <div className="space-y-6">
                <div className="sticky top-0 bg-background z-10 py-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Time Remaining: {formatTime(timeRemaining)}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to submit your exam?")) {
                        submitExam()
                      }
                    }}
                  >
                    Submit Exam
                  </Button>
                </div>

                <div className="space-y-8">
                  {currentExam.questions.map((question: any, index: number) => (
                    <div key={question.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">
                          Question {index + 1}{" "}
                          <span className="text-sm text-muted-foreground">({question.marks} marks)</span>
                        </h3>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md capitalize">{question.type}</span>
                      </div>
                      <p className="mb-2">{question.text}</p>
                      <Textarea
                        placeholder="Enter your answer here..."
                        value={answers[question.id] || ""}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={submitExam}>Submit Exam</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
