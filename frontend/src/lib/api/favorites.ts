// Favorites API module

import { BaseApiClient, API_BASE_URL } from "./base";
import { BusinessSummary, PageResponse } from "@/types";

class FavoritesApiClient extends BaseApiClient {
  async getMy(page = 0, size = 20): Promise<PageResponse<BusinessSummary>> {
    return this.request<PageResponse<BusinessSummary>>(
      `/api/favorites?page=${page}&size=${size}`
    );
  }

  async getAll(): Promise<BusinessSummary[]> {
    return this.request<BusinessSummary[]>("/api/favorites/all");
  }

  async getIds(): Promise<number[]> {
    return this.request<number[]>("/api/favorites/ids");
  }

  async check(businessId: number): Promise<boolean> {
    const result = await this.request<{ is_favorite: boolean }>(
      `/api/favorites/check/${businessId}`
    );
    return result.is_favorite;
  }

  async add(businessId: number): Promise<void> {
    return this.request<void>(`/api/favorites/${businessId}`, {
      method: "POST",
    });
  }

  async remove(businessId: number): Promise<void> {
    return this.request<void>(`/api/favorites/${businessId}`, {
      method: "DELETE",
    });
  }

  async toggle(businessId: number): Promise<{ isFavorite: boolean }> {
    const result = await this.request<{ is_favorite: boolean }>(
      `/api/favorites/${businessId}/toggle`,
      { method: "POST" }
    );
    return { isFavorite: result.is_favorite };
  }
}

export const favoritesApi = new FavoritesApiClient(API_BASE_URL);
