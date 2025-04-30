"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: "Demo School",
    adminEmail: "admin@example.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Education St, Learning City, 12345",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    examReminders: true,
    resultPublished: true,
    systemUpdates: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    })
  }

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting as keyof typeof notificationSettings],
    })
  }

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecuritySettings({
      ...securitySettings,
      [name]: name === "twoFactorAuth" ? !securitySettings.twoFactorAuth : Number.parseInt(value) || 0,
    })
  }

  const handleSaveSettings = (settingType: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Success",
        description: `${settingType} settings saved successfully.`,
      })
    }, 1000)
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">System Settings</h1>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your institution's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="schoolName">Institution Name</Label>
                  <Input
                    id="schoolName"
                    name="schoolName"
                    value={generalSettings.schoolName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralSettingsChange}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings("General")} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="examReminders">Exam Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders before scheduled exams</p>
                  </div>
                  <Switch
                    id="examReminders"
                    checked={notificationSettings.examReminders}
                    onCheckedChange={() => handleNotificationToggle("examReminders")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="resultPublished">Result Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify when exam results are published</p>
                  </div>
                  <Switch
                    id="resultPublished"
                    checked={notificationSettings.resultPublished}
                    onCheckedChange={() => handleNotificationToggle("resultPublished")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemUpdates">System Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about system updates</p>
                  </div>
                  <Switch
                    id="systemUpdates"
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={() => handleNotificationToggle("systemUpdates")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings("Notification")} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure system security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for all admin users
                    </p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    name="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: !securitySettings.twoFactorAuth,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    name="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry.toString()}
                    onChange={handleSecuritySettingsChange}
                  />
                  <p className="text-sm text-muted-foreground">Number of days before passwords expire (0 for never)</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    name="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout.toString()}
                    onChange={handleSecuritySettingsChange}
                  />
                  <p className="text-sm text-muted-foreground">Automatically log out users after inactivity</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings("Security")} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
