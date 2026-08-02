"use client";

import { useState } from "react";

import { IconDotsVertical } from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { formatDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import type { Employee, EmployeeDetail } from "@/lib/types/employee";
import type { Department } from "@/lib/types/department";
import type { JobTitle } from "@/lib/types/jobtitle";
import { JobTitleApi } from "@/lib/api/jobtitle";
import { EmployeeApi } from "@/lib/api/employee";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  employee: Employee;
  onDeleted: () => void;
  onUpdated: () => void;
  departments: Department[];
}

export function EmployeeActions({
  employee,
  onDeleted,
  onUpdated,
  departments,
}: Props) {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<EmployeeDetail | null>(
    null,
  );

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<EmployeeDetail | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const initialEditForm = {
    nik: "",
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
    placeOfBirth: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    departmentId: "",
    jobTitleId: "",
    hireDate: "",
  };

  const [editForm, setEditForm] = useState(initialEditForm);

  const handleDetail = async () => {
    try {
      setLoadingDetail(true);

      const result = await EmployeeApi.getById(employee.id);

      if (result.success) {
        setDetailEmployee(result.data);
        setDetailOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoadingEdit(true);

      const result = await EmployeeApi.getById(employee.id);

      if (result.success) {
        const employeeDetail = result.data;

        setEditEmployee(employeeDetail);

        setEditForm({
          nik: employeeDetail.nik,
          firstName: employeeDetail.firstName,
          lastName: employeeDetail.lastName,
          address: employeeDetail.address,
          gender: employeeDetail.gender,
          placeOfBirth: employeeDetail.placeOfBirth,
          dateOfBirth: employeeDetail.dateOfBirth.split("T")[0],
          email: employeeDetail.email,
          phone: employeeDetail.phone,

          departmentId: employeeDetail.departmentId.toString(),
          jobTitleId: employeeDetail.jobTitleId.toString(),

          hireDate: employeeDetail.hireDate.split("T")[0],
        });

        await fetchJobTitles(employeeDetail.departmentId);

        setEditOpen(true);
      }
    } catch (error) {
      console.error(error);

      toast.add({
        type: "error",
        title: "Failed",
        description: "Unable to load employee data.",
      });
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEditChange = (field: keyof typeof editForm, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      const result = await EmployeeApi.delete(employee.id);

      if (result.success) {
        toast.add({
          type: "success",
          title: "Employee Deleted",
          description: result.message,
        });

        setDeleteOpen(false);

        onDeleted();
      } else {
        toast.add({
          type: "error",
          title: "Delete Failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error(error);

      toast.add({
        type: "error",
        title: "Unexpected Error",
        description: "Unable to delete employee.",
      });
    }
  };

   const validateEmployeeForm = () => {
      if (!editForm.firstName.trim()) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "First Name is required.",
        });
  
        return false;
      }
  
      if (!editForm.lastName.trim()) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Last Name is required.",
        });
  
        return false;
      }
  
      if (!editForm.nik.trim()) {
        if (editForm.nik.length < 6) {
          toast.add({
            type: "error",
            title: "Validation Error",
            description: "NIK is too short.",
          });
  
          return false;
        }
      }
  
      if (!editForm.departmentId) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Please select a department.",
        });
  
        return false;
      }
  
      if (!editForm.jobTitleId) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Please select a job title.",
        });
  
        return false;
      }
  
      if (!editForm.gender) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Please select a gender.",
        });
  
        return false;
      }
  
      if (!editForm.placeOfBirth.trim()) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Place of Birth is required.",
        });
  
        return false;
      }
  
      if (!editForm.dateOfBirth) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Date of Birth is required.",
        });
  
        return false;
      }
  
      if (!editForm.address.trim()) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Address is required.",
        });
  
        return false;
      }
  
      if (!editForm.phone.trim()) {
        if (editForm.phone.length < 10) {
          toast.add({
            type: "error",
            title: "Validation Error",
            description: "Phone number is invalid.",
          });
  
          return false;
        }
      }
  
      if (!editForm.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!emailRegex.test(editForm.email)) {
          toast.add({
            type: "error",
            title: "Validation Error",
            description: "Invalid email format.",
          });
  
          return false;
        }
      }
  
      if (!editForm.hireDate) {
        toast.add({
          type: "error",
          title: "Validation Error",
          description: "Hire Date is required.",
        });
  
        return false;
      }
  
      return true;
    };

  const handleUpdate = async () => {
    if (!validateEmployeeForm()) {
      return;
    }
    try {
      const payload = {
        nik: editForm.nik,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        address: editForm.address,
        gender: editForm.gender,
        placeOfBirth: editForm.placeOfBirth,
        dateOfBirth: editForm.dateOfBirth,
        email: editForm.email,
        phone: editForm.phone,
        departmentId: Number(editForm.departmentId),
        jobTitleId: Number(editForm.jobTitleId),
        hireDate: editForm.hireDate,
      };

      const result = await EmployeeApi.update(employee.id, payload);

      if (result.success) {
        toast.add({
          type: "success",
          title: "Employee Updated",
          description: result.message,
        });

        setEditOpen(false);

        onUpdated();
      } else {
        toast.add({
          type: "error",
          title: "Update Failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md hover:bg-muted">
          <IconDotsVertical size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Detail Button */}
          <DropdownMenuItem onClick={handleDetail} disabled={loadingDetail}>
            {loadingDetail ? "Loading..." : "Detail"}
          </DropdownMenuItem>

          {/* Update Button */}
          <DropdownMenuItem onClick={handleEdit} disabled={loadingEdit}>
            {loadingEdit ? "Loading..." : "Edit"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete Button */}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Detail */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Detail Employee Profile</SheetTitle>
            <SheetDescription>
              View the details of the selected employee.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label>NIK</Label>
                  <Input disabled value={detailEmployee?.nik ?? ""} />
                </div>

                <div className="grid gap-3">
                  <Label>First Name</Label>
                  <Input disabled value={detailEmployee?.firstName ?? ""} />
                </div>

                <div className="grid gap-3">
                  <Label>Last Name</Label>
                  <Input disabled value={detailEmployee?.lastName ?? ""} />
                </div>

                <div className="grid gap-3">
                  <Label>Gender</Label>
                  <Input
                    disabled
                    value={
                      detailEmployee?.gender === "F"
                        ? "Female"
                        : detailEmployee?.gender === "M"
                          ? "Male"
                          : ""
                    }
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Place Of Birth</Label>
                  <Input disabled value={detailEmployee?.placeOfBirth ?? ""} />
                </div>

                <div className="grid gap-3">
                  <Label>Date Of Birth</Label>
                  <Input
                    disabled
                    value={
                      detailEmployee
                        ? formatDate(detailEmployee.dateOfBirth)
                        : ""
                    }
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Email</Label>
                  <Input disabled value={detailEmployee?.email ?? ""} />
                </div>

                <div className="grid gap-3">
                  <Label>Phone</Label>
                  <Input disabled value={detailEmployee?.phone ?? ""} />
                </div>

                <div className="grid gap-3">
                  <Label>Address</Label>
                  <Input disabled value={detailEmployee?.address ?? ""} />
                </div>

                <div className="grid gap-3">
                  <Label>Hire Date</Label>
                  <Input
                    disabled
                    value={
                      detailEmployee ? formatDate(detailEmployee.hireDate) : ""
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose render={<Button variant="outline">Close</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Edit Employee Profile</SheetTitle>
            <SheetDescription>
              Edit the details of the selected employee.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="grid gap-6">
              {/* First Name */}
              <div className="grid gap-3">
                <Label>First Name</Label>

                <Input
                  placeholder="Enter first name"
                  value={editForm.firstName}
                  onChange={(e) =>
                    handleEditChange("firstName", e.target.value)
                  }
                />
              </div>

              {/* Last Name */}
              <div className="grid gap-3">
                <Label>Last Name</Label>

                <Input
                  placeholder="Enter last name"
                  value={editForm.lastName}
                  onChange={(e) => handleEditChange("lastName", e.target.value)}
                />
              </div>

              {/* NIK */}
              <div className="grid gap-3">
                <Label>NIK</Label>

                <Input
                  placeholder="Enter NIK"
                  value={editForm.nik}
                  onChange={(e) => handleEditChange("nik", e.target.value)}
                />
              </div>

              {/* Department */}
              <div className="grid gap-3">
                <Label>Department</Label>

                <Select
                  value={editForm.departmentId}
                  onValueChange={(value) => {
                    handleEditChange("departmentId", value ?? "");

                    handleEditChange("jobTitleId", "");

                    fetchJobTitles(Number(value));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department">
                      {departments.find(
                        (d) => d.id.toString() === editForm.departmentId,
                      )?.departmentName ?? "Select Department"}
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
                  disabled={!editForm.departmentId}
                  value={editForm.jobTitleId}
                  onValueChange={(value) =>
                    handleEditChange("jobTitleId", value ?? "")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Job Title">
                      {
                        jobTitles.find(
                          (jobTitle) =>
                            jobTitle.id.toString() === editForm.jobTitleId,
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
                  value={editForm.gender}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({
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
                  value={editForm.placeOfBirth}
                  onChange={(e) =>
                    handleEditChange("placeOfBirth", e.target.value)
                  }
                />
              </div>

              {/* Date Of Birth */}
              <div className="grid gap-3">
                <Label>Date of Birth</Label>

                <Input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) =>
                    handleEditChange("dateOfBirth", e.target.value)
                  }
                />
              </div>

              {/* Hire Date */}
              <div className="grid gap-3">
                <Label>Hire Date</Label>

                <Input
                  type="date"
                  value={editForm.hireDate}
                  onChange={(e) => handleEditChange("hireDate", e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="grid gap-3">
                <Label>Address</Label>

                <Textarea
                  placeholder="Enter address"
                  value={editForm.address}
                  onChange={(e) => handleEditChange("address", e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="grid gap-3">
                <Label>Phone</Label>

                <Input
                  placeholder="Enter phone number"
                  value={editForm.phone}
                  onChange={(e) => handleEditChange("phone", e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label>Email</Label>

                <Input
                  type="email"
                  placeholder="Enter email"
                  value={editForm.email}
                  onChange={(e) => handleEditChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleUpdate}>Save changes</Button>
            <SheetClose render={<Button variant="outline">Close</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {employee.firstName} {employee.lastName}
              </strong>
              ?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />

            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
                setDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
