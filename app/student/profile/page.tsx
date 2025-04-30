"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { studentsAPI } from "@/lib/api"
import { User } from "lucide-react"

// Mock student ID for demo purposes
const STUDENT_ID = 1

export default function StudentProfilePage() {
  const [student, setStudent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true)
        const data = await studentsAPI.getById(STUDENT_ID)
        setStudent(data)
        setFormData({
          name: data.name,
          email: data.email,
          password: "",
          confirmPassword: "",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch student profile. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudent()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // In a real app, you would handle password updates differently
      // For this demo, we'll just update the name and email
      const updatedStudent = await studentsAPI.update(STUDENT_ID, {
        ...student,
        name: formData.name,
        email: formData.email,
      })

      setStudent(updatedStudent)
      setIsEditing(false)

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout userRole="student">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading profile...</p>
          </div>
        ) : student ? (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex flex-col items-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">{student.name}</CardTitle>
                  <CardDescription>{student.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Student ID:</span>
                    <span>{student.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Grade:</span>
                    <span>{student.grade}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <Tabs defaultValue="profile">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Account Settings</CardTitle>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate}>
                    <TabsContent value="profile" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="password" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </TabsContent>
                    {isEditing && (
                      <CardFooter className="flex justify-end gap-2 px-0 pt-4">
                        <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </CardFooter>
                    )}
                  </form>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p>Failed to load profile. Please try again later.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
