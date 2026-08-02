"use client";

import { useState } from "react";

import { IconDotsVertical } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

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
} from "@/components/ui/sheet";

import type { Employee } from "@/lib/types/employee";

interface Props {
  employee: Employee;
}

export function EmployeeActions({ employee }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md hover:bg-muted">
          <IconDotsVertical size={18} />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            Detail
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Detail Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detail Employee Profile</SheetTitle>
            <SheetDescription>
              View the details of the selected employee.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
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
                defaultValue={employee.hireDate}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
