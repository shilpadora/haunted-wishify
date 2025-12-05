// Enhanced Panel Management System
class PanelManager {
    constructor() {
        this.secondaryPanel = document.getElementById('secondary-panel');
        this.panelTitle = document.getElementById('panel-title');
        this.panelContent = document.getElementById('panel-content');
        this.collapseBtn = document.getElementById('panel-collapse');

        this.propertiesPanel = document.getElementById('properties-panel');
        this.propertiesTitle = document.getElementById('properties-title');
        this.propertiesContent = document.getElementById('properties-content');
        this.propertiesCollapseBtn = document.getElementById('properties-collapse');

        this.mainContent = document.querySelector('.designer-main');
        this.currentCategory = null;
        this.selectedObject = null;
        this.canvasObjects = []; // Track all objects on canvas
        this.objectCounter = 0; // For unique IDs

        this.initializeEventListeners();
        this.initializeCanvasToolbar();
        this.loadEmptyState();
        this.setDefaultCanvasBackground();

        // Auto-open templates panel to match the design
        setTimeout(() => {
            this.autoOpenTemplates();
        }, 500);

        // Setup export button
        this.setupExportButton();
    }

    setDefaultCanvasBackground() {
        const canvas = document.querySelector('.canvas-background');
        if (canvas) {
            // Set a default spooky background
            canvas.style.background = 'linear-gradient(135deg, #2d1b69, #11052c)';
            canvas.style.setProperty('background', 'linear-gradient(135deg, #2d1b69, #11052c)', 'important');
            console.log('Default background set on canvas:', canvas);
        } else {
            console.log('Canvas background element not found!');
        }
    }

    initializeEventListeners() {
        // Primary panel icon clicks
        document.querySelectorAll('.tool-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const categoryType = icon.getAttribute('data-category');
                this.openCategory(categoryType);

                // Update active state
                document.querySelectorAll('.tool-icon').forEach(ic => ic.classList.remove('active'));
                icon.classList.add('active');
            });
        });

        // Secondary panel collapse button
        if (this.collapseBtn) {
            this.collapseBtn.addEventListener('click', () => {
                this.closeSecondaryPanel();
            });
        }

        // Properties panel collapse button
        if (this.propertiesCollapseBtn) {
            this.propertiesCollapseBtn.addEventListener('click', () => {
                this.closePropertiesPanel();
            });
        }

        // Content tab filtering
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('content-tab')) {
                this.handleTabClick(e.target);
            }
        });

        // Template, font, color, shape, emoji, image selections
        document.addEventListener('click', (e) => {
            if (e.target.closest('.template-card')) {
                this.handleTemplateSelection(e.target.closest('.template-card'));
            } else if (e.target.closest('.font-card')) {
                this.handleFontSelection(e.target.closest('.font-card'));
            } else if (e.target.closest('.color-preset-card')) {
                this.handleColorSelection(e.target.closest('.color-preset-card'));
            } else if (e.target.closest('.shape-card')) {
                this.handleShapeSelection(e.target.closest('.shape-card'));
            } else if (e.target.closest('.emoji-card')) {
                this.handleEmojiSelection(e.target.closest('.emoji-card'));
            } else if (e.target.closest('.image-card')) {
                this.handleImageSelection(e.target.closest('.image-card'));
            }
        });

        // Canvas object clicks for properties
        document.addEventListener('click', (e) => {
            if (e.target.closest('.greeting-text') ||
                e.target.closest('.canvas-shape') ||
                e.target.closest('.canvas-emoji') ||
                e.target.closest('.canvas-image')) {
                const element = e.target.closest('.greeting-text, .canvas-shape, .canvas-emoji, .canvas-image');
                this.selectObject(element);
                this.openPropertiesPanel();
                e.stopPropagation();
            }
        });

        // Color pickers
        document.addEventListener('change', (e) => {
            if (e.target.id === 'bg-color-picker') {
                this.handleBackgroundColorChange(e.target.value);
            } else if (e.target.id === 'text-color-picker') {
                this.handleTextColorChange(e.target.value);
            }
        });
    }

    openCategory(categoryType) {
        this.currentCategory = categoryType;
        this.loadCategoryContent(categoryType);

        // Update panel title
        const titles = {
            'templates': '📚 Templates',
            'text': '🔤 Text & Fonts',
            'colors': '🎨 Colors',
            'shapes': '⬜ Shapes',
            'emojis': '😈 Emojis',
            'images': '🖼️ Images',
            'effects': '✨ Effects',
            'layers': '📋 Layers'
        };

        if (this.panelTitle) {
            this.panelTitle.textContent = titles[categoryType] || categoryType;
        }

        // Open the secondary panel
        this.openSecondaryPanel();
    }

    loadCategoryContent(categoryType) {
        if (!this.panelContent) return;

        // Clear current content
        this.panelContent.innerHTML = '';

        // Load content based on category
        switch (categoryType) {
            case 'templates':
                this.loadTemplatesContent();
                break;
            case 'text':
                this.loadTextContent();
                break;
            case 'colors':
                this.loadColorsContent();
                break;
            case 'shapes':
                this.loadShapesContent();
                break;
            case 'emojis':
                this.loadEmojisContent();
                break;
            case 'images':
                this.loadImagesContent();
                break;
            case 'effects':
                this.loadEffectsContent();
                break;
            case 'layers':
                this.loadLayersContent();
                break;
            default:
                this.loadEmptyState();
        }
    }

    loadTemplatesContent() {
        this.panelContent.innerHTML = `
            <div class="category-content">
                <div class="content-tabs">
                    <button class="content-tab active" data-filter="all">All</button>
                    <button class="content-tab" data-filter="halloween">🎃 Halloween</button>
                    <button class="content-tab" data-filter="birthday">🎂 Birthday</button>
                    <button class="content-tab" data-filter="gothic">🖤 Gothic</button>
                    <button class="content-tab" data-filter="valentine">💝 Valentine</button>
                    <button class="content-tab" data-filter="christmas">🎄 Christmas</button>
                </div>
                <div class="templates-grid">
                    <!-- Halloween Templates -->
                    <!-- Halloween Templates -->
                    <div class="template-card" data-category="halloween">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ff6b35, #8b0000);">
                            <h4>👻 Spooky Halloween</h4>
                            <p>Boo-tiful wishes!</p>
                        </div>
                        <span class="template-name">Spooky Halloween</span>
                    </div>
                    <div class="template-card" data-category="halloween">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ff6b00, #000000);">
                            <h4>🎃 Pumpkin Patch</h4>
                            <p>Orange you excited?</p>
                        </div>
                        <span class="template-name">Pumpkin Patch</span>
                    </div>
                    <div class="template-card" data-category="halloween">
                        <div class="template-preview" style="background: linear-gradient(135deg, #4a0e4e, #000000);">
                            <h4>🕷️ Spider's Web</h4>
                            <p>Caught in darkness</p>
                        </div>
                        <span class="template-name">Spider's Web</span>
                    </div>
                    <div class="template-card" data-category="halloween">
                        <div class="template-preview" style="background: linear-gradient(135deg, #2d1b69, #8b0000);">
                            <h4>🦇 Vampire Night</h4>
                            <p>Eternal darkness</p>
                        </div>
                        <span class="template-name">Vampire Night</span>
                    </div>
                    
                    <!-- Birthday Templates -->
                    <div class="template-card" data-category="birthday">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ff6b9d, #f093fb);">
                            <h4>🎂 Happy Birthday</h4>
                            <p>Make a wish!</p>
                        </div>
                        <span class="template-name">Birthday Celebration</span>
                    </div>
                    <div class="template-card" data-category="birthday">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ff9a9e, #fecfef);">
                            <h4>🎉 Party Time</h4>
                            <p>Let's celebrate!</p>
                        </div>
                        <span class="template-name">Party Time</span>
                    </div>
                    <div class="template-card" data-category="birthday">
                        <div class="template-preview" style="background: linear-gradient(135deg, #a8edea, #fed6e3);">
                            <h4>🎈 Balloon Fun</h4>
                            <p>Up, up and away!</p>
                        </div>
                        <span class="template-name">Balloon Fun</span>
                    </div>
                    <div class="template-card" data-category="birthday">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ffecd2, #fcb69f);">
                            <h4>🍰 Sweet Treats</h4>
                            <p>Delicious wishes</p>
                        </div>
                        <span class="template-name">Sweet Treats</span>
                    </div>
                    
                    <!-- Gothic Templates -->
                    <div class="template-card" data-category="gothic">
                        <div class="template-preview" style="background: linear-gradient(135deg, #2d1b69, #11052c);">
                            <h4>🖤 Dark Romance</h4>
                            <p>Eternal love...</p>
                        </div>
                        <span class="template-name">Dark Romance</span>
                    </div>
                    <div class="template-card" data-category="gothic">
                        <div class="template-preview" style="background: linear-gradient(135deg, #1a1a2e, #16213e);">
                            <h4>🌹 Black Rose</h4>
                            <p>Beauty in shadows</p>
                        </div>
                        <span class="template-name">Black Rose</span>
                    </div>
                    <div class="template-card" data-category="gothic">
                        <div class="template-preview" style="background: linear-gradient(135deg, #0f0f23, #2d1b69);">
                            <h4>⚰️ Midnight Crypt</h4>
                            <p>Rest in elegance</p>
                        </div>
                        <span class="template-name">Midnight Crypt</span>
                    </div>
                    <div class="template-card" data-category="gothic">
                        <div class="template-preview" style="background: linear-gradient(135deg, #434343, #000000);">
                            <h4>🕯️ Candlelight</h4>
                            <p>Flickering shadows</p>
                        </div>
                        <span class="template-name">Candlelight</span>
                    </div>
                    
                    <!-- Valentine Templates -->
                    <div class="template-card" data-category="valentine">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ff6b9d, #c44569);">
                            <h4>💝 Be My Valentine</h4>
                            <p>With all my love</p>
                        </div>
                        <span class="template-name">Be My Valentine</span>
                    </div>
                    <div class="template-card" data-category="valentine">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ff7675, #fd79a8);">
                            <h4>💕 Love Letter</h4>
                            <p>From my heart</p>
                        </div>
                        <span class="template-name">Love Letter</span>
                    </div>
                    <div class="template-card" data-category="valentine">
                        <div class="template-preview" style="background: linear-gradient(135deg, #fab1a0, #e17055);">
                            <h4>💖 Sweet Love</h4>
                            <p>You're my everything</p>
                        </div>
                        <span class="template-name">Sweet Love</span>
                    </div>
                    <div class="template-card" data-category="valentine">
                        <div class="template-preview" style="background: linear-gradient(135deg, #fd79a8, #fdcb6e);">
                            <h4>💘 Cupid's Arrow</h4>
                            <p>Love struck</p>
                        </div>
                        <span class="template-name">Cupid's Arrow</span>
                    </div>
                    
                    <!-- Anniversary Templates -->
                    <div class="template-card" data-category="anniversary">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ff7675, #fd79a8);">
                            <h4>💕 Happy Anniversary</h4>
                            <p>Years of love</p>
                        </div>
                        <span class="template-name">Love Anniversary</span>
                    </div>
                    <div class="template-card" data-category="anniversary">
                        <div class="template-preview" style="background: linear-gradient(135deg, #ff6b9d, #f093fb);">
                            <h4>💖 Floating Hearts</h4>
                            <p>Romantic animation</p>
                        </div>
                        <span class="template-name">Floating Hearts</span>
                    </div>
                    
                    <!-- Christmas Templates -->
                    <div class="template-card" data-category="christmas">
                        <div class="template-preview" style="background: linear-gradient(135deg, #00b894, #00cec9);">
                            <h4>🎄 Merry Christmas</h4>
                            <p>Joy and peace</p>
                        </div>
                        <span class="template-name">Merry Christmas</span>
                    </div>
                    <div class="template-card" data-category="christmas">
                        <div class="template-preview" style="background: linear-gradient(135deg, #e17055, #fdcb6e);">
                            <h4>🎅 Santa's Visit</h4>
                            <p>Ho ho ho!</p>
                        </div>
                        <span class="template-name">Santa's Visit</span>
                    </div>
                    <div class="template-card" data-category="christmas">
                        <div class="template-preview" style="background: linear-gradient(135deg, #74b9ff, #0984e3);">
                            <h4>❄️ Winter Wonder</h4>
                            <p>Let it snow</p>
                        </div>
                        <span class="template-name">Winter Wonder</span>
                    </div>
                    <div class="template-card" data-category="christmas">
                        <div class="template-preview" style="background: linear-gradient(135deg, #a29bfe, #6c5ce7);">
                            <h4>🎁 Gift Season</h4>
                            <p>Wrapped with love</p>
                        </div>
                        <span class="template-name">Gift Season</span>
                    </div>
                </div>
            </div>
        `;
    }

    loadTextContent() {
        this.panelContent.innerHTML = `
            <div class="category-content">
                <div class="text-tools">
                    <div class="tool-section">
                        <h4>Add Text</h4>
                        <button class="add-text-btn" data-text-type="heading">Add Heading</button>
                        <button class="add-text-btn" data-text-type="subtitle">Add Subtitle</button>
                        <button class="add-text-btn" data-text-type="body">Add Body Text</button>
                    </div>
                    
                    <div class="tool-section">
                        <h4>Font Families</h4>
                        <div class="fonts-list">
                            <div class="font-card" data-font="Creepster">
                                <div class="font-preview" style="font-family: 'Creepster', cursive;">Creepster</div>
                            </div>
                            <div class="font-card" data-font="Dancing Script">
                                <div class="font-preview" style="font-family: 'Dancing Script', cursive;">Dancing Script</div>
                            </div>
                            <div class="font-card" data-font="Playfair Display">
                                <div class="font-preview" style="font-family: 'Playfair Display', serif;">Playfair Display</div>
                            </div>
                            <div class="font-card" data-font="Poppins">
                                <div class="font-preview" style="font-family: 'Poppins', sans-serif;">Poppins</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for text tools
        this.panelContent.querySelectorAll('.add-text-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const textType = btn.getAttribute('data-text-type');
                this.addTextElement(textType);
            });
        });
    }

    loadColorsContent() {
        this.panelContent.innerHTML = `
            <div class="category-content">
                <div class="color-section">
                    <h4>Card Background & Text Colors</h4>
                    <div class="color-pickers">
                        <div class="color-picker-item">
                            <label>Card Background</label>
                            <input type="color" id="bg-color-picker" value="#2d1b69">
                        </div>
                        <div class="color-picker-item">
                            <label>Text Color</label>
                            <input type="color" id="text-color-picker" value="#ffffff">
                        </div>
                    </div>
                </div>
                <div class="color-section">
                    <h4>Color Presets</h4>
                    <div class="color-presets-grid">
                        <div class="color-preset-card" data-bg="#8b0000" data-fg="#ff6b9d">
                            <div class="preset-preview" style="background: linear-gradient(135deg, #8b0000, #ff6b9d);"></div>
                            <span class="preset-name">Dark Red</span>
                        </div>
                        <div class="color-preset-card" data-bg="#ff6b9d" data-fg="#c44569">
                            <div class="preset-preview" style="background: linear-gradient(135deg, #ff6b9d, #c44569);"></div>
                            <span class="preset-name">Spooky Pink</span>
                        </div>
                        <div class="color-preset-card" data-bg="#2d1b69" data-fg="#6c5ce7">
                            <div class="preset-preview" style="background: linear-gradient(135deg, #2d1b69, #6c5ce7);"></div>
                            <span class="preset-name">Gothic Purple</span>
                        </div>
                        <div class="color-preset-card" data-bg="#ff6b00" data-fg="#fdcb6e">
                            <div class="preset-preview" style="background: linear-gradient(135deg, #ff6b00, #fdcb6e);"></div>
                            <span class="preset-name">Halloween Orange</span>
                        </div>
                        <div class="color-preset-card" data-bg="#ff7675" data-fg="#fd79a8">
                            <div class="preset-preview" style="background: linear-gradient(135deg, #ff7675, #fd79a8);"></div>
                            <span class="preset-name">Pink Love</span>
                        </div>
                        <div class="color-preset-card" data-bg="#00b894" data-fg="#00cec9">
                            <div class="preset-preview" style="background: linear-gradient(135deg, #00b894, #00cec9);"></div>
                            <span class="preset-name">Christmas Green</span>
                        </div>
                        <div class="color-preset-card" data-bg="#8b4513" data-fg="#daa520">
                            <div class="preset-preview" style="background: linear-gradient(135deg, #8b4513, #daa520);"></div>
                            <span class="preset-name">Spooky Brown</span>
                        </div>
                        <div class="color-preset-card" data-bg="#2f1b14" data-fg="#8b4513">
                            <div class="preset-preview" style="background: linear-gradient(135deg, #2f1b14, #8b4513);"></div>
                            <span class="preset-name">Dark Earth</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadShapesContent() {
        this.panelContent.innerHTML = `
            <div class="category-content">
                <div class="shapes-grid">
                    <div class="shape-card" data-shape="rectangle">
                        <div class="shape-icon">⬜</div>
                        <span class="shape-name">Rectangle</span>
                    </div>
                    <div class="shape-card" data-shape="circle">
                        <div class="shape-icon">⭕</div>
                        <span class="shape-name">Circle</span>
                    </div>
                    <div class="shape-card" data-shape="star">
                        <div class="shape-icon">⭐</div>
                        <span class="shape-name">Star</span>
                    </div>
                    <div class="shape-card" data-shape="heart">
                        <div class="shape-icon">💖</div>
                        <span class="shape-name">Heart</span>
                    </div>
                    <div class="shape-card" data-shape="triangle">
                        <div class="shape-icon">🔺</div>
                        <span class="shape-name">Triangle</span>
                    </div>
                    <div class="shape-card" data-shape="diamond">
                        <div class="shape-icon">💎</div>
                        <span class="shape-name">Diamond</span>
                    </div>
                    <div class="shape-card" data-shape="moon">
                        <div class="shape-icon">🌙</div>
                        <span class="shape-name">Moon</span>
                    </div>
                    <div class="shape-card" data-shape="sun">
                        <div class="shape-icon">☀️</div>
                        <span class="shape-name">Sun</span>
                    </div>
                </div>
            </div>
        `;
    }

    loadEmojisContent() {
        this.panelContent.innerHTML = `
            <div class="category-content">
                <div class="content-tabs">
                    <button class="content-tab active" data-filter="halloween">🎃 Halloween</button>
                    <button class="content-tab" data-filter="gothic">🖤 Gothic</button>
                    <button class="content-tab" data-filter="cute">💕 Cute</button>
                    <button class="content-tab" data-filter="nature">🌙 Nature</button>
                    <button class="content-tab" data-filter="celebration">🎉 Party</button>
                </div>
                <div class="emojis-grid">
                    <div class="emoji-card" data-emoji="👻" data-category="halloween">👻</div>
                    <div class="emoji-card" data-emoji="🎃" data-category="halloween">🎃</div>
                    <div class="emoji-card" data-emoji="💀" data-category="halloween">💀</div>
                    <div class="emoji-card" data-emoji="🕷️" data-category="halloween">🕷️</div>
                    <div class="emoji-card" data-emoji="🦇" data-category="halloween">🦇</div>
                    <div class="emoji-card" data-emoji="🧙‍♀️" data-category="halloween">🧙‍♀️</div>
                    <div class="emoji-card" data-emoji="⚰️" data-category="gothic">⚰️</div>
                    <div class="emoji-card" data-emoji="🔮" data-category="gothic">🔮</div>
                    <div class="emoji-card" data-emoji="🖤" data-category="gothic">🖤</div>
                    <div class="emoji-card" data-emoji="🥀" data-category="gothic">🥀</div>
                    <div class="emoji-card" data-emoji="🕯️" data-category="gothic">🕯️</div>
                    <div class="emoji-card" data-emoji="⚡" data-category="gothic">⚡</div>
                    <div class="emoji-card" data-emoji="💕" data-category="cute">💕</div>
                    <div class="emoji-card" data-emoji="✨" data-category="cute">✨</div>
                    <div class="emoji-card" data-emoji="💖" data-category="cute">💖</div>
                    <div class="emoji-card" data-emoji="🌟" data-category="cute">🌟</div>
                    <div class="emoji-card" data-emoji="💫" data-category="cute">💫</div>
                    <div class="emoji-card" data-emoji="🦄" data-category="cute">🦄</div>
                    <div class="emoji-card" data-emoji="🌙" data-category="nature">🌙</div>
                    <div class="emoji-card" data-emoji="⭐" data-category="nature">⭐</div>
                    <div class="emoji-card" data-emoji="🌸" data-category="nature">🌸</div>
                    <div class="emoji-card" data-emoji="🌺" data-category="nature">🌺</div>
                    <div class="emoji-card" data-emoji="🍃" data-category="nature">🍃</div>
                    <div class="emoji-card" data-emoji="🌿" data-category="nature">🌿</div>
                    <div class="emoji-card" data-emoji="🎉" data-category="celebration">🎉</div>
                    <div class="emoji-card" data-emoji="🎊" data-category="celebration">🎊</div>
                    <div class="emoji-card" data-emoji="🎈" data-category="celebration">🎈</div>
                    <div class="emoji-card" data-emoji="🎂" data-category="celebration">🎂</div>
                    <div class="emoji-card" data-emoji="🍰" data-category="celebration">🍰</div>
                    <div class="emoji-card" data-emoji="🎁" data-category="celebration">🎁</div>
                </div>
            </div>
        `;
    }

    loadImagesContent() {
        this.panelContent.innerHTML = `
            <div class="category-content">
                <div class="upload-section">
                    <div class="upload-area" id="image-upload-area">
                        <input type="file" id="image-upload" accept="image/*" multiple hidden>
                        <div class="upload-content">
                            <span class="upload-icon">📸</span>
                            <p>Drop images here or click to upload</p>
                            <span class="upload-hint">PNG, JPG, GIF up to 10MB</span>
                        </div>
                    </div>
                </div>
                <div class="stock-images">
                    <h4>Stock Images</h4>
                    <div class="images-grid">
                        <div class="image-card" data-image="halloween-bg" data-bg="linear-gradient(135deg, #ff6b35, #8b0000)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #ff6b35, #8b0000); display: flex; align-items: center; justify-content: center; font-size: 24px;">🎃</div>
                            <span class="image-name">Halloween BG</span>
                        </div>
                        <div class="image-card" data-image="pumpkin-bg" data-bg="linear-gradient(135deg, #ff6b00, #000000)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #ff6b00, #000000); display: flex; align-items: center; justify-content: center; font-size: 24px;">🎃</div>
                            <span class="image-name">Pumpkin BG</span>
                        </div>
                        <div class="image-card" data-image="spider-bg" data-bg="linear-gradient(135deg, #4a0e4e, #000000)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #4a0e4e, #000000); display: flex; align-items: center; justify-content: center; font-size: 24px;">🕷️</div>
                            <span class="image-name">Spider BG</span>
                        </div>
                        <div class="image-card" data-image="vampire-bg" data-bg="linear-gradient(135deg, #2d1b69, #8b0000)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #2d1b69, #8b0000); display: flex; align-items: center; justify-content: center; font-size: 24px;">🦇</div>
                            <span class="image-name">Vampire BG</span>
                        </div>
                        <div class="image-card" data-image="gothic-bg" data-bg="linear-gradient(135deg, #2d1b69, #11052c)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #2d1b69, #11052c); display: flex; align-items: center; justify-content: center; font-size: 24px;">🖤</div>
                            <span class="image-name">Gothic BG</span>
                        </div>
                        <div class="image-card" data-image="black-rose-bg" data-bg="linear-gradient(135deg, #1a1a2e, #16213e)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #1a1a2e, #16213e); display: flex; align-items: center; justify-content: center; font-size: 24px;">🌹</div>
                            <span class="image-name">Black Rose BG</span>
                        </div>
                        <div class="image-card" data-image="birthday-bg" data-bg="linear-gradient(135deg, #ff6b9d, #f093fb)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #ff6b9d, #f093fb); display: flex; align-items: center; justify-content: center; font-size: 24px;">🎂</div>
                            <span class="image-name">Birthday BG</span>
                        </div>
                        <div class="image-card" data-image="party-bg" data-bg="linear-gradient(135deg, #ff9a9e, #fecfef)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #ff9a9e, #fecfef); display: flex; align-items: center; justify-content: center; font-size: 24px;">🎉</div>
                            <span class="image-name">Party BG</span>
                        </div>
                        <div class="image-card" data-image="valentine-bg" data-bg="linear-gradient(135deg, #ff6b9d, #c44569)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #ff6b9d, #c44569); display: flex; align-items: center; justify-content: center; font-size: 24px;">💝</div>
                            <span class="image-name">Valentine BG</span>
                        </div>
                        <div class="image-card" data-image="christmas-bg" data-bg="linear-gradient(135deg, #00b894, #00cec9)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #00b894, #00cec9); display: flex; align-items: center; justify-content: center; font-size: 24px;">🎄</div>
                            <span class="image-name">Christmas BG</span>
                        </div>
                        <div class="image-card" data-image="anniversary-bg" data-bg="linear-gradient(135deg, #ff7675, #fd79a8)">
                            <div class="image-preview" style="background: linear-gradient(135deg, #ff7675, #fd79a8); display: flex; align-items: center; justify-content: center; font-size: 24px;">💕</div>
                            <span class="image-name">Anniversary BG</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Setup image upload
        const uploadArea = this.panelContent.querySelector('#image-upload-area');
        const fileInput = this.panelContent.querySelector('#image-upload');

        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                this.handleImageUpload(e.dataTransfer.files);
            });
            fileInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files);
            });
        }

        // Add event listeners for stock image selection
        this.panelContent.querySelectorAll('.image-card').forEach(card => {
            card.addEventListener('click', () => {
                const bgGradient = card.getAttribute('data-bg');
                if (bgGradient) {
                    this.applyBackgroundFromImage(bgGradient);
                    // Visual feedback
                    this.panelContent.querySelectorAll('.image-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                }
            });
        });
    }

    loadEffectsContent() {
        this.panelContent.innerHTML = `
            <div class="category-content">
                <div class="effects-section">
                    <h4>Visual Effects</h4>
                    <div class="effects-grid">
                        <div class="effect-card" data-effect="sparkle">
                            <div class="effect-icon">✨</div>
                            <span class="effect-name">Sparkle</span>
                        </div>
                        <div class="effect-card" data-effect="glow">
                            <div class="effect-icon">🌟</div>
                            <span class="effect-name">Glow</span>
                        </div>
                        <div class="effect-card" data-effect="shadow">
                            <div class="effect-icon">🌑</div>
                            <span class="effect-name">Shadow</span>
                        </div>
                        <div class="effect-card" data-effect="blur">
                            <div class="effect-icon">💫</div>
                            <span class="effect-name">Blur</span>
                        </div>
                    </div>
                </div>
                <div class="animations-section">
                    <h4>Animations</h4>
                    <div class="effects-grid">
                        <div class="effect-card" data-effect="float">
                            <div class="effect-icon">🎈</div>
                            <span class="effect-name">Float</span>
                        </div>
                        <div class="effect-card" data-effect="pulse">
                            <div class="effect-icon">💓</div>
                            <span class="effect-name">Pulse</span>
                        </div>
                        <div class="effect-card" data-effect="rotate">
                            <div class="effect-icon">🌀</div>
                            <span class="effect-name">Rotate</span>
                        </div>
                        <div class="effect-card" data-effect="bounce">
                            <div class="effect-icon">⚡</div>
                            <span class="effect-name">Bounce</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadLayersContent() {
        this.panelContent.innerHTML = `
            <div class="category-content">
                <div class="layers-section">
                    <div class="layers-header">
                        <h4>Canvas Objects</h4>
                        <button class="clear-all-btn" id="clear-all-layers">Clear All</button>
                    </div>
                    <div class="layers-list" id="layers-list">
                        <div class="empty-layers">
                            <span class="empty-icon">📄</span>
                            <p>No objects on canvas</p>
                        </div>
                    </div>
                </div>
                <div class="layer-controls">
                    <button class="layer-control-btn" id="bring-to-front" title="Bring to Front">⬆️</button>
                    <button class="layer-control-btn" id="send-to-back" title="Send to Back">⬇️</button>
                    <button class="layer-control-btn" id="duplicate-layer" title="Duplicate">📋</button>
                    <button class="layer-control-btn" id="delete-layer" title="Delete">🗑️</button>
                </div>
            </div>
        `;

        // Initialize layer controls
        this.initializeLayerControls();
        this.updateLayersList();
    }

    loadEmptyState() {
        if (!this.panelContent) return;
        this.panelContent.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">👆</span>
                <p>Click an icon from the left panel to see options</p>
            </div>
        `;
    }

    // Panel Management
    openSecondaryPanel() {
        if (this.secondaryPanel) {
            this.secondaryPanel.classList.add('open');
        }
        if (this.mainContent) {
            this.mainContent.classList.add('secondary-open');
        }
    }

    closeSecondaryPanel() {
        if (this.secondaryPanel) {
            this.secondaryPanel.classList.remove('open');
        }
        if (this.mainContent) {
            this.mainContent.classList.remove('secondary-open');
        }

        // Remove active state from icons
        document.querySelectorAll('.tool-icon').forEach(icon => icon.classList.remove('active'));
    }

    openPropertiesPanel() {
        if (this.propertiesPanel) {
            this.propertiesPanel.classList.add('open');
        }
        if (this.mainContent) {
            this.mainContent.classList.add('properties-open');
        }
    }

    closePropertiesPanel() {
        if (this.propertiesPanel) {
            this.propertiesPanel.classList.remove('open');
        }
        if (this.mainContent) {
            this.mainContent.classList.remove('properties-open');
        }

        // Clear selected object
        this.selectedObject = null;
        this.clearObjectSelection();
    }

    // Object Selection and Properties
    selectObject(element) {
        // Clear previous selection
        if (this.selectedObject) {
            this.selectedObject.style.outline = 'none';
        }

        this.selectedObject = element;
        this.highlightSelectedObject(element);
        this.openPropertiesPanel();

        // Update layers list to show selection
        if (this.currentCategory === 'layers') {
            this.updateLayersList();
        }
    }

    showObjectProperties(element) {
        if (!this.propertiesContent) return;

        const elementType = this.getElementType(element);

        this.propertiesTitle.textContent = `Properties - ${elementType}`;

        if (element.classList.contains('greeting-text')) {
            this.showTextProperties(element);
        } else if (element.classList.contains('canvas-shape')) {
            this.showShapeProperties(element);
        } else if (element.classList.contains('canvas-emoji')) {
            this.showEmojiProperties(element);
        } else if (element.classList.contains('canvas-image')) {
            this.showImageProperties(element);
        }
    }

    showTextProperties(textElement) {
        this.propertiesContent.innerHTML = `
            <div class="properties-content">
                <div class="property-group">
                    <label>Text Content</label>
                    <textarea class="text-content-input" rows="3">${textElement.textContent}</textarea>
                </div>
                
                <div class="property-group">
                    <label>Font Family</label>
                    <select class="font-family-select">
                        <option value="Dancing Script">Dancing Script</option>
                        <option value="Creepster">Creepster</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Poppins">Poppins</option>
                    </select>
                </div>
                
                <div class="property-group">
                    <label>Font Size</label>
                    <input type="range" class="font-size-slider" min="12" max="72" value="24">
                    <span class="font-size-value">24px</span>
                </div>
                
                <div class="property-group">
                    <label>Text Color</label>
                    <input type="color" class="text-color-input" value="#ffffff">
                </div>
                
                <div class="property-group">
                    <label>Text Style</label>
                    <div class="style-buttons">
                        <button class="style-btn" data-style="bold">B</button>
                        <button class="style-btn" data-style="italic">I</button>
                        <button class="style-btn" data-style="underline">U</button>
                    </div>
                </div>
                
                <div class="property-group">
                    <button class="delete-btn">Delete Text</button>
                </div>
            </div>
        `;

        this.setupTextPropertyListeners(textElement);
    }

    showShapeProperties(shapeElement) {
        this.propertiesContent.innerHTML = `
            <div class="properties-content">
                <div class="property-group">
                    <label>Size</label>
                    <input type="range" class="size-slider" min="16" max="80" value="32">
                    <span class="size-value">32px</span>
                </div>
                
                <div class="property-group">
                    <label>Rotation</label>
                    <input type="range" class="rotation-slider" min="0" max="360" value="0">
                    <span class="rotation-value">0°</span>
                </div>
                
                <div class="property-group">
                    <label>Opacity</label>
                    <input type="range" class="opacity-slider" min="0" max="100" value="100">
                    <span class="opacity-value">100%</span>
                </div>
                
                <div class="property-group">
                    <button class="delete-btn">Delete Shape</button>
                </div>
            </div>
        `;

        this.setupShapePropertyListeners(shapeElement);
    }

    showEmojiProperties(emojiElement) {
        this.propertiesContent.innerHTML = `
            <div class="properties-content">
                <div class="property-group">
                    <label>Size</label>
                    <input type="range" class="size-slider" min="16" max="80" value="28">
                    <span class="size-value">28px</span>
                </div>
                
                <div class="property-group">
                    <label>Rotation</label>
                    <input type="range" class="rotation-slider" min="0" max="360" value="0">
                    <span class="rotation-value">0°</span>
                </div>
                
                <div class="property-group">
                    <button class="delete-btn">Delete Emoji</button>
                </div>
            </div>
        `;

        this.setupEmojiPropertyListeners(emojiElement);
    }

    getElementType(element) {
        if (element.classList.contains('greeting-text')) return 'Text';
        if (element.classList.contains('canvas-shape')) return 'Shape';
        if (element.classList.contains('canvas-emoji')) return 'Emoji';
        if (element.classList.contains('canvas-image')) return 'Image';
        return 'Element';
    }

    highlightSelectedObject(element) {
        // Remove previous highlights
        this.clearObjectSelection();

        // Add highlight to selected object
        element.classList.add('selected-object');
    }

    clearObjectSelection() {
        document.querySelectorAll('.selected-object').forEach(el => {
            el.classList.remove('selected-object');
        });
    }

    // Property Event Listeners
    setupTextPropertyListeners(textElement) {
        const content = this.propertiesContent;

        content.querySelector('.text-content-input').addEventListener('input', (e) => {
            textElement.textContent = e.target.value;
        });

        content.querySelector('.font-family-select').addEventListener('change', (e) => {
            textElement.style.fontFamily = `'${e.target.value}', cursive`;
        });

        content.querySelector('.font-size-slider').addEventListener('input', (e) => {
            textElement.style.fontSize = e.target.value + 'px';
            content.querySelector('.font-size-value').textContent = e.target.value + 'px';
        });

        content.querySelector('.text-color-input').addEventListener('change', (e) => {
            textElement.style.color = e.target.value;
        });

        content.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                const style = btn.getAttribute('data-style');
                this.applyTextStyle(textElement, style, btn.classList.contains('active'));
            });
        });

        content.querySelector('.delete-btn').addEventListener('click', () => {
            textElement.remove();
            this.closePropertiesPanel();
        });
    }

    setupShapePropertyListeners(shapeElement) {
        const content = this.propertiesContent;

        content.querySelector('.size-slider').addEventListener('input', (e) => {
            shapeElement.style.fontSize = e.target.value + 'px';
            content.querySelector('.size-value').textContent = e.target.value + 'px';
        });

        content.querySelector('.rotation-slider').addEventListener('input', (e) => {
            shapeElement.style.transform = `rotate(${e.target.value}deg)`;
            content.querySelector('.rotation-value').textContent = e.target.value + '°';
        });

        content.querySelector('.opacity-slider').addEventListener('input', (e) => {
            shapeElement.style.opacity = e.target.value / 100;
            content.querySelector('.opacity-value').textContent = e.target.value + '%';
        });

        content.querySelector('.delete-btn').addEventListener('click', () => {
            shapeElement.remove();
            this.closePropertiesPanel();
        });
    }

    setupEmojiPropertyListeners(emojiElement) {
        const content = this.propertiesContent;

        content.querySelector('.size-slider').addEventListener('input', (e) => {
            emojiElement.style.fontSize = e.target.value + 'px';
            content.querySelector('.size-value').textContent = e.target.value + 'px';
        });

        content.querySelector('.rotation-slider').addEventListener('input', (e) => {
            emojiElement.style.transform = `rotate(${e.target.value}deg)`;
            content.querySelector('.rotation-value').textContent = e.target.value + '°';
        });

        content.querySelector('.delete-btn').addEventListener('click', () => {
            emojiElement.remove();
            this.closePropertiesPanel();
        });
    }

    // Event Handlers
    handleTabClick(tab) {
        // Update active tab
        tab.parentElement.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter content based on tab
        const filter = tab.getAttribute('data-filter');
        this.filterContent(filter);
    }

    filterContent(filter) {
        const items = this.panelContent.querySelectorAll('[data-category]');
        items.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleTemplateSelection(card) {
        const category = card.getAttribute('data-category');
        const templateName = card.querySelector('.template-name')?.textContent ||
            card.querySelector('h4')?.textContent ||
            category;

        console.log('🎯 Template selected:', category, 'Template name:', templateName);
        console.log('🎯 Card element:', card);
        console.log('🎯 Card HTML:', card.outerHTML);

        // Apply template to canvas
        this.applyTemplate(category, templateName);

        // Visual feedback
        this.panelContent.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    }

    handleFontSelection(card) {
        const font = card.getAttribute('data-font');
        console.log('Font selected:', font);

        // Apply font to selected text or all text
        this.applyFont(font);

        // Visual feedback
        this.panelContent.querySelectorAll('.font-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    }

    handleColorSelection(card) {
        const bg = card.getAttribute('data-bg');
        const fg = card.getAttribute('data-fg');
        console.log('Color preset selected:', bg, fg);

        // Apply colors to canvas
        this.applyColors(bg, fg);

        // Visual feedback
        this.panelContent.querySelectorAll('.color-preset-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    }

    handleShapeSelection(card) {
        const shape = card.getAttribute('data-shape');
        console.log('Shape selected:', shape);

        // Add shape to canvas
        this.addShape(shape);

        // Visual feedback
        this.panelContent.querySelectorAll('.shape-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    }

    handleEmojiSelection(card) {
        const emoji = card.getAttribute('data-emoji');
        console.log('Emoji selected:', emoji);

        // Add emoji to canvas
        this.addEmoji(emoji);

        // Visual feedback
        card.style.transform = 'scale(1.2)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }

    handleBackgroundColorChange(color) {
        console.log('Background color changed:', color);
        this.applyBackgroundColor(color);
    }

    handleTextColorChange(color) {
        console.log('Text color changed:', color);
        this.applyTextColor(color);
    }

    handleImageUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addImageToCanvas(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    handleImageSelection(card) {
        const bgGradient = card.getAttribute('data-bg');
        const imageName = card.querySelector('.image-name').textContent;
        console.log('Stock image selected:', imageName, bgGradient);

        if (bgGradient) {
            this.applyBackgroundFromImage(bgGradient);
            // Visual feedback
            document.querySelectorAll('.image-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        }
    }

    applyBackgroundFromImage(gradient) {
        const canvas = document.querySelector('.canvas-background');
        if (canvas) {
            console.log('Applying background from image:', gradient);
            canvas.style.background = gradient;
            canvas.style.setProperty('background', gradient, 'important');
        }
    }

    setupExportButton() {
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.exportCanvasWithBorder();
            });
            console.log('📦 Export button connected');
        }
    }

    // Export Methods
    exportCanvasWithBorder() {
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) {
            console.error('Canvas container not found');
            return;
        }

        // Use html2canvas to capture the entire canvas container including border
        if (typeof html2canvas !== 'undefined') {
            html2canvas(canvasContainer, {
                backgroundColor: null,
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                // Download the image
                const link = document.createElement('a');
                link.download = `spooky-greeting-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();

                console.log('🎨 Canvas exported with border');
            }).catch(error => {
                console.error('Export failed:', error);
                // Fallback to manual canvas export
                this.exportCanvasManually();
            });
        } else {
            // Fallback if html2canvas is not available
            this.exportCanvasManually();
        }
    }

    exportCanvasManually() {
        // Create a canvas that includes the border
        const canvasContainer = document.querySelector('.canvas-container');
        const canvasBackground = document.querySelector('.canvas-background');

        if (!canvasContainer || !canvasBackground) {
            console.error('Canvas elements not found');
            return;
        }

        const exportCanvas = document.createElement('canvas');
        const ctx = exportCanvas.getContext('2d');

        // Get container dimensions
        const containerRect = canvasContainer.getBoundingClientRect();
        const borderWidth = 8; // Border width from CSS

        // Set canvas size to include border
        exportCanvas.width = containerRect.width;
        exportCanvas.height = containerRect.height;

        // Draw border
        ctx.fillStyle = '#ff6b35'; // Spooky orange border
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // Draw inner content area
        const innerX = borderWidth;
        const innerY = borderWidth;
        const innerWidth = exportCanvas.width - (borderWidth * 2);
        const innerHeight = exportCanvas.height - (borderWidth * 2);

        // Get background style
        const bgStyle = window.getComputedStyle(canvasBackground).background;

        // Draw background (simplified - would need more complex parsing for gradients)
        if (bgStyle.includes('gradient')) {
            // Create a simple gradient fallback
            const gradient = ctx.createLinearGradient(innerX, innerY, innerX + innerWidth, innerY + innerHeight);
            gradient.addColorStop(0, '#ff6b35');
            gradient.addColorStop(1, '#8b0000');
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = bgStyle || '#2d1b69';
        }

        ctx.fillRect(innerX, innerY, innerWidth, innerHeight);

        // Draw text elements (simplified)
        const textElements = document.querySelectorAll('.greeting-text');
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';

        textElements.forEach((textEl, index) => {
            const text = textEl.textContent;
            const y = innerY + (innerHeight / 2) + (index * 40);
            ctx.fillText(text, innerX + (innerWidth / 2), y);
        });

        // Download the image
        const link = document.createElement('a');
        link.download = `spooky-greeting-${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();

        console.log('🎨 Canvas exported manually with border');
    }

    makeClickableForProperties(element) {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectObject(element);
            this.openPropertiesPanel();
        });

        // Add hover effect to indicate it's clickable
        element.addEventListener('mouseenter', () => {
            element.style.outline = '2px dashed rgba(255, 107, 157, 0.5)';
        });

        element.addEventListener('mouseleave', () => {
            if (this.selectedObject !== element) {
                element.style.outline = 'none';
            }
        });
    }

    openPropertiesPanel() {
        if (this.propertiesPanel) {
            this.propertiesPanel.classList.add('open');
        }
        if (this.mainContent) {
            this.mainContent.classList.add('properties-open');
        }

        // Update properties content based on selected object
        this.updatePropertiesContent();
    }

    updatePropertiesContent() {
        if (!this.propertiesContent || !this.selectedObject) return;

        const objectType = this.selectedObject.classList.contains('main-text') ? 'Main Text' :
            this.selectedObject.classList.contains('sub-text') ? 'Subtitle Text' :
                this.selectedObject.classList.contains('greeting-text') ? 'Text Element' :
                    'Object';

        // Update properties panel title
        if (this.propertiesTitle) {
            this.propertiesTitle.textContent = `Properties - ${objectType}`;
        }

        this.propertiesContent.innerHTML = `
            <div class="properties-content">
                <div class="property-group">
                    <label>Element Type</label>
                    <input type="text" value="${objectType}" readonly>
                </div>
                <div class="property-group">
                    <label>Text Content</label>
                    <input type="text" class="text-content-input" value="${this.selectedObject.textContent}">
                </div>
                <div class="property-group">
                    <label>Font Size</label>
                    <input type="range" class="font-size-input" min="12" max="72" value="${parseInt(this.selectedObject.style.fontSize) || 24}">
                    <span class="font-size-value">${parseInt(this.selectedObject.style.fontSize) || 24}px</span>
                </div>
                <div class="property-group">
                    <label>Text Color</label>
                    <input type="color" class="text-color-input" value="#ffffff">
                </div>
                <div class="property-group">
                    <label>Font Family</label>
                    <select class="font-family-input">
                        <option value="Dancing Script">Dancing Script</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Creepster">Creepster</option>
                        <option value="Nosifer">Nosifer</option>
                    </select>
                </div>
                <div class="property-group">
                    <label>Text Alignment</label>
                    <div class="style-buttons">
                        <button class="style-btn" data-align="left">L</button>
                        <button class="style-btn" data-align="center">C</button>
                        <button class="style-btn" data-align="right">R</button>
                    </div>
                </div>
                <div class="property-group">
                    <button class="delete-btn" id="delete-selected">Delete Element</button>
                </div>
            </div>
        `;

        // Add event listeners for property changes
        this.setupPropertyListeners();
    }

    setupPropertyListeners() {
        if (!this.propertiesContent) return;

        // Text content change
        const textInput = this.propertiesContent.querySelector('.text-content-input');
        if (textInput) {
            textInput.addEventListener('input', (e) => {
                if (this.selectedObject) {
                    this.selectedObject.textContent = e.target.value;
                    this.updateLayerName(this.selectedObject, e.target.value);
                }
            });
        }

        // Font size change
        const fontSizeInput = this.propertiesContent.querySelector('.font-size-input');
        const fontSizeValue = this.propertiesContent.querySelector('.font-size-value');
        if (fontSizeInput && fontSizeValue) {
            fontSizeInput.addEventListener('input', (e) => {
                const size = e.target.value + 'px';
                if (this.selectedObject) {
                    this.selectedObject.style.fontSize = size;
                }
                fontSizeValue.textContent = size;
            });
        }

        // Text color change
        const colorInput = this.propertiesContent.querySelector('.text-color-input');
        if (colorInput) {
            colorInput.addEventListener('change', (e) => {
                if (this.selectedObject) {
                    this.selectedObject.style.color = e.target.value;
                }
            });
        }

        // Font family change
        const fontFamilyInput = this.propertiesContent.querySelector('.font-family-input');
        if (fontFamilyInput) {
            fontFamilyInput.addEventListener('change', (e) => {
                if (this.selectedObject) {
                    this.selectedObject.style.fontFamily = `'${e.target.value}', cursive`;
                }
            });
        }

        // Text alignment
        const alignButtons = this.propertiesContent.querySelectorAll('[data-align]');
        alignButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.selectedObject) {
                    this.selectedObject.style.textAlign = btn.getAttribute('data-align');
                }
                // Update button states
                alignButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Delete button
        const deleteBtn = this.propertiesContent.querySelector('#delete-selected');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteSelectedObject();
            });
        }
    }

    updateLayerName(element, newName) {
        const objectId = element.getAttribute('data-object-id');
        const objectData = this.canvasObjects.find(obj => obj.id === objectId);
        if (objectData) {
            objectData.name = newName;
            if (this.currentCategory === 'layers') {
                this.updateLayersList();
            }
        }
    }

    deleteSelectedObject() {
        if (this.selectedObject) {
            const objectId = this.selectedObject.getAttribute('data-object-id');

            // Remove from canvas
            this.selectedObject.remove();

            // Remove from objects array
            this.canvasObjects = this.canvasObjects.filter(obj => obj.id !== objectId);

            // Clear selection
            this.selectedObject = null;

            // Update layers list
            if (this.currentCategory === 'layers') {
                this.updateLayersList();
            }

            // Close properties panel
            this.closePropertiesPanel();
        }
    }

    closePropertiesPanel() {
        if (this.propertiesPanel) {
            this.propertiesPanel.classList.remove('open');
        }
        if (this.mainContent) {
            this.mainContent.classList.remove('properties-open');
        }
    }

    // Canvas Integration Methods
    addTextElement(textType) {
        const canvas = document.getElementById('greeting-canvas');
        if (!canvas) return;

        const textElement = document.createElement('div');
        textElement.className = 'greeting-text canvas-text';

        const texts = {
            heading: 'Your Heading Here',
            subtitle: 'Your subtitle text',
            body: 'Body text goes here'
        };

        const sizes = {
            heading: '32px',
            subtitle: '20px',
            body: '16px'
        };

        textElement.textContent = texts[textType] || 'New Text';
        textElement.style.cssText = `
            position: absolute;
            top: ${20 + Math.random() * 60}%;
            left: ${20 + Math.random() * 60}%;
            font-family: 'Dancing Script', cursive;
            font-size: ${sizes[textType] || '20px'};
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            cursor: move;
            user-select: none;
            z-index: 10;
        `;

        canvas.appendChild(textElement);
        this.makeDraggable(textElement);

        // Add to layers
        this.addObjectToLayers(textElement, 'text', texts[textType] || 'New Text');

        // Make clickable for properties panel
        this.makeClickableForProperties(textElement);

        // Auto-select the new text element
        setTimeout(() => {
            this.selectObject(textElement);
        }, 100);
    }

    applyTemplate(category, templateName = null) {
        const canvas = document.querySelector('.canvas-background');
        const dropZone = document.querySelector('.drop-zone');

        console.log('🎨 applyTemplate called with category:', category, 'templateName:', templateName);
        console.log('🎨 Canvas element found:', canvas);

        if (dropZone) {
            dropZone.style.display = 'none';
        }

        const backgrounds = {
            // Halloween Templates
            'Spooky Halloween': 'linear-gradient(135deg, #ff6b35, #8b0000)',
            'Pumpkin Patch': 'linear-gradient(135deg, #ff6b00, #000000)',
            "Spider's Web": 'linear-gradient(135deg, #4a0e4e, #000000)',
            'Vampire Night': 'linear-gradient(135deg, #2d1b69, #8b0000)',

            // Birthday Templates
            'Birthday Celebration': 'linear-gradient(135deg, #ff6b9d, #f093fb)',
            'Party Time': 'linear-gradient(135deg, #ff9a9e, #fecfef)',
            'Balloon Fun': 'linear-gradient(135deg, #a8edea, #fed6e3)',
            'Sweet Treats': 'linear-gradient(135deg, #ffecd2, #fcb69f)',

            // Gothic Templates
            'Dark Romance': 'linear-gradient(135deg, #2d1b69, #11052c)',
            'Black Rose': 'linear-gradient(135deg, #1a1a2e, #16213e)',
            'Midnight Crypt': 'linear-gradient(135deg, #0f0f23, #2d1b69)',
            'Candlelight': 'linear-gradient(135deg, #434343, #000000)',

            // Valentine Templates
            'Be My Valentine': 'linear-gradient(135deg, #ff6b9d, #c44569)',
            'Love Letter': 'linear-gradient(135deg, #ff7675, #fd79a8)',
            'Sweet Love': 'linear-gradient(135deg, #fab1a0, #e17055)',
            "Cupid's Arrow": 'linear-gradient(135deg, #fd79a8, #fdcb6e)',

            // Christmas Templates
            'Merry Christmas': 'linear-gradient(135deg, #00b894, #00cec9)',
            "Santa's Visit": 'linear-gradient(135deg, #e17055, #fdcb6e)',
            'Winter Wonder': 'linear-gradient(135deg, #74b9ff, #0984e3)',
            'Holiday Magic': 'linear-gradient(135deg, #a29bfe, #6c5ce7)',

            // Anniversary Templates
            'Love Anniversary': 'linear-gradient(135deg, #ff7675, #fd79a8)',
            'Floating Hearts': 'linear-gradient(135deg, #ff6b9d, #f093fb)',

            // Fallback by category
            halloween: 'linear-gradient(135deg, #ff6b35, #8b0000)',
            birthday: 'linear-gradient(135deg, #ff6b9d, #f093fb)',
            gothic: 'linear-gradient(135deg, #2d1b69, #11052c)',
            valentine: 'linear-gradient(135deg, #ff6b9d, #c44569)',
            christmas: 'linear-gradient(135deg, #00b894, #00cec9)',
            anniversary: 'linear-gradient(135deg, #ff7675, #fd79a8)'
        };

        // Try to get background by template name first, then by category
        const background = backgrounds[templateName] || backgrounds[category];

        console.log('🎨 Available backgrounds:', Object.keys(backgrounds));
        console.log('🎨 Looking for template:', templateName, 'or category:', category);
        console.log('🎨 Selected background:', background);

        if (canvas && background) {
            console.log('🎨 Applying background:', background, 'to canvas:', canvas);
            canvas.style.setProperty('background', background, 'important');
            console.log('🎨 Canvas style after applying:', canvas.style.background);
            console.log('🎨 Background applied successfully');
        } else {
            console.log('❌ Canvas not found or template not in backgrounds:', templateName, category, canvas, background);
        }

        // Add template text
        this.addTemplateText(category, templateName);
    }

    addTemplateText(category, templateName = null) {
        const canvas = document.getElementById('greeting-canvas');
        if (!canvas) return;

        // Remove existing template text (but keep user-added text)
        canvas.querySelectorAll('.template-text').forEach(text => {
            // Remove from layers panel too
            const objectId = text.getAttribute('data-object-id');
            if (objectId) {
                this.canvasObjects = this.canvasObjects.filter(obj => obj.id !== objectId);
            }
            text.remove();
        });

        const texts = {
            halloween: {
                main: '👻 Happy Halloween!',
                name: 'Dear [Name]',
                quote: 'May your night be filled with spooky delights and magical frights!',
                by: 'By [Your Name]'
            },
            birthday: {
                main: '🎂 Happy Birthday!',
                name: 'Dear [Name]',
                quote: 'May all your dreams come true and your day be filled with joy!',
                by: 'By [Your Name]'
            },
            gothic: {
                main: '🖤 Dark Romance',
                name: 'My Beloved [Name]',
                quote: 'In shadows we find beauty, in darkness we discover light.',
                by: 'By [Your Name]'
            },
            valentine: {
                main: '💝 Be My Valentine',
                name: 'My Dearest [Name]',
                quote: 'You are the light of my life and the beat of my heart.',
                by: 'By [Your Name]'
            },
            christmas: {
                main: '🎄 Merry Christmas',
                name: 'Dear [Name]',
                quote: 'May your holidays sparkle with joy and laughter!',
                by: 'By [Your Name]'
            },
            anniversary: {
                main: '💕 Happy Anniversary',
                name: 'My Love [Name]',
                quote: 'Every moment with you is a beautiful memory in the making.',
                by: 'By [Your Name]'
            }
        };

        const textData = texts[category] || texts.birthday;

        // Create main greeting text
        const mainText = document.createElement('div');
        mainText.className = 'greeting-text template-text main-text';
        mainText.textContent = textData.main;
        mainText.style.cssText = `
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Dancing Script', cursive;
            font-size: 32px;
            color: white;
            text-align: center;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            cursor: pointer;
            user-select: none;
            z-index: 10;
            border: 2px dashed transparent;
            padding: 8px;
            border-radius: 4px;
        `;

        // Create name text
        const nameText = document.createElement('div');
        nameText.className = 'greeting-text template-text name-text';
        nameText.textContent = textData.name;
        nameText.style.cssText = `
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            color: white;
            text-align: center;
            font-weight: 400;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            cursor: pointer;
            user-select: none;
            z-index: 10;
            border: 2px dashed transparent;
            padding: 8px;
            border-radius: 4px;
        `;

        // Create quote text
        const quoteText = document.createElement('div');
        quoteText.className = 'greeting-text template-text quote-text';
        quoteText.textContent = textData.quote;
        quoteText.style.cssText = `
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            color: white;
            text-align: center;
            font-weight: 300;
            font-style: italic;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            cursor: pointer;
            user-select: none;
            z-index: 10;
            border: 2px dashed transparent;
            padding: 8px;
            border-radius: 4px;
            max-width: 80%;
            line-height: 1.4;
        `;

        // Create "by" text
        const byText = document.createElement('div');
        byText.className = 'greeting-text template-text by-text';
        byText.textContent = textData.by;
        byText.style.cssText = `
            position: absolute;
            top: 80%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            font-weight: 400;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            cursor: pointer;
            user-select: none;
            z-index: 10;
            border: 2px dashed transparent;
            padding: 8px;
            border-radius: 4px;
        `;

        // Add all text elements to canvas
        canvas.appendChild(mainText);
        canvas.appendChild(nameText);
        canvas.appendChild(quoteText);
        canvas.appendChild(byText);

        // Make all text elements draggable
        this.makeDraggable(mainText);
        this.makeDraggable(nameText);
        this.makeDraggable(quoteText);
        this.makeDraggable(byText);

        // Add to layers panel
        this.addObjectToLayers(mainText, 'text', textData.main);
        this.addObjectToLayers(nameText, 'text', textData.name);
        this.addObjectToLayers(quoteText, 'text', textData.quote);
        this.addObjectToLayers(byText, 'text', textData.by);

        // Make clickable for properties panel
        this.makeClickableForProperties(mainText);
        this.makeClickableForProperties(nameText);
        this.makeClickableForProperties(quoteText);
        this.makeClickableForProperties(byText);

        // Add hover effects for better UX
        [mainText, nameText, quoteText, byText].forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.borderColor = '#ff6b9d';
            });
            element.addEventListener('mouseleave', () => {
                if (!element.classList.contains('selected')) {
                    element.style.borderColor = 'transparent';
                }
            });
        });
    }

    applyFont(fontFamily) {
        if (this.selectedObject && this.selectedObject.classList.contains('greeting-text')) {
            this.selectedObject.style.fontFamily = `'${fontFamily}', cursive`;
        } else {
            // Apply to all text elements if none selected
            const textElements = document.querySelectorAll('.greeting-text');
            textElements.forEach(text => {
                text.style.fontFamily = `'${fontFamily}', cursive`;
            });
        }
    }

    applyColors(bg, fg) {
        const canvas = document.querySelector('.canvas-background');

        if (canvas) {
            canvas.style.setProperty('background', `linear-gradient(135deg, ${bg}, ${fg})`, 'important');
        }

        if (this.selectedObject && this.selectedObject.classList.contains('greeting-text')) {
            this.selectedObject.style.color = fg === '#000000' ? '#ffffff' : fg;
        }
    }

    applyBackgroundColor(color) {
        const canvas = document.querySelector('.canvas-background');
        if (canvas) {
            canvas.style.setProperty('background', color, 'important');
        }
    }

    applyTextColor(color) {
        if (this.selectedObject && this.selectedObject.classList.contains('greeting-text')) {
            this.selectedObject.style.color = color;
        } else {
            const textElements = document.querySelectorAll('.greeting-text');
            textElements.forEach(text => {
                text.style.color = color;
            });
        }
    }

    applyTextStyle(textElement, style, active) {
        switch (style) {
            case 'bold':
                textElement.style.fontWeight = active ? '700' : '400';
                break;
            case 'italic':
                textElement.style.fontStyle = active ? 'italic' : 'normal';
                break;
            case 'underline':
                textElement.style.textDecoration = active ? 'underline' : 'none';
                break;
        }
    }

    addShape(shape) {
        const canvas = document.getElementById('greeting-canvas');
        if (!canvas) return;

        const shapes = {
            rectangle: '⬜',
            circle: '⭕',
            star: '⭐',
            heart: '💖',
            triangle: '🔺',
            diamond: '💎',
            moon: '🌙',
            sun: '☀️'
        };

        const shapeElement = document.createElement('div');
        shapeElement.className = 'canvas-shape';
        shapeElement.textContent = shapes[shape] || '⬜';
        shapeElement.style.cssText = `
            position: absolute;
            top: ${20 + Math.random() * 60}%;
            left: ${20 + Math.random() * 60}%;
            font-size: 32px;
            cursor: move;
            user-select: none;
            z-index: 15;
        `;

        canvas.appendChild(shapeElement);
        this.makeDraggable(shapeElement);

        // Add to layers
        this.addObjectToLayers(shapeElement, 'shape', shape.charAt(0).toUpperCase() + shape.slice(1));

        // Auto-select the new shape
        setTimeout(() => {
            this.selectObject(shapeElement);
        }, 100);
    }

    addEmoji(emoji) {
        const canvas = document.getElementById('greeting-canvas');
        if (!canvas) return;

        const emojiElement = document.createElement('div');
        emojiElement.className = 'canvas-emoji';
        emojiElement.textContent = emoji;
        emojiElement.style.cssText = `
            position: absolute;
            top: ${20 + Math.random() * 60}%;
            left: ${20 + Math.random() * 60}%;
            font-size: 28px;
            cursor: move;
            user-select: none;
            z-index: 15;
        `;

        canvas.appendChild(emojiElement);
        this.makeDraggable(emojiElement);

        // Add to layers
        this.addObjectToLayers(emojiElement, 'emoji', `Emoji ${emoji}`);

        // Auto-select the new emoji
        setTimeout(() => {
            this.selectObject(emojiElement);
        }, 100);
    }

    addImageToCanvas(imageSrc) {
        const canvas = document.getElementById('greeting-canvas');
        if (!canvas) return;

        const imageElement = document.createElement('div');
        imageElement.className = 'canvas-image';
        imageElement.style.cssText = `
            position: absolute;
            top: ${20 + Math.random() * 60}%;
            left: ${20 + Math.random() * 60}%;
            width: 100px;
            height: 100px;
            background-image: url(${imageSrc});
            background-size: cover;
            background-position: center;
            border-radius: 8px;
            cursor: move;
            user-select: none;
            z-index: 15;
        `;

        canvas.appendChild(imageElement);
        this.makeDraggable(imageElement);

        // Auto-select the new image
        setTimeout(() => {
            this.selectObject(imageElement);
        }, 100);
    }

    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
            element.style.cursor = 'grabbing';
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            element.style.left = (initialX + deltaX) + 'px';
            element.style.top = (initialY + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';
            }
        });
    }

    // Auto-open templates to match design
    autoOpenTemplates() {
        // Activate templates icon
        const templatesIcon = document.querySelector('[data-category="templates"]');
        if (templatesIcon) {
            templatesIcon.classList.add('active');
        }

        // Open secondary panel with templates
        this.openCategory('templates');

        // Add auto-open classes
        if (this.secondaryPanel) {
            this.secondaryPanel.classList.add('auto-open');
        }
        if (this.mainContent) {
            this.mainContent.classList.add('auto-secondary-open');
        }
    }

    // Initialize canvas toolbar events
    initializeCanvasToolbar() {
        // Zoom controls
        document.getElementById('zoom-in')?.addEventListener('click', () => {
            this.zoomIn();
        });

        document.getElementById('zoom-out')?.addEventListener('click', () => {
            this.zoomOut();
        });

        document.getElementById('fit-canvas')?.addEventListener('click', () => {
            this.fitCanvas();
        });

        // Grid and guides toggles
        document.getElementById('grid-toggle')?.addEventListener('click', (e) => {
            this.toggleGrid(e.target);
        });

        document.getElementById('guides-toggle')?.addEventListener('click', (e) => {
            this.toggleGuides(e.target);
        });

        // Format selector
        document.querySelector('.format-select')?.addEventListener('change', (e) => {
            this.changeCanvasFormat(e.target.value);
        });
    }

    // Canvas control methods
    zoomIn() {
        const canvas = document.querySelector('.canvas-container');
        const zoomLevel = document.querySelector('.zoom-level');
        if (canvas && zoomLevel) {
            let currentZoom = parseInt(zoomLevel.textContent) || 100;
            currentZoom = Math.min(currentZoom + 25, 200);
            canvas.style.transform = `scale(${currentZoom / 100})`;
            zoomLevel.textContent = currentZoom + '%';
        }
    }

    zoomOut() {
        const canvas = document.querySelector('.canvas-container');
        const zoomLevel = document.querySelector('.zoom-level');
        if (canvas && zoomLevel) {
            let currentZoom = parseInt(zoomLevel.textContent) || 100;
            currentZoom = Math.max(currentZoom - 25, 25);
            canvas.style.transform = `scale(${currentZoom / 100})`;
            zoomLevel.textContent = currentZoom + '%';
        }
    }

    fitCanvas() {
        const canvas = document.querySelector('.canvas-container');
        const zoomLevel = document.querySelector('.zoom-level');
        if (canvas && zoomLevel) {
            canvas.style.transform = 'scale(1)';
            zoomLevel.textContent = '100%';
        }
    }

    toggleGrid(button) {
        const canvas = document.getElementById('greeting-canvas');
        if (canvas) {
            canvas.classList.toggle('show-grid');
            button.classList.toggle('active');
        }
    }

    toggleGuides(button) {
        const canvas = document.getElementById('greeting-canvas');
        if (canvas) {
            canvas.classList.toggle('show-guides');
            button.classList.toggle('active');
        }
    }

    changeCanvasFormat(format) {
        const canvas = document.querySelector('.canvas-container');
        if (canvas) {
            switch (format) {
                case 'landscape':
                    canvas.style.width = '600px';
                    canvas.style.height = '400px';
                    break;
                case 'portrait':
                    canvas.style.width = '400px';
                    canvas.style.height = '600px';
                    break;
                case 'square':
                    canvas.style.width = '500px';
                    canvas.style.height = '500px';
                    break;
            }
        }
    }

    // Layer Management Methods
    initializeLayerControls() {
        document.getElementById('clear-all-layers')?.addEventListener('click', () => {
            this.clearAllLayers();
        });

        document.getElementById('bring-to-front')?.addEventListener('click', () => {
            this.bringToFront();
        });

        document.getElementById('send-to-back')?.addEventListener('click', () => {
            this.sendToBack();
        });

        document.getElementById('duplicate-layer')?.addEventListener('click', () => {
            this.duplicateLayer();
        });

        document.getElementById('delete-layer')?.addEventListener('click', () => {
            this.deleteLayer();
        });
    }

    addObjectToLayers(element, type, name) {
        this.objectCounter++;
        const objectData = {
            id: `object-${this.objectCounter}`,
            element: element,
            type: type,
            name: name || `${type} ${this.objectCounter}`,
            visible: true,
            locked: false
        };

        // Add unique ID to element
        element.setAttribute('data-object-id', objectData.id);

        // Add to objects array
        this.canvasObjects.push(objectData);

        // Update layers list if layers panel is open
        if (this.currentCategory === 'layers') {
            this.updateLayersList();
        }

        return objectData;
    }

    updateLayersList() {
        const layersList = document.getElementById('layers-list');
        if (!layersList) return;

        if (this.canvasObjects.length === 0) {
            layersList.innerHTML = `
                <div class="empty-layers">
                    <span class="empty-icon">📄</span>
                    <p>No objects on canvas</p>
                </div>
            `;
            return;
        }

        layersList.innerHTML = this.canvasObjects.map((obj, index) => `
            <div class="layer-item ${this.selectedObject?.getAttribute('data-object-id') === obj.id ? 'selected' : ''}" 
                 data-object-id="${obj.id}">
                <div class="layer-info">
                    <span class="layer-icon">${this.getLayerIcon(obj.type)}</span>
                    <span class="layer-name">${obj.name}</span>
                </div>
                <div class="layer-controls">
                    <button class="layer-visibility ${obj.visible ? 'visible' : 'hidden'}" 
                            data-object-id="${obj.id}" title="Toggle Visibility">
                        ${obj.visible ? '👁️' : '🙈'}
                    </button>
                    <button class="layer-lock ${obj.locked ? 'locked' : 'unlocked'}" 
                            data-object-id="${obj.id}" title="Toggle Lock">
                        ${obj.locked ? '🔒' : '🔓'}
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to layer items
        layersList.querySelectorAll('.layer-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('layer-visibility') &&
                    !e.target.classList.contains('layer-lock')) {
                    this.selectLayerObject(item.getAttribute('data-object-id'));
                }
            });
        });

        // Add event listeners to visibility toggles
        layersList.querySelectorAll('.layer-visibility').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleObjectVisibility(btn.getAttribute('data-object-id'));
            });
        });

        // Add event listeners to lock toggles
        layersList.querySelectorAll('.layer-lock').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleObjectLock(btn.getAttribute('data-object-id'));
            });
        });
    }

    getLayerIcon(type) {
        const icons = {
            'text': '🔤',
            'shape': '⬜',
            'emoji': '😈',
            'image': '🖼️',
            'template': '📚'
        };
        return icons[type] || '📄';
    }

    selectLayerObject(objectId) {
        const objectData = this.canvasObjects.find(obj => obj.id === objectId);
        if (objectData && objectData.element) {
            this.selectObject(objectData.element);
            this.updateLayersList();
        }
    }

    toggleObjectVisibility(objectId) {
        const objectData = this.canvasObjects.find(obj => obj.id === objectId);
        if (objectData) {
            objectData.visible = !objectData.visible;
            objectData.element.style.display = objectData.visible ? '' : 'none';
            this.updateLayersList();
        }
    }

    toggleObjectLock(objectId) {
        const objectData = this.canvasObjects.find(obj => obj.id === objectId);
        if (objectData) {
            objectData.locked = !objectData.locked;
            objectData.element.style.pointerEvents = objectData.locked ? 'none' : '';
            this.updateLayersList();
        }
    }

    clearAllLayers() {
        this.canvasObjects.forEach(obj => {
            if (obj.element && obj.element.parentNode) {
                obj.element.remove();
            }
        });
        this.canvasObjects = [];
        this.selectedObject = null;
        this.closePropertiesPanel();
        this.updateLayersList();
    }

    bringToFront() {
        if (this.selectedObject) {
            this.selectedObject.style.zIndex = '20';
        }
    }

    sendToBack() {
        if (this.selectedObject) {
            this.selectedObject.style.zIndex = '5';
        }
    }

    duplicateLayer() {
        if (this.selectedObject) {
            const objectId = this.selectedObject.getAttribute('data-object-id');
            const objectData = this.canvasObjects.find(obj => obj.id === objectId);

            if (objectData) {
                const clone = this.selectedObject.cloneNode(true);
                const rect = this.selectedObject.getBoundingClientRect();

                // Offset the clone position
                clone.style.left = (parseInt(this.selectedObject.style.left) + 20) + 'px';
                clone.style.top = (parseInt(this.selectedObject.style.top) + 20) + 'px';

                // Add to canvas
                this.selectedObject.parentNode.appendChild(clone);

                // Make draggable and add to layers
                this.makeDraggable(clone);
                this.addObjectToLayers(clone, objectData.type, objectData.name + ' Copy');
            }
        }
    }

    deleteLayer() {
        if (this.selectedObject) {
            const objectId = this.selectedObject.getAttribute('data-object-id');

            // Remove from canvas
            this.selectedObject.remove();

            // Remove from objects array
            this.canvasObjects = this.canvasObjects.filter(obj => obj.id !== objectId);

            // Clear selection
            this.selectedObject = null;
            this.closePropertiesPanel();
            this.updateLayersList();
        }
    }
}

// PanelManager class is ready for initialization