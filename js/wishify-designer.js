/**
 * Wishify Designer - Greeting Card Creator
 * Main JavaScript functionality for creating personalized greetings
 */

class WishifyDesigner {
    constructor() {
        this.currentTemplate = null;
        this.currentCategory = 'all';
        this.currentFormat = 'square';
        this.zoomLevel = 1;
        this.gridEnabled = false;
        this.guidesEnabled = false;

        // Canvas elements
        this.canvas = null;
        this.canvasBackground = null;
        this.mainText = null;
        this.subText = null;

        // Current settings
        this.settings = {
            mainText: 'Happy Birthday!',
            subText: 'Hope your day is wonderful!',
            fontFamily: 'Dancing Script',
            fontSize: 32,
            textColor: '#333333',
            primaryColor: '#ff6b9d',
            secondaryColor: '#c44569',
            backgroundType: 'gradient',
            borderRadius: 12,
            shadowIntensity: 20,
            effects: {
                sparkle: true,
                glow: false,
                textShadow: true,
                rainbow: false
            }
        };

        this.init();
    }

    init() {
        this.canvas = document.getElementById('greeting-canvas');
        this.canvasBackground = document.querySelector('.canvas-background');

        // Storage for uploaded files
        this.uploadedImages = [];
        this.uploadedAudio = [];
        this.currentAudio = null;

        // Book creation data
        this.bookData = null;

        this.setupEventListeners();
        this.setupTemplateFiltering();
        this.setupEditor();
        this.setupFileUploads();
        this.setupDrawingTools();
        this.initializeCanvas();
        this.initializeImageGrid();

        console.log('👻 Haunted Wishify Designer summoned from the digital realm');

        // Debug: Check if panels exist
        const panels = document.querySelectorAll('.content-panel');
        console.log('📋 Found panels:', panels.length);
        panels.forEach(panel => {
            console.log('Panel ID:', panel.id, 'Active:', panel.classList.contains('active'));
        });

        // Debug: Check if upload areas exist
        const imageUpload = document.getElementById('image-upload-area');
        const audioUpload = document.getElementById('audio-upload-area');
        console.log('📸 Image upload area:', imageUpload ? 'Found' : 'Missing');
        console.log('🎵 Audio upload area:', audioUpload ? 'Found' : 'Missing');

        // Auto-select first template
        setTimeout(() => {
            const firstTemplate = document.querySelector('.template-item');
            if (firstTemplate) {
                console.log('🎯 Auto-selecting first template');
                this.selectTemplate(firstTemplate);
            }
        }, 500);

        // Add global test function
        window.testImagePanel = () => {
            console.log('🧪 Manual test: switching to images panel');
            this.switchPanel('images');
        };
    }

    setupEventListeners() {
        // Side navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const panelName = e.currentTarget.dataset.panel;
                console.log('🖱️ Nav item clicked:', panelName);
                console.log('🔍 Nav item element:', e.currentTarget);
                console.log('📋 Panel name from dataset:', panelName);
                this.switchPanel(panelName);
            });
        });

        // Template category tabs
        document.querySelectorAll('.template-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.filterTemplates(e.target.dataset.category);
            });
        });

        // Template selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectTemplate(item);
            });
        });

        // Editor tabs
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchEditorTab(e.target.dataset.tab);
            });
        });

        // Canvas controls (with null checks)
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const fitCanvas = document.getElementById('fit-canvas');
        const gridToggle = document.getElementById('grid-toggle');
        const guidesToggle = document.getElementById('guides-toggle');

        if (zoomIn) zoomIn.addEventListener('click', () => this.zoomIn());
        if (zoomOut) zoomOut.addEventListener('click', () => this.zoomOut());
        if (fitCanvas) fitCanvas.addEventListener('click', () => this.fitCanvas());
        if (gridToggle) gridToggle.addEventListener('click', () => this.toggleGrid());
        if (guidesToggle) guidesToggle.addEventListener('click', () => this.toggleGuides());

        // Format selector (with null check)
        const formatSelect = document.querySelector('.format-select');
        if (formatSelect) {
            formatSelect.addEventListener('change', (e) => {
                this.changeFormat(e.target.value);
            });
        }

        // Header buttons
        document.getElementById('preview-btn').addEventListener('click', () => this.showPreview());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadGreeting());
        document.getElementById('share-btn').addEventListener('click', () => this.shareGreeting());

        // Modal controls (with null checks)
        const modalClose = document.querySelector('.modal-close');
        const modalOverlay = document.querySelector('.modal-overlay');
        const editMore = document.getElementById('edit-more');
        const downloadFinal = document.getElementById('download-final');

        if (modalClose) modalClose.addEventListener('click', () => this.hidePreview());
        if (modalOverlay) modalOverlay.addEventListener('click', () => this.hidePreview());
        if (editMore) editMore.addEventListener('click', () => this.hidePreview());
        if (downloadFinal) downloadFinal.addEventListener('click', () => this.downloadGreeting());

        // Book creation buttons
        const createBookBtn = document.getElementById('create-book');
        if (createBookBtn) createBookBtn.addEventListener('click', () => this.showBookCreator());

        // Book modal controls
        const bookModalClose = document.querySelectorAll('#book-modal .modal-close');
        const bookModalOverlay = document.querySelector('#book-modal .modal-overlay');
        const closeBookBtn = document.getElementById('close-book');
        const generatePdfBtn = document.getElementById('generate-pdf');
        const addPageBtn = document.getElementById('add-page');

        bookModalClose.forEach(btn => btn.addEventListener('click', () => this.hideBookCreator()));
        if (bookModalOverlay) bookModalOverlay.addEventListener('click', () => this.hideBookCreator());
        if (closeBookBtn) closeBookBtn.addEventListener('click', () => this.hideBookCreator());
        if (generatePdfBtn) generatePdfBtn.addEventListener('click', () => this.generatePdfBook());
        if (addPageBtn) addPageBtn.addEventListener('click', () => this.addNewPage());

        // Search functionality (with null check)
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTemplates(e.target.value);
            });
        }

        // Panel interactions
        this.setupPanelInteractions();
    }

    setupTemplateFiltering() {
        this.filterTemplates('all');
    }

    switchPanel(panelName) {
        console.log('🔮 Switching to panel:', panelName);

        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        console.log('🧭 Found nav items:', navItems.length);
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        const navItem = document.querySelector(`[data-panel="${panelName}"]`);
        console.log('🎯 Target nav item:', navItem);
        if (navItem) {
            navItem.classList.add('active');
            console.log('✅ Nav item activated');
        }

        // Show corresponding panel
        const allPanels = document.querySelectorAll('.content-panel');
        console.log('📋 Found content panels:', allPanels.length);
        allPanels.forEach(panel => {
            console.log('📄 Panel:', panel.id, 'removing active');
            panel.classList.remove('active');
        });

        const targetPanelId = `${panelName}-panel`;
        const targetPanel = document.getElementById(targetPanelId);
        console.log('🎯 Looking for panel:', targetPanelId);
        console.log('🎯 Target panel found:', targetPanel);

        if (targetPanel) {
            targetPanel.classList.add('active');
            console.log('✅ Panel activated:', targetPanelId);
            console.log('📊 Panel display style:', window.getComputedStyle(targetPanel).display);
        } else {
            console.error('❌ Panel not found:', targetPanelId);
            // List all available panels for debugging
            const availablePanels = document.querySelectorAll('[id$="-panel"]');
            console.log('📋 Available panels:', Array.from(availablePanels).map(p => p.id));
        }

        console.log('🔮 Switched to panel:', panelName);
    }

    filterTemplates(category) {
        this.currentCategory = category;

        // Update active tab
        document.querySelectorAll('.template-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-category="${category}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Filter template items
        document.querySelectorAll('.template-item').forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
            }
        });

        console.log('🎨 Filtered templates for category:', category);
    }

    searchTemplates(query) {
        const items = document.querySelectorAll('.template-item');
        const searchTerm = query.toLowerCase();

        items.forEach(item => {
            const name = item.querySelector('.template-name').textContent.toLowerCase();
            const category = item.dataset.category;

            const matchesSearch = name.includes(searchTerm) || category.includes(searchTerm);
            const matchesCategory = this.currentCategory === 'all' || item.dataset.category === this.currentCategory;

            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    selectTemplate(templateItem) {
        // Remove previous selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Select new template
        templateItem.classList.add('selected');
        this.currentTemplate = templateItem;

        // Get template data
        const category = templateItem.dataset.category;
        const type = templateItem.dataset.type;
        const name = templateItem.querySelector('.template-name').textContent;

        // Apply template to canvas
        this.applyTemplate(category, type, name);

        console.log('🎯 Selected template:', name, category, type);
    }

    applyTemplate(category, type, name) {
        // Clear drop zone
        const dropZone = document.querySelector('.drop-zone');
        if (dropZone) {
            dropZone.style.display = 'none';
        }

        // Update canvas background based on category
        this.updateCanvasBackground(category);

        // Create or update text elements
        this.createTextElements(category);

        // Update settings based on template
        this.updateSettingsForTemplate(category);

        // Apply effects if it's a video template
        if (type === 'video') {
            this.addVideoEffects(category);
        }

        // Update editor with current settings
        this.updateEditorValues();
    }

    updateCanvasBackground(category) {
        const backgrounds = {
            halloween: 'linear-gradient(135deg, #ff6b35, #8b0000)',
            gothic: 'linear-gradient(135deg, #2d1b69, #11052c)',
            dark: 'linear-gradient(135deg, #0c0c0c, #2d1b1b)',
            mystical: 'linear-gradient(135deg, #6a0dad, #4b0082)',
            birthday: 'linear-gradient(135deg, #ff6b9d, #f093fb)',
            anniversary: 'linear-gradient(135deg, #ff7675, #fd79a8)',
            valentine: 'linear-gradient(135deg, #ff6b9d, #c44569)',
            christmas: 'linear-gradient(135deg, #00b894, #00cec9)',
            'new-year': 'linear-gradient(135deg, #fdcb6e, #e17055)',
        };

        const background = backgrounds[category] || backgrounds.birthday;
        this.canvasBackground.style.background = background;
    }

    createTextElements(category) {
        // Remove existing text elements
        const existingTexts = this.canvas.querySelectorAll('.greeting-text');
        existingTexts.forEach(text => text.remove());

        // Create main text
        this.mainText = document.createElement('div');
        this.mainText.className = 'greeting-text main-greeting';
        this.mainText.textContent = this.getDefaultMainText(category);
        this.mainText.style.cssText = `
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: '${this.settings.fontFamily}', cursive;
            font-size: ${this.settings.fontSize}px;
            color: white;
            text-align: center;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 10;
        `;

        // Create sub text
        this.subText = document.createElement('div');
        this.subText.className = 'greeting-text sub-greeting';
        this.subText.textContent = this.getDefaultSubText(category);
        this.subText.style.cssText = `
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            color: white;
            text-align: center;
            opacity: 0.9;
            z-index: 10;
        `;

        this.canvas.appendChild(this.mainText);
        this.canvas.appendChild(this.subText);

        // Make text elements clickable for properties panel and add to layers
        if (window.panelManager) {
            window.panelManager.makeClickableForProperties(this.mainText);
            window.panelManager.makeClickableForProperties(this.subText);
            
            // Add to layers panel
            window.panelManager.addObjectToLayers(this.mainText, 'Text', this.mainText.textContent);
            window.panelManager.addObjectToLayers(this.subText, 'Text', this.subText.textContent);
        }

        // Update settings
        this.settings.mainText = this.mainText.textContent;
        this.settings.subText = this.subText.textContent;
    }

    getDefaultMainText(category) {
        const texts = {
            halloween: '👻 Happy Halloween!',
            gothic: '🖤 Dark Elegance',
            dark: '🌙 Midnight Spell',
            mystical: '🔮 Mystical Wishes',
            birthday: '🎂 Happy Birthday!',
            anniversary: '💕 Happy Anniversary!',
            valentine: '💝 Be My Valentine!',
            christmas: '🎄 Merry Christmas!',
            'new-year': '🎊 Happy New Year!',
        };
        return texts[category] || '🎉 Congratulations!';
    }

    getDefaultSubText(category) {
        const texts = {
            halloween: 'Have a spook-tacular day!',
            gothic: 'Embrace the shadows within',
            dark: 'Cast in moonlight and mystery',
            mystical: 'May the stars align for you',
            birthday: 'Hope your day is wonderful!',
            anniversary: 'Celebrating your love story',
            valentine: 'With all my love',
            christmas: 'Joy, peace, and happiness',
            'new-year': 'Wishing you a fantastic year ahead!',
        };
        return texts[category] || 'Best wishes to you!';
    }

    updateSettingsForTemplate(category) {
        const colorSchemes = {
            halloween: { primary: '#ff6b35', secondary: '#8b0000' },
            gothic: { primary: '#2d1b69', secondary: '#11052c' },
            dark: { primary: '#0c0c0c', secondary: '#2d1b1b' },
            mystical: { primary: '#6a0dad', secondary: '#4b0082' },
            birthday: { primary: '#ff6b9d', secondary: '#f093fb' },
            anniversary: { primary: '#ff7675', secondary: '#fd79a8' },
            valentine: { primary: '#ff6b9d', secondary: '#c44569' },
            christmas: { primary: '#00b894', secondary: '#00cec9' },
            'new-year': { primary: '#fdcb6e', secondary: '#e17055' },

        };

        const scheme = colorSchemes[category] || colorSchemes.birthday;
        this.settings.primaryColor = scheme.primary;
        this.settings.secondaryColor = scheme.secondary;
    }

    addVideoEffects(category) {
        // Add sparkle animation for video templates
        this.createSparkleEffect();

        // Add category-specific animations
        switch (category) {
            case 'halloween':
                this.addFloatingGhosts();
                break;
            case 'birthday':
                this.addConfettiEffect();
                break;
            case 'anniversary':
                this.addFloatingHearts();
                break;
            case 'valentine':
                this.addCupidEffect();
                break;
            case 'christmas':
                this.addSnowEffect();
                break;
            case 'new-year':
                this.addFireworksEffect();
                break;
            case 'gothic':
                this.addGothicEffect();
                break;
            case 'dark':
                this.addDarkMagicEffect();
                break;
            case 'mystical':
                this.addMysticalEffect();
                break;
        }
    }

    createSparkleEffect() {
        const sparkles = ['✨', '⭐', '💫', '🌟'];

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.cssText = `
                    position: absolute;
                    font-size: 20px;
                    pointer-events: none;
                    z-index: 5;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: sparkleFloat 3s ease-in-out infinite;
                `;

                this.canvas.appendChild(sparkle);

                setTimeout(() => sparkle.remove(), 3000);
            }, i * 500);
        }
    }

    addFloatingGhosts() {
        const ghosts = ['👻', '🎃', '🦇'];

        ghosts.forEach((ghost, index) => {
            const element = document.createElement('div');
            element.textContent = ghost;
            element.style.cssText = `
                position: absolute;
                font-size: 30px;
                left: ${20 + index * 30}%;
                top: ${20 + index * 20}%;
                animation: float 4s ease-in-out infinite;
                animation-delay: ${index * 0.5}s;
                z-index: 5;
            `;
            this.canvas.appendChild(element);
        });
    }

    addConfettiEffect() {
        const colors = ['#ff6b9d', '#f093fb', '#fdcb6e', '#00b894'];

        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                animation: confettiFall 3s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                z-index: 5;
            `;
            this.canvas.appendChild(confetti);
        }
    }

    addFloatingHearts() {
        const hearts = ['💕', '💖', '💗', '💝'];

        hearts.forEach((heart, index) => {
            const element = document.createElement('div');
            element.textContent = heart;
            element.style.cssText = `
                position: absolute;
                font-size: 25px;
                left: ${10 + index * 25}%;
                top: ${80 - index * 15}%;
                animation: heartFloat 3s ease-in-out infinite;
                animation-delay: ${index * 0.3}s;
                z-index: 5;
            `;
            this.canvas.appendChild(element);
        });
    }

    addCupidEffect() {
        const cupid = document.createElement('div');
        cupid.textContent = '💘';
        cupid.style.cssText = `
            position: absolute;
            font-size: 40px;
            left: 10%;
            top: 20%;
            animation: cupidFly 5s linear infinite;
            z-index: 5;
        `;
        this.canvas.appendChild(cupid);
    }

    addSnowEffect() {
        for (let i = 0; i < 15; i++) {
            const snowflake = document.createElement('div');
            snowflake.textContent = '❄️';
            snowflake.style.cssText = `
                position: absolute;
                font-size: ${10 + Math.random() * 10}px;
                left: ${Math.random() * 100}%;
                top: -20px;
                animation: snowFall ${3 + Math.random() * 2}s linear infinite;
                animation-delay: ${Math.random() * 3}s;
                z-index: 5;
            `;
            this.canvas.appendChild(snowflake);
        }
    }

    addFireworksEffect() {
        const fireworks = ['🎆', '🎇', '✨'];

        fireworks.forEach((firework, index) => {
            const element = document.createElement('div');
            element.textContent = firework;
            element.style.cssText = `
                position: absolute;
                font-size: 35px;
                left: ${20 + index * 30}%;
                top: ${10 + index * 20}%;
                animation: fireworkBurst 2s ease-out infinite;
                animation-delay: ${index * 0.7}s;
                z-index: 5;
            `;
            this.canvas.appendChild(element);
        });
    }

    addGothicEffect() {
        const gothicElements = ['🌹', '⚰️', '🕯️', '🦇'];

        gothicElements.forEach((element, index) => {
            const gothicEl = document.createElement('div');
            gothicEl.textContent = element;
            gothicEl.style.cssText = `
                position: absolute;
                font-size: 28px;
                left: ${15 + index * 20}%;
                top: ${20 + index * 15}%;
                animation: gothicFloat 4s ease-in-out infinite;
                animation-delay: ${index * 0.8}s;
                z-index: 5;
                filter: drop-shadow(0 0 10px #8b0000);
            `;
            this.canvas.appendChild(gothicEl);
        });
    }

    addDarkMagicEffect() {
        const darkElements = ['🌙', '⭐', '🕯️', '🔮'];

        darkElements.forEach((element, index) => {
            const darkEl = document.createElement('div');
            darkEl.textContent = element;
            darkEl.style.cssText = `
                position: absolute;
                font-size: 30px;
                left: ${10 + index * 25}%;
                top: ${25 + index * 10}%;
                animation: darkPulse 3s ease-in-out infinite;
                animation-delay: ${index * 0.6}s;
                z-index: 5;
                filter: drop-shadow(0 0 15px #ff6b35);
            `;
            this.canvas.appendChild(darkEl);
        });
    }

    addMysticalEffect() {
        const mysticalElements = ['✨', '🌟', '💫', '🔮'];

        mysticalElements.forEach((element, index) => {
            const mysticalEl = document.createElement('div');
            mysticalEl.textContent = element;
            mysticalEl.style.cssText = `
                position: absolute;
                font-size: 32px;
                left: ${12 + index * 22}%;
                top: ${18 + index * 18}%;
                animation: mysticalGlow 2.5s ease-in-out infinite;
                animation-delay: ${index * 0.4}s;
                z-index: 5;
                filter: drop-shadow(0 0 20px #6a0dad);
            `;
            this.canvas.appendChild(mysticalEl);
        });
    }

    setupEditor() {
        // Text controls (with null checks)
        const mainTextInput = document.querySelector('.main-text');
        if (mainTextInput) {
            mainTextInput.addEventListener('input', (e) => {
                this.settings.mainText = e.target.value;
                if (this.mainText) {
                    this.mainText.textContent = e.target.value;
                }
            });
        }

        const subTextInput = document.querySelector('.sub-text');
        if (subTextInput) {
            subTextInput.addEventListener('input', (e) => {
                this.settings.subText = e.target.value;
                if (this.subText) {
                    this.subText.textContent = e.target.value;
                }
            });
        }

        const fontSelect = document.querySelector('.font-select');
        if (fontSelect) {
            fontSelect.addEventListener('change', (e) => {
                this.settings.fontFamily = e.target.value;
                if (this.mainText) {
                    this.mainText.style.fontFamily = `'${e.target.value}', cursive`;
                }
            });
        }

        const fontSizeSlider = document.querySelector('.font-size-slider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                this.settings.fontSize = e.target.value;
                const sizeValue = document.querySelector('.size-value');
                if (sizeValue) sizeValue.textContent = e.target.value + 'px';
                if (this.mainText) {
                    this.mainText.style.fontSize = e.target.value + 'px';
                }
            });
        }

        const textColor = document.querySelector('.text-color');
        if (textColor) {
            textColor.addEventListener('change', (e) => {
                this.settings.textColor = e.target.value;
                if (this.mainText) {
                    this.mainText.style.color = e.target.value;
                }
                if (this.subText) {
                    this.subText.style.color = e.target.value;
                }
            });
        }

        // Design controls (with null checks)
        const primaryColor = document.querySelector('.primary-color');
        if (primaryColor) {
            primaryColor.addEventListener('change', (e) => {
                this.settings.primaryColor = e.target.value;
                this.updateCanvasColors();
            });
        }

        const secondaryColor = document.querySelector('.secondary-color');
        if (secondaryColor) {
            secondaryColor.addEventListener('change', (e) => {
                this.settings.secondaryColor = e.target.value;
                this.updateCanvasColors();
            });
        }

        const borderRadius = document.querySelector('.border-radius');
        if (borderRadius) {
            borderRadius.addEventListener('input', (e) => {
                this.settings.borderRadius = e.target.value;
                const radiusValue = document.querySelector('.radius-value');
                if (radiusValue) radiusValue.textContent = e.target.value + 'px';
                if (this.canvas) this.canvas.style.borderRadius = e.target.value + 'px';
            });
        }

        const shadowIntensity = document.querySelector('.shadow-intensity');
        if (shadowIntensity) {
            shadowIntensity.addEventListener('input', (e) => {
                this.settings.shadowIntensity = e.target.value;
                const shadowValue = document.querySelector('.shadow-value');
                if (shadowValue) shadowValue.textContent = e.target.value + '%';
                this.updateCanvasShadow();
            });
        }

        // Background options
        document.querySelectorAll('.bg-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.bg-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
                this.settings.backgroundType = e.target.dataset.bg;
                this.updateCanvasColors();
            });
        });

        // Style buttons
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                btn.classList.toggle('active');
                this.applyTextStyle(e.target.dataset.style, btn.classList.contains('active'));
            });
        });

        // Effect toggles
        document.querySelectorAll('.effect-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const isOn = e.target.textContent === 'ON';
                e.target.textContent = isOn ? 'OFF' : 'ON';
                e.target.style.background = isOn ? '#6b7280' : '#00d4aa';

                const effectName = e.target.closest('.effect-item').querySelector('.effect-name').textContent.toLowerCase();
                this.toggleEffect(effectName, !isOn);
            });
        });
    }

    updateCanvasColors() {
        if (this.settings.backgroundType === 'gradient') {
            this.canvasBackground.style.background =
                `linear-gradient(135deg, ${this.settings.primaryColor}, ${this.settings.secondaryColor})`;
        } else if (this.settings.backgroundType === 'solid') {
            this.canvasBackground.style.background = this.settings.primaryColor;
        }
    }

    updateCanvasShadow() {
        const intensity = this.settings.shadowIntensity / 100;
        this.canvas.style.boxShadow = `0 ${10 * intensity}px ${40 * intensity}px rgba(0, 0, 0, ${0.3 * intensity})`;
    }

    applyTextStyle(style, active) {
        if (!this.mainText) return;

        switch (style) {
            case 'bold':
                this.mainText.style.fontWeight = active ? '700' : '400';
                break;
            case 'italic':
                this.mainText.style.fontStyle = active ? 'italic' : 'normal';
                break;
            case 'underline':
                this.mainText.style.textDecoration = active ? 'underline' : 'none';
                break;
            case 'center':
                this.mainText.style.textAlign = active ? 'center' : 'left';
                break;
        }
    }

    toggleEffect(effectName, enabled) {
        this.settings.effects[effectName] = enabled;

        // Apply effect based on name
        if (effectName.includes('sparkle') && enabled) {
            this.createSparkleEffect();
        }

        if (effectName.includes('glow') && this.mainText) {
            this.mainText.style.textShadow = enabled ?
                '0 0 20px rgba(255, 255, 255, 0.8), 2px 2px 4px rgba(0,0,0,0.5)' :
                '2px 2px 4px rgba(0,0,0,0.5)';
        }

        if (effectName.includes('rainbow') && this.mainText) {
            if (enabled) {
                this.mainText.style.background = 'linear-gradient(45deg, #ff6b9d, #c44569, #f093fb, #00d4aa)';
                this.mainText.style.webkitBackgroundClip = 'text';
                this.mainText.style.webkitTextFillColor = 'transparent';
                this.mainText.style.backgroundClip = 'text';
            } else {
                this.mainText.style.background = 'none';
                this.mainText.style.webkitTextFillColor = 'white';
                this.mainText.style.color = 'white';
            }
        }
    }

    updateEditorValues() {
        document.querySelector('.main-text').value = this.settings.mainText;
        document.querySelector('.sub-text').value = this.settings.subText;
        document.querySelector('.font-select').value = this.settings.fontFamily;
        document.querySelector('.font-size-slider').value = this.settings.fontSize;
        document.querySelector('.size-value').textContent = this.settings.fontSize + 'px';
        document.querySelector('.text-color').value = this.settings.textColor;
        document.querySelector('.primary-color').value = this.settings.primaryColor;
        document.querySelector('.secondary-color').value = this.settings.secondaryColor;
        document.querySelector('.border-radius').value = this.settings.borderRadius;
        document.querySelector('.radius-value').textContent = this.settings.borderRadius + 'px';
        document.querySelector('.shadow-intensity').value = this.settings.shadowIntensity;
        document.querySelector('.shadow-value').textContent = this.settings.shadowIntensity + '%';
    }

    switchEditorTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`[data-tab="${tab}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Show/hide editor sections
        document.querySelectorAll('.editor-section').forEach(section => {
            section.classList.add('hidden');
        });

        const targetSection = document.getElementById(`${tab}-editor`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    }

    initializeCanvas() {
        this.updateCanvasColors();
        this.updateCanvasShadow();
    }

    // Canvas controls
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
        this.updateZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.3);
        this.updateZoom();
    }

    updateZoom() {
        const wrapper = document.querySelector('.canvas-wrapper');
        wrapper.style.transform = `scale(${this.zoomLevel})`;
        document.querySelector('.zoom-level').textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }

    fitCanvas() {
        this.zoomLevel = 1;
        this.updateZoom();
    }

    toggleGrid() {
        this.gridEnabled = !this.gridEnabled;
        const btn = document.getElementById('grid-toggle');

        if (this.gridEnabled) {
            btn.classList.add('active');
            this.canvas.style.backgroundImage = 'radial-gradient(circle at 20px 20px, rgba(255, 255, 255, 0.1) 1px, transparent 0)';
            this.canvas.style.backgroundSize = '20px 20px';
        } else {
            btn.classList.remove('active');
            this.canvas.style.backgroundImage = 'none';
        }
    }

    toggleGuides() {
        this.guidesEnabled = !this.guidesEnabled;
        const btn = document.getElementById('guides-toggle');
        btn.classList.toggle('active', this.guidesEnabled);

        // Add guide implementation here if needed
    }

    changeFormat(format) {
        this.currentFormat = format;

        const dimensions = {
            square: { width: 600, height: 600 },
            landscape: { width: 800, height: 450 },
            portrait: { width: 450, height: 800 },
            story: { width: 450, height: 800 }
        };

        const dim = dimensions[format];
        this.canvas.style.width = dim.width + 'px';
        this.canvas.style.height = dim.height + 'px';
    }

    // Preview and export
    showPreview() {
        console.log('🔮 Summoning preview from the digital realm...');
        
        const modal = document.getElementById('preview-modal');
        const previewCard = document.getElementById('preview-card');

        if (!modal) {
            console.error('❌ Preview modal not found in the DOM');
            return;
        }

        if (!previewCard) {
            console.error('❌ Preview card not found in the DOM');
            return;
        }

        // Clone canvas content for preview
        if (this.canvas && this.canvasBackground) {
            previewCard.innerHTML = this.canvas.innerHTML;
            previewCard.style.background = this.canvasBackground.style.background;
            previewCard.style.borderRadius = this.canvas.style.borderRadius || '12px';
            
            console.log('✅ Preview content cloned successfully');
        } else {
            console.error('❌ Canvas or canvas background not found');
            previewCard.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">No content to preview</div>';
        }

        modal.classList.remove('hidden');
        console.log('👁️ Preview modal summoned successfully');
    }

    hidePreview() {
        const modal = document.getElementById('preview-modal');
        if (modal) {
            modal.classList.add('hidden');
            console.log('👻 Preview modal banished to the shadow realm');
        }
    }

    downloadGreeting() {
        // Create a temporary canvas for export
        const exportCanvas = document.createElement('canvas');
        const ctx = exportCanvas.getContext('2d');

        // Set canvas size based on current format
        const dimensions = {
            square: { width: 1080, height: 1080 },
            landscape: { width: 1920, height: 1080 },
            portrait: { width: 1080, height: 1920 },
            story: { width: 1080, height: 1920 }
        };

        const dim = dimensions[this.currentFormat];
        exportCanvas.width = dim.width;
        exportCanvas.height = dim.height;

        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, dim.width, dim.height);
        gradient.addColorStop(0, this.settings.primaryColor);
        gradient.addColorStop(1, this.settings.secondaryColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, dim.width, dim.height);

        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = `bold ${this.settings.fontSize * 2}px ${this.settings.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(this.settings.mainText, dim.width / 2, dim.height * 0.4);

        ctx.font = `${this.settings.fontSize}px Poppins`;
        ctx.fillText(this.settings.subText, dim.width / 2, dim.height * 0.6);

        // Download the image
        const link = document.createElement('a');
        link.download = `wishify-greeting-${Date.now()}.png`;
        link.href = exportCanvas.toDataURL();
        link.click();

        console.log('📜 Cursed greeting scroll exported to mortal realm');
    }

    shareGreeting() {
        if (navigator.share) {
            navigator.share({
                title: 'My Wishify Greeting',
                text: 'Check out this beautiful greeting I created with Wishify!',
                url: window.location.href
            });
        } else {
            // Fallback: copy link to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard! Share it with your friends.');
            });
        }
    }

    setupPanelInteractions() {
        // Image panel interactions
        document.querySelectorAll('.image-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.addImageToCanvas(e.currentTarget.dataset.image);
            });
        });

        // Audio panel interactions
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playAudio(e.currentTarget.closest('.audio-item').dataset.audio);
            });
        });

        // Effects panel interactions
        document.querySelectorAll('.effect-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.applyEffect(e.currentTarget.dataset.effect);
            });
        });

        // Font panel interactions
        document.querySelectorAll('.font-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.applyFont(e.currentTarget.dataset.font);
            });
        });

        // Color panel interactions
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                this.applyColor(e.currentTarget.dataset.color);
            });
        });

        // Shape panel interactions
        document.querySelectorAll('.shape-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.addShape(e.currentTarget.dataset.shape);
            });
        });

        // Sticker panel interactions
        document.querySelectorAll('.sticker-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.addSticker(e.currentTarget.dataset.sticker);
            });
        });

        // Category button interactions
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active from siblings
                e.currentTarget.parentElement.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.currentTarget.classList.add('active');

                // Filter content based on category
                this.filterPanelContent(e.currentTarget);
            });
        });
    }

    filterPanelContent(categoryBtn) {
        const category = categoryBtn.dataset.imgCategory || categoryBtn.dataset.audioCategory || categoryBtn.dataset.stickerCategory || categoryBtn.dataset.colorCategory;
        const panel = categoryBtn.closest('.content-panel');

        console.log('🏷️ Filtering panel content:', {
            category: category,
            panelId: panel ? panel.id : 'not found',
            button: categoryBtn
        });

        if (panel && panel.id === 'images-panel') {
            this.filterImages(category);
        } else if (panel && panel.id === 'audio-panel') {
            this.filterAudio(category);
        }
    }

    initializeImageGrid() {
        console.log('🖼️ Initializing image grid...');
        const imageGrid = document.getElementById('image-grid');
        if (!imageGrid) {
            console.error('❌ Image grid not found');
            return;
        }

        // Make sure sample images are visible by default
        const sampleImages = document.querySelectorAll('.image-item[data-category="sample"]');
        console.log('📸 Found sample images:', sampleImages.length);

        sampleImages.forEach(item => {
            item.style.display = 'block';

            // Add click handler for sample images
            item.addEventListener('click', () => {
                console.log('🖱️ Sample image clicked:', item.dataset.image);
                this.selectImage(item.dataset.image);
            });
        });

        // Set initial category filter to show sample images
        this.filterImages('sample');
    }

    filterImages(category) {
        console.log('🖼️ Filtering images by category:', category);
        const imageItems = document.querySelectorAll('.image-item');
        console.log('📸 Found image items:', imageItems.length);

        let visibleCount = 0;
        imageItems.forEach(item => {
            const isVisible = (category === 'sample' && item.classList.contains('sample-image')) ||
                (category === 'uploaded' && item.classList.contains('uploaded-item')) ||
                (category !== 'sample' && category !== 'uploaded' && item.dataset.category === category);

            if (isVisible) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        console.log('👁️ Visible images after filter:', visibleCount);
    }

    filterAudio(category) {
        const audioItems = document.querySelectorAll('.audio-item');
        audioItems.forEach(item => {
            if (category === 'sample' && item.classList.contains('sample-audio')) {
                item.style.display = 'flex';
            } else if (category === 'uploaded' && item.classList.contains('uploaded-item')) {
                item.style.display = 'flex';
            } else if (category !== 'sample' && category !== 'uploaded' && item.dataset.category === category) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    addImageToCanvas(imageId) {
        console.log('🖼️ Adding image to canvas:', imageId);

        // Find the image data (either sample or uploaded)
        const sampleItem = document.querySelector(`[data-image="${imageId}"]`);

        if (sampleItem && sampleItem.classList.contains('sample-image')) {
            // Handle sample image
            const imagePreview = sampleItem.querySelector('.image-preview');
            if (imagePreview && this.canvasBackground) {
                const background = imagePreview.style.background;
                console.log('📸 Applying sample image background:', background);
                this.canvasBackground.style.background = background;
            }
        } else {
            // Handle uploaded image
            const imageData = this.uploadedImages.find(img => img.id === imageId);
            if (imageData && this.canvasBackground) {
                console.log('📸 Applying uploaded image:', imageData.name);
                this.canvasBackground.style.backgroundImage = `url(${imageData.url})`;
                this.canvasBackground.style.backgroundSize = 'cover';
                this.canvasBackground.style.backgroundPosition = 'center';
                this.canvasBackground.style.backgroundRepeat = 'no-repeat';
            }
        }
    }

    playAudio(audioId) {
        console.log('🎵 Playing audio:', audioId);
        // Implementation for playing audio previews
    }

    applyEffect(effectId) {
        console.log('✨ Applying effect:', effectId);
        // Apply the selected effect to the canvas
        switch (effectId) {
            case 'floating-ghosts':
                this.addFloatingGhosts();
                break;
            case 'falling-leaves':
                this.addFallingLeaves();
                break;
            case 'sparkle-trail':
                this.createSparkleEffect();
                break;
            case 'blood-drip':
                this.addBloodDrip();
                break;
        }
    }

    applyFont(fontName) {
        console.log('🔤 Applying font:', fontName);
        this.settings.fontFamily = fontName;
        if (this.mainText) {
            this.mainText.style.fontFamily = `'${fontName}', cursive`;
        }
        // Update the font selector in the editor
        document.querySelector('.font-select').value = fontName;
    }

    applyColor(color) {
        console.log('🎨 Applying color:', color);
        this.settings.primaryColor = color;
        if (this.mainText) {
            this.mainText.style.color = color;
        }
        if (this.subText) {
            this.subText.style.color = color;
        }
        // Update color inputs in editor
        document.querySelector('.text-color').value = color;
        document.querySelector('.primary-color').value = color;
    }

    addShape(shapeType) {
        console.log('⬜ Adding shape:', shapeType);
        const shape = document.createElement('div');
        shape.className = 'canvas-shape';
        shape.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 8;
        `;

        switch (shapeType) {
            case 'rectangle':
                shape.style.width = '100px';
                shape.style.height = '60px';
                shape.style.background = this.settings.primaryColor;
                shape.style.borderRadius = '8px';
                break;
            case 'circle':
                shape.style.width = '80px';
                shape.style.height = '80px';
                shape.style.background = this.settings.primaryColor;
                shape.style.borderRadius = '50%';
                break;
            case 'triangle':
                shape.innerHTML = '🔺';
                shape.style.fontSize = '60px';
                shape.style.color = this.settings.primaryColor;
                break;
            case 'star':
                shape.innerHTML = '⭐';
                shape.style.fontSize = '60px';
                shape.style.color = this.settings.primaryColor;
                break;
        }

        this.canvas.appendChild(shape);
        this.makeElementInteractive(shape);
    }

    addSticker(sticker) {
        console.log('😈 Adding sticker:', sticker);
        const stickerEl = document.createElement('div');
        stickerEl.className = 'canvas-sticker';
        stickerEl.textContent = sticker;
        stickerEl.style.cssText = `
            position: absolute;
            left: ${Math.random() * 70 + 15}%;
            top: ${Math.random() * 70 + 15}%;
            font-size: 40px;
            z-index: 9;
            cursor: move;
            filter: drop-shadow(0 0 10px var(--spooky-glow));
        `;

        this.canvas.appendChild(stickerEl);
        this.makeElementInteractive(stickerEl);
    }

    addFallingLeaves() {
        const leaves = ['🍂', '🍁', '🌿'];

        for (let i = 0; i < 8; i++) {
            const leaf = document.createElement('div');
            leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
            leaf.style.cssText = `
                position: absolute;
                font-size: ${15 + Math.random() * 10}px;
                left: ${Math.random() * 100}%;
                top: -20px;
                animation: leafFall ${2 + Math.random() * 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                z-index: 6;
            `;
            this.canvas.appendChild(leaf);
        }
    }

    addBloodDrip() {
        for (let i = 0; i < 5; i++) {
            const drop = document.createElement('div');
            drop.textContent = '🩸';
            drop.style.cssText = `
                position: absolute;
                font-size: 20px;
                left: ${Math.random() * 100}%;
                top: -10px;
                animation: bloodDrip ${1 + Math.random()}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                z-index: 6;
            `;
            this.canvas.appendChild(drop);
        }
    }

    makeElementInteractive(element) {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element);
        });

        element.addEventListener('mousedown', (e) => {
            if (this.currentTool === 'select') {
                e.stopPropagation();
                this.selectElement(element);
                this.startDragging(element, e);
            }
        });
    }

    setupFileUploads() {
        // Image upload setup
        const imageUploadArea = document.getElementById('image-upload-area');
        const imageUploadInput = document.getElementById('image-upload');

        imageUploadArea.addEventListener('click', () => {
            imageUploadInput.click();
        });

        imageUploadInput.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files);
        });

        // Image drag and drop
        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.classList.add('dragover');
        });

        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.classList.remove('dragover');
        });

        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files).filter(file =>
                file.type.startsWith('image/')
            );
            this.handleImageUpload(files);
        });

        // Audio upload setup
        const audioUploadArea = document.getElementById('audio-upload-area');
        const audioUploadInput = document.getElementById('audio-upload');

        audioUploadArea.addEventListener('click', () => {
            audioUploadInput.click();
        });

        audioUploadInput.addEventListener('change', (e) => {
            this.handleAudioUpload(e.target.files);
        });

        // Audio drag and drop
        audioUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            audioUploadArea.classList.add('dragover');
        });

        audioUploadArea.addEventListener('dragleave', () => {
            audioUploadArea.classList.remove('dragover');
        });

        audioUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            audioUploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files).filter(file =>
                file.type.startsWith('audio/')
            );
            this.handleAudioUpload(files);
        });

        // Canvas drag and drop for direct adding
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.showCanvasDropZone();
        });

        this.canvas.addEventListener('dragleave', (e) => {
            if (!this.canvas.contains(e.relatedTarget)) {
                this.hideCanvasDropZone();
            }
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.hideCanvasDropZone();
            const files = Array.from(e.dataTransfer.files);
            const images = files.filter(file => file.type.startsWith('image/'));

            if (images.length > 0) {
                this.addImageDirectlyToCanvas(images[0], e);
            }
        });
    }

    handleImageUpload(files) {
        Array.from(files).forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                this.showUploadError('Image file too large. Maximum size is 10MB.');
                return;
            }

            if (!file.type.startsWith('image/')) {
                this.showUploadError('Please upload only image files.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: 'uploaded-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    url: e.target.result,
                    size: this.formatFileSize(file.size),
                    type: file.type
                };

                this.uploadedImages.push(imageData);
                this.addImageToGrid(imageData);
                this.showUploadSuccess('Image uploaded successfully!');
            };
            reader.readAsDataURL(file);
        });
    }

    handleAudioUpload(files) {
        Array.from(files).forEach(file => {
            if (file.size > 25 * 1024 * 1024) { // 25MB limit
                this.showUploadError('Audio file too large. Maximum size is 25MB.');
                return;
            }

            if (!file.type.startsWith('audio/')) {
                this.showUploadError('Please upload only audio files.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const audioData = {
                    id: 'uploaded-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    url: e.target.result,
                    size: this.formatFileSize(file.size),
                    type: file.type,
                    duration: '0:00' // Will be updated when audio loads
                };

                this.uploadedAudio.push(audioData);
                this.addAudioToList(audioData);
                this.showUploadSuccess('Audio uploaded successfully!');
            };
            reader.readAsDataURL(file);
        });
    }

    addImageToGrid(imageData) {
        const imageGrid = document.getElementById('image-grid');
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item uploaded-item';
        imageItem.dataset.image = imageData.id;
        imageItem.dataset.category = 'uploaded';

        imageItem.innerHTML = `
            <div class="image-preview" style="background-image: url('${imageData.url}'); background-size: cover; background-position: center;">
                <div class="file-type-icon">${imageData.type.split('/')[1].toUpperCase()}</div>
            </div>
            <span class="image-name">${imageData.name}</span>
            <span class="image-size">${imageData.size}</span>
            <button class="delete-btn" onclick="wishifyDesigner.deleteUploadedImage('${imageData.id}')">×</button>
        `;

        imageItem.addEventListener('click', () => {
            this.selectImage(imageData.id);
        });

        imageGrid.appendChild(imageItem);
    }

    selectImage(imageId) {
        console.log('🖼️ Selecting image:', imageId);

        // Remove previous selection
        document.querySelectorAll('.image-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Add selection to clicked image
        const selectedItem = document.querySelector(`[data-image="${imageId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');

            // Apply image to canvas
            this.addImageToCanvas(imageId);

            // Show success notification
            this.showUploadSuccess('Image selected successfully!');
        }
    }

    addAudioToList(audioData) {
        const audioList = document.getElementById('audio-list');
        const audioItem = document.createElement('div');
        audioItem.className = 'audio-item uploaded-item';
        audioItem.dataset.audio = audioData.id;
        audioItem.dataset.category = 'uploaded';

        audioItem.innerHTML = `
            <div class="audio-icon">🎵</div>
            <div class="audio-info">
                <span class="audio-name">${audioData.name}</span>
                <span class="audio-duration">${audioData.duration}</span>
                <span class="audio-size">${audioData.size}</span>
            </div>
            <button class="play-btn">▶️</button>
            <button class="delete-btn" onclick="wishifyDesigner.deleteUploadedAudio('${audioData.id}')">×</button>
            <div class="audio-progress">
                <div class="audio-progress-bar"></div>
            </div>
        `;

        const playBtn = audioItem.querySelector('.play-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playUploadedAudio(audioData);
        });

        audioList.appendChild(audioItem);

        // Load audio to get duration
        const audio = new Audio(audioData.url);
        audio.addEventListener('loadedmetadata', () => {
            const duration = this.formatDuration(audio.duration);
            audioItem.querySelector('.audio-duration').textContent = duration;
            audioData.duration = duration;
        });
    }

    deleteUploadedImage(imageId) {
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
        const imageItem = document.querySelector(`[data-image="${imageId}"]`);
        if (imageItem) {
            imageItem.remove();
        }
    }

    deleteUploadedAudio(audioId) {
        this.uploadedAudio = this.uploadedAudio.filter(audio => audio.id !== audioId);
        const audioItem = document.querySelector(`[data-audio="${audioId}"]`);
        if (audioItem) {
            audioItem.remove();
        }

        // Stop audio if it's currently playing
        if (this.currentAudio && this.currentAudio.dataset.audio === audioId) {
            this.stopCurrentAudio();
        }
    }

    playUploadedAudio(audioData) {
        // Stop current audio if playing
        this.stopCurrentAudio();

        const audio = new Audio(audioData.url);
        const audioItem = document.querySelector(`[data-audio="${audioData.id}"]`);
        const playBtn = audioItem.querySelector('.play-btn');
        const progressBar = audioItem.querySelector('.audio-progress-bar');

        audioItem.classList.add('playing');
        playBtn.textContent = '⏸️';

        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = progress + '%';
        });

        audio.addEventListener('ended', () => {
            this.stopCurrentAudio();
        });

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.textContent = '⏸️';
                audioItem.classList.add('playing');
            } else {
                audio.pause();
                playBtn.textContent = '▶️';
                audioItem.classList.remove('playing');
            }
        });

        this.currentAudio = audioItem;
        this.currentAudioElement = audio;
        audio.play();
    }

    stopCurrentAudio() {
        if (this.currentAudio) {
            this.currentAudio.classList.remove('playing');
            const playBtn = this.currentAudio.querySelector('.play-btn');
            const progressBar = this.currentAudio.querySelector('.audio-progress-bar');

            playBtn.textContent = '▶️';
            progressBar.style.width = '0%';

            if (this.currentAudioElement) {
                this.currentAudioElement.pause();
                this.currentAudioElement.currentTime = 0;
            }

            this.currentAudio = null;
            this.currentAudioElement = null;
        }
    }

    addImageDirectlyToCanvas(file, event) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('div');
            img.className = 'canvas-image';

            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            img.style.cssText = `
                position: absolute;
                left: ${x - 50}px;
                top: ${y - 50}px;
                width: 100px;
                height: 100px;
                background-image: url('${e.target.result}');
                background-size: cover;
                background-position: center;
                border-radius: 8px;
                cursor: move;
                z-index: 10;
                border: 2px solid transparent;
            `;

            this.canvas.appendChild(img);
            this.makeElementInteractive(img);
        };
        reader.readAsDataURL(file);
    }

    showCanvasDropZone() {
        let dropZone = document.querySelector('.canvas-drop-zone');
        if (!dropZone) {
            dropZone = document.createElement('div');
            dropZone.className = 'canvas-drop-zone';
            dropZone.innerHTML = `
                <div class="canvas-drop-message">
                    <div class="drop-icon">📸</div>
                    <h3>Drop image here to add to canvas</h3>
                </div>
            `;
            this.canvas.appendChild(dropZone);
        }
        dropZone.classList.add('active');
    }

    hideCanvasDropZone() {
        const dropZone = document.querySelector('.canvas-drop-zone');
        if (dropZone) {
            dropZone.classList.remove('active');
        }
    }

    showUploadError(message) {
        this.showNotification(message, 'error');
    }

    showUploadSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            ${type === 'error' ? 'background: var(--blood-red);' : 'background: var(--success-color);'}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    setupFileUploads() {
        // Image upload functionality
        const imageUploadArea = document.getElementById('image-upload-area');
        const imageUploadInput = document.getElementById('image-upload');

        if (imageUploadArea && imageUploadInput) {
            // Click to upload
            imageUploadArea.addEventListener('click', () => {
                imageUploadInput.click();
            });

            // File selection
            imageUploadInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files);
            });

            // Drag and drop
            imageUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                imageUploadArea.style.borderColor = 'var(--accent-color)';
                imageUploadArea.style.background = 'rgba(255, 107, 53, 0.1)';
            });

            imageUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                imageUploadArea.style.borderColor = 'var(--border-color)';
                imageUploadArea.style.background = 'var(--background-light)';
            });

            imageUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                imageUploadArea.style.borderColor = 'var(--border-color)';
                imageUploadArea.style.background = 'var(--background-light)';
                this.handleImageUpload(e.dataTransfer.files);
            });
        }

        // Audio upload functionality
        const audioUploadArea = document.getElementById('audio-upload-area');
        const audioUploadInput = document.getElementById('audio-upload');

        if (audioUploadArea && audioUploadInput) {
            // Click to upload
            audioUploadArea.addEventListener('click', () => {
                audioUploadInput.click();
            });

            // File selection
            audioUploadInput.addEventListener('change', (e) => {
                this.handleAudioUpload(e.target.files);
            });

            // Drag and drop
            audioUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                audioUploadArea.style.borderColor = 'var(--accent-color)';
                audioUploadArea.style.background = 'rgba(255, 107, 53, 0.1)';
            });

            audioUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                audioUploadArea.style.borderColor = 'var(--border-color)';
                audioUploadArea.style.background = 'var(--background-light)';
            });

            audioUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                audioUploadArea.style.borderColor = 'var(--border-color)';
                audioUploadArea.style.background = 'var(--background-light)';
                this.handleAudioUpload(e.dataTransfer.files);
            });
        }

        console.log('📁 File upload areas initialized');
    }

    handleImageUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        name: file.name,
                        url: e.target.result,
                        type: 'uploaded'
                    };
                    this.uploadedImages.push(imageData);
                    this.addImageToGrid(imageData);
                    console.log('📸 Image uploaded:', file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    handleAudioUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('audio/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const audioData = {
                        name: file.name,
                        url: e.target.result,
                        type: 'uploaded'
                    };
                    this.uploadedAudio.push(audioData);
                    this.addAudioToList(audioData);
                    console.log('🎵 Audio uploaded:', file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addImageToGrid(imageData) {
        const imageGrid = document.getElementById('image-grid');
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item uploaded-image';
        imageItem.dataset.category = 'uploaded';

        imageItem.innerHTML = `
            <div class="image-preview" style="background-image: url('${imageData.url}'); background-size: cover; background-position: center;"></div>
            <span class="image-name">${imageData.name}</span>
        `;

        imageGrid.appendChild(imageItem);

        // Add click handler
        imageItem.addEventListener('click', () => {
            this.applyImageToCanvas(imageData);
        });
    }

    addAudioToList(audioData) {
        const audioList = document.getElementById('audio-list');
        const audioItem = document.createElement('div');
        audioItem.className = 'audio-item uploaded-audio';
        audioItem.dataset.category = 'uploaded';

        audioItem.innerHTML = `
            <div class="audio-icon">🎵</div>
            <div class="audio-info">
                <span class="audio-name">${audioData.name}</span>
                <span class="audio-duration">--:--</span>
            </div>
            <button class="play-btn">▶️</button>
        `;

        audioList.appendChild(audioItem);

        // Add click handler for play button
        const playBtn = audioItem.querySelector('.play-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playAudio(audioData);
        });
    }

    applyImageToCanvas(imageData) {
        // Create image element on canvas
        const img = document.createElement('img');
        img.src = imageData.url;
        img.style.cssText = `
            position: absolute;
            top: 20%;
            left: 20%;
            max-width: 60%;
            max-height: 60%;
            border-radius: 8px;
            z-index: 5;
            cursor: move;
        `;

        this.canvas.appendChild(img);
        console.log('🖼️ Image applied to canvas:', imageData.name);
    }

    playAudio(audioData) {
        // Stop current audio if playing
        if (this.currentAudio) {
            this.currentAudio.pause();
        }

        // Create and play new audio
        this.currentAudio = new Audio(audioData.url);
        this.currentAudio.play();
        console.log('🎵 Playing audio:', audioData.name);
    }

    initializeCanvas() {
        if (this.canvasBackground) {
            // Set default background
            this.canvasBackground.style.background = 'linear-gradient(135deg, #ff6b9d, #c44569)';
            console.log('🎨 Canvas initialized with default background');
        }
    }

    initializeImageGrid() {
        // Add click handlers to sample images
        document.querySelectorAll('.sample-image').forEach(item => {
            item.addEventListener('click', () => {
                const imageName = item.dataset.image;
                const category = item.dataset.category;
                console.log('🖼️ Sample image clicked:', imageName);
                this.applySampleImage(imageName, category);
            });
        });

        // Add click handlers to image category buttons
        document.querySelectorAll('[data-img-category]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                document.querySelectorAll('[data-img-category]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Filter images
                const category = e.target.dataset.imgCategory;
                this.filterImages(category);
            });
        });

        console.log('🖼️ Image grid initialized');
    }

    applySampleImage(imageName, category) {
        // Create a sample image element on canvas
        const imageEl = document.createElement('div');
        imageEl.className = 'sample-image-element';
        imageEl.style.cssText = `
            position: absolute;
            top: 20%;
            left: 20%;
            width: 60%;
            height: 60%;
            background: var(--gradient-primary);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            z-index: 5;
            cursor: move;
        `;

        // Add appropriate emoji based on image name
        const imageEmojis = {
            'spooky-bg-1': '🏚️',
            'spooky-bg-2': '🌙',
            'spooky-bg-3': '🕷️',
            'gothic-bg-1': '🖤',
            'mystical-bg-1': '🔮'
        };

        imageEl.textContent = imageEmojis[imageName] || '🖼️';
        this.canvas.appendChild(imageEl);

        console.log('🖼️ Sample image applied:', imageName);
    }

    filterImages(category) {
        const imageItems = document.querySelectorAll('.image-item');
        imageItems.forEach(item => {
            if (category === 'sample' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        console.log('🔍 Images filtered by category:', category);
    }

    // Drawing Tools System
    setupDrawingTools() {
        this.currentTool = 'select';
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.currentShape = null;
        this.shapes = [];
        this.drawingHistory = [];
        this.historyIndex = -1;

        // Save initial state
        this.saveInitialState();

        // Tool button event listeners
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTool(e.target.closest('.tool-btn').dataset.tool);
            });
        });

        // Action button event listeners
        document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.executeAction(e.target.closest('.tool-btn').dataset.action);
            });
        });

        // Canvas drawing event listeners
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Property controls
        this.setupPropertyControls();

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();

        console.log('🎨 Drawing tools initialized');
    }

    saveInitialState() {
        // Save the initial canvas state
        const state = this.canvas.innerHTML;
        this.drawingHistory.push(state);
        this.historyIndex = 0;
        console.log('💾 Initial canvas state saved');
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            // Ctrl/Cmd + Shift + Z for redo
            else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                this.redo();
            }
            // Ctrl/Cmd + Y for redo (alternative)
            else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
            // Delete key for deleting selected shapes
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                this.deleteSelected();
            }
            // Escape to deselect all
            else if (e.key === 'Escape') {
                this.deselectAll();
            }
        });

        console.log('⌨️ Keyboard shortcuts enabled: Ctrl+Z (undo), Ctrl+Shift+Z (redo), Delete (remove)');
    }

    deselectAll() {
        document.querySelectorAll('.shape-element.selected, .text-element.selected').forEach(el => {
            el.classList.remove('selected');
        });
    }

    quickUndoLastShape() {
        // Remove the last added shape
        if (this.shapes.length > 0) {
            const lastShape = this.shapes[this.shapes.length - 1];
            lastShape.remove();
            this.shapes.pop();
            this.saveToHistory();
            console.log('⏪ Last shape removed');
        }
    }

    clearAll() {
        // Clear all shapes with confirmation
        if (this.shapes.length > 0) {
            if (confirm('Are you sure you want to clear all shapes? This cannot be undone.')) {
                this.shapes.forEach(shape => shape.remove());
                this.shapes = [];
                this.saveToHistory();
                console.log('🧹 All shapes cleared');
            }
        }
    }

    selectTool(toolName) {
        // Update active tool button
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${toolName}"]`).classList.add('active');

        // Update current tool
        this.currentTool = toolName;

        // Update canvas cursor
        if (this.canvas.setAttribute) {
            this.canvas.setAttribute('class', `greeting-canvas tool-${toolName}`);
        } else {
            this.canvas.className = `greeting-canvas tool-${toolName}`;
        }

        console.log('🔧 Tool selected:', toolName);
    }

    setupPropertyControls() {
        // Fill color (with null check)
        const fillColor = document.querySelector('.fill-color');
        if (fillColor) {
            fillColor.addEventListener('change', (e) => {
                this.updateSelectedShapes('fill', e.target.value);
            });
        }

        // Stroke color (with null check)
        const strokeColor = document.querySelector('.stroke-color');
        if (strokeColor) {
            strokeColor.addEventListener('change', (e) => {
                this.updateSelectedShapes('stroke', e.target.value);
            });
        }

        // Stroke width (with null check)
        const strokeWidth = document.querySelector('.stroke-width');
        if (strokeWidth) {
            strokeWidth.addEventListener('input', (e) => {
                const widthValue = e.target.value;
                const widthValueElement = document.querySelector('.width-value');
                if (widthValueElement) {
                    widthValueElement.textContent = widthValue + 'px';
                }
                this.updateSelectedShapes('strokeWidth', widthValue);

                // Visual feedback - update slider background
                const slider = e.target;
                const percentage = (widthValue - slider.min) / (slider.max - slider.min) * 100;
                slider.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`;
            });
        }

        // Opacity (with null check)
        const opacitySlider = document.querySelector('.opacity-slider');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                const opacityValue = e.target.value;
                const opacityValueElement = document.querySelector('.opacity-value');
                if (opacityValueElement) {
                    opacityValueElement.textContent = opacityValue + '%';
                }
                this.updateSelectedShapes('opacity', opacityValue / 100);

                // Visual feedback - update slider background
                const slider = e.target;
                const percentage = (opacityValue - slider.min) / (slider.max - slider.min) * 100;
                slider.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`;
            });
        }
    }

    startDrawing(e) {
        if (this.currentTool === 'select' || this.currentTool === 'hand') return;

        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

        if (this.currentTool === 'text') {
            this.createTextElement(this.startX, this.startY);
        } else if (['rectangle', 'circle', 'triangle', 'star', 'heart'].includes(this.currentTool)) {
            this.createShape(this.currentTool, this.startX, this.startY);
        } else if (['pen', 'brush', 'line', 'arrow'].includes(this.currentTool)) {
            this.startPath(this.startX, this.startY);
        }
    }

    draw(e) {
        if (!this.isDrawing || !this.currentShape) return;

        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        if (['rectangle', 'circle', 'triangle', 'star', 'heart'].includes(this.currentTool)) {
            this.updateShapeSize(currentX, currentY);
        } else if (['pen', 'brush'].includes(this.currentTool)) {
            this.continuePath(currentX, currentY);
        } else if (['line', 'arrow'].includes(this.currentTool)) {
            this.updateLine(currentX, currentY);
        }
    }

    stopDrawing(e) {
        if (!this.isDrawing) return;

        this.isDrawing = false;

        if (this.currentShape) {
            this.finalizeShape();
            this.saveToHistory();
        }
    }

    createShape(type, x, y) {
        const shape = document.createElement('div');
        shape.className = 'shape-element';
        shape.dataset.shapeType = type;

        const fillColor = document.querySelector('.fill-color').value;
        const strokeColor = document.querySelector('.stroke-color').value;
        const strokeWidth = document.querySelector('.stroke-width').value;
        const opacity = document.querySelector('.opacity-slider').value / 100;

        shape.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: 0px;
            height: 0px;
            background: ${fillColor};
            border: ${strokeWidth}px solid ${strokeColor};
            opacity: ${opacity};
            z-index: 10;
        `;

        // Add shape-specific styling
        switch (type) {
            case 'rectangle':
                shape.style.borderRadius = '4px';
                break;
            case 'circle':
                shape.style.borderRadius = '50%';
                break;
            case 'triangle':
                shape.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                break;
            case 'star':
                shape.innerHTML = '⭐';
                shape.style.display = 'flex';
                shape.style.alignItems = 'center';
                shape.style.justifyContent = 'center';
                shape.style.fontSize = '24px';
                shape.style.background = 'transparent';
                shape.style.border = 'none';
                break;
            case 'heart':
                shape.innerHTML = '💖';
                shape.style.display = 'flex';
                shape.style.alignItems = 'center';
                shape.style.justifyContent = 'center';
                shape.style.fontSize = '24px';
                shape.style.background = 'transparent';
                shape.style.border = 'none';
                break;
        }

        this.canvas.appendChild(shape);
        this.currentShape = shape;
        this.shapes.push(shape);

        // Add click handler for selection
        shape.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectShape(shape);
        });
    }

    updateShapeSize(currentX, currentY) {
        if (!this.currentShape) return;

        const width = Math.abs(currentX - this.startX);
        const height = Math.abs(currentY - this.startY);
        const left = Math.min(this.startX, currentX);
        const top = Math.min(this.startY, currentY);

        this.currentShape.style.left = left + 'px';
        this.currentShape.style.top = top + 'px';
        this.currentShape.style.width = width + 'px';
        this.currentShape.style.height = height + 'px';

        // For star and heart, adjust font size based on size
        if (['star', 'heart'].includes(this.currentShape.dataset.shapeType)) {
            const fontSize = Math.min(width, height) * 0.8;
            this.currentShape.style.fontSize = Math.max(16, fontSize) + 'px';
        }
    }

    createTextElement(x, y) {
        const textEl = document.createElement('div');
        textEl.className = 'text-element';
        textEl.contentEditable = true;
        textEl.textContent = 'Double click to edit';

        textEl.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: white;
            font-family: 'Poppins', sans-serif;
            font-size: 18px;
            background: rgba(0, 0, 0, 0.1);
            padding: 8px;
            border-radius: 4px;
            min-width: 100px;
            z-index: 10;
            cursor: text;
        `;

        this.canvas.appendChild(textEl);
        this.shapes.push(textEl);

        // Focus for immediate editing
        textEl.focus();
        textEl.select();

        // Add blur handler to finalize text
        textEl.addEventListener('blur', () => {
            if (textEl.textContent.trim() === '') {
                textEl.remove();
                this.shapes = this.shapes.filter(s => s !== textEl);
            }
        });

        this.saveToHistory();
    }

    selectShape(shape) {
        // Clear previous selections
        document.querySelectorAll('.shape-element.selected, .text-element.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Select new shape
        shape.classList.add('selected');
        console.log('🎯 Shape selected:', shape.dataset.shapeType || 'text');
    }

    updateSelectedShapes(property, value) {
        document.querySelectorAll('.shape-element.selected').forEach(shape => {
            switch (property) {
                case 'fill':
                    if (!['star', 'heart'].includes(shape.dataset.shapeType)) {
                        shape.style.background = value;
                    }
                    break;
                case 'stroke':
                    shape.style.borderColor = value;
                    break;
                case 'strokeWidth':
                    shape.style.borderWidth = value + 'px';
                    break;
                case 'opacity':
                    shape.style.opacity = value;
                    break;
            }
        });
    }

    executeAction(action) {
        switch (action) {
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'quick-undo':
                this.quickUndoLastShape();
                break;
            case 'delete':
                this.deleteSelected();
                break;
            case 'duplicate':
                this.duplicateSelected();
                break;
            case 'clear-all':
                this.clearAll();
                break;
        }
    }

    deleteSelected() {
        const selected = document.querySelectorAll('.shape-element.selected, .text-element.selected');
        selected.forEach(el => {
            el.remove();
            this.shapes = this.shapes.filter(s => s !== el);
        });
        this.saveToHistory();
    }

    duplicateSelected() {
        const selected = document.querySelectorAll('.shape-element.selected, .text-element.selected');
        selected.forEach(el => {
            const clone = el.cloneNode(true);
            clone.classList.remove('selected');

            // Offset the duplicate
            const left = parseInt(el.style.left) + 20;
            const top = parseInt(el.style.top) + 20;
            clone.style.left = left + 'px';
            clone.style.top = top + 'px';

            this.canvas.appendChild(clone);
            this.shapes.push(clone);

            // Add event listeners to clone
            clone.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectShape(clone);
            });
        });
        this.saveToHistory();
    }

    saveToHistory() {
        // Remove any history after current index
        this.drawingHistory = this.drawingHistory.slice(0, this.historyIndex + 1);

        // Save current state
        const state = this.canvas.innerHTML;
        this.drawingHistory.push(state);
        this.historyIndex++;

        // Limit history size
        if (this.drawingHistory.length > 50) {
            this.drawingHistory.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.drawingHistory[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.drawingHistory.length - 1) {
            this.historyIndex++;
            this.restoreState(this.drawingHistory[this.historyIndex]);
        }
    }

    restoreState(state) {
        this.canvas.innerHTML = state;
        this.shapes = Array.from(this.canvas.querySelectorAll('.shape-element, .text-element, .drawing-path'));

        // Re-add event listeners only to interactive elements
        this.shapes.forEach(shape => {
            if (shape.classList.contains('shape-element') || shape.classList.contains('text-element')) {
                shape.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectShape(shape);
                });
            }
        });
    }

    handleCanvasClick(e) {
        if (this.currentTool === 'select') {
            // Clear selections when clicking empty area
            document.querySelectorAll('.shape-element.selected, .text-element.selected').forEach(el => {
                el.classList.remove('selected');
            });
        }
    }

    finalizeShape() {
        this.currentShape = null;
    }

    startPath(x, y) {
        // For pen/brush tools - create a container for brush strokes
        const pathContainer = document.createElement('div');
        pathContainer.className = 'drawing-path';
        pathContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 15;
        `;

        this.canvas.appendChild(pathContainer);

        // Create first brush dot
        this.createBrushDot(x, y, pathContainer);

        this.currentShape = {
            container: pathContainer,
            lastX: x,
            lastY: y,
            type: 'path'
        };
    }

    continuePath(x, y) {
        if (this.currentShape && this.currentShape.container) {
            // Calculate distance from last point
            const dx = x - this.currentShape.lastX;
            const dy = y - this.currentShape.lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only add dots if moved enough distance (smoother drawing)
            if (distance > 3) {
                this.createBrushDot(x, y, this.currentShape.container);
                this.currentShape.lastX = x;
                this.currentShape.lastY = y;
            }
        }
    }

    createBrushDot(x, y, container) {
        const dot = document.createElement('div');
        const strokeColor = document.querySelector('.stroke-color').value;
        const strokeWidth = document.querySelector('.stroke-width').value;

        dot.style.cssText = `
            position: absolute;
            left: ${x - strokeWidth / 2}px;
            top: ${y - strokeWidth / 2}px;
            width: ${strokeWidth}px;
            height: ${strokeWidth}px;
            background: ${strokeColor};
            border-radius: 50%;
            pointer-events: none;
        `;

        container.appendChild(dot);
    }

    updateLine(currentX, currentY) {
        if (this.currentShape && this.currentShape.container) {
            // Clear previous line
            this.currentShape.container.innerHTML = '';

            // Create line using div
            const line = document.createElement('div');
            const strokeColor = document.querySelector('.stroke-color').value;
            const strokeWidth = document.querySelector('.stroke-width').value;

            // Calculate line properties
            const length = Math.sqrt(Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2));
            const angle = Math.atan2(currentY - this.startY, currentX - this.startX) * 180 / Math.PI;

            line.style.cssText = `
                position: absolute;
                left: ${this.startX}px;
                top: ${this.startY - strokeWidth / 2}px;
                width: ${length}px;
                height: ${strokeWidth}px;
                background: ${strokeColor};
                transform-origin: 0 50%;
                transform: rotate(${angle}deg);
                pointer-events: none;
            `;

            this.currentShape.container.appendChild(line);

            // Add arrowhead for arrow tool
            if (this.currentTool === 'arrow') {
                const arrowHead = document.createElement('div');
                arrowHead.style.cssText = `
                    position: absolute;
                    right: -${strokeWidth}px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-left: ${strokeWidth * 2}px solid ${strokeColor};
                    border-top: ${strokeWidth}px solid transparent;
                    border-bottom: ${strokeWidth}px solid transparent;
                `;
                line.appendChild(arrowHead);
            }
        }
    }

    // Responsive toolbar handling
    setupResponsiveToolbar() {
        const handleResize = () => {
            const toolbar = document.querySelector('.drawing-toolbar');
            const properties = document.querySelector('.tool-properties');

            if (window.innerHeight < 500 && window.innerWidth > window.innerHeight) {
                // Landscape mode with limited height
                toolbar.classList.add('compact-mode');
                properties.classList.add('compact-mode');
            } else {
                toolbar.classList.remove('compact-mode');
                properties.classList.remove('compact-mode');
            }

            // Ensure properties panel is always visible
            if (properties) {
                properties.style.display = 'flex';
                properties.style.visibility = 'visible';
                properties.style.opacity = '1';
            }
        };

        // Initial check
        handleResize();

        // Listen for orientation and resize changes
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100); // Delay to ensure orientation change is complete
        });
    }

    // Book Creation Methods
    showBookCreator() {
        console.log('📚 Opening book creator...');
        
        // Initialize book data if not exists
        if (!this.bookData) {
            this.bookData = {
                pages: [this.getCurrentPageData()],
                currentPage: 0
            };
        }

        const bookModal = document.getElementById('book-modal');
        if (bookModal) {
            bookModal.classList.remove('hidden');
            this.renderBookPages();
            this.renderCurrentBookPage();
            console.log('✅ Book creator opened');
        }
    }

    hideBookCreator() {
        const bookModal = document.getElementById('book-modal');
        if (bookModal) {
            bookModal.classList.add('hidden');
            console.log('📚 Book creator closed');
        }
    }

    getCurrentPageData() {
        return {
            canvasHTML: this.canvas ? this.canvas.innerHTML : '',
            canvasBackground: this.canvasBackground ? this.canvasBackground.style.background : '',
            settings: { ...this.settings },
            timestamp: Date.now()
        };
    }

    addNewPage() {
        console.log('📄 Adding new page to book...');
        
        if (!this.bookData) {
            this.bookData = { pages: [], currentPage: 0 };
        }

        // Save current page data
        if (this.bookData.pages[this.bookData.currentPage]) {
            this.bookData.pages[this.bookData.currentPage] = this.getCurrentPageData();
        }

        // Create new page with default content
        const newPage = {
            canvasHTML: '<div class="greeting-text main-greeting" style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); font-family: \'Dancing Script\', cursive; font-size: 32px; color: white; text-align: center; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); z-index: 10;">New Page</div>',
            canvasBackground: 'linear-gradient(135deg, #2d1b69, #11052c)',
            settings: { ...this.settings },
            timestamp: Date.now()
        };

        this.bookData.pages.push(newPage);
        this.bookData.currentPage = this.bookData.pages.length - 1;

        this.renderBookPages();
        this.renderCurrentBookPage();
        
        console.log(`✅ Added page ${this.bookData.pages.length}`);
    }

    renderBookPages() {
        const pagesList = document.getElementById('pages-list');
        if (!pagesList || !this.bookData) return;

        pagesList.innerHTML = '';

        this.bookData.pages.forEach((page, index) => {
            const pageItem = document.createElement('div');
            pageItem.className = `page-item ${index === this.bookData.currentPage ? 'active' : ''}`;
            pageItem.dataset.page = index;

            pageItem.innerHTML = `
                <div class="page-thumbnail">
                    <div class="page-preview" style="background: ${page.canvasBackground}">
                        ${index + 1}
                    </div>
                </div>
                <span class="page-number">Page ${index + 1}</span>
                ${this.bookData.pages.length > 1 ? `<button class="delete-page-btn" data-page="${index}">×</button>` : ''}
            `;

            pageItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-page-btn')) {
                    this.switchToBookPage(index);
                }
            });

            // Add delete functionality
            const deleteBtn = pageItem.querySelector('.delete-page-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deletePage(index);
                });
            }

            pagesList.appendChild(pageItem);
        });
    }

    switchToBookPage(pageIndex) {
        if (!this.bookData || pageIndex >= this.bookData.pages.length) return;

        // Save current page data
        if (this.bookData.pages[this.bookData.currentPage]) {
            this.bookData.pages[this.bookData.currentPage] = this.getCurrentPageData();
        }

        // Switch to new page
        this.bookData.currentPage = pageIndex;
        this.renderBookPages();
        this.renderCurrentBookPage();

        console.log(`📖 Switched to page ${pageIndex + 1}`);
    }

    renderCurrentBookPage() {
        const bookCanvas = document.getElementById('book-canvas');
        if (!bookCanvas || !this.bookData) return;

        const currentPage = this.bookData.pages[this.bookData.currentPage];
        if (!currentPage) return;

        bookCanvas.innerHTML = currentPage.canvasHTML;
        bookCanvas.style.background = currentPage.canvasBackground;

        // Apply settings to main canvas as well
        if (this.canvas && this.canvasBackground) {
            this.canvas.innerHTML = currentPage.canvasHTML;
            this.canvasBackground.style.background = currentPage.canvasBackground;
            this.settings = { ...currentPage.settings };
        }
    }

    async generatePdfBook() {
        console.log('📄 Generating PDF book...');

        if (!this.bookData || this.bookData.pages.length === 0) {
            alert('No pages to generate PDF from!');
            return;
        }

        try {
            // Save current page
            this.bookData.pages[this.bookData.currentPage] = this.getCurrentPageData();

            // Create a temporary container for PDF generation
            const pdfContainer = document.createElement('div');
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.top = '-9999px';
            pdfContainer.style.left = '-9999px';
            document.body.appendChild(pdfContainer);

            const canvases = [];

            // Generate canvas for each page
            for (let i = 0; i < this.bookData.pages.length; i++) {
                const page = this.bookData.pages[i];
                
                // Create temporary page element
                const pageElement = document.createElement('div');
                pageElement.style.width = '400px';
                pageElement.style.height = '400px';
                pageElement.style.background = page.canvasBackground;
                pageElement.style.borderRadius = '8px';
                pageElement.style.position = 'relative';
                pageElement.innerHTML = page.canvasHTML;
                
                pdfContainer.appendChild(pageElement);

                // Convert to canvas using html2canvas
                const canvas = await html2canvas(pageElement, {
                    width: 400,
                    height: 400,
                    scale: 2,
                    backgroundColor: null
                });

                canvases.push(canvas);
                pdfContainer.removeChild(pageElement);
            }

            // Clean up temporary container
            document.body.removeChild(pdfContainer);

            // Create PDF using jsPDF (we'll need to include this library)
            this.createPdfFromCanvases(canvases);

        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    }

    createPdfFromCanvases(canvases) {
        console.log('📚 Creating PDF with', canvases.length, 'pages');

        try {
            // Create new jsPDF instance
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit A4 page
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const margin = 20;
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = imgWidth; // Keep square aspect ratio

            canvases.forEach((canvas, index) => {
                if (index > 0) {
                    pdf.addPage();
                }

                // Convert canvas to image data
                const imgData = canvas.toDataURL('image/png');
                
                // Add image to PDF
                const yPosition = (pageHeight - imgHeight) / 2; // Center vertically
                pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);

                // Add page number
                pdf.setFontSize(12);
                pdf.setTextColor(100);
                pdf.text(`Page ${index + 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            });

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `haunted-wishify-book-${timestamp}.pdf`;

            // Save the PDF
            pdf.save(filename);

            alert(`📚 Success! Your haunted book has been exported as "${filename}"`);
            console.log('✅ PDF book generated successfully');

        } catch (error) {
            console.error('❌ Error creating PDF:', error);
            
            // Fallback to individual image downloads
            console.log('📸 Falling back to individual image downloads...');
            canvases.forEach((canvas, index) => {
                const link = document.createElement('a');
                link.download = `haunted-book-page-${index + 1}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });

            alert(`📚 PDF generation failed, but downloaded ${canvases.length} individual page images instead.`);
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
    }
    
    @keyframes confettiFall {
        0% { transform: translateY(-10px) rotate(0deg); }
        100% { transform: translateY(610px) rotate(360deg); }
    }
    
    @keyframes heartFloat {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-10px) scale(1.1); }
    }
    
    @keyframes cupidFly {
        0% { transform: translateX(-50px); }
        100% { transform: translateX(650px); }
    }
    
    @keyframes snowFall {
        0% { transform: translateY(-20px) rotate(0deg); }
        100% { transform: translateY(620px) rotate(360deg); }
    }
    
    @keyframes fireworkBurst {
        0% { transform: scale(0.5); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(0.8); opacity: 0.6; }
    }
    
    @keyframes gothicFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
        50% { transform: translateY(-12px) rotate(-3deg); opacity: 1; }
    }
    
    @keyframes darkPulse {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.15); opacity: 1; }
    }
    
    @keyframes mysticalGlow {
        0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
        33% { transform: scale(1.1) rotate(120deg); opacity: 1; }
        66% { transform: scale(0.95) rotate(240deg); opacity: 0.8; }
    }
    
    @keyframes leafFall {
        0% { transform: translateY(-20px) rotate(0deg); }
        100% { transform: translateY(620px) rotate(360deg); }
    }
    
    @keyframes bloodDrip {
        0% { transform: translateY(-10px); opacity: 1; }
        100% { transform: translateY(610px); opacity: 0.3; }
    }
`;
document.head.appendChild(style);

// Initialize the application
let wishifyDesigner;
document.addEventListener('DOMContentLoaded', () => {
    wishifyDesigner = new WishifyDesigner();
});

    deletePage(pageIndex) {
        if (!this.bookData || this.bookData.pages.length <= 1) {
            alert('Cannot delete the last page!');
            return;
        }

        if (confirm(`Are you sure you want to delete page ${pageIndex + 1}?`)) {
            this.bookData.pages.splice(pageIndex, 1);
            
            // Adjust current page if necessary
            if (this.bookData.currentPage >= this.bookData.pages.length) {
                this.bookData.currentPage = this.bookData.pages.length - 1;
            } else if (this.bookData.currentPage > pageIndex) {
                this.bookData.currentPage--;
            }

            this.renderBookPages();
            this.renderCurrentBookPage();
            
            console.log(`🗑️ Deleted page ${pageIndex + 1}`);
        }
    }