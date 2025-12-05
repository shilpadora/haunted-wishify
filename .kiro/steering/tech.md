# Technology Stack & Build System

## Core Technologies

### Frontend Stack
- **Vanilla JavaScript**: No framework dependencies for maximum performance and theme control
- **HTML5**: Modern semantic markup with Web Components
- **CSS3**: Advanced styling with custom properties, animations, and grid/flexbox layouts
- **Web APIs**: Canvas API, Web Audio API, HTML5 Drag & Drop API, Web Animations API

### Key Libraries
- **html2canvas**: Canvas-to-image conversion for export functionality
- **jsPDF**: PDF generation for multi-page books and print exports
- **IndexedDB**: Client-side storage for project persistence (planned)

### Audio & Visual Effects
- **Web Audio API**: Spatial audio effects and real-time processing
- **Canvas API**: Particle effects and custom rendering
- **CSS Animations**: Supernatural floating movements and glitch effects
- **Web Animations API**: Complex animation sequences

## Architecture Patterns

### Modular Class-Based Architecture
- Each major feature implemented as ES6 classes
- Clear separation of concerns between UI, logic, and effects
- Event-driven communication between modules

### Component System
- Base component interfaces for extensibility
- Theme-aware components with consistent Halloween aesthetic
- Drag-and-drop component library with categories

### Core Modules
- `BuilderEngine`: Main orchestrator coordinating all systems
- `CanvasManager`: Handles drag-and-drop and component placement
- `ComponentLibrary`: Manages available UI components
- `EffectsEngine`: Handles animations and visual effects
- `AudioManager`: Manages sound effects and ambient audio
- `ExportSystem`: Handles PDF/image generation and code export
- `PanelManager`: Manages UI panels and tool interactions

## File Structure Conventions

```
/
├── index.html              # Wishify Designer main app
├── index2.html             # Spooky Web Builder main app
├── css/
│   ├── wishify-designer.css    # Main Wishify styles
│   ├── panel-system.css        # Panel-specific styles
│   ├── themes.css              # Theme definitions
│   └── components.css          # Component-specific styles
├── js/
│   ├── app.js                  # Spooky Web Builder entry point
│   ├── wishify-designer.js     # Wishify Designer main logic
│   ├── panel-manager.js        # Panel management system
│   └── core/                   # Core engine modules
│       ├── builder-engine.js
│       ├── canvas-manager.js
│       ├── component-library.js
│       ├── effects-engine.js
│       ├── audio-manager.js
│       └── export-system.js
└── audio/                      # Audio assets and samples
```

## Development Workflow

### No Build Process Required
- Pure client-side application
- Open HTML files directly in browser for development
- No compilation or bundling steps needed

### Development Commands
```bash
# Start local development (any HTTP server)
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000

# Open applications
open http://localhost:8000/index.html      # Wishify Designer
open http://localhost:8000/index2.html     # Spooky Web Builder
```

### Testing
- Manual testing in browser
- Cross-browser compatibility testing required
- Performance testing for 60fps animations
- Audio synchronization testing

## CSS Architecture

### CSS Custom Properties (Variables)
- Consistent color palette using CSS variables
- Theme-aware property definitions
- Easy theme switching capability

### Component-Scoped Styling
- BEM-like naming conventions for clarity
- Scoped styles to prevent conflicts
- Modular CSS organization

### Animation Performance
- Hardware-accelerated transforms
- RequestAnimationFrame for smooth animations
- CSS animations preferred over JavaScript for performance

## Browser Compatibility

### Minimum Requirements
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Web Components support required
- Web Audio API support for full experience
- Canvas API support for visual effects

### Progressive Enhancement
- Graceful degradation for older browsers
- Feature detection for advanced capabilities
- Fallbacks for unsupported audio formats

## Performance Considerations

### Optimization Strategies
- Lazy loading of audio assets
- Component virtualization for large projects
- Animation frame throttling
- Memory management for particle systems
- Asset compression and CDN delivery

### Performance Targets
- 60fps animation performance
- Audio latency under 50ms
- Component rendering under 100ms
- Export generation under 5 seconds