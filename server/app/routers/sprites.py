from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
import uuid
from datetime import datetime

from ..database import get_db, Sprite as DBSprite
from ..models.sprite import SpriteCreate, SpriteResponse, SpriteUpdate

router = APIRouter()

@router.post("/", response_model=SpriteResponse)
async def create_sprite(sprite: SpriteCreate, db: Session = Depends(get_db)):
    """Create a new sprite"""
    db_sprite = DBSprite(
        id=str(uuid.uuid4()),
        name=sprite.name,
        width=sprite.width,
        height=sprite.height,
        data=json.dumps(sprite.data),
        colors=json.dumps(sprite.colors)
    )
    
    db.add(db_sprite)
    db.commit()
    db.refresh(db_sprite)
    
    return SpriteResponse(
        success=True,
        data={
            "id": db_sprite.id,
            "name": db_sprite.name,
            "width": db_sprite.width,
            "height": db_sprite.height,
            "data": json.loads(db_sprite.data),
            "colors": json.loads(db_sprite.colors),
            "created_at": db_sprite.created_at,
            "updated_at": db_sprite.updated_at
        }
    )

@router.get("/", response_model=List[SpriteResponse])
async def get_sprites(db: Session = Depends(get_db)):
    """Get all sprites"""
    sprites = db.query(DBSprite).all()
    return [
        SpriteResponse(
            success=True,
            data={
                "id": sprite.id,
                "name": sprite.name,
                "width": sprite.width,
                "height": sprite.height,
                "data": json.loads(sprite.data),
                "colors": json.loads(sprite.colors),
                "created_at": sprite.created_at,
                "updated_at": sprite.updated_at
            }
        ) for sprite in sprites
    ]

@router.get("/{sprite_id}", response_model=SpriteResponse)
async def get_sprite(sprite_id: str, db: Session = Depends(get_db)):
    """Get a specific sprite"""
    sprite = db.query(DBSprite).filter(DBSprite.id == sprite_id).first()
    if not sprite:
        raise HTTPException(status_code=404, detail="Sprite not found")
    
    return SpriteResponse(
        success=True,
        data={
            "id": sprite.id,
            "name": sprite.name,
            "width": sprite.width,
            "height": sprite.height,
            "data": json.loads(sprite.data),
            "colors": json.loads(sprite.colors),
            "created_at": sprite.created_at,
            "updated_at": sprite.updated_at
        }
    )

@router.put("/{sprite_id}", response_model=SpriteResponse)
async def update_sprite(sprite_id: str, sprite_update: SpriteUpdate, db: Session = Depends(get_db)):
    """Update a sprite"""
    sprite = db.query(DBSprite).filter(DBSprite.id == sprite_id).first()
    if not sprite:
        raise HTTPException(status_code=404, detail="Sprite not found")
    
    update_data = sprite_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field in ["data", "colors"] and value is not None:
            setattr(sprite, field, json.dumps(value))
        elif value is not None:
            setattr(sprite, field, value)
    
    sprite.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(sprite)
    
    return SpriteResponse(
        success=True,
        data={
            "id": sprite.id,
            "name": sprite.name,
            "width": sprite.width,
            "height": sprite.height,
            "data": json.loads(sprite.data),
            "colors": json.loads(sprite.colors),
            "created_at": sprite.created_at,
            "updated_at": sprite.updated_at
        }
    )

@router.delete("/{sprite_id}")
async def delete_sprite(sprite_id: str, db: Session = Depends(get_db)):
    """Delete a sprite"""
    sprite = db.query(DBSprite).filter(DBSprite.id == sprite_id).first()
    if not sprite:
        raise HTTPException(status_code=404, detail="Sprite not found")
    
    db.delete(sprite)
    db.commit()
    
    return {"success": True, "message": "Sprite deleted successfully"}
