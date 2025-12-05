/**
 * Canvas Manager for Spooky Web Builder
 * Handles drag-and-drop functionality, component positioning, and canvas interactions
 */

class CanvasManager {
    constructor(builderEngine) {
        this.builderEngine = builderEngine;
        this.canvas = null;
        this.components = new Map();
        this.selectedComponent = null;
        this.draggedComponent = null;
        this.ghostTrail = null;
        this.gridEnabled = true;
        this.snapEnabled = true;
        this.zoomLevel = 1;
        this.gridSize = 20;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
    }

    initialize() {
        this.canvas = document.getElementById('canvas');
        this.ghostTrail = document.getElementById('ghost-trail');
        
        this.setupCanvasEvents();
        this.setupDragAndDrop();
        this.setupControls();
        this.setupGhostTrail();
        
        console.log('👻 Canvas Manager initialized');
    }

    setupCanvasEvents() {
        // Canvas click events
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Component selection and dragging
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Resize observer
        this.resizeObserver = new ResizeObserver(() => this.handleCanvasResize());
        this.resizeObserver.observe(this.canvas);
    }

    setupDragAndDrop() {
        // Allow dropping on canvas
        this.canvas.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));
        this.canvas.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        this.canvas.addEventListener('dragleave', (e) => this.handleDragLeave(e));

        // Set up component palette drag events
        const componentItems = document.querySelectorAll('.component-item');
        componentItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleComponentDragStart(e));
            item.addEventListener('dragend', (e) => this.handleComponentDragEnd(e));
        });
    }

    setupControls() {
        // Grid toggle
        document.getElementById('grid-toggle').addEventListener('click', () => {
            this.toggleGrid();
        });

        // Snap toggle
        document.getElementById('snap-toggle').addEventListener('click', () => {
            this.toggleSnap();
        });

        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.zoomIn();
        });

        document.getElementById('zoom-out').addEventListener('click', () => {
            this.zoomOut();
        });
    }

    setupGhostTrail() {
        this.ghostTrail.width = window.innerWidth;
        this.ghostTrail.height = window.innerHeight;
        this.ghostTrailCtx = this.ghostTrail.getContext('2d');
        this.trailPoints = [];
        
        // Start ghost trail animation
        this.animateGhostTrail();
    }

    handleComponentDragStart(e) {
        const componentType = e.target.dataset.componentType;
        e.dataTransfer.setData('text/plain', componentType);
        e.dataTransfer.effectAllowed = 'copy';
        
        // Create custom ghost image
        this.createDragGhost(e.target);
        
        // Play drag start sound
        this.builderEngine.audioManager?.playSound('whisper', { volume: 0.2 });
        
        console.log('🎭 Started dragging component:', componentType);
    }

    handleComponentDragEnd(e) {
        // Clear ghost trail
        this.clearGhostTrail();
    }

    createDragGhost(element) {
        const ghost = element.cloneNode(true);
        ghost.style.transform = 'rotate(5deg) scale(1.1)';
        ghost.style.opacity = '0.8';
        ghost.style.filter = 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))';
        
        // Position off-screen
        ghost.style.position = 'absolute';
        ghost.style.top = '-1000px';
        ghost.style.left = '-1000px';
        
        document.body.appendChild(ghost);
        
        // Set as drag image
        setTimeout(() => {
            document.body.removeChild(ghost);
        }, 0);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        
        // Update ghost trail
        this.updateGhostTrail(e.clientX, e.clientY);
    }

    handleDragEnter(e) {
        e.preventDefault();
        this.canvas.classList.add('drag-over');
    }

    handleDragLeave(e) {
        // Only remove if actually leaving the canvas
        if (!this.canvas.contains(e.relatedTarget)) {
            this.canvas.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        this.canvas.classList.remove('drag-over');
        
        const componentType = e.dataTransfer.getData('text/plain');
        if (!componentType) return;

        // Calculate drop position relative to canvas
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        // Snap to grid if enabled
        const position = this.snapEnabled ? this.snapToGrid({ x, y }) : { x, y };

        // Create and add component
        this.addComponentFromPalette(componentType, position);
        
        // Play drop sound
        this.builderEngine.audioManager?.playSound('chains', { volume: 0.3 });
        
        // Clear ghost trail
        this.clearGhostTrail();
        
        console.log('👻 Dropped component:', componentType, 'at', position);
    }

    addComponentFromPalette(componentType, position) {
        // Create component through component library
        const component = this.builderEngine.componentLibrary.createComponent(componentType, {
            position: position,
            id: this.generateComponentId()
        });

        if (component) {
            this.addComponent(component);
            this.selectComponent(component);
            
            // Hide drop message if this is the first component
            const dropMessage = this.canvas.querySelector('.drop-message');
            if (dropMessage && this.components.size === 1) {
                dropMessage.style.display = 'none';
            }
        }
    }

    addComponent(component) {
        // Add to canvas DOM
        component.element.classList.add('canvas-component', 'appearing');
        this.canvas.appendChild(component.element);
        
        // Store in components map
        this.components.set(component.id, component);
        
        // Set up component events
        this.setupComponentEvents(component);
        
        // Add to project
        if (this.builderEngine.currentProject) {
            this.builderEngine.currentProject.components.push(component.serialize());
            this.builderEngine.markProjectAsModified();
        }
        
        // Remove appearing animation class after animation
        setTimeout(() => {
            component.element.classList.remove('appearing');
        }, 600);
        
        console.log('✨ Added component to canvas:', component.id);
    }

    setupComponentEvents(component) {
        const element = component.element;
        
        // Click to select
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectComponent(component);
        });

        // Double-click to edit
        element.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.editComponent(component);
        });

        // Context menu
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showComponentContextMenu(component, e.clientX, e.clientY);
        });
    }

    handleCanvasClick(e) {
        // Deselect if clicking on empty canvas
        if (e.target === this.canvas || e.target.classList.contains('canvas-background')) {
            this.selectComponent(null);
        }
    }

    handleMouseDown(e) {
        const component = this.getComponentFromElement(e.target);
        if (!component) return;

        this.isDragging = true;
        this.draggedComponent = component;
        
        // Calculate drag offset
        const rect = component.element.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        // Add dragging class
        component.element.classList.add('dragging');
        
        // Select component
        this.selectComponent(component);
        
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.draggedComponent) return;

        const canvasRect = this.canvas.getBoundingClientRect();
        let x = e.clientX - canvasRect.left - this.dragOffset.x;
        let y = e.clientY - canvasRect.top - this.dragOffset.y;

        // Snap to grid if enabled
        if (this.snapEnabled) {
            const snapped = this.snapToGrid({ x, y });
            x = snapped.x;
            y = snapped.y;
        }

        // Update component position
        this.draggedComponent.updatePosition({ x, y });
        
        // Update ghost trail
        this.updateGhostTrail(e.clientX, e.clientY);
    }

    handleMouseUp(e) {
        if (this.isDragging && this.draggedComponent) {
            // Remove dragging class
            this.draggedComponent.element.classList.remove('dragging');
            
            // Play drop sound
            this.builderEngine.audioManager?.playSound('creak', { volume: 0.2 });
            
            // Mark project as modified
            this.builderEngine.markProjectAsModified();
        }

        this.isDragging = false;
        this.draggedComponent = null;
        this.clearGhostTrail();
    }

    handleKeyDown(e) {
        if (!this.selectedComponent) return;

        const moveDistance = e.shiftKey ? 10 : 1;
        let moved = false;

        switch (e.key) {
            case 'ArrowUp':
                this.moveComponent(this.selectedComponent, 0, -moveDistance);
                moved = true;
                break;
            case 'ArrowDown':
                this.moveComponent(this.selectedComponent, 0, moveDistance);
                moved = true;
                break;
            case 'ArrowLeft':
                this.moveComponent(this.selectedComponent, -moveDistance, 0);
                moved = true;
                break;
            case 'ArrowRight':
                this.moveComponent(this.selectedComponent, moveDistance, 0);
                moved = true;
                break;
            case 'Delete':
            case 'Backspace':
                this.removeComponent(this.selectedComponent.id);
                moved = true;
                break;
        }

        if (moved) {
            e.preventDefault();
            this.builderEngine.markProjectAsModified();
        }
    }

    moveComponent(component, deltaX, deltaY) {
        const currentPos = component.getPosition();
        let newPos = {
            x: currentPos.x + deltaX,
            y: currentPos.y + deltaY
        };

        // Snap to grid if enabled
        if (this.snapEnabled) {
            newPos = this.snapToGrid(newPos);
        }

        component.updatePosition(newPos);
    }

    selectComponent(component) {
        // Deselect previous
        if (this.selectedComponent) {
            this.selectedComponent.element.classList.remove('selected');
        }

        this.selectedComponent = component;
        
        if (component) {
            component.element.classList.add('selected');
            this.builderEngine.selectComponent(component);
        } else {
            this.builderEngine.selectComponent(null);
        }
    }

    removeComponent(componentId) {
        const component = this.components.get(componentId);
        if (!component) return;

        // Remove from DOM
        component.element.remove();
        
        // Remove from components map
        this.components.delete(componentId);
        
        // Remove from project
        if (this.builderEngine.currentProject) {
            this.builderEngine.currentProject.components = 
                this.builderEngine.currentProject.components.filter(c => c.id !== componentId);
        }
        
        // Deselect if this was selected
        if (this.selectedComponent === component) {
            this.selectComponent(null);
        }
        
        console.log('🗑️ Removed component:', componentId);
    }

    getComponentFromElement(element) {
        // Walk up the DOM tree to find component element
        while (element && element !== this.canvas) {
            if (element.classList.contains('canvas-component')) {
                const componentId = element.dataset.componentId;
                return this.components.get(componentId);
            }
            element = element.parentElement;
        }
        return null;
    }

    snapToGrid(position) {
        return {
            x: Math.round(position.x / this.gridSize) * this.gridSize,
            y: Math.round(position.y / this.gridSize) * this.gridSize
        };
    }

    toggleGrid() {
        this.gridEnabled = !this.gridEnabled;
        const gridBtn = document.getElementById('grid-toggle');
        
        if (this.gridEnabled) {
            gridBtn.classList.add('active');
            this.canvas.style.backgroundImage = 
                `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0)`;
        } else {
            gridBtn.classList.remove('active');
            this.canvas.style.backgroundImage = 'none';
        }
        
        console.log('⚏ Grid', this.gridEnabled ? 'enabled' : 'disabled');
    }

    toggleSnap() {
        this.snapEnabled = !this.snapEnabled;
        const snapBtn = document.getElementById('snap-toggle');
        
        if (this.snapEnabled) {
            snapBtn.classList.add('active');
        } else {
            snapBtn.classList.remove('active');
        }
        
        console.log('🧲 Snap', this.snapEnabled ? 'enabled' : 'disabled');
    }

    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
        this.updateZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.3);
        this.updateZoom();
    }

    updateZoom() {
        this.canvas.style.transform = `scale(${this.zoomLevel})`;
        this.canvas.style.transformOrigin = 'top left';
        
        document.getElementById('zoom-level').textContent = `${Math.round(this.zoomLevel * 100)}%`;
        
        console.log('🔍 Zoom level:', this.zoomLevel);
    }

    updateGhostTrail(x, y) {
        this.trailPoints.push({ x, y, time: Date.now() });
        
        // Remove old points (older than 1 second)
        const now = Date.now();
        this.trailPoints = this.trailPoints.filter(point => now - point.time < 1000);
    }

    animateGhostTrail() {
        this.ghostTrailCtx.clearRect(0, 0, this.ghostTrail.width, this.ghostTrail.height);
        
        if (this.trailPoints.length > 1) {
            this.ghostTrailCtx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
            this.ghostTrailCtx.lineWidth = 3;
            this.ghostTrailCtx.lineCap = 'round';
            this.ghostTrailCtx.shadowBlur = 10;
            this.ghostTrailCtx.shadowColor = 'rgba(139, 92, 246, 0.8)';
            
            this.ghostTrailCtx.beginPath();
            
            for (let i = 0; i < this.trailPoints.length; i++) {
                const point = this.trailPoints[i];
                const age = Date.now() - point.time;
                const opacity = Math.max(0, 1 - age / 1000);
                
                this.ghostTrailCtx.globalAlpha = opacity;
                
                if (i === 0) {
                    this.ghostTrailCtx.moveTo(point.x, point.y);
                } else {
                    this.ghostTrailCtx.lineTo(point.x, point.y);
                }
            }
            
            this.ghostTrailCtx.stroke();
            this.ghostTrailCtx.globalAlpha = 1;
        }
        
        requestAnimationFrame(() => this.animateGhostTrail());
    }

    clearGhostTrail() {
        this.trailPoints = [];
        this.ghostTrailCtx.clearRect(0, 0, this.ghostTrail.width, this.ghostTrail.height);
    }

    editComponent(component) {
        // Focus on properties panel
        this.selectComponent(component);
        
        // Scroll properties panel into view
        const propertiesPanel = document.querySelector('.properties-panel');
        propertiesPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        console.log('✏️ Editing component:', component.id);
    }

    showComponentContextMenu(component, x, y) {
        // Create context menu
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.position = 'fixed';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.style.zIndex = '2000';
        
        menu.innerHTML = `
            <div class="context-menu-item" data-action="edit">✏️ Edit Properties</div>
            <div class="context-menu-item" data-action="duplicate">📋 Duplicate</div>
            <div class="context-menu-item" data-action="copy">📄 Copy</div>
            <div class="context-menu-item" data-action="delete">🗑️ Delete</div>
        `;
        
        // Add event listeners
        menu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            this.handleContextMenuAction(component, action);
            menu.remove();
        });
        
        // Remove on outside click
        setTimeout(() => {
            document.addEventListener('click', () => menu.remove(), { once: true });
        }, 0);
        
        document.body.appendChild(menu);
    }

    handleContextMenuAction(component, action) {
        switch (action) {
            case 'edit':
                this.editComponent(component);
                break;
            case 'duplicate':
                this.duplicateComponent(component);
                break;
            case 'copy':
                this.copyComponent(component);
                break;
            case 'delete':
                this.removeComponent(component.id);
                break;
        }
    }

    duplicateComponent(component) {
        const data = component.serialize();
        data.id = this.generateComponentId();
        data.position.x += 20;
        data.position.y += 20;
        
        const newComponent = this.builderEngine.componentLibrary.createComponent(data.type, data);
        if (newComponent) {
            this.addComponent(newComponent);
            this.selectComponent(newComponent);
        }
    }

    copyComponent(component) {
        localStorage.setItem('spooky-clipboard', JSON.stringify(component.serialize()));
        this.builderEngine.showNotification('Component captured in the spirit realm', 'info');
    }

    handleCanvasResize() {
        // Update ghost trail canvas size
        this.ghostTrail.width = window.innerWidth;
        this.ghostTrail.height = window.innerHeight;
    }

    generateComponentId() {
        return 'comp_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    }

    // Public API methods
    getAllComponents() {
        return Array.from(this.components.values());
    }

    getComponentById(id) {
        return this.components.get(id);
    }

    clearCanvas() {
        this.components.forEach(component => {
            component.element.remove();
        });
        this.components.clear();
        this.selectComponent(null);
        
        if (this.builderEngine.currentProject) {
            this.builderEngine.currentProject.components = [];
        }
        
        console.log('🧹 Canvas cleared');
    }

    loadProject(projectData) {
        this.clearCanvas();
        
        if (projectData.components) {
            projectData.components.forEach(componentData => {
                const component = this.builderEngine.componentLibrary.createComponent(
                    componentData.type, 
                    componentData
                );
                if (component) {
                    this.addComponent(component);
                }
            });
        }
        
        console.log('📂 Project loaded to canvas');
    }
}