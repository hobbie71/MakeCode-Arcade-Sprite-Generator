import { IS_APPROPRIATE_API_URL } from "../constants/api";

export interface ModerationResponse {
  is_appropriate: boolean;
  flagged: boolean;
  categories: Record<string, boolean>;
  category_scores: Record<string, number>;
}

export const moderatePrompt = async (
  prompt: string
): Promise<ModerationResponse> => {
  const response = await fetch(IS_APPROPRIATE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`Text Moderation API Error: ${response.statusText}`);
  }

  return response.json();
};
