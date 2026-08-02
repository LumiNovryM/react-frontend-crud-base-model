"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { EmployeeApi } from "@/lib/api/employee";
import type { Employee, EmployeePagination } from "@/lib/types/employee";
import { DepartmentApi } from "@/lib/api/department";
import type { Department } from "@/lib/types/department";

export default function Page() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<EmployeePagination | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        const result = await EmployeeApi.getAll({
          page,
          pageSize,
          search: debouncedSearch,
        });

        if (result.success) {
          setEmployees(result.data.data);
          setPagination(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchEmployees();
  }, [page, pageSize, debouncedSearch, refreshKey]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await DepartmentApi.getAll();

        if (result.success) {
          setDepartments(result.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    if (page !== 1) {
      setPage(1);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable
                data={employees}
                pagination={pagination}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                searchInput={searchInput}
                onSearchChange={handleSearchChange}
                departments={departments}
                onCreated={() => {
                  setRefreshKey((prev) => prev + 1);
                }}
                onDeleted={() => {
                  setRefreshKey((prev) => prev + 1);
                }}
                onUpdated={() => {
                  setRefreshKey((prev) => prev + 1);
                }}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
