# MakeCode Arcade Sprite Generator

[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.5.0-blue.svg)](package.json)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009639?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?logo=python&logoColor=white)](https://python.org/)

A powerful, AI-enhanced sprite generation and editing tool specifically designed for MakeCode Arcade development. Transform images and text prompts into pixel-perfect sprites with multiple export options.

🚀 **Live Demo**: [makespritecode.com](https://makespritecode.com)

## 🎯 Features

### Core Functionality

- **Image to Sprite Conversion**: Upload any image and convert it to MakeCode Arcade-compatible sprites
- **AI Prompt-to-Sprite**: Generate sprites from natural language descriptions using advanced AI
- **Professional Sprite Editor**: Full-featured pixel art editor with advanced tools
- **Multi-format Export**: Export sprites as PNG images, JavaScript code, Python code, or MakeCode paste-ready format

## 🚀 Getting Started

### Live Application

Visit [makespritecode.com](https://makespritecode.com) to use the application directly in your browser. No installation required!

### Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your API keys
3. Install dependencies: `npm run setup`
4. Start development server: `npm run dev`

### Production Deployment (Render.com)

This project is deployed on [Render.com](https://render.com) with separate services for the FastAPI backend and React frontend.

#### Environment Variables

**Required environment variables:**

- `PIXELLAB_API_TOKEN` - Your PixelLab API token
- `OPENAI_API_TOKEN` - Your OpenAI API key
- `CORS_ORIGINS` - Allowed origins (e.g., `["https://makespritecode.com"]`)
- `ENVIRONMENT` - Set to `production`

#### Deployment Commands

- **Frontend Build**: `npm run build` (builds the React client)
- **Backend Start**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

The FastAPI server serves the API endpoints while the React frontend is served as static files.

## 🎨 Usage

### Image to Sprite Conversion

1. Upload your image using the file picker
2. Adjust conversion settings (size, color palette, dithering)
3. Preview the generated sprite
4. Export in your preferred format

### AI Sprite Generation

1. Enter a descriptive prompt (e.g., "a cute dragon breathing blue flames")
2. Configure generation parameters
3. Generate and refine the sprite
4. Export the final result

### Sprite Editor

1. Create a new sprite or load an existing one
2. Use the pixel art tools to edit
3. Apply filters and effects
4. Export in multiple formats

## 📊 Export Formats

### JavaScript Export

```javascript
const mySprite = sprites.create(
  img`
. . . . . . f f f f . . . . . . 
. . . . f f f 2 2 f f f . . . . 
. . . f f f 2 2 2 2 f f f . . . 
. . f f f e e e e e e f f f . . 
. . f f e 2 2 2 2 2 2 e e f . . 
. . f e 2 f f f f f f 2 e f . . 
. . f f f f e e e e f f f f . . 
. f f e f b f 4 4 f b f e f f . 
. f e e 4 1 f d d f 1 4 e e f . 
. . f e e d d d d d d e e f . . 
. . . f e e 4 4 4 4 e e f . . . 
. . e 4 f 2 2 2 2 2 2 f 4 e . . 
. . 4 d f 2 2 2 2 2 2 f d 4 . . 
. . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
. . . . . f f f f f f . . . . . 
. . . . . f f . . f f . . . . . 
`,
  SpriteKind.Player
);
```

### Python Export

```python
my_sprite = arcade_sprites.create_sprite("""
. . . . . . f f f f . . . . . .
. . . . f f f 2 2 f f f . . . .
. . . f f f 2 2 2 2 f f f . . .
. . f f f e e e e e e f f f . .
. . f f e 2 2 2 2 2 2 e e f . .
. . f e 2 f f f f f f 2 e f . .
. . f f f f e e e e f f f f . .
. f f e f b f 4 4 f b f e f f .
. f e e 4 1 f d d f 1 4 e e f .
. . f e e d d d d d d e e f . .
. . . f e e 4 4 4 4 e e f . . .
. . e 4 f 2 2 2 2 2 2 f 4 e . .
. . 4 d f 2 2 2 2 2 2 f d 4 . .
. . 4 4 f 4 4 5 5 4 4 f 4 4 . .
. . . . . f f f f f f . . . . .
. . . . . f f . . f f . . . . .
""", sprite_kind="Player")
```

### MakeCode Paste Format

```
img`
. . . . . . f f f f . . . . . .
. . . . f f f 2 2 f f f . . . .
. . . f f f 2 2 2 2 f f f . . .
. . f f f e e e e e e f f f . .
. . f f e 2 2 2 2 2 2 e e f . .
. . f e 2 f f f f f f 2 e f . .
. . f f f f e e e e f f f f . .
. f f e f b f 4 4 f b f e f f .
. f e e 4 1 f d d f 1 4 e e f .
. . f e e d d d d d d e e f . .
. . . f e e 4 4 4 4 e e f . . .
. . e 4 f 2 2 2 2 2 2 f 4 e . .
. . 4 d f 2 2 2 2 2 2 f d 4 . .
. . 4 4 f 4 4 5 5 4 4 f 4 4 . .
. . . . . f f f f f f . . . . .
. . . . . f f . . f f . . . . .
`
```

## 🏗️ Architecture

- **Frontend**: React 19 with TypeScript and Tailwind CSS
- **Backend**: FastAPI (Python) with async support
- **AI Integration**: OpenAI GPT models and PixelLab API
- **Deployment**: Render.com (separate frontend/backend services)

## 🤝 Contributing

This project is currently under private development. Contributions are not open to the public at this time.

## 📄 License & Usage Rights

**All Rights Reserved**

This software is proprietary and confidential. Unauthorized copying, distribution, modification, public display, or public performance of this software, via any medium, is strictly prohibited.

### Usage Restrictions

- **Commercial Use**: Prohibited without explicit written permission
- **Distribution**: Not permitted under any circumstances
- **Modification**: Not permitted without authorization
- **Private Use**: Permitted only for authorized individuals
- **Study**: Academic study permitted only with prior approval

### Authorized Use

Use of this software requires explicit written authorization from the copyright holder. For licensing inquiries, please contact the project owner.

**Copyright © 2025 hobbie71. All rights reserved.**

## 📞 Contact

For licensing inquiries, feature requests, or authorized collaboration:

- **GitHub**: [@hobbie71](https://github.com/hobbie71)
- **Project Repository**: [MakeCode-Arcade-Sprite-Generator](https://github.com/hobbie71/MakeCode-Arcade-Sprite-Generator)
- **Report an Issue**: [https://forms.gle/RMooZuywkBVUQwtw8](https://forms.gle/RMooZuywkBVUQwtw8)

## ⚠️ Disclaimer

This project is not affiliated with Microsoft Corporation or the official MakeCode Arcade platform. MakeCode Arcade is a trademark of Microsoft Corporation.

---

_Built with ❤️ for the MakeCode Arcade community_
