// Workers API module

import { BaseApiClient, API_BASE_URL } from "./base";
import { Worker, CreateWorkerRequest, WorkerScheduleRequest } from "@/types";

class WorkersApiClient extends BaseApiClient {
  async getAll(businessId: number): Promise<Worker[]> {
    return this.request<Worker[]>(`/api/businesses/${businessId}/workers`);
  }

  async getById(businessId: number, workerId: number): Promise<Worker> {
    return this.request<Worker>(`/api/businesses/${businessId}/workers/${workerId}`);
  }

  async add(businessId: number, data: CreateWorkerRequest): Promise<Worker> {
    return this.request<Worker>(`/api/businesses/${businessId}/workers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async remove(businessId: number, workerId: number): Promise<void> {
    return this.request<void>(`/api/businesses/${businessId}/workers/${workerId}`, {
      method: "DELETE",
    });
  }

  async getMyProfiles(): Promise<Worker[]> {
    return this.request<Worker[]>("/api/workers/me");
  }

  async setSchedule(
    businessId: number,
    workerId: number,
    schedules: WorkerScheduleRequest[]
  ): Promise<Worker> {
    return this.request<Worker>(`/api/businesses/${businessId}/workers/${workerId}/schedule`, {
      method: "PUT",
      body: JSON.stringify(schedules),
    });
  }
}

export const workersApi = new WorkersApiClient(API_BASE_URL);
