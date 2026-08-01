import api from "./axios";

import type { ApiResponse } from "@/lib/types/api";
import type { EmployeePagination } from "@/lib/types/employee";

export const EmployeeApi = {
  getAll: async ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<ApiResponse<EmployeePagination>> => {

    const response =
      await api.get<ApiResponse<EmployeePagination>>(
        "/Employee",
        {
          params: {
            page,
            pageSize,
          },
        }
      );

    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/Employee/${id}`);

    return response.data;
  },

  create: async (payload: unknown) => {
    const response = await api.post("/Employee", payload);

    return response.data;
  },

  update: async (id: number, payload: unknown) => {
    const response = await api.put(`/Employee/${id}`, payload);

    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/Employee/${id}`);

    return response.data;
  },
};