import api from "./axios";

import type { ApiResponse } from "@/lib/types/api";
import type { Department } from "@/lib/types/department";

export const DepartmentApi = {
  getAll: async (): Promise<ApiResponse<Department[]>> => {
    const response = await api.get<ApiResponse<Department[]>>(
      "/Department"
    );

    return response.data;
  },
};