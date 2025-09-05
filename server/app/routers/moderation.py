from fastapi import APIRouter
from app.models.schemas import ModerationRequest, ModerationResponse
from app.services.openai_services import OpenAIServices

router = APIRouter()

@router.post("/moderate", response_model=ModerationResponse)
async def moderate_prompt(request: ModerationRequest):
    openai = OpenAIServices()
    moderation = await openai.get_moderate_prompt(request.prompt)
    flagged = moderation.results[0].flagged
    categories = moderation.results[0].categories
    category_scores = moderation.results[0].category_scores

    # Only flag for violence if score is above 0.5
    violence_score = getattr(category_scores, "violence", 0)
    custom_flagged = flagged

    if getattr(categories, "violence", False) and violence_score < 0.5:
        custom_flagged = False

    return {
        "is_appropriate": not custom_flagged,
        "flagged": custom_flagged,
        "categories": categories.dict(),
        "category_scores": category_scores.dict(),
    }