// This file contains all API calls to the JSON Server

// Base URL for JSON Server
const API_URL = "http://localhost:3001"

// Generic fetch function with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Students API
export const studentsAPI = {
  getAll: () => fetchAPI("/students"),
  getById: (id: number) => fetchAPI(`/students/${id}`),
  create: (data: any) =>
    fetchAPI("/students", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchAPI(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchAPI(`/students/${id}`, {
      method: "DELETE",
    }),
}

// Subjects API
export const subjectsAPI = {
  getAll: () => fetchAPI("/subjects"),
  getById: (id: number) => fetchAPI(`/subjects/${id}`),
  create: (data: any) =>
    fetchAPI("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchAPI(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchAPI(`/subjects/${id}`, {
      method: "DELETE",
    }),
}

// Teachers API
export const teachersAPI = {
  getAll: () => fetchAPI("/teachers"),
  getById: (id: number) => fetchAPI(`/teachers/${id}`),
  create: (data: any) =>
    fetchAPI("/teachers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchAPI(`/teachers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchAPI(`/teachers/${id}`, {
      method: "DELETE",
    }),
}

// Exams API
export const examsAPI = {
  getAll: () => fetchAPI("/exams"),
  getById: (id: number) => fetchAPI(`/exams/${id}`),
  getByStudent: (studentId: number) => fetchAPI(`/exams?studentId=${studentId}`),
  getByTeacher: (teacherId: number) => fetchAPI(`/exams?teacherId=${teacherId}`),
  create: (data: any) =>
    fetchAPI("/exams", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchAPI(`/exams/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchAPI(`/exams/${id}`, {
      method: "DELETE",
    }),
}

// Results API
export const resultsAPI = {
  getAll: () => fetchAPI("/results"),
  getById: (id: number) => fetchAPI(`/results/${id}`),
  getByStudent: (studentId: number) => fetchAPI(`/results?studentId=${studentId}`),
  getByExam: (examId: number) => fetchAPI(`/results?examId=${examId}`),
  create: (data: any) =>
    fetchAPI("/results", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchAPI(`/results/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}
