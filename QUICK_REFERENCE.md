# 🚀 Quick Reference Cheat Sheet

## 📁 File Structure At-a-Glance

```
Your Project/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI pieces
│   │   ├── services/       # API calls to backend
│   │   ├── types/          # TypeScript definitions
│   │   └── App/            # Main app
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Build tool config
│   └── tailwind.config.js  # CSS framework config
├── server/                  # Python Backend
│   ├── app/
│   │   ├── main.py         # API server entry point
│   │   ├── routers/        # API endpoints
│   │   └── models/         # Database schemas
│   ├── venv/               # Python virtual environment
│   └── requirements.txt    # Python dependencies
└── package.json            # Workspace manager
```

## 🔧 Essential Commands

### Starting Your Project

```bash
# Start both frontend and backend
npm run dev

# OR start them separately:
npm run dev:client    # Frontend only (port 3000)
npm run dev:server    # Backend only (port 8000)
```

### Working with Python

```bash
# Activate virtual environment
source server/venv/bin/activate

# Install new Python package
pip install package-name
pip freeze > server/requirements.txt  # Save to requirements
```

### Working with Node.js

```bash
# Install new npm package
cd client
npm install package-name

# Add to dev dependencies
npm install -D package-name
```

## 🌐 Important URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## 📝 Quick TypeScript Examples

### Define a Type

```typescript
interface Sprite {
  id: string;
  name: string;
  width: number;
  height: number;
  data: string[][];
}
```

### Use State in React

```tsx
import { useState } from "react";

function MyComponent() {
  const [sprites, setSprites] = useState<Sprite[]>([]);

  return <div>{sprites.length} sprites loaded</div>;
}
```

### Make API Call

```typescript
import { spriteAPI } from "@/services/api";

const loadSprites = async () => {
  try {
    const sprites = await spriteAPI.getAllSprites();
    setSprites(sprites);
  } catch (error) {
    console.error("Failed to load sprites:", error);
  }
};
```

## 🐍 Quick Python Examples

### Create API Endpoint

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/sprites")
async def get_sprites():
    return {"sprites": []}

@router.post("/sprites")
async def create_sprite(sprite_data: dict):
    # Save sprite logic here
    return {"success": True, "id": "new-sprite-id"}
```

### Database Model

```python
from sqlalchemy import Column, String, Integer

class Sprite(Base):
    __tablename__ = "sprites"

    id = Column(String, primary_key=True)
    name = Column(String)
    width = Column(Integer)
    height = Column(Integer)
```

## 🎨 Common TailwindCSS Classes

### Layout

- `flex` - Make flexbox container
- `grid` - Make grid container
- `w-full` - Full width
- `h-screen` - Full screen height
- `p-4` - Padding (1rem)
- `m-2` - Margin (0.5rem)

### Colors

- `bg-blue-500` - Blue background
- `text-white` - White text
- `border-gray-300` - Gray border

### Interactive

- `hover:bg-blue-700` - Darker blue on hover
- `cursor-pointer` - Pointer cursor
- `transition-colors` - Smooth color transitions

### Custom MakeCode Colors

- `bg-makecode-red` - MakeCode red
- `bg-makecode-blue` - MakeCode blue
- (See tailwind.config.js for all colors)

## 🔍 Debugging Tips

### Check if Server is Running

```bash
curl http://localhost:8000/api/health
# Should return: {"success": true, "status": "healthy"}
```

### Check Network Tab

1. Open browser dev tools (F12)
2. Go to Network tab
3. Make a request from your app
4. Check if API calls are succeeding

### Common Errors & Solutions

- **Port already in use**: Kill the process or use a different port
- **Module not found**: Check if dependencies are installed
- **CORS error**: Check if CORS is configured in FastAPI
- **TypeScript error**: Check type definitions match your data

## 📦 Key Dependencies Explained

### Frontend (client/package.json)

- **react** - UI library for building interfaces
- **typescript** - Type safety for JavaScript
- **vite** - Fast build tool and dev server
- **tailwindcss** - Utility-first CSS framework
- **axios** - HTTP client for API calls
- **react-router-dom** - Navigation between pages

### Backend (server/requirements.txt)

- **fastapi** - Python web framework
- **uvicorn** - ASGI server for running FastAPI
- **sqlalchemy** - Database ORM
- **pydantic** - Data validation
- **pillow** - Image processing library

## 🚨 When Things Break

### Frontend Won't Start

1. Check if Node.js is installed: `node --version`
2. Install dependencies: `cd client && npm install`
3. Check for TypeScript errors in terminal

### Backend Won't Start

1. Activate virtual environment: `source server/venv/bin/activate`
2. Install dependencies: `pip install -r server/requirements.txt`
3. Check Python version: `python --version` (needs 3.8+)

### API Calls Failing

1. Check if backend is running on port 8000
2. Check browser Network tab for error details
3. Verify API endpoint URLs in `client/src/services/api.ts`

## 💡 Learning Path Priority

1. **Start Here**: HTML/CSS basics, JavaScript fundamentals
2. **Then Learn**: React basics, TypeScript basics
3. **Next**: API concepts, HTTP methods (GET, POST, etc.)
4. **Advanced**: Database design, deployment, testing

Remember: **It's okay to not understand everything immediately!** Focus on one concept at a time and build up your knowledge gradually. 🎯
