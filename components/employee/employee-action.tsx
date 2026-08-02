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

import type { Employee } from "@/lib/types/employee";

interface Props {
  employee: Employee;
}

export function EmployeeActions({ employee }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md hover:bg-muted">
          <IconDotsVertical size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setDetailOpen(true);
            }}
          >
            Detail
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Detail Employee Profile</SheetTitle>
            <SheetDescription>
              View the details of the selected employee.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">First Name</Label>
                <Input
                  id="sheet-demo-name"
                  disabled
                  defaultValue={employee.firstName}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Last Name</Label>
                <Input
                  id="sheet-demo-username"
                  disabled
                  defaultValue={employee.lastName}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-email">Email</Label>
                <Input
                  id="sheet-demo-email"
                  disabled
                  defaultValue={employee.email}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-department">Department</Label>
                <Input
                  id="sheet-demo-department"
                  disabled
                  defaultValue={employee.department}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-jobtitle">Job Title</Label>
                <Input
                  id="sheet-demo-jobtitle"
                  disabled
                  defaultValue={employee.jobTitle}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-hiredate">Hire Date</Label>
                <Input
                  id="sheet-demo-hiredate"
                  disabled
                  defaultValue={formatDate(employee.hireDate)}
                />
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose render={<Button variant="outline">Close</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
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
    </>
  );
}
