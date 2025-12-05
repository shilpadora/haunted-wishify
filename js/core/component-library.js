/**
 * Component Library for Spooky Web Builder
 * Manages all Halloween-themed components and their creation
 */

class ComponentLibrary {
    constructor(builderEngine) {
        this.builderEngine = builderEngine;
        this.componentTypes = new Map();
        this.componentInstances = new Map();
    }

    initialize() {
        this.registerComponents();
        console.log('🎭 Component Library initialized with', this.componentTypes.size, 'component types');
    }

    registerComponents() {
        // Register all component types
        this.componentTypes.set('ghostly-header', GhostlyHeaderComponent);
        this.componentTypes.set('dripping-header', DrippingHeaderComponent);
        this.componentTypes.set('haunted-button', HauntedButtonComponent);
        this.componentTypes.set('glowing-button', GlowingButtonComponent);
        this.componentTypes.set('ghostly-input', GhostlyInputComponent);
        this.componentTypes.set('haunted-form', HauntedFormComponent);
        this.componentTypes.set('phantom-image', PhantomImageComponent);
        this.componentTypes.set('glitch-image', GlitchImageComponent);
        this.componentTypes.set('flickering-text', FlickeringTextComponent);
        this.componentTypes.set('cursed-paragraph', CursedParagraphComponent);
        this.componentTypes.set('retro-landing-page', RetroLandingPageComponent);
        this.componentTypes.set('haunted-mansion-template', HauntedMansionTemplateComponent);
        this.componentTypes.set('graveyard-portfolio-template', GraveyardPortfolioTemplateComponent);
    }

    createComponent(type, config = {}) {
        const ComponentClass = this.componentTypes.get(type);
        if (!ComponentClass) {
            console.error('Unknown component type:', type);
            return null;
        }

        const component = new ComponentClass(config, this.builderEngine);
        this.componentInstances.set(component.id, component);
        
        console.log('✨ Created component:', type, component.id);
        return component;
    }

    getComponentTypes() {
        return Array.from(this.componentTypes.keys());
    }

    getComponentInstance(id) {
        return this.componentInstances.get(id);
    }

    removeComponentInstance(id) {
        this.componentInstances.delete(id);
    }
}

// Base Component Class
class BaseSpookyComponent {
    constructor(config = {}, builderEngine) {
        this.id = config.id || this.generateId();
        this.type = config.type || 'base';
        this.position = config.position || { x: 100, y: 100 };
        this.dimensions = config.dimensions || { width: 200, height: 100 };
        this.properties = { ...this.getDefaultProperties(), ...config.properties };
        this.builderEngine = builderEngine;
        this.element = null;
        
        this.createElement();
        this.updatePosition(this.position);
        this.updateDimensions(this.dimensions);
        this.applyProperties();
    }

    generateId() {
        return 'comp_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    }

    getDefaultProperties() {
        return {
            backgroundColor: 'transparent',
            textColor: '#f8fafc',
            fontSize: '16px',
            fontFamily: 'inherit',
            padding: '16px',
            borderRadius: '8px',
            opacity: 1,
            animation: 'enabled'
        };
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = `canvas-component ${this.type}`;
        this.element.dataset.componentId = this.id;
        this.element.dataset.componentType = this.type;
        
        // Set positioning styles
        this.element.style.position = 'absolute';
        this.element.style.cursor = 'move';
        this.element.style.userSelect = 'none';
        this.element.style.zIndex = '10';
        
        this.renderContent();
    }

    renderContent() {
        // Override in subclasses
        this.element.innerHTML = '<div>Base Component</div>';
    }

    updatePosition(position) {
        this.position = position;
        this.element.style.left = position.x + 'px';
        this.element.style.top = position.y + 'px';
    }

    updateDimensions(dimensions) {
        this.dimensions = dimensions;
        if (dimensions.width) {
            this.element.style.width = dimensions.width + 'px';
        }
        if (dimensions.height) {
            this.element.style.height = dimensions.height + 'px';
        }
    }

    updateProperty(property, value) {
        this.properties[property] = value;
        this.applyProperties();
        
        // Play property change sound
        this.builderEngine.audioManager?.playSound('whisper', { volume: 0.1 });
    }

    applyProperties() {
        const style = this.element.style;
        
        if (this.properties.backgroundColor !== 'transparent') {
            style.backgroundColor = this.properties.backgroundColor;
        }
        
        style.color = this.properties.textColor;
        style.fontSize = this.properties.fontSize;
        style.fontFamily = this.properties.fontFamily;
        style.padding = this.properties.padding;
        style.borderRadius = this.properties.borderRadius;
        style.opacity = this.properties.opacity;
        
        // Toggle animations
        if (this.properties.animation === 'disabled') {
            this.element.style.animation = 'none';
        }
    }

    getPosition() {
        return { ...this.position };
    }

    getDimensions() {
        return { ...this.dimensions };
    }

    serialize() {
        return {
            id: this.id,
            type: this.type,
            position: this.position,
            dimensions: this.dimensions,
            properties: this.properties
        };
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Text Color</label>
                <input type="color" class="property-input" data-property="textColor" value="${this.properties.textColor}">
            </div>
            <div class="property-group">
                <label class="property-label">Background Color</label>
                <input type="color" class="property-input" data-property="backgroundColor" value="${this.properties.backgroundColor}">
            </div>
            <div class="property-group">
                <label class="property-label">Font Size</label>
                <input type="text" class="property-input" data-property="fontSize" value="${this.properties.fontSize}">
            </div>
            <div class="property-group">
                <label class="property-label">Padding</label>
                <input type="text" class="property-input" data-property="padding" value="${this.properties.padding}">
            </div>
            <div class="property-group">
                <label class="property-label">Opacity</label>
                <input type="range" class="property-input" data-property="opacity" min="0" max="1" step="0.1" value="${this.properties.opacity}">
            </div>
            <div class="property-group">
                <label class="checkbox-label">
                    <input type="checkbox" class="property-checkbox" data-property="animation" ${this.properties.animation === 'enabled' ? 'checked' : ''}>
                    Enable Spooky Animations
                </label>
            </div>
        `;
    }
}

// Ghostly Header Component
class GhostlyHeaderComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            text: 'Haunted Title',
            fontSize: '32px',
            fontFamily: 'Creepster, cursive',
            textAlign: 'center',
            glowIntensity: '20px'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <h1 class="ghostly-text" style="
                margin: 0;
                font-size: ${this.properties.fontSize};
                font-family: ${this.properties.fontFamily};
                text-align: ${this.properties.textAlign};
                text-shadow: 0 0 ${this.properties.glowIntensity} rgba(248, 250, 252, 0.3);
            ">${this.properties.text}</h1>
        `;
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Header Text</label>
                <input type="text" class="property-input" data-property="text" value="${this.properties.text}">
            </div>
            <div class="property-group">
                <label class="property-label">Font Size</label>
                <input type="text" class="property-input" data-property="fontSize" value="${this.properties.fontSize}">
            </div>
            <div class="property-group">
                <label class="property-label">Text Alignment</label>
                <select class="property-select" data-property="textAlign">
                    <option value="left" ${this.properties.textAlign === 'left' ? 'selected' : ''}>Left</option>
                    <option value="center" ${this.properties.textAlign === 'center' ? 'selected' : ''}>Center</option>
                    <option value="right" ${this.properties.textAlign === 'right' ? 'selected' : ''}>Right</option>
                </select>
            </div>
            <div class="property-group">
                <label class="property-label">Glow Intensity</label>
                <input type="range" class="property-input" data-property="glowIntensity" min="0" max="50" value="${parseInt(this.properties.glowIntensity)}">
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

// Dripping Header Component
class DrippingHeaderComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            text: 'Dripping Title',
            fontSize: '32px',
            fontFamily: 'Nosifer, cursive',
            textAlign: 'center',
            dripColor: '#ff6b35'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <h1 class="dripping-text" style="
                margin: 0;
                font-size: ${this.properties.fontSize};
                font-family: ${this.properties.fontFamily};
                text-align: ${this.properties.textAlign};
                color: ${this.properties.dripColor};
                text-shadow: 0 0 20px ${this.properties.dripColor};
                position: relative;
            ">${this.properties.text}</h1>
        `;
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Header Text</label>
                <input type="text" class="property-input" data-property="text" value="${this.properties.text}">
            </div>
            <div class="property-group">
                <label class="property-label">Drip Color</label>
                <input type="color" class="property-input" data-property="dripColor" value="${this.properties.dripColor}">
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

// Haunted Button Component
class HauntedButtonComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            text: 'Spooky Button',
            buttonColor: '#ff6b35',
            hoverColor: '#8b5cf6',
            action: 'alert'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <button class="haunted-btn" style="
                background: linear-gradient(135deg, #1a1a1a, #2d3748);
                border: 2px solid ${this.properties.buttonColor};
                color: ${this.properties.textColor};
                padding: 12px 24px;
                font-size: ${this.properties.fontSize};
                border-radius: ${this.properties.borderRadius};
                cursor: pointer;
                transition: all 0.3s ease;
            ">${this.properties.text}</button>
        `;
        
        // Add click event
        const button = this.element.querySelector('.haunted-btn');
        button.addEventListener('click', () => this.handleButtonClick());
        
        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.borderColor = this.properties.hoverColor;
            button.style.boxShadow = `0 0 20px ${this.properties.hoverColor}`;
            this.builderEngine.audioManager?.playSound('whisper', { volume: 0.2 });
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.borderColor = this.properties.buttonColor;
            button.style.boxShadow = 'none';
        });
    }

    handleButtonClick() {
        this.builderEngine.audioManager?.playSound('chains', { volume: 0.4 });
        
        switch (this.properties.action) {
            case 'alert':
                alert('👻 Boo! You clicked the haunted button!');
                break;
            case 'console':
                console.log('👻 Haunted button clicked!');
                break;
            case 'custom':
                // Custom action would be defined by user
                break;
        }
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Button Text</label>
                <input type="text" class="property-input" data-property="text" value="${this.properties.text}">
            </div>
            <div class="property-group">
                <label class="property-label">Button Color</label>
                <input type="color" class="property-input" data-property="buttonColor" value="${this.properties.buttonColor}">
            </div>
            <div class="property-group">
                <label class="property-label">Hover Color</label>
                <input type="color" class="property-input" data-property="hoverColor" value="${this.properties.hoverColor}">
            </div>
            <div class="property-group">
                <label class="property-label">Click Action</label>
                <select class="property-select" data-property="action">
                    <option value="alert" ${this.properties.action === 'alert' ? 'selected' : ''}>Show Alert</option>
                    <option value="console" ${this.properties.action === 'console' ? 'selected' : ''}>Log to Console</option>
                    <option value="custom" ${this.properties.action === 'custom' ? 'selected' : ''}>Custom Action</option>
                </select>
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

// Glowing Button Component
class GlowingButtonComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            text: 'Glowing Button',
            glowColor: '#8b5cf6',
            pulseSpeed: '2s'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <button class="glowing-btn" style="
                background: ${this.properties.glowColor};
                border: none;
                color: ${this.properties.textColor};
                padding: 12px 24px;
                font-size: ${this.properties.fontSize};
                border-radius: 25px;
                cursor: pointer;
                box-shadow: 0 0 20px ${this.properties.glowColor};
                animation: pulseGlow ${this.properties.pulseSpeed} ease-in-out infinite;
            ">${this.properties.text}</button>
        `;
        
        const button = this.element.querySelector('.glowing-btn');
        button.addEventListener('click', () => {
            this.builderEngine.audioManager?.playSound('creak', { volume: 0.3 });
        });
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Button Text</label>
                <input type="text" class="property-input" data-property="text" value="${this.properties.text}">
            </div>
            <div class="property-group">
                <label class="property-label">Glow Color</label>
                <input type="color" class="property-input" data-property="glowColor" value="${this.properties.glowColor}">
            </div>
            <div class="property-group">
                <label class="property-label">Pulse Speed</label>
                <select class="property-select" data-property="pulseSpeed">
                    <option value="1s" ${this.properties.pulseSpeed === '1s' ? 'selected' : ''}>Fast</option>
                    <option value="2s" ${this.properties.pulseSpeed === '2s' ? 'selected' : ''}>Normal</option>
                    <option value="3s" ${this.properties.pulseSpeed === '3s' ? 'selected' : ''}>Slow</option>
                </select>
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

// Ghostly Input Component
class GhostlyInputComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            placeholder: 'Enter your fears...',
            inputType: 'text',
            borderColor: '#374151',
            focusColor: '#8b5cf6'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <input type="${this.properties.inputType}" 
                   class="ghostly-input" 
                   placeholder="${this.properties.placeholder}"
                   style="
                       background: rgba(26, 26, 26, 0.8);
                       border: 1px solid ${this.properties.borderColor};
                       color: ${this.properties.textColor};
                       padding: 12px 16px;
                       border-radius: ${this.properties.borderRadius};
                       font-size: ${this.properties.fontSize};
                       width: 100%;
                       backdrop-filter: blur(5px);
                   ">
        `;
        
        const input = this.element.querySelector('.ghostly-input');
        
        input.addEventListener('focus', () => {
            input.style.borderColor = this.properties.focusColor;
            input.style.boxShadow = `0 0 20px ${this.properties.focusColor}`;
            this.builderEngine.audioManager?.playSound('whisper', { volume: 0.15 });
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = this.properties.borderColor;
            input.style.boxShadow = 'none';
        });
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Placeholder Text</label>
                <input type="text" class="property-input" data-property="placeholder" value="${this.properties.placeholder}">
            </div>
            <div class="property-group">
                <label class="property-label">Input Type</label>
                <select class="property-select" data-property="inputType">
                    <option value="text" ${this.properties.inputType === 'text' ? 'selected' : ''}>Text</option>
                    <option value="email" ${this.properties.inputType === 'email' ? 'selected' : ''}>Email</option>
                    <option value="password" ${this.properties.inputType === 'password' ? 'selected' : ''}>Password</option>
                    <option value="number" ${this.properties.inputType === 'number' ? 'selected' : ''}>Number</option>
                </select>
            </div>
            <div class="property-group">
                <label class="property-label">Border Color</label>
                <input type="color" class="property-input" data-property="borderColor" value="${this.properties.borderColor}">
            </div>
            <div class="property-group">
                <label class="property-label">Focus Color</label>
                <input type="color" class="property-input" data-property="focusColor" value="${this.properties.focusColor}">
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

// Additional component classes would continue here...
// For brevity, I'll implement the remaining components with similar patterns

class HauntedFormComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            title: 'Contact the Spirits',
            submitText: 'Send to the Void',
            fields: ['name', 'email', 'message']
        };
    }

    renderContent() {
        const fieldsHtml = this.properties.fields.map(field => {
            const fieldType = field === 'email' ? 'email' : field === 'message' ? 'textarea' : 'text';
            const placeholder = `Enter your ${field}...`;
            
            if (fieldType === 'textarea') {
                return `
                    <div class="form-group">
                        <label>${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <textarea class="ghostly-input" placeholder="${placeholder}" rows="4"></textarea>
                    </div>
                `;
            } else {
                return `
                    <div class="form-group">
                        <label>${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input type="${fieldType}" class="ghostly-input" placeholder="${placeholder}">
                    </div>
                `;
            }
        }).join('');

        this.element.innerHTML = `
            <div class="haunted-form">
                <h3 style="margin-bottom: 16px; color: ${this.properties.textColor};">${this.properties.title}</h3>
                ${fieldsHtml}
                <button class="haunted-btn" style="width: 100%; margin-top: 16px;">
                    ${this.properties.submitText}
                </button>
            </div>
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

class PhantomImageComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            src: '',
            alt: 'Phantom Image',
            fadeSpeed: '4s'
        };
    }

    renderContent() {
        const content = this.properties.src ? 
            `<img src="${this.properties.src}" alt="${this.properties.alt}" style="width: 100%; height: 100%; object-fit: cover; border-radius: ${this.properties.borderRadius};">` :
            `<div class="phantom-img" style="width: 200px; height: 150px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #94a3b8; border: 2px dashed #374151; border-radius: ${this.properties.borderRadius};">🖼️</div>`;
        
        this.element.innerHTML = content;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

class GlitchImageComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            src: '',
            alt: 'Glitch Image',
            glitchIntensity: 'medium'
        };
    }

    renderContent() {
        const content = this.properties.src ? 
            `<img src="${this.properties.src}" alt="${this.properties.alt}" class="glitch-effect" style="width: 100%; height: 100%; object-fit: cover;">` :
            `<div class="glitch-img" style="width: 200px; height: 150px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #ff6b35; border: 2px solid #ff6b35; border-radius: ${this.properties.borderRadius};">📸</div>`;
        
        this.element.innerHTML = content;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

class FlickeringTextComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            text: 'Flickering Text',
            flickerSpeed: '2s'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <p class="flickering-text" style="
                margin: 0;
                font-size: ${this.properties.fontSize};
                color: ${this.properties.textColor};
                animation: flicker ${this.properties.flickerSpeed} ease-in-out infinite;
            ">${this.properties.text}</p>
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

class CursedParagraphComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            text: 'This text is cursed with ancient magic...',
            cursedColor: '#10b981',
            shakeIntensity: 'low'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <p class="cursed-text" style="
                margin: 0;
                font-size: ${this.properties.fontSize};
                color: ${this.properties.cursedColor};
                text-shadow: 0 0 20px ${this.properties.cursedColor};
                animation: cursedShake 4s ease-in-out infinite;
            ">${this.properties.text}</p>
        `;
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Cursed Text</label>
                <textarea class="property-textarea" data-property="text">${this.properties.text}</textarea>
            </div>
            <div class="property-group">
                <label class="property-label">Cursed Color</label>
                <input type="color" class="property-input" data-property="cursedColor" value="${this.properties.cursedColor}">
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

// Retro Landing Page Component
class RetroLandingPageComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            sequenceEnabled: true,
            autoStart: true,
            skipEnabled: true,
            width: '800px',
            height: '600px'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <div class="retro-landing-container" style="
                width: ${this.properties.width};
                height: ${this.properties.height};
                background: #000000;
                border: 2px solid #c0c0c0;
                position: relative;
                overflow: hidden;
                font-family: 'VT323', monospace;
            ">
                <div class="landing-preview">
                    <div class="preview-monitor" style="
                        width: 100%;
                        height: 100%;
                        background: radial-gradient(ellipse at center, #003300 0%, #000000 40%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #00ff00;
                        font-size: 24px;
                        text-shadow: 0 0 20px #00ff00;
                    ">
                        <div class="preview-content">
                            <div style="margin-bottom: 20px;">📺 1995 RETRO EXPERIENCE</div>
                            <div style="font-size: 16px; opacity: 0.7;">Click to launch full sequence</div>
                        </div>
                    </div>
                </div>
                <button class="launch-sequence-btn" style="
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background: #c0c0c0;
                    border: 2px outset #c0c0c0;
                    padding: 8px 16px;
                    font-family: 'VT323', monospace;
                    font-size: 14px;
                    cursor: pointer;
                ">Launch Sequence</button>
            </div>
        `;

        // Add click event to launch full sequence
        const launchBtn = this.element.querySelector('.launch-sequence-btn');
        const preview = this.element.querySelector('.landing-preview');
        
        const launchSequence = () => {
            // Open the retro landing page in a new window/tab
            window.open('retro-landing.html', '_blank', 'width=1024,height=768');
        };

        if (launchBtn) {
            launchBtn.addEventListener('click', launchSequence);
        }
        
        if (preview) {
            preview.addEventListener('click', launchSequence);
        }
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Container Width</label>
                <input type="text" class="property-input" data-property="width" value="${this.properties.width}">
            </div>
            <div class="property-group">
                <label class="property-label">Container Height</label>
                <input type="text" class="property-input" data-property="height" value="${this.properties.height}">
            </div>
            <div class="property-group">
                <label class="checkbox-label">
                    <input type="checkbox" class="property-checkbox" data-property="sequenceEnabled" ${this.properties.sequenceEnabled ? 'checked' : ''}>
                    Enable Opening Sequence
                </label>
            </div>
            <div class="property-group">
                <label class="checkbox-label">
                    <input type="checkbox" class="property-checkbox" data-property="autoStart" ${this.properties.autoStart ? 'checked' : ''}>
                    Auto-start Sequence
                </label>
            </div>
            <div class="property-group">
                <label class="checkbox-label">
                    <input type="checkbox" class="property-checkbox" data-property="skipEnabled" ${this.properties.skipEnabled ? 'checked' : ''}>
                    Allow Sequence Skip
                </label>
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}
// Haunted Mansion Template Component
class HauntedMansionTemplateComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            siteName: 'Haunted Mansion',
            tagline: 'Welcome to the Dark Side',
            heroText: 'Enter if you dare...',
            aboutText: 'This ancient mansion holds secrets from centuries past.',
            contactEmail: 'spirits@hauntedmansion.com',
            width: '100%',
            height: '100vh'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <div class="haunted-mansion-template" style="
                width: ${this.properties.width};
                height: ${this.properties.height};
                background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%);
                color: #f8fafc;
                overflow-y: auto;
                position: relative;
            ">
                <!-- Navigation -->
                <nav class="mansion-nav" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 16px 32px;
                    z-index: 100;
                    border-bottom: 2px solid #8b0000;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="logo" style="
                            font-family: 'Creepster', cursive;
                            font-size: 24px;
                            color: #8b0000;
                            text-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
                        ">🏚️ ${this.properties.siteName}</div>
                        <div class="nav-links" style="display: flex; gap: 32px;">
                            <a href="#home" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">Home</a>
                            <a href="#about" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">About</a>
                            <a href="#gallery" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">Gallery</a>
                            <a href="#contact" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">Contact</a>
                        </div>
                    </div>
                </nav>

                <!-- Hero Section -->
                <section id="home" class="hero" style="
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"mansion\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\"><rect width=\"100\" height=\"100\" fill=\"%23000\"/><path d=\"M50 10L90 50H10z\" fill=\"%23111\"/><rect x=\"40\" y=\"50\" width=\"20\" height=\"40\" fill=\"%23222\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23mansion)\" opacity=\"0.1\"/></svg>') center/cover;
                    position: relative;
                ">
                    <div style="position: relative; z-index: 2;">
                        <h1 style="
                            font-family: 'Nosifer', cursive;
                            font-size: 4rem;
                            color: #8b0000;
                            text-shadow: 0 0 30px rgba(139, 0, 0, 0.8);
                            margin-bottom: 16px;
                            animation: flicker 3s ease-in-out infinite;
                        ">${this.properties.heroText}</h1>
                        <p style="
                            font-size: 1.5rem;
                            color: #94a3b8;
                            margin-bottom: 32px;
                        ">${this.properties.tagline}</p>
                        <button style="
                            background: linear-gradient(135deg, #8b0000, #660000);
                            border: 2px solid #8b0000;
                            color: white;
                            padding: 16px 32px;
                            font-size: 1.2rem;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 0 20px rgba(139, 0, 0, 0.3);
                        ">Explore the Mansion</button>
                    </div>
                </section>

                <!-- About Section -->
                <section id="about" style="
                    padding: 100px 32px;
                    background: rgba(26, 10, 10, 0.8);
                    text-align: center;
                ">
                    <h2 style="
                        font-family: 'Creepster', cursive;
                        font-size: 3rem;
                        color: #8b0000;
                        margin-bottom: 32px;
                        text-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
                    ">About the Mansion</h2>
                    <p style="
                        font-size: 1.2rem;
                        line-height: 1.8;
                        max-width: 800px;
                        margin: 0 auto;
                        color: #d1d5db;
                    ">${this.properties.aboutText}</p>
                </section>

                <!-- Gallery Section -->
                <section id="gallery" style="
                    padding: 100px 32px;
                    background: rgba(10, 10, 26, 0.8);
                ">
                    <h2 style="
                        font-family: 'Creepster', cursive;
                        font-size: 3rem;
                        color: #8b0000;
                        margin-bottom: 64px;
                        text-align: center;
                        text-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
                    ">Haunted Gallery</h2>
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 32px;
                        max-width: 1200px;
                        margin: 0 auto;
                    ">
                        <div class="gallery-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #8b0000;
                            border-radius: 12px;
                            padding: 24px;
                            text-align: center;
                            transition: transform 0.3s ease;
                        ">
                            <div style="font-size: 4rem; margin-bottom: 16px;">👻</div>
                            <h3 style="color: #8b0000; margin-bottom: 12px;">The Ghost</h3>
                            <p style="color: #94a3b8;">A restless spirit roams these halls...</p>
                        </div>
                        <div class="gallery-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #8b0000;
                            border-radius: 12px;
                            padding: 24px;
                            text-align: center;
                            transition: transform 0.3s ease;
                        ">
                            <div style="font-size: 4rem; margin-bottom: 16px;">🕯️</div>
                            <h3 style="color: #8b0000; margin-bottom: 12px;">The Candle</h3>
                            <p style="color: #94a3b8;">Eternal flames that never die...</p>
                        </div>
                        <div class="gallery-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #8b0000;
                            border-radius: 12px;
                            padding: 24px;
                            text-align: center;
                            transition: transform 0.3s ease;
                        ">
                            <div style="font-size: 4rem; margin-bottom: 16px;">🗝️</div>
                            <h3 style="color: #8b0000; margin-bottom: 12px;">The Key</h3>
                            <p style="color: #94a3b8;">Unlocks secrets of the past...</p>
                        </div>
                    </div>
                </section>

                <!-- Contact Section -->
                <section id="contact" style="
                    padding: 100px 32px;
                    background: rgba(26, 10, 10, 0.8);
                    text-align: center;
                ">
                    <h2 style="
                        font-family: 'Creepster', cursive;
                        font-size: 3rem;
                        color: #8b0000;
                        margin-bottom: 32px;
                        text-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
                    ">Contact the Spirits</h2>
                    <p style="
                        font-size: 1.2rem;
                        margin-bottom: 32px;
                        color: #d1d5db;
                    ">Dare to reach out to the otherworld...</p>
                    <div style="
                        background: rgba(0, 0, 0, 0.5);
                        border: 2px solid #8b0000;
                        border-radius: 12px;
                        padding: 32px;
                        max-width: 500px;
                        margin: 0 auto;
                    ">
                        <input type="text" placeholder="Your Name" style="
                            width: 100%;
                            background: rgba(26, 26, 26, 0.8);
                            border: 1px solid #8b0000;
                            color: #f8fafc;
                            padding: 12px 16px;
                            border-radius: 6px;
                            margin-bottom: 16px;
                            font-size: 1rem;
                        ">
                        <input type="email" placeholder="Your Email" style="
                            width: 100%;
                            background: rgba(26, 26, 26, 0.8);
                            border: 1px solid #8b0000;
                            color: #f8fafc;
                            padding: 12px 16px;
                            border-radius: 6px;
                            margin-bottom: 16px;
                            font-size: 1rem;
                        ">
                        <textarea placeholder="Your Message" rows="4" style="
                            width: 100%;
                            background: rgba(26, 26, 26, 0.8);
                            border: 1px solid #8b0000;
                            color: #f8fafc;
                            padding: 12px 16px;
                            border-radius: 6px;
                            margin-bottom: 16px;
                            font-size: 1rem;
                            resize: vertical;
                        "></textarea>
                        <button style="
                            background: linear-gradient(135deg, #8b0000, #660000);
                            border: 2px solid #8b0000;
                            color: white;
                            padding: 12px 32px;
                            font-size: 1rem;
                            border-radius: 6px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">Send Message</button>
                    </div>
                </section>
            </div>
        `;

        // Add smooth scrolling for navigation
        this.setupNavigation();
    }

    setupNavigation() {
        const navLinks = this.element.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = this.element.querySelector(`#${targetId}`);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });

            link.addEventListener('mouseenter', () => {
                link.style.color = '#8b0000';
                link.style.textShadow = '0 0 10px rgba(139, 0, 0, 0.5)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.color = '#f8fafc';
                link.style.textShadow = 'none';
            });
        });

        // Add hover effects to gallery items
        const galleryItems = this.element.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.05)';
                item.style.boxShadow = '0 10px 30px rgba(139, 0, 0, 0.3)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.boxShadow = 'none';
            });
        });
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Site Name</label>
                <input type="text" class="property-input" data-property="siteName" value="${this.properties.siteName}">
            </div>
            <div class="property-group">
                <label class="property-label">Tagline</label>
                <input type="text" class="property-input" data-property="tagline" value="${this.properties.tagline}">
            </div>
            <div class="property-group">
                <label class="property-label">Hero Text</label>
                <input type="text" class="property-input" data-property="heroText" value="${this.properties.heroText}">
            </div>
            <div class="property-group">
                <label class="property-label">About Text</label>
                <textarea class="property-textarea" data-property="aboutText">${this.properties.aboutText}</textarea>
            </div>
            <div class="property-group">
                <label class="property-label">Contact Email</label>
                <input type="email" class="property-input" data-property="contactEmail" value="${this.properties.contactEmail}">
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}

// Graveyard Portfolio Template Component
class GraveyardPortfolioTemplateComponent extends BaseSpookyComponent {
    getDefaultProperties() {
        return {
            ...super.getDefaultProperties(),
            siteName: 'Digital Graveyard',
            subtitle: 'Portfolio of the Departed',
            heroTitle: 'Welcome to My Digital Afterlife',
            heroSubtitle: 'Where creativity never dies',
            aboutTitle: 'About the Phantom Developer',
            aboutText: 'I am a spirit who codes beyond the veil, creating digital experiences that haunt the web.',
            skillsTitle: 'Spectral Skills',
            portfolioTitle: 'Haunted Projects',
            contactTitle: 'Summon Me',
            width: '100%',
            height: '100vh'
        };
    }

    renderContent() {
        this.element.innerHTML = `
            <div class="graveyard-portfolio-template" style="
                width: ${this.properties.width};
                height: ${this.properties.height};
                background: linear-gradient(135deg, #0a0a0a 0%, #0a1a0a 100%);
                color: #f8fafc;
                overflow-y: auto;
                position: relative;
            ">
                <!-- Navigation -->
                <nav class="graveyard-nav" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: rgba(10, 26, 10, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 16px 32px;
                    z-index: 100;
                    border-bottom: 2px solid #10b981;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="logo" style="
                            font-family: 'Creepster', cursive;
                            font-size: 24px;
                            color: #10b981;
                            text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
                        ">⚰️ ${this.properties.siteName}</div>
                        <div class="nav-links" style="display: flex; gap: 32px;">
                            <a href="#home" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">Home</a>
                            <a href="#about" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">About</a>
                            <a href="#skills" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">Skills</a>
                            <a href="#portfolio" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">Portfolio</a>
                            <a href="#contact" style="color: #f8fafc; text-decoration: none; transition: color 0.3s;">Contact</a>
                        </div>
                    </div>
                </nav>

                <!-- Hero Section -->
                <section id="home" class="hero" style="
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"graveyard\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\"><rect width=\"100\" height=\"100\" fill=\"%23000\"/><rect x=\"20\" y=\"60\" width=\"15\" height=\"30\" fill=\"%23111\" rx=\"2\"/><rect x=\"40\" y=\"55\" width=\"20\" height=\"35\" fill=\"%23111\" rx=\"3\"/><rect x=\"65\" y=\"65\" width=\"12\" height=\"25\" fill=\"%23111\" rx=\"2\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23graveyard)\" opacity=\"0.1\"/></svg>') center/cover;
                    position: relative;
                ">
                    <div style="position: relative; z-index: 2;">
                        <h1 style="
                            font-family: 'Nosifer', cursive;
                            font-size: 4rem;
                            color: #10b981;
                            text-shadow: 0 0 30px rgba(16, 185, 129, 0.8);
                            margin-bottom: 16px;
                            animation: ghostlyGlow 3s ease-in-out infinite;
                        ">${this.properties.heroTitle}</h1>
                        <p style="
                            font-size: 1.5rem;
                            color: #94a3b8;
                            margin-bottom: 32px;
                        ">${this.properties.heroSubtitle}</p>
                        <div style="display: flex; gap: 16px; justify-content: center;">
                            <button style="
                                background: linear-gradient(135deg, #10b981, #059669);
                                border: 2px solid #10b981;
                                color: white;
                                padding: 16px 32px;
                                font-size: 1.1rem;
                                border-radius: 8px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
                            ">View My Work</button>
                            <button style="
                                background: transparent;
                                border: 2px solid #10b981;
                                color: #10b981;
                                padding: 16px 32px;
                                font-size: 1.1rem;
                                border-radius: 8px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">Contact Me</button>
                        </div>
                    </div>
                </section>

                <!-- About Section -->
                <section id="about" style="
                    padding: 100px 32px;
                    background: rgba(10, 26, 10, 0.8);
                ">
                    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;">
                        <div>
                            <h2 style="
                                font-family: 'Creepster', cursive;
                                font-size: 3rem;
                                color: #10b981;
                                margin-bottom: 32px;
                                text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
                            ">${this.properties.aboutTitle}</h2>
                            <p style="
                                font-size: 1.2rem;
                                line-height: 1.8;
                                color: #d1d5db;
                                margin-bottom: 32px;
                            ">${this.properties.aboutText}</p>
                            <div style="display: flex; gap: 16px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem; color: #10b981; margin-bottom: 8px;">👻</div>
                                    <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">5+</div>
                                    <div style="color: #94a3b8;">Years Haunting</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem; color: #10b981; margin-bottom: 8px;">💀</div>
                                    <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">50+</div>
                                    <div style="color: #94a3b8;">Projects Buried</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem; color: #10b981; margin-bottom: 8px;">🕯️</div>
                                    <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">100+</div>
                                    <div style="color: #94a3b8;">Souls Helped</div>
                                </div>
                            </div>
                        </div>
                        <div style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            padding: 32px;
                            text-align: center;
                        ">
                            <div style="font-size: 8rem; margin-bottom: 16px;">👤</div>
                            <h3 style="color: #10b981; margin-bottom: 8px;">The Phantom Developer</h3>
                            <p style="color: #94a3b8;">Coding from beyond the veil</p>
                        </div>
                    </div>
                </section>

                <!-- Skills Section -->
                <section id="skills" style="
                    padding: 100px 32px;
                    background: rgba(26, 10, 26, 0.8);
                ">
                    <h2 style="
                        font-family: 'Creepster', cursive;
                        font-size: 3rem;
                        color: #10b981;
                        margin-bottom: 64px;
                        text-align: center;
                        text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
                    ">${this.properties.skillsTitle}</h2>
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 32px;
                        max-width: 1200px;
                        margin: 0 auto;
                    ">
                        <div class="skill-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            padding: 24px;
                            text-align: center;
                            transition: transform 0.3s ease;
                        ">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🕸️</div>
                            <h3 style="color: #10b981; margin-bottom: 12px;">Web Development</h3>
                            <p style="color: #94a3b8;">HTML, CSS, JavaScript</p>
                        </div>
                        <div class="skill-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            padding: 24px;
                            text-align: center;
                            transition: transform 0.3s ease;
                        ">
                            <div style="font-size: 3rem; margin-bottom: 16px;">⚡</div>
                            <h3 style="color: #10b981; margin-bottom: 12px;">Frameworks</h3>
                            <p style="color: #94a3b8;">React, Vue, Node.js</p>
                        </div>
                        <div class="skill-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            padding: 24px;
                            text-align: center;
                            transition: transform 0.3s ease;
                        ">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🎨</div>
                            <h3 style="color: #10b981; margin-bottom: 12px;">Design</h3>
                            <p style="color: #94a3b8;">UI/UX, Figma, Adobe</p>
                        </div>
                        <div class="skill-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            padding: 24px;
                            text-align: center;
                            transition: transform 0.3s ease;
                        ">
                            <div style="font-size: 3rem; margin-bottom: 16px;">💾</div>
                            <h3 style="color: #10b981; margin-bottom: 12px;">Backend</h3>
                            <p style="color: #94a3b8;">Python, PHP, Databases</p>
                        </div>
                    </div>
                </section>

                <!-- Portfolio Section -->
                <section id="portfolio" style="
                    padding: 100px 32px;
                    background: rgba(10, 26, 10, 0.8);
                ">
                    <h2 style="
                        font-family: 'Creepster', cursive;
                        font-size: 3rem;
                        color: #10b981;
                        margin-bottom: 64px;
                        text-align: center;
                        text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
                    ">${this.properties.portfolioTitle}</h2>
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                        gap: 32px;
                        max-width: 1200px;
                        margin: 0 auto;
                    ">
                        <div class="portfolio-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            overflow: hidden;
                            transition: transform 0.3s ease;
                        ">
                            <div style="
                                height: 200px;
                                background: linear-gradient(135deg, #10b981, #059669);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 4rem;
                            ">🌙</div>
                            <div style="padding: 24px;">
                                <h3 style="color: #10b981; margin-bottom: 12px;">Moonlight E-commerce</h3>
                                <p style="color: #94a3b8; margin-bottom: 16px;">A haunting online store that sells under the moonlight.</p>
                                <button style="
                                    background: transparent;
                                    border: 1px solid #10b981;
                                    color: #10b981;
                                    padding: 8px 16px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                ">View Project</button>
                            </div>
                        </div>
                        <div class="portfolio-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            overflow: hidden;
                            transition: transform 0.3s ease;
                        ">
                            <div style="
                                height: 200px;
                                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 4rem;
                            ">🔮</div>
                            <div style="padding: 24px;">
                                <h3 style="color: #10b981; margin-bottom: 12px;">Crystal Ball App</h3>
                                <p style="color: #94a3b8; margin-bottom: 16px;">Predict the future with this mystical web application.</p>
                                <button style="
                                    background: transparent;
                                    border: 1px solid #10b981;
                                    color: #10b981;
                                    padding: 8px 16px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                ">View Project</button>
                            </div>
                        </div>
                        <div class="portfolio-item" style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            overflow: hidden;
                            transition: transform 0.3s ease;
                        ">
                            <div style="
                                height: 200px;
                                background: linear-gradient(135deg, #ff6b35, #e55a2b);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 4rem;
                            ">🎃</div>
                            <div style="padding: 24px;">
                                <h3 style="color: #10b981; margin-bottom: 12px;">Pumpkin Patch CMS</h3>
                                <p style="color: #94a3b8; margin-bottom: 16px;">Content management for the spookiest season.</p>
                                <button style="
                                    background: transparent;
                                    border: 1px solid #10b981;
                                    color: #10b981;
                                    padding: 8px 16px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                ">View Project</button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Contact Section -->
                <section id="contact" style="
                    padding: 100px 32px;
                    background: rgba(26, 10, 26, 0.8);
                    text-align: center;
                ">
                    <h2 style="
                        font-family: 'Creepster', cursive;
                        font-size: 3rem;
                        color: #10b981;
                        margin-bottom: 32px;
                        text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
                    ">${this.properties.contactTitle}</h2>
                    <p style="
                        font-size: 1.2rem;
                        margin-bottom: 48px;
                        color: #d1d5db;
                        max-width: 600px;
                        margin-left: auto;
                        margin-right: auto;
                    ">Ready to bring your digital dreams to life? Let's create something hauntingly beautiful together.</p>
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 32px;
                        max-width: 800px;
                        margin: 0 auto;
                    ">
                        <div style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            padding: 32px;
                        ">
                            <div style="font-size: 3rem; margin-bottom: 16px;">📧</div>
                            <h3 style="color: #10b981; margin-bottom: 12px;">Email</h3>
                            <p style="color: #94a3b8;">phantom@digitalgraveyard.com</p>
                        </div>
                        <div style="
                            background: rgba(0, 0, 0, 0.5);
                            border: 2px solid #10b981;
                            border-radius: 12px;
                            padding: 32px;
                        ">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🌐</div>
                            <h3 style="color: #10b981; margin-bottom: 12px;">Social</h3>
                            <p style="color: #94a3b8;">@PhantomDev</p>
                        </div>
                    </div>
                </section>
            </div>
        `;

        // Add smooth scrolling and interactions
        this.setupPortfolioNavigation();
    }

    setupPortfolioNavigation() {
        const navLinks = this.element.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = this.element.querySelector(`#${targetId}`);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });

            link.addEventListener('mouseenter', () => {
                link.style.color = '#10b981';
                link.style.textShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.color = '#f8fafc';
                link.style.textShadow = 'none';
            });
        });

        // Add hover effects to skill items
        const skillItems = this.element.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.05)';
                item.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.boxShadow = 'none';
            });
        });

        // Add hover effects to portfolio items
        const portfolioItems = this.element.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.02)';
                item.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.2)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.boxShadow = 'none';
            });
        });
    }

    generatePropertiesPanel() {
        return `
            <div class="property-group">
                <label class="property-label">Site Name</label>
                <input type="text" class="property-input" data-property="siteName" value="${this.properties.siteName}">
            </div>
            <div class="property-group">
                <label class="property-label">Hero Title</label>
                <input type="text" class="property-input" data-property="heroTitle" value="${this.properties.heroTitle}">
            </div>
            <div class="property-group">
                <label class="property-label">Hero Subtitle</label>
                <input type="text" class="property-input" data-property="heroSubtitle" value="${this.properties.heroSubtitle}">
            </div>
            <div class="property-group">
                <label class="property-label">About Title</label>
                <input type="text" class="property-input" data-property="aboutTitle" value="${this.properties.aboutTitle}">
            </div>
            <div class="property-group">
                <label class="property-label">About Text</label>
                <textarea class="property-textarea" data-property="aboutText">${this.properties.aboutText}</textarea>
            </div>
            <div class="property-group">
                <label class="property-label">Skills Title</label>
                <input type="text" class="property-input" data-property="skillsTitle" value="${this.properties.skillsTitle}">
            </div>
            <div class="property-group">
                <label class="property-label">Portfolio Title</label>
                <input type="text" class="property-input" data-property="portfolioTitle" value="${this.properties.portfolioTitle}">
            </div>
            <div class="property-group">
                <label class="property-label">Contact Title</label>
                <input type="text" class="property-input" data-property="contactTitle" value="${this.properties.contactTitle}">
            </div>
            ${super.generatePropertiesPanel()}
        `;
    }

    applyProperties() {
        super.applyProperties();
        this.renderContent();
    }
}