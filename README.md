# MakeCode Arcade Sprite Generator

[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.5.0-blue.svg)](package.json)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A powerful, AI-enhanced sprite generation and editing tool specifically designed for MakeCode Arcade development. Transform images and text prompts into pixel-perfect sprites with multiple export options.

## 🎯 Features

### Core Functionality

- **Image to Sprite Conversion**: Upload any image and convert it to MakeCode Arcade-compatible sprites
- **AI Prompt-to-Sprite**: Generate sprites from natural language descriptions using advanced AI
- **Professional Sprite Editor**: Full-featured pixel art editor with advanced tools
- **Multi-format Export**: Export sprites as PNG images, JavaScript code, Python code, or MakeCode paste-ready format

### Advanced Capabilities

- **Animation Generation**: Create animated sprites and character movement sequences
- **Smart Resizing**: Automatic sprite sizing optimization for MakeCode Arcade
- **Color Palette Management**: MakeCode Arcade color palette enforcement
- **Preview Integration**: Real-time preview in MakeCode Arcade style
- **Export Optimization**: Optimized code generation for performance

## 🚀 Getting Started

This project is currently in early development. Check back soon for usage instructions and demos!

### Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your API keys
3. Run `npm run setup` to install dependencies
4. Run `npm run dev` to start the development server

### Production Deployment

This project is configured for deployment on platforms like Railway, Render, or Heroku.

#### Environment Variables

Make sure to set these environment variables in your deployment platform:

```bash
PIXELLAB_API_TOKEN=your_pixellab_api_token
OPENAI_API_TOKEN=your_openai_api_token
CORS_ORIGINS=["https://yourdomain.com"]
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production
```

#### Deployment Commands

The project includes these npm scripts for deployment:

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your API keys
3. Run `npm run setup` to install dependencies
4. Run `npm run dev` to start the development server, or use the included `dev.sh` script:

```bash
./dev.sh
```

- `npm start`: Production start command (builds client and starts server)
- `npm run build`: Build the client application
- `npm run setup`: Install all dependencies (client and server)

#### Platform-Specific Instructions

**Railway/Railpack:**

- The project includes a `Procfile` and `start.sh` script
- Ensure you have a `start` script in your package.json (✅ included)
- Set environment variables in your Railway dashboard

**Heroku:**

- Use the Node.js buildpack
- Set environment variables in the Heroku dashboard
- The app will automatically use the PORT environment variable

**Render:**

- Use Node.js environment
- Build command: `npm run build`
- Start command: `npm start`

## 🎨 Usage

### Image to Sprite Conversion

1. Upload your image using the file picker
2. Adjust conversion settings (size, color palette, dithering)
3. Preview the generated sprite
4. Export in your preferred format

### AI Sprite Generation

1. Enter a descriptive prompt (e.g., "8-bit style spaceship with blue flames")
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

- The project includes a `Procfile` and `start.sh` script
- Ensure you have a `start` script in your package.json (✅ included)
- Set environment variables in your Railway dashboard
- **Set the Start Command to `./start.sh` in your Railway project settings.**

# Create sprite with default character model

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

img`. . . . . . f f f f . . . . . .
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
. . . . . f f . . f f . . . . .`

```

## Development Roadmap

### Phase 1: Core MVP (Essential Foundation)

**Priority: Critical - Must have for basic functionality**

#### Version 0.1.0 - Basic Sprite Editor

- [x] Project initialization and setup
- [x] **Canvas-based pixel editor** (multi-size grid support)
- [x] **Basic drawing tools** (pencil, eraser)
- [x] **MakeCode color palette** (16 colors) integration
- [x] **Real-time preview** of sprite changes
- [x] **PNG export** functionality

#### Version 0.2.0 - MakeCode Integration

- [x] **MakeCode paste format export** (highest priority for users)
- [x] **JavaScript code export** with sprites.create()
- [x] **Copy to clipboard** functionality
- [x] **Grid size selection**
- [x] **Zoom controls** for precise editing

### Phase 2: Image Processing (High Value Features)

**Priority: High - Significantly increases utility**

#### Version 0.3.0 - Image Import & Conversion

- [x] **Image upload** (PNG, JPG)
- [x] **Automatic resizing** to MakeCode dimensions
- [x] **Color quantization** to MakeCode palette
- [ ] ~~**Dithering options** for better image quality~~ <br> <sub><sup>_Canceled: Not applicable due to the fixed 15-color palette limitation of MakeCode Arcade._</sup></sub>
- [ ] ~~**Multiple conversion algorithms** (nearest neighbor, bilinear)~~ <br> <sub><sup>_Canceled: Not applicable due to the fixed 15-color palette limitation of MakeCode Arcade._</sup></sub>

#### Version 0.4.0 - Smart Processing

- [x] **Edge detection** for cleaner sprite conversion
- [x] **Background removal** tools
- [x] **Contrast/brightness** adjustment
- [x] **Preview comparison** (original vs converted)
- [ ] **Batch size processing** (multiple dimensions at once) <br> <sub><sup>_Put on Hold: MVP first before quality of life features_</sup></sub>

### Phase 3: AI Integration (Differentiating Feature)

**Priority: High - Unique selling point**

#### Version 0.5.0 - AI Sprite Generation

- [x] **Text-to-sprite AI model** integration
- [x] **Style selection** (pixel art, 8-bit, retro)
- [x] **Prompt engineering** interface
- [ ] **Multiple generation attempts** per prompt <br> <sub><sup>_Put on Hold: MVP first before quality of life features_</sup></sub>
- [ ] **AI result refinement** tools <br> <sub><sup>_Put on Hold: MVP first before quality of life features_</sup></sub>

#### Version 0.6.0 - Advanced AI Features

- [ ] **Style transfer** (apply existing sprite styles)
- [ ] **Sprite variation generation**
- [ ] **Character pose generation** (walking, jumping, etc.)
- [ ] **AI-powered upscaling** for low-res inputs
- [ ] **Intelligent color palette** suggestions

### Phase 4: Professional Tools (Quality of Life)

**Priority: Medium - Professional workflow features**

#### Version 0.7.0 - Advanced Editing

- [ ] **Layer system** for complex sprites
- [ ] **Undo/Redo system** (unlimited history)
- [ ] **Selection tools** (rectangle, line, fill bucket, etc)
- [ ] **Copy/paste** between sprites
- [ ] **Transformation tools** (rotate, flip, scale)

#### Version 0.8.0 - Animation Support

- [ ] **Frame-based animation** editor
- [ ] **Onion skinning** for animation preview
- [ ] **Timeline controls** (play, pause, frame rate)
- [ ] **Animation export** (GIF, sprite sheets)
- [ ] **Loop configuration** and preview

### Phase 5: Workflow Enhancement (Nice to Have)

**Priority: Low-Medium - Productivity features**

#### Version 0.9.0 - Project Management

- [ ] **Save/Load projects** (local storage)
- [ ] **Sprite library** management
- [ ] **Export presets** (custom settings)
- [ ] **Keyboard shortcuts** for power users
- [ ] **Recent files** quick access

#### Version 1.0.0 - Polish & Performance

- [ ] **Cloud save** functionality (optional)
- [ ] **Collaboration features** (share sprites)
- [ ] **Performance optimization** (large sprite handling)
- [ ] **Mobile responsive** design
- [ ] **Comprehensive tutorials** and documentation

### Phase 6: Advanced Features (Future Enhancements)

**Priority: Low - Advanced use cases**

#### Version 1.1.0+ - Pro Features

- [ ] **Custom color palettes** beyond MakeCode
- [ ] **Vector sprite** support
- [ ] **Plugin system** for custom tools
- [ ] **API integration** with MakeCode Arcade
- [ ] **Sprite analytics** (size optimization, performance tips)
- [ ] **Community gallery** (with authorization system)
- [ ] **Advanced AI models** (custom training)
- [ ] **Batch automation** (scripted processing)

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

## ⚠️ Disclaimer

This project is not affiliated with Microsoft Corporation or the official MakeCode Arcade platform. MakeCode Arcade is a trademark of Microsoft Corporation.

---

_Built with ❤️ for the MakeCode Arcade community_
```
