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
import { Textarea } from "@/components/ui/textarea"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { subjectsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Subject type definition
interface Subject {
  id: number
  code: string
  name: string
  department: string
  description: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null)
  const [newSubject, setNewSubject] = useState({
    code: "",
    name: "",
    department: "Science",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
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
      subject.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubject = async () => {
    try {
      setIsLoading(true)
      const newSubjectData = await subjectsAPI.create(newSubject)
      setSubjects([...subjects, newSubjectData])
      setNewSubject({ code: "", name: "", department: "Science", description: "" })
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "Subject added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subject. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSubject = async () => {
    if (!currentSubject) return
    try {
      setIsLoading(true)
      const updatedSubject = await subjectsAPI.update(currentSubject.id, currentSubject)
      setSubjects(subjects.map((subject) => (subject.id === currentSubject.id ? updatedSubject : subject)))
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Subject updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subject. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSubject = async () => {
    if (!currentSubject) return
    try {
      setIsLoading(true)
      await subjectsAPI.delete(currentSubject.id)
      setSubjects(subjects.filter((subject) => subject.id !== currentSubject.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Subject deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
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
          <h1 className="text-3xl font-bold">Manage Subjects</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>Enter the details of the new subject.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newSubject.department}
                    onValueChange={(value) => setNewSubject({ ...newSubject, department: value })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Humanities">Humanities</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubject} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Subject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subjects List</CardTitle>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading subjects...
                    </TableCell>
                  </TableRow>
                ) : filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.department}</TableCell>
                      <TableCell className="max-w-xs truncate">{subject.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={isEditDialogOpen && currentSubject?.id === subject.id}
                            onOpenChange={(open) => {
                              setIsEditDialogOpen(open)
                              if (open) setCurrentSubject(subject)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Subject</DialogTitle>
                                <DialogDescription>Update the subject's information.</DialogDescription>
                              </DialogHeader>
                              {currentSubject && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-code">Subject Code</Label>
                                    <Input
                                      id="edit-code"
                                      value={currentSubject.code}
                                      onChange={(e) => setCurrentSubject({ ...currentSubject, code: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Subject Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={currentSubject.name}
                                      onChange={(e) => setCurrentSubject({ ...currentSubject, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-department">Department</Label>
                                    <Select
                                      value={currentSubject.department}
                                      onValueChange={(value) =>
                                        setCurrentSubject({ ...currentSubject, department: value })
                                      }
                                    >
                                      <SelectTrigger id="edit-department">
                                        <SelectValue placeholder="Select department" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="Humanities">Humanities</SelectItem>
                                        <SelectItem value="Arts">Arts</SelectItem>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={currentSubject.description}
                                      onChange={(e) =>
                                        setCurrentSubject({ ...currentSubject, description: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditSubject} disabled={isLoading}>
                                  {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={isDeleteDialogOpen && currentSubject?.id === subject.id}
                            onOpenChange={(open) => {
                              setIsDeleteDialogOpen(open)
                              if (open) setCurrentSubject(subject)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Subject</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this subject? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              {currentSubject && (
                                <div className="py-4">
                                  <p>
                                    <strong>Code:</strong> {currentSubject.code}
                                  </p>
                                  <p>
                                    <strong>Name:</strong> {currentSubject.name}
                                  </p>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteSubject} disabled={isLoading}>
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
