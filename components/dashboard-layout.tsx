"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, ChevronDown, FileText, Home, LogOut, Menu, PieChart, Settings, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  userRole: "admin" | "teacher" | "student"
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/teachers", label: "Teachers", icon: Users },
    { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
    { href: "/admin/exams", label: "Exams", icon: FileText },
    { href: "/admin/reports", label: "Reports", icon: PieChart },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const teacherNavItems = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: Home },
    { href: "/teacher/students", label: "Students", icon: Users },
    { href: "/teacher/subjects", label: "Subjects", icon: BookOpen },
    { href: "/teacher/exams", label: "Exams", icon: FileText },
    { href: "/teacher/results", label: "Results", icon: PieChart },
  ]

  const studentNavItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: Home },
    { href: "/student/exams", label: "My Exams", icon: FileText },
    { href: "/student/results", label: "My Results", icon: PieChart },
    { href: "/student/profile", label: "Profile", icon: User },
  ]

  const navItems = userRole === "admin" ? adminNavItems : userRole === "teacher" ? teacherNavItems : studentNavItems

  const roleName = userRole === "admin" ? "Administrator" : userRole === "teacher" ? "Teacher" : "Student"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 py-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                        pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href={`/${userRole}/dashboard`} className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-lg font-bold">Exam System</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium">
                <User className="h-4 w-4" />
                <span>{roleName}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
