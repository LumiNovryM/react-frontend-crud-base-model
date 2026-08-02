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

import { EmployeeApi } from "@/lib/api/employee";

interface Props {
  employee: Employee;
  onDeleted: () => void;
}

export function EmployeeActions({ employee, onDeleted }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<EmployeeDetail | null>(
    null,
  );

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
          <DropdownMenuItem
            onClick={() => {
              setEditOpen(true);
            }}
          >
            Edit
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
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">First Name</Label>
                <Input id="sheet-demo-name" defaultValue={employee.firstName} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Last Name</Label>
                <Input
                  id="sheet-demo-username"
                  defaultValue={employee.lastName}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-email">Email</Label>
                <Input id="sheet-demo-email" defaultValue={employee.email} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-department">Department</Label>
                <Input
                  id="sheet-demo-department"
                  defaultValue={employee.department}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-jobtitle">Job Title</Label>
                <Input
                  id="sheet-demo-jobtitle"
                  defaultValue={employee.jobTitle}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-hiredate">Hire Date</Label>
                <Input
                  id="sheet-demo-hiredate"
                  defaultValue={formatDate(employee.hireDate)}
                />
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
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
