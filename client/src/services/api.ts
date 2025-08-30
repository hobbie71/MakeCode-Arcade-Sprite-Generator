import axios from "axios";
import type {
  APIResponse,
  Sprite,
  AIPrompt,
  AIGenerationResult,
  ImageConversionOptions,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for AI operations
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const spriteAPI = {
  // AI Generation
  generateFromPrompt: async (prompt: AIPrompt): Promise<AIGenerationResult> => {
    const response = await api.post<APIResponse<AIGenerationResult>>(
      "/api/ai/generate",
      prompt
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to generate sprite");
    }
    return response.data.data!;
  },

  // Image Conversion
  convertImage: async (
    imageFile: File,
    options: ImageConversionOptions
  ): Promise<Sprite> => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("options", JSON.stringify(options));

    const response = await api.post<APIResponse<Sprite>>(
      "/api/convert/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to convert image");
    }
    return response.data.data!;
  },

  // Sprite Management
  saveSprite: async (
    sprite: Omit<Sprite, "id" | "createdAt" | "updatedAt">
  ): Promise<Sprite> => {
    const response = await api.post<APIResponse<Sprite>>(
      "/api/sprites",
      sprite
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to save sprite");
    }
    return response.data.data!;
  },

  getSprites: async (): Promise<Sprite[]> => {
    const response = await api.get<APIResponse<Sprite[]>>("/api/sprites");
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch sprites");
    }
    return response.data.data!;
  },

  getSprite: async (id: string): Promise<Sprite> => {
    const response = await api.get<APIResponse<Sprite>>(`/api/sprites/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch sprite");
    }
    return response.data.data!;
  },

  updateSprite: async (
    id: string,
    updates: Partial<Sprite>
  ): Promise<Sprite> => {
    const response = await api.put<APIResponse<Sprite>>(
      `/api/sprites/${id}`,
      updates
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update sprite");
    }
    return response.data.data!;
  },

  deleteSprite: async (id: string): Promise<void> => {
    const response = await api.delete<APIResponse<void>>(`/api/sprites/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete sprite");
    }
  },

  // Export
  exportSprite: async (spriteId: string, format: string): Promise<Blob> => {
    const response = await api.get(
      `/api/sprites/${spriteId}/export/${format}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await api.get("/api/health");
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

export default api;
