/**
 * Spooky Design Studio - Figma-like Interface
 * Main JavaScript functionality for the design interface
 */

class SpookyDesignStudio {
    constructor() {
        this.currentTool = 'select';
        this.selectedElements = [];
        this.clipboard = null;
        this.zoomLevel = 1;
        this.gridEnabled = true;
        this.rulersEnabled = false;
        this.canvas = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.canvas = document.getElementById('design-canvas');
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupKeyboardShortcuts();
        this.initializeInterface();

        console.log('👻 Spooky Design Studio initialized');
    }

    setupEventListeners() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTool(e.target.dataset.tool);
            });
        });

        // Tab switching
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Asset tabs
        document.querySelectorAll('.asset-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAssetTab(e.target.dataset.asset);
            });
        });

        // Property tabs
        document.querySelectorAll('.property-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchPropertyTab(e.target.dataset.prop);
            });
        });

        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom-out').addEventListener('click', () => this.zoomOut());
        document.getElementById('fit-screen').addEventListener('click', () => this.fitToScreen());

        // Grid and rulers
        document.getElementById('grid-toggle').addEventListener('click', () => this.toggleGrid());
        document.getElementById('rulers-toggle').addEventListener('click', () => this.toggleRulers());

        // Canvas interactions
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // Layer interactions
        document.querySelectorAll('.layer-item').forEach(layer => {
            layer.addEventListener('click', (e) => this.selectLayer(e.target));
        });

        // Comments
        document.querySelector('.comment-send-btn').addEventListener('click', () => this.addComment());
        document.querySelector('.comment-text-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addComment();
        });

        // Add debug key to toggle properties panel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' && e.ctrlKey) {
                this.togglePropertiesPanel();
            }
        });
    }
    setupDragAndDrop() {
        // Component drag and drop
        document.querySelectorAll('.component-item, .icon-item, .image-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.component || item.textContent);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });

        // Canvas drop handling
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.createElement(data, { x, y });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Tool shortcuts
            if (e.key === 'v' || e.key === 'V') this.selectTool('select');
            if (e.key === 'r' || e.key === 'R') this.selectTool('rectangle');
            if (e.key === 'o' || e.key === 'O') this.selectTool('ellipse');
            if (e.key === 't' || e.key === 'T') this.selectTool('text');
            if (e.key === 'h' || e.key === 'H') this.selectTool('hand');

            // Edit shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') this.copy();
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') this.paste();
            if ((e.ctrlKey || e.metaKey) && e.key === 'x') this.cut();
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') this.undo();
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') this.duplicate();

            // Delete
            if (e.key === 'Delete' || e.key === 'Backspace') this.deleteSelected();

            // Zoom
            if ((e.ctrlKey || e.metaKey) && e.key === '=') this.zoomIn();
            if ((e.ctrlKey || e.metaKey) && e.key === '-') this.zoomOut();
            if ((e.ctrlKey || e.metaKey) && e.key === '0') this.fitToScreen();
        });
    }

    initializeInterface() {
        // Set initial tool
        this.selectTool('select');

        // Make existing elements interactive
        document.querySelectorAll('.design-element').forEach(element => {
            this.makeElementInteractive(element);
        });

        // Initialize panels
        this.updatePropertiesPanel();
        this.updateLayersPanel();

        // Ensure properties panel is visible
        const propertiesPanel = document.querySelector('.properties-panel');
        if (propertiesPanel) {
            propertiesPanel.style.display = 'block';
        }

        // Add some spooky effects
        this.addSpookyEffects();

        console.log('🎃 Interface initialized successfully');
    }

    selectTool(toolName) {
        this.currentTool = toolName;

        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const toolBtn = document.querySelector(`[data-tool="${toolName}"]`);
        if (toolBtn) {
            toolBtn.classList.add('active');
        }

        // Update cursor
        this.updateCanvasCursor();

        console.log('🛠️ Selected tool:', toolName);
    }

    updateCanvasCursor() {
        const cursors = {
            'select': 'default',
            'frame': 'crosshair',
            'rectangle': 'crosshair',
            'ellipse': 'crosshair',
            'text': 'text',
            'pen': 'crosshair',
            'image': 'crosshair',
            'component': 'copy',
            'hand': 'grab',
            'zoom': 'zoom-in',
            'comment': 'help'
        };

        this.canvas.style.cursor = cursors[this.currentTool] || 'default';
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabBtn) {
            tabBtn.classList.add('active');
        }

        console.log('📑 Switched to tab:', tabName);
    }

    switchAssetTab(assetType) {
        document.querySelectorAll('.asset-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        document.querySelectorAll('.asset-content').forEach(content => {
            content.classList.add('hidden');
        });

        const activeTab = document.querySelector(`[data-asset="${assetType}"]`);
        const activeContent = document.getElementById(`${assetType}-content`);

        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.classList.remove('hidden');
    }

    switchPropertyTab(propType) {
        document.querySelectorAll('.property-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        const activeTab = document.querySelector(`[data-prop="${propType}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Show/hide property content based on tab
        const designContent = document.getElementById('design-properties');
        if (designContent) {
            if (propType === 'design') {
                designContent.style.display = 'block';
            } else {
                // For prototype and inspect tabs, show placeholder content
                designContent.innerHTML = `
                    <div class="property-section">
                        <p style="color: #94a3b8; text-align: center; padding: 20px;">
                            🚧 ${propType.charAt(0).toUpperCase() + propType.slice(1)} properties coming soon...
                        </p>
                    </div>
                `;
            }
        }

        console.log('📑 Switched to property tab:', propType);
    }
    createElement(type, position) {
        const element = document.createElement('div');
        element.className = 'design-element';
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';

        // Create different types of elements
        switch (type) {
            case 'ghostly-button':
                element.classList.add('button-element');
                element.style.width = '120px';
                element.style.height = '40px';
                element.innerHTML = '<button style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; width: 100%; height: 100%;">Ghostly Button</button>';
                break;

            case 'haunted-card':
                element.classList.add('card-element');
                element.style.width = '200px';
                element.style.height = '150px';
                element.innerHTML = '<div style="background: #2d3748; border: 1px solid #374151; border-radius: 8px; padding: 16px; width: 100%; height: 100%; color: #f8fafc;"><h3>Haunted Card</h3><p>Spooky content here...</p></div>';
                break;

            case 'spooky-input':
                element.classList.add('input-element');
                element.style.width = '200px';
                element.style.height = '40px';
                element.innerHTML = '<input type="text" placeholder="Enter your fears..." style="background: #1a1a1a; border: 1px solid #374151; color: #f8fafc; padding: 8px 12px; border-radius: 6px; width: 100%; height: 100%;">';
                break;

            default:
                // Handle icons and other elements
                element.classList.add('icon-element');
                element.style.width = '40px';
                element.style.height = '40px';
                element.innerHTML = `<div style="font-size: 2rem; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${type}</div>`;
        }

        // Add to canvas
        const frame = document.querySelector('.frame-content');
        if (frame) {
            frame.appendChild(element);
        }

        // Make it selectable and draggable
        this.makeElementInteractive(element);

        // Select the new element
        this.selectElement(element);

        console.log('✨ Created element:', type);
    }

    makeElementInteractive(element) {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('🖱️ Element clicked:', element.className);
            this.selectElement(element);
        });

        element.addEventListener('mousedown', (e) => {
            if (this.currentTool === 'select') {
                e.stopPropagation();
                this.selectElement(element);
                this.startDragging(element, e);
            }
        });

        // Add hover effects
        element.addEventListener('mouseenter', () => {
            if (!element.classList.contains('selected')) {
                element.style.borderColor = 'rgba(139, 92, 246, 0.5)';
            }
        });

        element.addEventListener('mouseleave', () => {
            if (!element.classList.contains('selected')) {
                element.style.borderColor = 'transparent';
            }
        });
    }

    selectElement(element) {
        console.log('🎯 Selecting element:', element);

        // Clear previous selection
        document.querySelectorAll('.design-element').forEach(el => {
            el.classList.remove('selected');
        });

        // Select new element
        element.classList.add('selected');
        this.selectedElements = [element];

        console.log('📊 Selected elements array:', this.selectedElements);

        // Update properties panel immediately
        this.updatePropertiesPanel();

        // Update layers panel
        this.updateLayersPanel();

        // Ensure properties panel is visible but don't scroll the entire page
        const propertiesPanel = document.querySelector('.properties-panel');
        if (propertiesPanel) {
            // Just make sure it's visible without scrolling the main interface
            propertiesPanel.style.display = 'block';
        }

        console.log('🎯 Selected element:', element.className);
    }

    startDragging(element, e) {
        this.isDragging = true;
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();

        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        element.style.zIndex = '1000';

        const handleMouseMove = (e) => {
            if (this.isDragging) {
                const parentRect = element.parentElement.getBoundingClientRect();
                let x = e.clientX - parentRect.left - this.dragOffset.x;
                let y = e.clientY - parentRect.top - this.dragOffset.y;

                // Snap to grid if enabled
                if (this.gridEnabled) {
                    x = Math.round(x / 20) * 20;
                    y = Math.round(y / 20) * 20;
                }

                element.style.left = x + 'px';
                element.style.top = y + 'px';

                this.updatePropertiesPanel();
            }
        };

        const handleMouseUp = () => {
            this.isDragging = false;
            element.style.zIndex = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    handleCanvasClick(e) {
        if (e.target === this.canvas || e.target.classList.contains('frame-content') || e.target.classList.contains('canvas-background')) {
            // Deselect all elements
            document.querySelectorAll('.design-element').forEach(el => {
                el.classList.remove('selected');
            });
            this.selectedElements = [];
            this.updatePropertiesPanel();
            console.log('🚫 Deselected all elements');
        }
    }

    handleMouseDown(e) {
        if (this.currentTool !== 'select' && this.currentTool !== 'hand') {
            // Start creating new element
            this.startCreating(e);
        }
    }

    handleMouseMove(e) {
        // Handle tool-specific mouse move
    }

    handleMouseUp(e) {
        // Handle tool-specific mouse up
    }

    handleContextMenu(e) {
        e.preventDefault();
        this.showContextMenu(e.clientX, e.clientY);
    }

    showContextMenu(x, y) {
        const menu = document.getElementById('element-context-menu');
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.remove('hidden');

        // Hide menu on outside click
        setTimeout(() => {
            document.addEventListener('click', () => {
                menu.classList.add('hidden');
            }, { once: true });
        }, 0);
    }
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 5);
        this.updateZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.1);
        this.updateZoom();
    }

    updateZoom() {
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        canvasWrapper.style.transform = `scale(${this.zoomLevel})`;
        canvasWrapper.style.transformOrigin = 'top left';

        document.querySelector('.zoom-level').textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }

    fitToScreen() {
        this.zoomLevel = 1;
        this.updateZoom();

        // Center the canvas
        const container = document.querySelector('.canvas-container');
        container.scrollTop = 0;
        container.scrollLeft = 0;
    }

    toggleGrid() {
        this.gridEnabled = !this.gridEnabled;
        const gridBtn = document.getElementById('grid-toggle');

        if (this.gridEnabled) {
            gridBtn.classList.add('active');
            this.canvas.style.backgroundImage = 'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.1) 1px, transparent 0)';
        } else {
            gridBtn.classList.remove('active');
            this.canvas.style.backgroundImage = 'none';
        }
    }

    toggleRulers() {
        this.rulersEnabled = !this.rulersEnabled;
        const rulersBtn = document.getElementById('rulers-toggle');

        if (this.rulersEnabled) {
            rulersBtn.classList.add('active');
            // Add ruler implementation here
        } else {
            rulersBtn.classList.remove('active');
        }
    }

    updatePropertiesPanel() {
        console.log('🔮 Updating properties panel...');
        const content = document.getElementById('design-properties');
        console.log('📋 Properties content element:', content);

        if (!content) {
            console.error('❌ Properties content element not found!');
            return;
        }

        console.log('📊 Selected elements count:', this.selectedElements.length);

        if (this.selectedElements.length === 0) {
            // Show default message when no element is selected
            const defaultMessage = `
                <div class="property-section">
                    <p style="color: #94a3b8; text-align: center; padding: 20px; font-style: italic;">
                        👻 Select an element to edit its spooky properties
                    </p>
                </div>
            `;
            content.innerHTML = defaultMessage;
            return;
        }

        const element = this.selectedElements[0];
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement ? element.parentElement.getBoundingClientRect() : { left: 0, top: 0 };

        const x = parseInt(element.style.left) || 0;
        const y = parseInt(element.style.top) || 0;
        const w = parseInt(element.style.width) || Math.round(rect.width);
        const h = parseInt(element.style.height) || Math.round(rect.height);

        // Create complete properties panel content
        const propertiesHTML = `
            <div class="property-section">
                <h4>Position & Size</h4>
                <div class="property-grid">
                    <div class="property-group">
                        <label>X</label>
                        <input type="number" value="${x}" class="property-input" data-property="x">
                    </div>
                    <div class="property-group">
                        <label>Y</label>
                        <input type="number" value="${y}" class="property-input" data-property="y">
                    </div>
                    <div class="property-group">
                        <label>W</label>
                        <input type="number" value="${w}" class="property-input" data-property="w">
                    </div>
                    <div class="property-group">
                        <label>H</label>
                        <input type="number" value="${h}" class="property-input" data-property="h">
                    </div>
                </div>
            </div>
            
            <div class="property-section">
                <h4>Fill</h4>
                <div class="fill-controls">
                    <div class="color-picker">
                        <input type="color" value="#ff6b35" class="color-input" data-property="fill">
                        <span class="color-value">#ff6b35</span>
                    </div>
                    <div class="opacity-control">
                        <label>Opacity</label>
                        <input type="range" min="0" max="100" value="100" class="opacity-slider">
                        <span class="opacity-value">100%</span>
                    </div>
                </div>
            </div>
            
            <div class="property-section">
                <h4>Stroke</h4>
                <div class="stroke-controls">
                    <div class="color-picker">
                        <input type="color" value="#8b5cf6" class="color-input" data-property="stroke">
                        <span class="color-value">#8b5cf6</span>
                    </div>
                    <div class="stroke-width">
                        <label>Width</label>
                        <input type="number" value="2" class="property-input" data-property="stroke-width">
                    </div>
                </div>
            </div>
            
            <div class="property-section">
                <h4>Effects</h4>
                <div class="effects-list">
                    <div class="effect-item">
                        <span class="effect-icon">✨</span>
                        <span class="effect-name">Ghostly Glow</span>
                        <button class="effect-toggle active">👁️</button>
                    </div>
                    <div class="effect-item">
                        <span class="effect-icon">🌫️</span>
                        <span class="effect-name">Shadow Mist</span>
                        <button class="effect-toggle">👁️</button>
                    </div>
                </div>
                <button class="add-effect-btn">➕ Add Effect</button>
            </div>
        `;

        content.innerHTML = propertiesHTML;
        console.log('✅ Properties HTML updated');

        // Show the properties panel if it's hidden
        const propertiesPanel = document.querySelector('.properties-panel');
        if (propertiesPanel) {
            propertiesPanel.style.display = 'block';
            propertiesPanel.style.visibility = 'visible';
            // Add a subtle animation to indicate update
            propertiesPanel.style.transform = 'scale(0.98)';
            setTimeout(() => {
                propertiesPanel.style.transform = 'scale(1)';
            }, 100);
            console.log('✅ Properties panel made visible');
        } else {
            console.error('❌ Properties panel not found');
        }

        // Ensure the design tab is active
        this.switchPropertyTab('design');

        // Add property change listeners
        this.setupPropertyListeners();

        console.log('🔮 Updated properties panel for element:', element.className);

        // Debug layout
        this.debugLayout();
    }

    setupPropertyListeners() {
        document.querySelectorAll('.property-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateElementProperty(e.target);
            });
        });

        document.querySelectorAll('.color-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateElementColor(e.target);
            });
        });
    }

    updateElementProperty(input) {
        if (this.selectedElements.length === 0) return;

        const element = this.selectedElements[0];
        const propertyGroup = input.closest('.property-group');
        const label = propertyGroup.querySelector('label').textContent.toLowerCase();

        switch (label) {
            case 'x':
                element.style.left = input.value + 'px';
                break;
            case 'y':
                element.style.top = input.value + 'px';
                break;
            case 'w':
                element.style.width = input.value + 'px';
                break;
            case 'h':
                element.style.height = input.value + 'px';
                break;
        }
    }

    updateElementColor(input) {
        if (this.selectedElements.length === 0) return;

        const element = this.selectedElements[0];
        const childElement = element.firstElementChild;

        if (childElement) {
            childElement.style.backgroundColor = input.value;
        }
    }

    updateLayersPanel() {
        // Update layer selection in the layers panel
        document.querySelectorAll('.layer-item').forEach(layer => {
            layer.classList.remove('active');
        });

        if (this.selectedElements.length > 0) {
            // Find corresponding layer and activate it
            const element = this.selectedElements[0];
            const layerName = this.getElementLayerName(element);
            const layer = Array.from(document.querySelectorAll('.layer-item')).find(l =>
                l.querySelector('.layer-name').textContent === layerName
            );

            if (layer) {
                layer.classList.add('active');
            }
        }
    }

    getElementLayerName(element) {
        if (element.classList.contains('text-element')) return 'Welcome Text';
        if (element.classList.contains('button-element')) return 'Enter Button';
        if (element.classList.contains('shape-element')) return 'Gradient Shape';
        return 'Unknown Element';
    }

    selectLayer(layerElement) {
        const layerName = layerElement.querySelector('.layer-name').textContent;

        // Find corresponding element
        const elements = document.querySelectorAll('.design-element');
        const targetElement = Array.from(elements).find(el =>
            this.getElementLayerName(el) === layerName
        );

        if (targetElement) {
            this.selectElement(targetElement);
        }
    }

    addComment() {
        const input = document.querySelector('.comment-text-input');
        const text = input.value.trim();

        if (!text) return;

        const commentsList = document.querySelector('.comments-list');
        const comment = document.createElement('div');
        comment.className = 'comment-item';
        comment.innerHTML = `
            <div class="comment-avatar">🧙‍♂️</div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">You</span>
                    <span class="comment-time">now</span>
                </div>
                <p class="comment-text">${text}</p>
            </div>
        `;

        commentsList.appendChild(comment);
        input.value = '';

        // Scroll to bottom
        commentsList.scrollTop = commentsList.scrollHeight;
    }

    addSpookyEffects() {
        // Add floating animation to some elements
        const floatingElements = document.querySelectorAll('.skull, .ghost, .user-avatar');
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = (index * 0.5) + 's';
        });

        // Add glow effects on hover
        document.querySelectorAll('.tool-btn, .menu-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.5)';
            });

            btn.addEventListener('mouseleave', () => {
                if (!btn.classList.contains('active')) {
                    btn.style.boxShadow = '';
                }
            });
        });

        // Add particle effects occasionally
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.createSpookyParticle();
            }
        }, 2000);
    }

    createSpookyParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #8b5cf6;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            opacity: 0.7;
        `;

        document.body.appendChild(particle);

        // Animate particle
        particle.animate([
            { transform: 'translateY(0px)', opacity: 0.7 },
            { transform: 'translateY(-100px)', opacity: 0 }
        ], {
            duration: 3000,
            easing: 'ease-out'
        }).onfinish = () => {
            particle.remove();
        };
    }

    // Edit operations
    copy() {
        if (this.selectedElements.length > 0) {
            this.clipboard = this.selectedElements[0].cloneNode(true);
            console.log('📋 Copied element');
        }
    }

    paste() {
        if (this.clipboard) {
            const clone = this.clipboard.cloneNode(true);
            clone.style.left = (parseInt(clone.style.left) + 20) + 'px';
            clone.style.top = (parseInt(clone.style.top) + 20) + 'px';

            const frame = document.querySelector('.frame-content');
            if (frame) {
                frame.appendChild(clone);
                this.makeElementInteractive(clone);
                this.selectElement(clone);
            }

            console.log('📄 Pasted element');
        }
    }

    cut() {
        this.copy();
        this.deleteSelected();
    }

    deleteSelected() {
        this.selectedElements.forEach(element => {
            element.remove();
        });
        this.selectedElements = [];
        this.updatePropertiesPanel();
        console.log('🗑️ Deleted selected elements');
    }

    duplicate() {
        this.copy();
        this.paste();
    }

    undo() {
        // Implement undo functionality
        console.log('↶ Undo');
    }

    debugLayout() {
        const mainInterface = document.querySelector('.main-interface');
        const canvasArea = document.querySelector('.canvas-area');
        const rightSidebar = document.querySelector('.right-sidebar');

        console.log('🔍 Layout Debug:');
        console.log('Main Interface:', mainInterface?.getBoundingClientRect());
        console.log('Canvas Area:', canvasArea?.getBoundingClientRect());
        console.log('Right Sidebar:', rightSidebar?.getBoundingClientRect());
        console.log('Canvas Area Display:', window.getComputedStyle(canvasArea)?.display);
        console.log('Canvas Area Visibility:', window.getComputedStyle(canvasArea)?.visibility);
    }

    togglePropertiesPanel() {
        const rightSidebar = document.querySelector('.right-sidebar');
        if (rightSidebar.style.display === 'none') {
            rightSidebar.style.display = 'flex';
            console.log('✅ Properties panel shown');
        } else {
            rightSidebar.style.display = 'none';
            console.log('❌ Properties panel hidden');
        }
        this.debugLayout();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SpookyDesignStudio();
});