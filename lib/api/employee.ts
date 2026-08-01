import api from "./axios";

export const EmployeeApi = {
  getAll: async () => {
    const response = await api.get("/Employee");

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