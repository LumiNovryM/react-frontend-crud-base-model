# Employee Management Frontend

Frontend application untuk **Employee Management System** yang dibangun menggunakan **Next.js 15**, **React 19**, **TypeScript**, dan **shadcn/ui**.

Project ini mengimplementasikan modern frontend architecture dengan server-side data fetching melalui REST API, reusable components, serta responsive user interface untuk mendukung fitur Employee Management.

---

# Tech Stack

## Frontend

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* TanStack Table
* Axios
* Lucide Icons
* Tabler Icons

## UI Components

* shadcn/ui
* Radix UI
* Tailwind CSS
* Responsive Layout

---

# Features

## Employee Management

### Employee List

Menampilkan daftar employee dengan dukungan:

* Server-side pagination
* Searching
* Dynamic rows per page
* Responsive data table

Seluruh data diambil langsung dari backend API sehingga tabel selalu menampilkan data terbaru.

---

### Employee Detail

Menampilkan informasi lengkap employee dalam bentuk **Sheet**.

Response mencakup:

* NIK
* First Name
* Last Name
* Gender
* Place of Birth
* Date of Birth
* Address
* Email
* Phone
* Hire Date

Data diambil secara realtime menggunakan endpoint **Get Employee Detail**.

---

### Create Employee

Menambahkan employee baru melalui form yang telah divalidasi.

Fitur yang tersedia:

* Dynamic Department Dropdown
* Dynamic Job Title Dropdown
* Gender Radio Button
* Date Picker
* Form Validation
* Toast Notification
* Automatic Table Refresh

Job Title akan dimuat secara otomatis berdasarkan Department yang dipilih.

---

### Update Employee

Mengubah data employee yang sudah ada.

Fitur yang tersedia:

* Load data berdasarkan Employee ID
* Dynamic Department Dropdown
* Dynamic Job Title Dropdown
* Update seluruh informasi employee
* Toast Notification
* Automatic Table Refresh

Ketika Department diubah, daftar Job Title akan dimuat ulang sesuai department yang dipilih.

---

### Delete Employee

Menghapus employee dengan dialog konfirmasi.

Fitur:

* Confirmation Dialog
* Toast Notification
* Automatic Table Refresh

---

# Project Architecture

Project menggunakan pendekatan component-based architecture agar setiap bagian aplikasi memiliki tanggung jawab yang jelas dan mudah dikembangkan.

```text
nextjs-frontend-crud

│
├── app
│   ├── employee
│   └── layout.tsx
│
├── components
│   ├── ui
│   ├── employee
│   └── shared
│
├── lib
│   ├── api
│   ├── types
│   ├── utils
│   └── date.ts
│
├── hooks
│
├── public
│
└── middleware.ts
```

---

# Architecture Flow

Request flow pada aplikasi:

```text
User
   |
   |
   v
React Component
   |
   |
   v
API Layer
   |
   |
   v
Axios
   |
   |
   v
ASP.NET Core Web API
   |
   |
   v
SQL Server
```

---

# Layer Responsibility

## Page

Bertanggung jawab untuk:

* Mengelola state halaman
* Pagination
* Search
* Refresh data
* Memanggil API

Contoh:

```
Employee Page
```

---

## Components

Bertanggung jawab untuk:

* Menampilkan user interface
* Mengelola interaksi pengguna
* Reusable component

Contoh:

```
DataTable
EmployeeActions
CreateEmployeeSheet
```

---

## API Layer

Bertanggung jawab untuk:

* HTTP Request
* HTTP Response
* Error Handling
* Komunikasi dengan Backend API

Contoh:

```
EmployeeApi
DepartmentApi
JobTitleApi
```

---

## Types

Berisi seluruh TypeScript interface yang digunakan pada aplikasi.

Contoh:

```
Employee
EmployeeDetail
Department
JobTitle
Pagination
ApiResponse
```

---

## UI Layer

Berisi reusable UI components yang dibangun menggunakan **shadcn/ui**.

Contoh:

* Button
* Input
* Select
* Dialog
* Sheet
* Table
* Radio Group
* Textarea

---

# Data Flow

Employee Management Flow:

```text
User
   |
   |
   v
Employee Page
   |
   |
   v
DataTable
   |
   |
   v
EmployeeActions
   |
   |
   +-------- Detail
   |
   +-------- Create
   |
   +-------- Update
   |
   +-------- Delete
```

---

# API Integration

Frontend berkomunikasi dengan Backend menggunakan REST API.

Endpoint yang digunakan:

## Employee

```text
GET     /api/employees
GET     /api/employees/{id}
POST    /api/employees
PUT     /api/employees/{id}
DELETE  /api/employees/{id}
```

## Department

```text
GET /api/departments
```

## Job Title

```text
GET /api/jobtitles/department/{departmentId}
```

---

# State Management

Project menggunakan React Hooks untuk mengelola state.

Digunakan untuk:

* Employee Data
* Pagination
* Search
* Department List
* Job Title List
* Loading State
* Sheet State
* Dialog State
* Form State

Karena skala project masih relatif kecil, React Hooks sudah cukup untuk mengelola seluruh state tanpa memerlukan library state management tambahan.

---

# Running Project

## 1. Clone Repository

```bash
git clone <repository-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

atau

```bash
pnpm install
```

---

## 3. Configure Environment

Buat file:

```text
.env.local
```

Contoh:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Sesuaikan URL dengan backend yang sedang dijalankan.

---

## 4. Run Development Server

```bash
npm run dev
```

atau

```bash
pnpm dev
```

---

## 5. Open Browser

```text
http://localhost:3000
```

---

# Engineering Practices Applied

Project ini menerapkan beberapa best practices:

✅ Component-Based Architecture

✅ Reusable UI Components

✅ TypeScript Strong Typing

✅ REST API Integration

✅ Axios API Layer

✅ Server-side Pagination

✅ Search Functionality

✅ Dynamic Dependent Dropdown

✅ Responsive Design

✅ Toast Notification

✅ Confirmation Dialog

---

# Future Improvement

Beberapa improvement yang dapat dikembangkan:

* Form Validation (Zod + React Hook Form)
* TanStack Query
* Authentication & Authorization
* Unit Testing
* End-to-End Testing
* Docker Containerization
* CI/CD Pipeline
* Dark Mode
* Skeleton Loading
* Optimistic UI Update

---

# Author

Lumi Novri

Fullstack Developer

.NET | React | Next.js | TypeScript | SQL Server
