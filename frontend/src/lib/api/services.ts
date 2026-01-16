// Services API module

import { BaseApiClient, API_BASE_URL } from "./base";
import { Service, CreateServiceRequest, UpdateServiceRequest } from "@/types";

class ServicesApiClient extends BaseApiClient {
  async getAll(businessId: number): Promise<Service[]> {
    return this.request<Service[]>(`/api/businesses/${businessId}/services`);
  }

  async getById(businessId: number, serviceId: number): Promise<Service> {
    return this.request<Service>(`/api/businesses/${businessId}/services/${serviceId}`);
  }

  async create(businessId: number, data: CreateServiceRequest): Promise<Service> {
    return this.request<Service>(`/api/businesses/${businessId}/services`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(
    businessId: number,
    serviceId: number,
    data: UpdateServiceRequest
  ): Promise<Service> {
    return this.request<Service>(`/api/businesses/${businessId}/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(businessId: number, serviceId: number): Promise<void> {
    return this.request<void>(`/api/businesses/${businessId}/services/${serviceId}`, {
      method: "DELETE",
    });
  }
}

export const servicesApi = new ServicesApiClient(API_BASE_URL);
