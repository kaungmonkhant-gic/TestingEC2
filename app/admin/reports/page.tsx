"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { examsAPI, resultsAPI, studentsAPI, subjectsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AdminReportsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const studentsData = await studentsAPI.getAll()
        const examsData = await examsAPI.getAll()
        const resultsData = await resultsAPI.getAll()
        const subjectsData = await subjectsAPI.getAll()

        setStudents(studentsData)
        setExams(examsData)
        setResults(resultsData)
        setSubjects(subjectsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch report data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Prepare data for charts
  const subjectPerformanceData = subjects.map((subject) => {
    const subjectExams = exams.filter((exam) => exam.subject === subject.name)
    const subjectExamIds = subjectExams.map((exam) => exam.id)
    const subjectResults = results.filter((result) => subjectExamIds.includes(result.examId))

    const averageScore =
      subjectResults.length > 0
        ? subjectResults.reduce((sum, result) => sum + (result.score / result.totalMarks) * 100, 0) /
          subjectResults.length
        : 0

    return {
      name: subject.name,
      averageScore: Math.round(averageScore),
    }
  })

  // Grade distribution data
  const gradeDistribution = [
    { name: "A+", value: results.filter((result) => result.grade === "A+").length },
    { name: "A", value: results.filter((result) => result.grade === "A").length },
    { name: "B+", value: results.filter((result) => result.grade === "B+").length },
    { name: "B", value: results.filter((result) => result.grade === "B").length },
    { name: "C+", value: results.filter((result) => result.grade === "C+").length },
    { name: "C", value: results.filter((result) => result.grade === "C").length },
    { name: "D", value: results.filter((result) => result.grade === "D").length },
    { name: "F", value: results.filter((result) => result.grade === "F").length },
  ].filter((grade) => grade.value > 0)

  // Colors for pie chart
  const COLORS = ["#4CAF50", "#8BC34A", "#2196F3", "#03A9F4", "#FFC107", "#FF9800", "#FF5722", "#F44336"]

  return (
    <DashboardLayout userRole="admin">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results.length > 0
                  ? Math.round(
                      results.reduce((sum, result) => sum + (result.score / result.totalMarks) * 100, 0) /
                        results.length,
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results.length > 0
                  ? Math.round(
                      (results.filter((result) => (result.score / result.totalMarks) * 100 >= 60).length /
                        results.length) *
                        100,
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance">
          <TabsList>
            <TabsTrigger value="performance">Subject Performance</TabsTrigger>
            <TabsTrigger value="grades">Grade Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average scores across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectPerformanceData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageScore" name="Average Score (%)" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of grades across all exams</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} results`, props.payload.name]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
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
