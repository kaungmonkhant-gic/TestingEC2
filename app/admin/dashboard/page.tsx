import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, Users } from "lucide-react"

export default function AdminDashboard() {
  return (
    <DashboardLayout userRole="admin">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">+2 new subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">3 pending review</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="upcoming-exams">Upcoming Exams</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Key metrics and statistics for the exam management system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Teachers:</span>
                    <span>32</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Exams Created This Month:</span>
                    <span>24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Pass Rate:</span>
                    <span>78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Uptime:</span>
                    <span>99.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent-activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and events in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New student registered", time: "2 hours ago", user: "Admin" },
                    { action: "New exam created", time: "5 hours ago", user: "Teacher: John Smith" },
                    { action: "Subject updated", time: "Yesterday", user: "Admin" },
                    { action: "Exam results published", time: "Yesterday", user: "Teacher: Sarah Johnson" },
                    { action: "System backup completed", time: "2 days ago", user: "System" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">By: {item.user}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming-exams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>Exams scheduled for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Mathematics Final",
                      date: "Tomorrow, 10:00 AM",
                      subject: "Mathematics",
                      teacher: "John Smith",
                    },
                    { name: "Physics Mid-term", date: "May 2, 2:00 PM", subject: "Physics", teacher: "Sarah Johnson" },
                    {
                      name: "Computer Science Project",
                      date: "May 3, 9:00 AM",
                      subject: "Computer Science",
                      teacher: "Michael Brown",
                    },
                    {
                      name: "English Literature Essay",
                      date: "May 5, 1:00 PM",
                      subject: "English",
                      teacher: "Emily Davis",
                    },
                  ].map((exam, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{exam.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.subject} • {exam.teacher}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{exam.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
