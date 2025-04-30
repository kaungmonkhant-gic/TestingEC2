"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { subjectsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function TeacherSubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true)
        const data = await subjectsAPI.getAll()
        setSubjects(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch subjects. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [toast])

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout userRole="teacher">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Subjects</h1>

        <Card>
          <CardHeader>
            <CardTitle>Available Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Loading subjects...
                    </TableCell>
                  </TableRow>
                ) : filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.department}</TableCell>
                      <TableCell className="max-w-md truncate">{subject.description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No subjects found. Try a different search term.
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
