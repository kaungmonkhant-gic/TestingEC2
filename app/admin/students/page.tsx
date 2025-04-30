"use client"

import { useEffect, useState } from "react"
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
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { studentsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Student type definition
interface Student {
  id: number
  name: string
  email: string
  studentId: string
  grade: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    studentId: "",
    grade: "10th",
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddStudent = async () => {
    try {
      setIsLoading(true)
      const newStudentData = await studentsAPI.create(newStudent)
      setStudents([...students, newStudentData])
      setNewStudent({ name: "", email: "", studentId: "", grade: "10th" })
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "Student added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditStudent = async () => {
    if (!currentStudent) return
    try {
      setIsLoading(true)
      const updatedStudent = await studentsAPI.update(currentStudent.id, currentStudent)
      setStudents(students.map((student) => (student.id === currentStudent.id ? updatedStudent : student)))
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Student updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStudent = async () => {
    if (!currentStudent) return
    try {
      setIsLoading(true)
      await studentsAPI.delete(currentStudent.id)
      setStudents(students.filter((student) => student.id !== currentStudent.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Student deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Students</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>Enter the details of the new student.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select
                    value={newStudent.grade}
                    onValueChange={(value) => setNewStudent({ ...newStudent, grade: value })}
                  >
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10th">10th Grade</SelectItem>
                      <SelectItem value="11th">11th Grade</SelectItem>
                      <SelectItem value="12th">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Student"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={isEditDialogOpen && currentStudent?.id === student.id}
                            onOpenChange={(open) => {
                              setIsEditDialogOpen(open)
                              if (open) setCurrentStudent(student)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Student</DialogTitle>
                                <DialogDescription>Update the student's information.</DialogDescription>
                              </DialogHeader>
                              {currentStudent && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={currentStudent.name}
                                      onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={currentStudent.email}
                                      onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-studentId">Student ID</Label>
                                    <Input
                                      id="edit-studentId"
                                      value={currentStudent.studentId}
                                      onChange={(e) =>
                                        setCurrentStudent({ ...currentStudent, studentId: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-grade">Grade</Label>
                                    <Select
                                      value={currentStudent.grade}
                                      onValueChange={(value) => setCurrentStudent({ ...currentStudent, grade: value })}
                                    >
                                      <SelectTrigger id="edit-grade">
                                        <SelectValue placeholder="Select grade" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="10th">10th Grade</SelectItem>
                                        <SelectItem value="11th">11th Grade</SelectItem>
                                        <SelectItem value="12th">12th Grade</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditStudent} disabled={isLoading}>
                                  {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={isDeleteDialogOpen && currentStudent?.id === student.id}
                            onOpenChange={(open) => {
                              setIsDeleteDialogOpen(open)
                              if (open) setCurrentStudent(student)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Student</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this student? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              {currentStudent && (
                                <div className="py-4">
                                  <p>
                                    <strong>Name:</strong> {currentStudent.name}
                                  </p>
                                  <p>
                                    <strong>Student ID:</strong> {currentStudent.studentId}
                                  </p>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteStudent} disabled={isLoading}>
                                  {isLoading ? "Deleting..." : "Delete"}
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
