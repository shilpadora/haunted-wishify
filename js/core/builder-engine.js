/**
 * Builder Engine for Spooky Web Builder
 * Main orchestrator that coordinates all systems
 */

class BuilderEngine {
    constructor() {
        this.canvasManager = null;
        this.componentLibrary = null;
        this.effectsEngine = null;
        this.audioManager = null;
        this.exportSystem = null;
        
        this.currentProject = null;
        this.selectedComponent = null;
        this.isModified = false;
        
        this.projects = new Map();
        this.settings = {
            autoSave: true,
            soundEnabled: true,
            effectsEnabled: true,
            theme: 'spooky'
        };
    }

    async initialize() {
        console.log('🎃 Initializing Spooky Web Builder Engine...');
        
        try {
            // Check if required classes are available
            if (typeof ComponentLibrary === 'undefined') {
                throw new Error('ComponentLibrary class not found. Check if js/core/component-library.js is loaded.');
            }
            if (typeof CanvasManager === 'undefined') {
                throw new Error('CanvasManager class not found. Check if js/core/canvas-manager.js is loaded.');
            }
            if (typeof EffectsEngine === 'undefined') {
                throw new Error('EffectsEngine class not found. Check if js/core/effects-engine.js is loaded.');
            }
            if (typeof AudioManager === 'undefined') {
                throw new Error('AudioManager class not found. Check if js/core/audio-manager.js is loaded.');
            }
            if (typeof ExportSystem === 'undefined') {
                throw new Error('ExportSystem class not found. Check if js/core/export-system.js is loaded.');
            }

            // Initialize core systems
            this.componentLibrary = new ComponentLibrary(this);
            this.canvasManager = new CanvasManager(this);
            this.effectsEngine = new EffectsEngine(this);
            this.audioManager = new AudioManager(this);
            this.exportSystem = new ExportSystem(this);
            
            // Initialize all systems
            await this.componentLibrary.initialize();
            await this.canvasManager.initialize();
            await this.effectsEngine.initialize();
            await this.audioManager.initialize();
            await this.exportSystem.initialize();
            
            // Set up UI event handlers
            this.setupUIHandlers();
            
            // Load settings and projects
            this.loadSettings();
            this.loadProjects();
            
            // Create default project or load template
            this.handleInitialLoad();
            
            console.log('✨ Spooky Web Builder Engine initialized successfully!');
            this.showNotification('The spirits have awakened... Builder ready!', 'success');
            
        } catch (error) {
            console.error('💀 Failed to initialize Builder Engine:', error);
            this.showNotification('The spirits are restless... Initialization failed!', 'error');
        }
    }

    setupUIHandlers() {
        // Header buttons
        document.getElementById('save-btn').addEventListener('click', () => this.saveProject());
        document.getElementById('preview-btn').addEventListener('click', () => this.previewProject());
        document.getElementById('export-btn').addEventListener('click', () => this.exportProject());
        
        // Project name input
        document.getElementById('project-name').addEventListener('input', (e) => {
            if (this.currentProject) {
                this.currentProject.name = e.target.value;
                this.markProjectAsModified();
            }
        });
        
        // Properties panel handlers
        this.setupPropertiesPanel();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Window events
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
        window.addEventListener('resize', () => this.handleWindowResize());
    }

    setupPropertiesPanel() {
        const propertiesContent = document.getElementById('properties-content');
        
        // Delegate event handling for property inputs
        propertiesContent.addEventListener('input', (e) => {
            if (e.target.classList.contains('property-input')) {
                this.handlePropertyChange(e.target);
            }
        });
        
        propertiesContent.addEventListener('change', (e) => {
            if (e.target.classList.contains('property-checkbox') || 
                e.target.classList.contains('property-select')) {
                this.handlePropertyChange(e.target);
            }
        });
    }

    handlePropertyChange(input) {
        if (!this.selectedComponent) return;
        
        const property = input.dataset.property;
        let value = input.value;
        
        // Handle different input types
        if (input.type === 'checkbox') {
            value = input.checked ? 'enabled' : 'disabled';
        } else if (input.type === 'range') {
            value = parseFloat(value);
        }
        
        // Update component property
        this.selectedComponent.updateProperty(property, value);
        this.markProjectAsModified();
        
        console.log('🔮 Property updated:', property, '=', value);
    }

    selectComponent(component) {
        this.selectedComponent = component;
        this.updatePropertiesPanel();
    }

    updatePropertiesPanel() {
        const propertiesContent = document.getElementById('properties-content');
        
        if (this.selectedComponent) {
            const propertiesHTML = this.selectedComponent.generatePropertiesPanel();
            propertiesContent.innerHTML = `
                <div class="component-info">
                    <h3>👻 ${this.selectedComponent.type}</h3>
                    <p class="component-id">ID: ${this.selectedComponent.id}</p>
                </div>
                ${propertiesHTML}
            `;
        } else {
            propertiesContent.innerHTML = '<p class="no-selection">Select a component to customize its supernatural properties...</p>';
        }
    }

    createNewProject() {
        const projectId = this.generateProjectId();
        const project = {
            id: projectId,
            name: 'Haunted Website',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            components: [],
            settings: {
                theme: 'spooky',
                backgroundColor: '#0a0a0a',
                backgroundImage: null
            }
        };
        
        this.currentProject = project;
        this.projects.set(projectId, project);
        this.isModified = false;
        
        // Update UI
        document.getElementById('project-name').value = project.name;
        
        console.log('📄 Created new project:', projectId);
    }

    saveProject() {
        if (!this.currentProject) return;
        
        // Update project data
        this.currentProject.modified = new Date().toISOString();
        this.currentProject.components = this.canvasManager.getAllComponents().map(c => c.serialize());
        
        // Save to localStorage
        localStorage.setItem('spooky-projects', JSON.stringify(Array.from(this.projects.entries())));
        
        this.isModified = false;
        this.showNotification('Project sealed in the crypt!', 'success');
        
        console.log('💾 Project saved:', this.currentProject.id);
    }

    previewProject() {
        if (!this.currentProject) return;
        
        // Generate preview HTML
        const previewHTML = this.exportSystem.generatePreviewHTML(this.currentProject);
        
        // Open in new window
        const previewWindow = window.open('', '_blank', 'width=1024,height=768');
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
        
        this.showNotification('Portal opened to preview realm!', 'info');
        console.log('👁️ Preview opened');
    }

    exportProject() {
        if (!this.currentProject) return;
        
        this.exportSystem.exportProject(this.currentProject);
        this.showNotification('Export summoned from the digital realm!', 'success');
        
        console.log('📦 Project exported');
    }

    loadProjects() {
        try {
            const savedProjects = localStorage.getItem('spooky-projects');
            if (savedProjects) {
                const projectsArray = JSON.parse(savedProjects);
                this.projects = new Map(projectsArray);
                console.log('📂 Loaded', this.projects.size, 'projects from storage');
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('spooky-settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
                console.log('⚙️ Settings loaded');
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    saveSettings() {
        localStorage.setItem('spooky-settings', JSON.stringify(this.settings));
        console.log('⚙️ Settings saved');
    }

    markProjectAsModified() {
        this.isModified = true;
        
        // Auto-save if enabled
        if (this.settings.autoSave) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                this.saveProject();
            }, 2000); // Auto-save after 2 seconds of inactivity
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S: Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveProject();
        }
        
        // Ctrl/Cmd + N: New project
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.createNewProject();
        }
        
        // Ctrl/Cmd + E: Export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            this.exportProject();
        }
        
        // Ctrl/Cmd + P: Preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            this.previewProject();
        }
        
        // Escape: Deselect
        if (e.key === 'Escape') {
            this.canvasManager.selectComponent(null);
        }
    }

    handleBeforeUnload(e) {
        if (this.isModified) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    }

    handleWindowResize() {
        // Notify systems of resize
        this.effectsEngine?.handleResize();
        this.canvasManager?.handleCanvasResize();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add appropriate icon
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Play notification sound
        if (this.settings.soundEnabled) {
            this.audioManager?.playSound('whisper', { volume: 0.1 });
        }
    }

    showErrorDialog(title, message) {
        const dialog = document.createElement('div');
        dialog.className = 'error-dialog';
        
        dialog.innerHTML = `
            <div class="error-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="haunted-btn primary" onclick="this.closest('.error-dialog').remove()">
                    Banish Error
                </button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Play error sound
        if (this.settings.soundEnabled) {
            this.audioManager?.playSound('chains', { volume: 0.3 });
        }
    }

    generateProjectId() {
        return 'proj_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    }

    // Public API methods
    getProject(id) {
        return this.projects.get(id);
    }

    getAllProjects() {
        return Array.from(this.projects.values());
    }

    deleteProject(id) {
        this.projects.delete(id);
        this.saveProjects();
    }

    duplicateProject(id) {
        const original = this.projects.get(id);
        if (!original) return null;
        
        const duplicate = {
            ...original,
            id: this.generateProjectId(),
            name: original.name + ' (Copy)',
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };
        
        this.projects.set(duplicate.id, duplicate);
        return duplicate;
    }

    loadProject(id) {
        const project = this.projects.get(id);
        if (!project) return false;
        
        this.currentProject = project;
        this.canvasManager.loadProject(project);
        
        // Update UI
        document.getElementById('project-name').value = project.name;
        
        this.isModified = false;
        console.log('📂 Project loaded:', id);
        return true;
    }

    handleInitialLoad() {
        // Check for template parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const templateType = urlParams.get('template');
        
        if (templateType) {
            this.loadTemplate(templateType);
        } else {
            this.createNewProject();
        }
    }

    loadTemplate(templateType) {
        console.log('🎭 Loading template:', templateType);
        
        // Create new project
        this.createNewProject();
        
        // Add template component to canvas
        setTimeout(() => {
            const component = this.componentLibrary.createComponent(templateType, {
                position: { x: 0, y: 0 },
                dimensions: { width: window.innerWidth - 600, height: window.innerHeight - 100 }
            });

            if (component) {
                this.canvasManager.addComponent(component);
                this.canvasManager.selectComponent(component);
                
                // Update project name based on template
                const templateNames = {
                    'haunted-mansion-template': 'Haunted Mansion Website',
                    'graveyard-portfolio-template': 'Digital Graveyard Portfolio',
                    'retro-landing-page': 'Retro 1995 Landing Page'
                };
                
                const projectName = templateNames[templateType] || 'Spooky Template';
                this.currentProject.name = projectName;
                document.getElementById('project-name').value = projectName;
                
                this.showNotification(`Template "${projectName}" loaded successfully!`, 'success');
            }
        }, 500);
    }
}