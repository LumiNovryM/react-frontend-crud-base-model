import api from "./axios";

import type { ApiResponse } from "@/lib/types/api";
import type { JobTitle } from "@/lib/types/jobtitle";

export const JobTitleApi = {
  getByDepartment: async (
    departmentId: number
  ): Promise<ApiResponse<JobTitle[]>> => {

    const response = await api.get<ApiResponse<JobTitle[]>>(
      `/Employee/${departmentId}`
    );

    return response.data;
  },
};