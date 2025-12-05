/**
 * Effects Engine for Spooky Web Builder
 * Manages animations, particle systems, and visual effects
 */

class EffectsEngine {
    constructor(builderEngine) {
        this.builderEngine = builderEngine;
        this.particleCanvas = null;
        this.particleCtx = null;
        this.particles = [];
        this.animationFrame = null;
        this.isInitialized = false;
    }

    initialize() {
        this.setupParticleSystem();
        this.startParticleAnimation();
        this.setupScreenEffects();
        this.isInitialized = true;
        
        console.log('✨ Effects Engine initialized');
    }

    setupParticleSystem() {
        this.particleCanvas = document.getElementById('particles');
        this.particleCtx = this.particleCanvas.getContext('2d');
        
        this.resizeParticleCanvas();
        window.addEventListener('resize', () => this.resizeParticleCanvas());
        
        // Create initial particles
        this.createAmbientParticles();
    }

    resizeParticleCanvas() {
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
    }

    createAmbientParticles() {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle({
                x: Math.random() * this.particleCanvas.width,
                y: Math.random() * this.particleCanvas.height,
                type: 'ambient'
            }));
        }
    }

    createParticle(config = {}) {
        const types = {
            ambient: {
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2,
                color: `rgba(139, 92, 246, ${Math.random() * 0.3 + 0.1})`,
                life: Infinity,
                behavior: 'float'
            },
            soul: {
                size: Math.random() * 5 + 2,
                speed: Math.random() * 1 + 0.5,
                color: `rgba(248, 250, 252, ${Math.random() * 0.5 + 0.3})`,
                life: 300,
                behavior: 'rise'
            },
            magic: {
                size: Math.random() * 4 + 1,
                speed: Math.random() * 2 + 1,
                color: `rgba(16, 185, 129, ${Math.random() * 0.6 + 0.2})`,
                life: 200,
                behavior: 'spiral'
            },
            ember: {
                size: Math.random() * 3 + 1,
                speed: Math.random() * 1.5 + 0.8,
                color: `rgba(255, 107, 53, ${Math.random() * 0.7 + 0.3})`,
                life: 150,
                behavior: 'flicker'
            }
        };

        const particleType = types[config.type] || types.ambient;
        
        return {
            x: config.x || Math.random() * this.particleCanvas.width,
            y: config.y || Math.random() * this.particleCanvas.height,
            vx: (Math.random() - 0.5) * particleType.speed,
            vy: (Math.random() - 0.5) * particleType.speed,
            size: particleType.size,
            color: particleType.color,
            life: particleType.life,
            maxLife: particleType.life,
            behavior: particleType.behavior,
            angle: Math.random() * Math.PI * 2,
            pulse: Math.random() * Math.PI * 2
        };
    }

    startParticleAnimation() {
        const animate = () => {
            this.updateParticles();
            this.renderParticles();
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update based on behavior
            switch (particle.behavior) {
                case 'float':
                    this.updateFloatingParticle(particle);
                    break;
                case 'rise':
                    this.updateRisingParticle(particle);
                    break;
                case 'spiral':
                    this.updateSpiralParticle(particle);
                    break;
                case 'flicker':
                    this.updateFlickerParticle(particle);
                    break;
            }
            
            // Update life
            if (particle.life !== Infinity) {
                particle.life--;
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }
            
            // Wrap around screen for ambient particles
            if (particle.behavior === 'float') {
                if (particle.x < 0) particle.x = this.particleCanvas.width;
                if (particle.x > this.particleCanvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.particleCanvas.height;
                if (particle.y > this.particleCanvas.height) particle.y = 0;
            }
        }
        
        // Maintain ambient particle count
        while (this.particles.filter(p => p.behavior === 'float').length < 15) {
            this.particles.push(this.createParticle({
                x: Math.random() * this.particleCanvas.width,
                y: Math.random() * this.particleCanvas.height,
                type: 'ambient'
            }));
        }
    }

    updateFloatingParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy + Math.sin(particle.pulse) * 0.1;
        particle.pulse += 0.02;
        
        // Gentle direction changes
        if (Math.random() < 0.01) {
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
            
            // Limit speed
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 1) {
                particle.vx = (particle.vx / speed) * 1;
                particle.vy = (particle.vy / speed) * 1;
            }
        }
    }

    updateRisingParticle(particle) {
        particle.x += particle.vx + Math.sin(particle.angle) * 0.5;
        particle.y += particle.vy - 1;
        particle.angle += 0.05;
        
        // Fade out over time
        const alpha = particle.life / particle.maxLife;
        particle.color = particle.color.replace(/[\d\.]+\)$/g, `${alpha * 0.5})`);
    }

    updateSpiralParticle(particle) {
        particle.angle += 0.1;
        particle.x += Math.cos(particle.angle) * 2;
        particle.y += Math.sin(particle.angle) * 2 - 0.5;
        
        // Pulsing size
        particle.pulse += 0.1;
        particle.currentSize = particle.size + Math.sin(particle.pulse) * 1;
    }

    updateFlickerParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy - 0.8;
        
        // Flickering effect
        particle.pulse += 0.3;
        const flicker = Math.sin(particle.pulse) * 0.5 + 0.5;
        particle.currentAlpha = flicker * (particle.life / particle.maxLife);
    }

    renderParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        for (const particle of this.particles) {
            this.particleCtx.save();
            
            // Set particle properties
            this.particleCtx.globalAlpha = particle.currentAlpha || 1;
            this.particleCtx.fillStyle = particle.color;
            this.particleCtx.shadowBlur = 10;
            this.particleCtx.shadowColor = particle.color;
            
            // Draw particle
            this.particleCtx.beginPath();
            const size = particle.currentSize || particle.size;
            this.particleCtx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.particleCtx.fill();
            
            this.particleCtx.restore();
        }
    }

    // Effect creation methods
    createSaveAnimation() {
        // Create magical particles around save button
        const saveBtn = document.getElementById('save-btn');
        const rect = saveBtn.getBoundingClientRect();
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.particles.push(this.createParticle({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    type: 'magic'
                }));
            }, i * 50);
        }
        
        // Screen flash effect
        this.createScreenFlash('#10b981', 0.1);
    }

    createComponentAddEffect(x, y) {
        // Create soul particles at drop location
        for (let i = 0; i < 10; i++) {
            this.particles.push(this.createParticle({
                x: x + (Math.random() - 0.5) * 50,
                y: y + (Math.random() - 0.5) * 50,
                type: 'soul'
            }));
        }
    }

    createScreenFlash(color, intensity = 0.2) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            opacity: ${intensity};
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
        }, 100);
    }

    createGlitchEffect(element, duration = 1000) {
        const originalTransform = element.style.transform;
        const glitchInterval = setInterval(() => {
            const x = (Math.random() - 0.5) * 4;
            const y = (Math.random() - 0.5) * 4;
            element.style.transform = `translate(${x}px, ${y}px) ${originalTransform}`;
        }, 50);
        
        setTimeout(() => {
            clearInterval(glitchInterval);
            element.style.transform = originalTransform;
        }, duration);
    }

    createFloatingAnimation(element) {
        const keyframes = [
            { transform: 'translateY(0px)' },
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0px)' }
        ];
        
        const options = {
            duration: 3000,
            iterations: Infinity,
            easing: 'ease-in-out'
        };
        
        return element.animate(keyframes, options);
    }

    createShakeAnimation(element, intensity = 5) {
        const keyframes = [];
        for (let i = 0; i < 10; i++) {
            keyframes.push({
                transform: `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px)`
            });
        }
        keyframes.push({ transform: 'translate(0px, 0px)' });
        
        const options = {
            duration: 500,
            easing: 'ease-in-out'
        };
        
        return element.animate(keyframes, options);
    }

    setupScreenEffects() {
        // Subtle screen distortion effect
        this.createScreenDistortion();
        
        // Random lightning flashes
        this.startLightningEffect();
    }

    createScreenDistortion() {
        const distortion = document.createElement('div');
        distortion.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            background: 
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(139, 92, 246, 0.01) 2px,
                    rgba(139, 92, 246, 0.01) 4px
                );
            animation: scanlines 0.1s linear infinite;
        `;
        
        // Add scanline animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scanlines {
                0% { transform: translateY(0px); }
                100% { transform: translateY(4px); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(distortion);
    }

    startLightningEffect() {
        const lightning = () => {
            if (Math.random() < 0.002) { // Very rare lightning
                this.createScreenFlash('#ffffff', 0.05);
                
                // Thunder sound after delay
                setTimeout(() => {
                    this.builderEngine.audioManager?.playSound('thunder', { volume: 0.1 });
                }, Math.random() * 1000 + 500);
            }
        };
        
        setInterval(lightning, 100);
    }

    // Particle burst effects for interactions
    createHoverEffect(element) {
        element.addEventListener('mouseenter', (e) => {
            const rect = element.getBoundingClientRect();
            
            for (let i = 0; i < 5; i++) {
                this.particles.push(this.createParticle({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    type: 'ember'
                }));
            }
        });
    }

    createClickEffect(x, y) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid rgba(139, 92, 246, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1500;
            animation: ripple 0.6s ease-out;
        `;
        
        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Add particles
        for (let i = 0; i < 8; i++) {
            this.particles.push(this.createParticle({
                x: x,
                y: y,
                type: 'magic'
            }));
        }
    }

    // Theme transition effects
    createThemeTransition(newTheme) {
        // Create swirling particles during theme change
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.particles.push(this.createParticle({
                    x: Math.random() * this.particleCanvas.width,
                    y: Math.random() * this.particleCanvas.height,
                    type: 'magic'
                }));
            }, i * 100);
        }
        
        // Screen transition effect
        this.createScreenFlash(this.getThemeColor(newTheme), 0.15);
    }

    getThemeColor(theme) {
        const themeColors = {
            'spooky-theme': '#8b5cf6',
            'haunted-mansion-theme': '#8b0000',
            'graveyard-mist-theme': '#32cd32',
            'witches-cauldron-theme': '#ff8c00',
            'vampires-lair-theme': '#dc143c'
        };
        
        return themeColors[theme] || '#8b5cf6';
    }

    // Cleanup and resize handling
    handleResize() {
        this.resizeParticleCanvas();
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.particles = [];
        
        if (this.particleCanvas) {
            this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        }
        
        console.log('💀 Effects Engine destroyed');
    }

    // Performance monitoring
    getParticleCount() {
        return this.particles.length;
    }

    optimizePerformance() {
        // Reduce particles if performance is poor
        if (this.particles.length > 100) {
            this.particles = this.particles.slice(0, 50);
        }
    }
}