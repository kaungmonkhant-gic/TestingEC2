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
import { teachersAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Teacher type definition
interface Teacher {
  id: number
  name: string
  email: string
  teacherId: string
  department: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null)
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    teacherId: "",
    department: "Science",
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teachersAPI.getAll()
        setTeachers(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch teachers. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeachers()
  }, [toast])

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTeacher = async () => {
    try {
      setIsLoading(true)
      const newTeacherData = await teachersAPI.create(newTeacher)
      setTeachers([...teachers, newTeacherData])
      setNewTeacher({ name: "", email: "", teacherId: "", department: "Science" })
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "Teacher added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add teacher. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTeacher = async () => {
    if (!currentTeacher) return
    try {
      setIsLoading(true)
      const updatedTeacher = await teachersAPI.update(currentTeacher.id, currentTeacher)
      setTeachers(teachers.map((teacher) => (teacher.id === currentTeacher.id ? updatedTeacher : teacher)))
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Teacher updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update teacher. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTeacher = async () => {
    if (!currentTeacher) return
    try {
      setIsLoading(true)
      await teachersAPI.delete(currentTeacher.id)
      setTeachers(teachers.filter((teacher) => teacher.id !== currentTeacher.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete teacher. Please try again.",
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
          <h1 className="text-3xl font-bold">Manage Teachers</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>Enter the details of the new teacher.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teacherId">Teacher ID</Label>
                  <Input
                    id="teacherId"
                    value={newTeacher.teacherId}
                    onChange={(e) => setNewTeacher({ ...newTeacher, teacherId: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newTeacher.department}
                    onValueChange={(value) => setNewTeacher({ ...newTeacher, department: value })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeacher} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Teacher"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teachers List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading teachers...
                    </TableCell>
                  </TableRow>
                ) : filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.teacherId}</TableCell>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.department}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={isEditDialogOpen && currentTeacher?.id === teacher.id}
                            onOpenChange={(open) => {
                              setIsEditDialogOpen(open)
                              if (open) setCurrentTeacher(teacher)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Teacher</DialogTitle>
                                <DialogDescription>Update the teacher's information.</DialogDescription>
                              </DialogHeader>
                              {currentTeacher && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={currentTeacher.name}
                                      onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={currentTeacher.email}
                                      onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-teacherId">Teacher ID</Label>
                                    <Input
                                      id="edit-teacherId"
                                      value={currentTeacher.teacherId}
                                      onChange={(e) =>
                                        setCurrentTeacher({ ...currentTeacher, teacherId: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-department">Department</Label>
                                    <Select
                                      value={currentTeacher.department}
                                      onValueChange={(value) =>
                                        setCurrentTeacher({ ...currentTeacher, department: value })
                                      }
                                    >
                                      <SelectTrigger id="edit-department">
                                        <SelectValue placeholder="Select department" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="History">History</SelectItem>
                                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditTeacher} disabled={isLoading}>
                                  {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={isDeleteDialogOpen && currentTeacher?.id === teacher.id}
                            onOpenChange={(open) => {
                              setIsDeleteDialogOpen(open)
                              if (open) setCurrentTeacher(teacher)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Teacher</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this teacher? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              {currentTeacher && (
                                <div className="py-4">
                                  <p>
                                    <strong>Name:</strong> {currentTeacher.name}
                                  </p>
                                  <p>
                                    <strong>Teacher ID:</strong> {currentTeacher.teacherId}
                                  </p>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteTeacher} disabled={isLoading}>
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
                      No teachers found. Try a different search term.
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
