// Get the base URL from environment variables
// In production, use relative URLs since the API and client are served from the same domain
// In development, use localhost:8000
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:8000");

export const GENERATE_PIXELLAB_IMAGE_API_URL = `${API_BASE_URL}/generate-image/pixellab`;
export const GENERATE_OPENAI_IMAGE_API_URL = `${API_BASE_URL}/generate-image/openai`;
