export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  hireDate: string;
}

export interface EmployeePagination {
  data: Employee[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateEmployeePayload {
  nik: string;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  placeOfBirth: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  jobTitleId: number;
  hireDate: string;
}

export interface EmployeeDetail {
  nik: string;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  placeOfBirth: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  jobTitleId: number;
  hireDate: string;
}