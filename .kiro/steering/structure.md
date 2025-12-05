# Project Structure & Organization

## Root Directory Layout

```
haunted-wishify/
├── index.html                    # Main Wishify Designer application
├── index2.html                   # Spooky Web Builder application
├── README.md                     # Project documentation
├── LICENSE                       # MIT license file
├── .DS_Store                     # macOS system file (ignore)
├── .git/                         # Git repository data
├── .kiro/                        # Kiro AI assistant configuration
├── .vscode/                      # VS Code workspace settings
├── audio/                        # Audio assets and samples
├── css/                          # Stylesheets and themes
├── js/                           # JavaScript modules and logic
└── [test-*.html]                 # Development test files
```

## Application Entry Points

### Primary Applications
- **`index.html`**: Haunted Wishify Designer (greeting card creator)
- **`index2.html`**: Spooky Web Builder (website builder)

### Development/Test Files
- `debug-builder.html`: Builder debugging interface
- `design-studio-showcase.html`: Design system showcase
- `figma-spooky.html`: Figma integration prototype
- `retro-landing.html`: Retro landing page demo
- `test-*.html`: Various feature testing pages

## CSS Organization

```
css/
├── main.css                      # Base styles and resets
├── themes.css                    # Theme definitions and variables
├── components.css                # Reusable component styles
├── wishify-designer.css          # Wishify Designer specific styles
├── panel-system.css              # Panel management system styles
├── figma-spooky.css             # Figma integration styles
└── retro-landing.css            # Retro landing page styles
```

### CSS Architecture Principles
- **CSS Custom Properties**: Extensive use of CSS variables for theming
- **Component-Scoped**: Each major UI component has dedicated styles
- **Theme-Aware**: All styles support the spooky Halloween aesthetic
- **Performance-Optimized**: Hardware-accelerated animations and transforms

## JavaScript Architecture

```
js/
├── app.js                        # Spooky Web Builder main entry point
├── wishify-designer.js           # Wishify Designer main class
├── panel-manager.js              # UI panel management system
├── figma-spooky.js              # Figma integration logic
├── retro-landing.js             # Retro landing page controller
└── core/                        # Core engine modules
    ├── audio-manager.js         # Audio system and effects
    ├── builder-engine.js        # Main builder orchestrator
    ├── canvas-manager.js        # Canvas and drag-drop handling
    ├── component-library.js     # Component definitions and library
    ├── effects-engine.js        # Animation and visual effects
    └── export-system.js         # Export and generation system
```

### Module Organization Principles
- **Class-Based Architecture**: Each module is an ES6 class with clear responsibilities
- **Dependency Injection**: Core modules receive dependencies through constructor
- **Event-Driven**: Modules communicate through custom events and callbacks
- **Modular Loading**: Scripts loaded in dependency order in HTML

## Audio Assets

```
audio/
├── README.md                     # Audio system documentation
└── placeholder.txt               # Placeholder for future audio files
```

### Planned Audio Structure
- `ghost-sounds/`: Supernatural audio effects (whispers, chains, creaks)
- `ambient/`: Background atmospheric loops
- `ui-sounds/`: Interface interaction sounds
- `music/`: Retro cassette player tracks

## Configuration & Settings

```
.kiro/
├── settings/                     # Kiro AI configuration
├── specs/                       # Project specifications
│   └── spooky-web-builder/
│       ├── requirements.md      # Detailed requirements
│       ├── design.md           # Architecture and design
│       └── tasks.md            # Implementation tasks
└── steering/                    # AI guidance documents
    ├── product.md              # Product overview
    ├── tech.md                 # Technology stack
    └── structure.md            # This file
```

## Naming Conventions

### File Naming
- **HTML Files**: kebab-case with descriptive names (`test-builder.html`)
- **CSS Files**: kebab-case matching their purpose (`panel-system.css`)
- **JavaScript Files**: kebab-case for modules (`canvas-manager.js`)
- **Classes**: PascalCase (`WishifyDesigner`, `BuilderEngine`)

### CSS Classes
- **Components**: `.component-name` (e.g., `.greeting-canvas`, `.tool-icon`)
- **States**: `.is-active`, `.is-hidden`, `.is-loading`
- **Modifiers**: `.component--modifier` (e.g., `.button--primary`)
- **Utilities**: `.u-text-center`, `.u-hidden`

### JavaScript Conventions
- **Variables**: camelCase (`currentTemplate`, `zoomLevel`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_THEME`, `MAX_ZOOM`)
- **Methods**: camelCase with descriptive verbs (`loadTemplate`, `applyTheme`)
- **Event Handlers**: `on` prefix (`onClick`, `onDragStart`)

## Component Organization

### UI Component Categories
1. **Templates**: Pre-designed card/page templates
2. **Text**: Typography and text editing tools
3. **Shapes**: Geometric shapes and decorative elements
4. **Emojis**: Categorized emoji collections
5. **Images**: Image upload and stock graphics
6. **Colors**: Color palettes and custom picker
7. **Effects**: Animation and visual effects
8. **Layers**: Element organization and management

### Component File Structure
- Each component type has dedicated methods in `panel-manager.js`
- Component definitions stored in `js/core/component-library.js`
- Component-specific styles in `css/components.css`

## Development Workflow

### Local Development
1. Clone repository
2. Start local HTTP server (no build process required)
3. Open `index.html` or `index2.html` in browser
4. Make changes and refresh browser

### File Dependencies
- HTML files load CSS and JS in specific order
- Core modules must be loaded before application classes
- External libraries (html2canvas, jsPDF) loaded via CDN

### Testing Strategy
- Manual testing using test HTML files
- Cross-browser compatibility testing
- Performance testing for animations and audio
- Export functionality testing

## Asset Management

### Static Assets
- **Fonts**: Loaded from Google Fonts CDN
- **Icons**: Unicode emojis and CSS-based icons
- **Images**: Inline SVG and CSS gradients preferred
- **Audio**: Web-optimized formats (WebM, OGG, MP3 fallbacks)

### Dynamic Assets
- **User Uploads**: Handled via File API
- **Generated Content**: Canvas-based rendering
- **Exports**: Client-side generation (no server required)