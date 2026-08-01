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