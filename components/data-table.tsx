"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { Employee, EmployeePagination } from "@/lib/types/employee";
import { EmployeeActions } from "@/components/employee/employee-action";
import { formatDate } from "@/lib/date";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Department } from "@/lib/types/department";
import { JobTitleApi } from "@/lib/api/jobtitle";
import type { JobTitle } from "@/lib/types/jobtitle";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeApi } from "@/lib/api/employee";
import type { CreateEmployeePayload } from "@/lib/types/employee";
import { toast } from "@/components/ui/toast";

function getColumns(onDeleted: () => void): ColumnDef<Employee>[] {
  return [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
    },
    {
      accessorKey: "hireDate",
      header: "Hire Date",
      cell: ({ row }) => formatDate(row.original.hireDate),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <EmployeeActions
          employee={row.original}
          onDeleted={onDeleted}
        />
      ),
    },
  ];
}

function DraggableRow({ row }: { row: Row<Employee> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
  pagination,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchInput,
  onSearchChange,
  departments,
  onCreated,
  onDeleted,
}: {
  data: Employee[];
  pagination: EmployeePagination | null;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  departments: Department[];
  onCreated: () => void;
  onDeleted: () => void;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const sortableId = React.useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => initialData?.map(({ id }) => id) || [],
    [initialData],
  );

  const [addEmployeeOpen, setAddEmployeeOpen] = React.useState(false);
  const [employeeForm, setEmployeeForm] = React.useState({
    nik: "",
    firstName: "",
    lastName: "",
    gender: "",
    placeOfBirth: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    departmentId: "",
    jobTitleId: "",
    hireDate: "",
  });

  const initialEmployeeForm = {
    nik: "",
    firstName: "",
    lastName: "",
    gender: "",
    placeOfBirth: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    departmentId: "",
    jobTitleId: "",
    hireDate: "",
  };

  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [creating, setCreating] = useState(false);

  const fetchJobTitles = async (departmentId: number) => {
    try {
      const result = await JobTitleApi.getByDepartment(departmentId);

      if (result.success) {
        setJobTitles(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmployeeChange = (
    field: keyof typeof employeeForm,
    value: string,
  ) => {
    setEmployeeForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmployeeForm = () => {
    if (!employeeForm.firstName.trim()) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "First Name is required.",
      });

      return false;
    }

    if (!employeeForm.lastName.trim()) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Last Name is required.",
      });

      return false;
    }

    if (!employeeForm.nik.trim()) {
      if (employeeForm.nik.length < 6) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "NIK is too short.",
        });

        return false;
      }
    }

    if (!employeeForm.departmentId) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Please select a department.",
      });

      return false;
    }

    if (!employeeForm.jobTitleId) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Please select a job title.",
      });

      return false;
    }

    if (!employeeForm.gender) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Please select a gender.",
      });

      return false;
    }

    if (!employeeForm.placeOfBirth.trim()) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Place of Birth is required.",
      });

      return false;
    }

    if (!employeeForm.dateOfBirth) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Date of Birth is required.",
      });

      return false;
    }

    if (!employeeForm.address.trim()) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Address is required.",
      });

      return false;
    }

    if (!employeeForm.phone.trim()) {
      if (employeeForm.phone.length < 10) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Phone number is invalid.",
        });

        return false;
      }
    }

    if (!employeeForm.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(employeeForm.email)) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Invalid email format.",
        });

        return false;
      }
    }

    if (!employeeForm.hireDate) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Hire Date is required.",
      });

      return false;
    }

    return true;
  };

  const handleCreateEmployee = async () => {
    if (!validateEmployeeForm()) {
      return;
    }
    setCreating(true);

    try {
      const payload: CreateEmployeePayload = {
        nik: employeeForm.nik,
        firstName: employeeForm.firstName,
        lastName: employeeForm.lastName,
        address: employeeForm.address,
        gender: employeeForm.gender,
        placeOfBirth: employeeForm.placeOfBirth,
        dateOfBirth: new Date(employeeForm.dateOfBirth).toISOString(),
        email: employeeForm.email,
        phone: employeeForm.phone,
        jobTitleId: Number(employeeForm.jobTitleId),
        hireDate: new Date(employeeForm.hireDate).toISOString(),
      };

      const result = await EmployeeApi.create(payload);

      if (result.success) {
        onCreated();

        setAddEmployeeOpen(false);

        setEmployeeForm(initialEmployeeForm);

        setJobTitles([]);

        toast.add({
          type: "success",
          title: "Employee Created",
          description: result.message,
        });
      } else {
        toast.add({
          type: "error",
          title: "Create Employee Failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error(error);

      toast.add({
        type: "error",
        title: "Unexpected Error",
        description: "Unable to create employee. Please try again.",
      });
    } finally {
      setCreating(false);
    }
  };

  const columns = getColumns(onDeleted);

  const table = useReactTable({
    data: initialData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,

    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={() =>
              toast.add({
                type: "success",
                title: "Hi From Lumi",
                description: "This is a toast notification from Lumi.",
              })
            }
          >
            Hola Button :)
          </Button>
          <Button variant="outline" onClick={() => setAddEmployeeOpen(true)}>
            Add New Employee
          </Button>
          <Field orientation="horizontal">
            <Input
              type="search"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Field>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  onPageSizeChange(Number(value));
                  onPageChange(1);
                }}
                items={[10, 20, 30, 40, 50].map((pageSize) => ({
                  label: `${pageSize}`,
                  value: `${pageSize}`,
                }))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {page} of {pagination?.totalPages ?? 1}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => {
                  if (page > 1) {
                    onPageChange(page - 1);
                  }
                }}
                disabled={page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => {
                  if (pagination && page < pagination.totalPages) {
                    onPageChange(page + 1);
                  }
                }}
                disabled={pagination ? page === pagination.totalPages : true}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => {
                  if (pagination) {
                    onPageChange(pagination.totalPages);
                  }
                }}
                disabled={pagination ? page === pagination.totalPages : true}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <Sheet open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Add New Employee</SheetTitle>

            <SheetDescription>Create a new employee profile.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="grid gap-6">
              {/* First Name */}
              <div className="grid gap-3">
                <Label>First Name</Label>

                <Input
                  placeholder="Enter first name"
                  value={employeeForm.firstName}
                  onChange={(e) =>
                    handleEmployeeChange("firstName", e.target.value)
                  }
                />
              </div>

              {/* Last Name */}
              <div className="grid gap-3">
                <Label>Last Name</Label>

                <Input
                  placeholder="Enter last name"
                  value={employeeForm.lastName}
                  onChange={(e) =>
                    handleEmployeeChange("lastName", e.target.value)
                  }
                />
              </div>

              {/* NIK */}
              <div className="grid gap-3">
                <Label>NIK</Label>

                <Input
                  placeholder="Enter NIK"
                  value={employeeForm.nik}
                  onChange={(e) => handleEmployeeChange("nik", e.target.value)}
                />
              </div>

              {/* Department */}
              <div className="grid gap-3">
                <Label>Department</Label>

                <Select
                  value={employeeForm.departmentId}
                  onValueChange={(value) => {
                    handleEmployeeChange("departmentId", value ?? "");

                    handleEmployeeChange("jobTitleId", "");

                    fetchJobTitles(Number(value));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department">
                      {
                        departments.find(
                          (department) =>
                            department.id.toString() ===
                            employeeForm.departmentId,
                        )?.departmentName
                      }
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={department.id.toString()}
                      >
                        {department.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* JobTitle */}
              <div className="grid gap-3">
                <Label>Job Title</Label>

                <Select
                  disabled={!employeeForm.departmentId}
                  value={employeeForm.jobTitleId}
                  onValueChange={(value) =>
                    handleEmployeeChange("jobTitleId", value ?? "")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Job Title">
                      {
                        jobTitles.find(
                          (jobTitle) =>
                            jobTitle.id.toString() === employeeForm.jobTitleId,
                        )?.jobTitleName
                      }
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {jobTitles.map((jobTitle) => (
                      <SelectItem
                        key={jobTitle.id}
                        value={jobTitle.id.toString()}
                      >
                        {jobTitle.jobTitleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div className="grid gap-3">
                <Label> Gender</Label>

                <RadioGroup
                  value={employeeForm.gender}
                  onValueChange={(value) =>
                    setEmployeeForm((prev) => ({
                      ...prev,
                      gender: value,
                    }))
                  }
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="M" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="F" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Place Of Birth */}
              <div className="grid gap-3">
                <Label>Place of Birth</Label>

                <Input
                  placeholder="Enter place of birth"
                  value={employeeForm.placeOfBirth}
                  onChange={(e) =>
                    handleEmployeeChange("placeOfBirth", e.target.value)
                  }
                />
              </div>

              {/* Date Of Birth */}
              <div className="grid gap-3">
                <Label>Date of Birth</Label>

                <Input
                  type="date"
                  value={employeeForm.dateOfBirth}
                  onChange={(e) =>
                    handleEmployeeChange("dateOfBirth", e.target.value)
                  }
                />
              </div>

              {/* Hire Date */}
              <div className="grid gap-3">
                <Label>Hire Date</Label>

                <Input
                  type="date"
                  value={employeeForm.hireDate}
                  onChange={(e) =>
                    handleEmployeeChange("hireDate", e.target.value)
                  }
                />
              </div>

              {/* Address */}
              <div className="grid gap-3">
                <Label>Address</Label>

                <Textarea
                  placeholder="Enter address"
                  value={employeeForm.address}
                  onChange={(e) =>
                    handleEmployeeChange("address", e.target.value)
                  }
                />
              </div>

              {/* Phone */}
              <div className="grid gap-3">
                <Label>Phone</Label>

                <Input
                  placeholder="Enter phone number"
                  value={employeeForm.phone}
                  onChange={(e) =>
                    handleEmployeeChange("phone", e.target.value)
                  }
                />
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label>Email</Label>

                <Input
                  type="email"
                  placeholder="Enter email"
                  value={employeeForm.email}
                  onChange={(e) =>
                    handleEmployeeChange("email", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button
              disabled={creating}
              onClick={() => {
                handleCreateEmployee();
              }}
            >
              {creating ? "Saving..." : "Save"}
            </Button>

            <SheetClose render={<Button variant="outline">Cancel</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Tabs>
  );
}
