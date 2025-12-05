# 👻 Haunted Wishify Designer

A spooky, interactive greeting card creator with multi-page book functionality and PDF export capabilities. Create haunting greetings, dark romance cards, and mystical messages with animated effects and professional export options.

## 🎃 Features

### 🎨 **Card Creation**
- **Template Library**: Halloween, Gothic, Birthday, Valentine, Christmas, and Anniversary themes
- **Real-time Editor**: Live preview with instant updates
- **Custom Text**: Editable main and sub-text with multiple font options
- **Color Schemes**: Pre-designed color palettes and custom color picker
- **Animated Effects**: Floating ghosts, confetti, hearts, snow, and mystical elements
- **Multiple Formats**: Square, landscape, portrait, and story formats

### 📚 **Multi-Page Books**
- **Page Management**: Add, delete, and reorder pages
- **Visual Navigation**: Thumbnail sidebar for easy page switching
- **Content Persistence**: Each page saves its own content, background, and settings
- **PDF Export**: Professional PDF generation with proper formatting
- **Page Thumbnails**: Visual previews of each page in the book

### 🔮 **Interactive Elements**
- **Drag & Drop**: Easy element placement and manipulation
- **Live Preview**: Real-time canvas updates
- **Zoom Controls**: Zoom in/out and fit-to-canvas options
- **Grid & Guides**: Alignment helpers for precise positioning
- **Properties Panel**: Context-sensitive editing options

### 🌙 **Spooky Themes**
- **Halloween**: Pumpkins, ghosts, bats, and spiders
- **Gothic**: Dark romance, black roses, and candlelight
- **Mystical**: Crystal balls, stars, and magical elements
- **Dark Magic**: Midnight spells and shadow effects

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs entirely in the browser

### Quick Start
1. Open `index.html` in your web browser
2. Select a template from the left panel
3. Customize text, colors, and effects
4. Click "👁️ Summon Preview" to see your creation
5. Export as image or create a multi-page book

## 📖 Usage Guide

### Creating Your First Card
1. **Choose Template**: Click on Templates (📚) in the left panel
2. **Select Category**: Pick from Halloween, Gothic, Birthday, etc.
3. **Customize Text**: Use the Text panel (🔤) to edit content
4. **Adjust Colors**: Use the Colors panel (🎨) for color schemes
5. **Add Elements**: Use Shapes (⬜), Emojis (😈), or Images (🖼️)
6. **Preview**: Click "Summon Preview" to see the final result

### Creating Multi-Page Books
1. **Create Initial Page**: Design your first page as normal
2. **Open Preview**: Click "👁️ Summon Preview"
3. **Start Book**: Click "📚 Create Book" in the preview modal
4. **Add Pages**: Use "+ Add Page" to create additional pages
5. **Navigate**: Click page thumbnails to switch between pages
6. **Export PDF**: Click "📄 Generate PDF Book" when finished

### Advanced Features
- **Layer Management**: Use the Layers panel (📋) to organize elements
- **Effects**: Apply sparkles, glow, shadows, and animations
- **Custom Images**: Upload your own images via the Images panel
- **Format Options**: Switch between different card dimensions

## 🎯 Panel System

### Primary Panels
- **📚 Templates**: Pre-designed card templates
- **🔤 Text**: Font selection and text editing tools
- **⬜ Shapes**: Geometric shapes and decorative elements
- **😈 Emojis**: Categorized emoji collection
- **🖼️ Images**: Image upload and stock graphics
- **🎨 Colors**: Color palettes and custom color picker
- **✨ Effects**: Animation and visual effects
- **📋 Layers**: Element organization and management

### Canvas Controls
- **Zoom**: +/- buttons for magnification control
- **Fit Canvas**: Auto-fit content to viewport
- **Grid Toggle**: Show/hide alignment grid
- **Guides**: Display positioning guides
- **Format Selector**: Change canvas dimensions

## 🔧 Technical Details

### Built With
- **Vanilla JavaScript**: No framework dependencies
- **HTML5 Canvas**: High-performance rendering
- **CSS3**: Modern styling with animations
- **html2canvas**: Canvas-to-image conversion
- **jsPDF**: PDF generation library

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### File Structure
```
haunted-wishify/
├── index.html              # Main application
├── css/
│   ├── wishify-designer.css # Main styles
│   └── panel-system.css     # Panel-specific styles
├── js/
│   ├── wishify-designer.js  # Core application logic
│   └── panel-manager.js     # Panel management system
└── README.md               # This file
```

## 🎨 Customization

### Adding New Templates
Templates are defined in the `loadTemplatesContent()` method in `panel-manager.js`. Add new template cards with:
```javascript
<div class="template-card" data-category="your-category">
    <div class="template-preview" style="background: your-gradient;">
        <h4>Your Title</h4>
        <p>Your subtitle</p>
    </div>
    <span class="template-name">Template Name</span>
</div>
```

### Custom Color Schemes
Add new color presets in the `loadColorsContent()` method:
```javascript
<div class="color-preset-card" data-bg="#color1" data-fg="#color2">
    <div class="preset-preview" style="background: linear-gradient(135deg, #color1, #color2);"></div>
    <span class="preset-name">Preset Name</span>
</div>
```

### New Animation Effects
Create custom animations by adding CSS keyframes and applying them in the template methods:
```css
@keyframes yourAnimation {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
}
```

## 📱 Responsive Design

The application adapts to different screen sizes:
- **Desktop**: Full panel layout with sidebar navigation
- **Tablet**: Collapsible panels for optimal space usage
- **Mobile**: Compact mode with essential controls

## 🔮 Export Options

### Single Card Export
- **PNG**: High-resolution raster image
- **Canvas**: Direct canvas download
- **Print-ready**: Optimized for physical printing

### Multi-Page Book Export
- **PDF**: Professional multi-page document
- **Individual Pages**: Separate image files
- **Custom Dimensions**: A4, Letter, or custom sizes

## 🎃 Themes & Categories

### Halloween Collection
- Spooky Halloween: Classic orange and black with ghosts
- Pumpkin Patch: Bright orange with pumpkin elements
- Spider's Web: Dark purple with web patterns
- Vampire Night: Deep red with bat animations

### Gothic Collection
- Dark Romance: Purple and black gradients
- Black Rose: Elegant dark florals
- Midnight Crypt: Cemetery-inspired designs
- Candlelight: Flickering flame effects

### Celebration Collection
- Birthday: Colorful party themes with confetti
- Valentine: Romantic pinks and reds with hearts
- Christmas: Festive greens with snow effects
- Anniversary: Elegant love-themed designs

## 🛠️ Development

### Local Development
1. Clone or download the project files
2. Open `index.html` in a web browser
3. No build process required - pure client-side application

### Adding Features
The modular architecture makes it easy to extend:
- **New Panels**: Add to `panel-manager.js`
- **Canvas Tools**: Extend `wishify-designer.js`
- **Styling**: Modify CSS files
- **Templates**: Update template definitions

## 🎯 Performance

### Optimization Features
- **Lazy Loading**: Templates load on demand
- **Canvas Caching**: Efficient rendering updates
- **Memory Management**: Automatic cleanup of animations
- **Responsive Images**: Optimized for different screen densities

## 🔒 Privacy & Security

- **Client-Side Only**: No data sent to external servers
- **Local Storage**: All content stays in your browser
- **No Tracking**: No analytics or user tracking
- **Offline Capable**: Works without internet connection

## 🎊 Contributing

This is a standalone project, but you can:
1. Fork the repository
2. Add new templates or features
3. Improve existing functionality
4. Share your custom themes

## 📄 License

This project is open source and available under the MIT License.

## 🎭 Credits

Created with love for the spooky season and beyond. Special thanks to:
- Font providers (Google Fonts)
- Icon libraries
- Open source JavaScript libraries
- The Halloween spirit that inspired this project

---

**Happy Haunting! 👻🎃**

*Create spine-chilling greetings that will haunt your recipients' memories forever...*