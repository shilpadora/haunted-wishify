/**
 * Export System for Spooky Web Builder
 * Handles project export and HTML generation
 */

class ExportSystem {
    constructor(builderEngine) {
        this.builderEngine = builderEngine;
        this.exportFormats = ['html', 'zip', 'json'];
    }

    initialize() {
        console.log('📦 Export System initialized');
        return Promise.resolve();
    }

    exportProject(project, format = 'html') {
        switch (format) {
            case 'html':
                this.exportAsHTML(project);
                break;
            case 'zip':
                this.exportAsZip(project);
                break;
            case 'json':
                this.exportAsJSON(project);
                break;
            default:
                console.error('Unknown export format:', format);
        }
    }

    exportAsHTML(project) {
        const html = this.generateCompleteHTML(project);
        this.downloadFile(`${project.name}.html`, html, 'text/html');
    }

    exportAsJSON(project) {
        const projectData = {
            ...project,
            components: this.builderEngine.canvasManager.getAllComponents().map(c => c.serialize()),
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const json = JSON.stringify(projectData, null, 2);
        this.downloadFile(`${project.name}.json`, json, 'application/json');
    }

    exportAsZip(project) {
        // For now, just export HTML - could be extended to include assets
        this.exportAsHTML(project);
        this.builderEngine.showNotification('ZIP export coming soon! HTML exported instead.', 'info');
    }

    generateCompleteHTML(project) {
        const components = this.builderEngine.canvasManager.getAllComponents();
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(project.name)}</title>
    <style>
        ${this.generateCSS(project, components)}
    </style>
</head>
<body class="spooky-theme">
    <div class="spooky-container">
        ${this.generateComponentsHTML(components)}
    </div>
    
    <script>
        ${this.generateJavaScript(project, components)}
    </script>
</body>
</html>`;
    }

    generatePreviewHTML(project) {
        // Similar to complete HTML but optimized for preview
        return this.generateCompleteHTML(project);
    }

    generateCSS(project, components) {
        return `
/* Spooky Web Builder - Generated Styles */

:root {
    --color-primary: #0a0a0a;
    --color-secondary: #ff6b35;
    --color-accent: #8b5cf6;
    --color-warning: #10b981;
    --color-background: #1a1a1a;
    --color-text: #f8fafc;
    --color-text-dim: #94a3b8;
    --color-border: #374151;
    --color-hover: #2d3748;
    
    --glow-orange: 0 0 20px rgba(255, 107, 53, 0.5);
    --glow-purple: 0 0 20px rgba(139, 92, 246, 0.5);
    --glow-green: 0 0 20px rgba(16, 185, 129, 0.5);
    --glow-white: 0 0 15px rgba(248, 250, 252, 0.3);
    
    --font-primary: 'Creepster', cursive;
    --font-secondary: 'Courier New', monospace;
    --font-accent: 'Nosifer', cursive;
    --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-body);
    background: var(--color-primary);
    color: var(--color-text);
    min-height: 100vh;
    position: relative;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    animation: backgroundShift 20s ease-in-out infinite;
    pointer-events: none;
    z-index: -1;
}

@keyframes backgroundShift {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
}

.spooky-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 20px;
}

/* Component Styles */
.spooky-component {
    position: absolute;
    transition: all 0.3s ease;
}

.spooky-component:hover {
    transform: translateY(-2px);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Ghostly Header Styles */
.ghostly-text {
    font-family: var(--font-primary);
    text-shadow: var(--glow-white);
    animation: ghostlyGlow 3s ease-in-out infinite;
}

@keyframes ghostlyGlow {
    0%, 100% { text-shadow: var(--glow-white); }
    50% { text-shadow: 0 0 30px rgba(248, 250, 252, 0.6); }
}

/* Dripping Header Styles */
.dripping-text {
    font-family: var(--font-accent);
    position: relative;
}

.dripping-text::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 20px;
    background: linear-gradient(to bottom, currentColor, transparent);
    animation: drip 2s ease-in-out infinite;
}

@keyframes drip {
    0%, 100% { height: 20px; opacity: 1; }
    50% { height: 30px; opacity: 0.7; }
}

/* Button Styles */
.haunted-btn {
    background: linear-gradient(135deg, var(--color-background), #2d3748);
    border: 2px solid var(--color-secondary);
    color: var(--color-text);
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.haunted-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
}

.haunted-btn:hover::before {
    left: 100%;
}

.haunted-btn:hover {
    border-color: var(--color-accent);
    box-shadow: var(--glow-purple);
    transform: translateY(-2px);
}

.glowing-btn {
    background: var(--color-accent);
    border: none;
    color: var(--color-text);
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: var(--glow-purple);
    animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
    0%, 100% { 
        box-shadow: var(--glow-purple);
        transform: scale(1);
    }
    50% { 
        box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
        transform: scale(1.05);
    }
}

/* Input Styles */
.ghostly-input {
    background: rgba(26, 26, 26, 0.8);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 1rem;
    width: 100%;
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;
}

.ghostly-input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: var(--glow-purple);
}

/* Text Effects */
.flickering-text {
    animation: flicker 2s ease-in-out infinite;
}

@keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
    75% { opacity: 0.9; }
    85% { opacity: 0.7; }
    95% { opacity: 1; }
}

.cursed-text {
    animation: cursedShake 4s ease-in-out infinite;
}

@keyframes cursedShake {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(-2px); }
    20% { transform: translateX(2px); }
    30% { transform: translateX(-1px); }
    40% { transform: translateX(1px); }
    50% { transform: translateX(-2px); }
    60% { transform: translateX(2px); }
    70% { transform: translateX(-1px); }
    80% { transform: translateX(1px); }
    90% { transform: translateX(-1px); }
}

/* Image Styles */
.phantom-img, .glitch-img {
    border-radius: 8px;
    transition: all 0.3s ease;
}

.phantom-img {
    opacity: 0.8;
    animation: phantomFade 4s ease-in-out infinite;
}

@keyframes phantomFade {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.4; }
}

.glitch-img {
    animation: glitchEffect 3s ease-in-out infinite;
}

@keyframes glitchEffect {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-2px); }
    40% { transform: translateX(2px); }
    60% { transform: translateX(-1px); }
    80% { transform: translateX(1px); }
}

/* Form Styles */
.haunted-form {
    background: rgba(26, 26, 26, 0.8);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 4px;
    color: var(--color-text-dim);
    font-size: 0.9rem;
}

/* Retro Landing Page Styles */
.retro-landing-container {
    border: 2px solid #c0c0c0;
    background: #000000;
    font-family: 'VT323', monospace;
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
}

/* Responsive Design */
@media (max-width: 768px) {
    .spooky-container {
        padding: 10px;
    }
    
    .spooky-component {
        position: relative !important;
        margin-bottom: 20px;
    }
}

/* Component-specific positioning */
${this.generateComponentPositions(components)}
        `;
    }

    generateComponentPositions(components) {
        return components.map(component => {
            const pos = component.getPosition();
            const dims = component.getDimensions();
            
            return `
.component-${component.id} {
    left: ${pos.x}px;
    top: ${pos.y}px;
    width: ${dims.width}px;
    height: ${dims.height}px;
}`;
        }).join('\n');
    }

    generateComponentsHTML(components) {
        return components.map(component => {
            const pos = component.getPosition();
            const dims = component.getDimensions();
            
            // Clone the component element and clean it up for export
            const clone = component.element.cloneNode(true);
            
            // Remove builder-specific classes
            clone.classList.remove('canvas-component', 'selected', 'dragging', 'appearing');
            clone.classList.add('spooky-component', `component-${component.id}`);
            
            // Remove data attributes
            delete clone.dataset.componentId;
            delete clone.dataset.componentType;
            
            return clone.outerHTML;
        }).join('\n');
    }

    generateJavaScript(project, components) {
        return `
// Spooky Web Builder - Generated JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('👻 ${project.name} loaded successfully!');
    
    // Initialize spooky effects
    initializeSpookyEffects();
    
    // Initialize component interactions
    initializeComponentInteractions();
});

function initializeSpookyEffects() {
    // Add floating animation to ghostly elements
    const ghostlyElements = document.querySelectorAll('.ghostly-text');
    ghostlyElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.haunted-btn, .glowing-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add focus effects to inputs
    const inputs = document.querySelectorAll('.ghostly-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function initializeComponentInteractions() {
    ${this.generateComponentInteractions(components)}
}

${this.generateUtilityFunctions()}
        `;
    }

    generateComponentInteractions(components) {
        return components.map(component => {
            switch (component.type) {
                case 'haunted-button':
                    return `
    // Haunted button: ${component.id}
    document.querySelector('.component-${component.id} .haunted-btn')?.addEventListener('click', function() {
        alert('👻 Boo! You clicked the haunted button!');
    });`;
                
                case 'retro-landing-page':
                    return `
    // Retro landing page: ${component.id}
    document.querySelector('.component-${component.id} .launch-sequence-btn')?.addEventListener('click', function() {
        window.open('retro-landing.html', '_blank', 'width=1024,height=768');
    });`;
                
                default:
                    return `// Component ${component.id} (${component.type}) - no special interactions`;
            }
        }).join('\n');
    }

    generateUtilityFunctions() {
        return `
// Utility functions for spooky effects

function createSpookyParticles(element) {
    const particles = [];
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#8b5cf6';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        particle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(particle);
        particles.push(particle);
        
        // Animate particle
        particle.animate([
            { transform: 'translateY(0px)', opacity: 1 },
            { transform: 'translateY(-50px)', opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

function addGlowEffect(element, color = '#8b5cf6') {
    element.style.boxShadow = \`0 0 20px \${color}\`;
    setTimeout(() => {
        element.style.boxShadow = '';
    }, 1000);
}

function triggerSpookySound() {
    // Placeholder for sound effects
    console.log('👻 Spooky sound triggered!');
}
        `;
    }

    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        console.log('📥 Downloaded:', filename);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API methods
    getSupportedFormats() {
        return [...this.exportFormats];
    }

    validateProject(project) {
        if (!project.name || !project.id) {
            return { valid: false, error: 'Project missing required fields' };
        }
        
        return { valid: true };
    }

    generateProjectPreview(project) {
        const components = this.builderEngine.canvasManager.getAllComponents();
        return {
            name: project.name,
            componentCount: components.length,
            lastModified: project.modified,
            thumbnail: this.generateThumbnail(components)
        };
    }

    generateThumbnail(components) {
        // Generate a simple text-based thumbnail
        const types = components.map(c => c.type);
        const uniqueTypes = [...new Set(types)];
        return uniqueTypes.slice(0, 3).join(', ') + (uniqueTypes.length > 3 ? '...' : '');
    }
}