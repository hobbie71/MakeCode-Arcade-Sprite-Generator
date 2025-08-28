// Get the base URL from environment variables, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://0.0.0.0:8000";

export const GENERATE_PIXELLAB_IMAGE_API_URL = `${API_BASE_URL}/generate-image/pixellab`;
export const GENERATE_OPENAI_IMAGE_API_URL = `${API_BASE_URL}/generate-image/openai`;
