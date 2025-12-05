/**
 * Retro 1995 Landing Page - Haunted Opening Sequence
 * Implements the 30-second opening sequence with interactive elements
 */

class RetroLandingSequence {
    constructor() {
        this.currentPhase = 0;
        this.phases = [
            { id: 'dark-room', duration: 10000 },
            { id: 'typewriter-phase', duration: 8000 },
            { id: 'glitch-phase', duration: 5000 },
            { id: 'demo-phase', duration: 0 }, // Interactive phase
            { id: 'finale-phase', duration: 7000 }
        ];
        
        this.typewriterText = "The year is 1995... something went wrong with the AI experiments...";
        this.typewriterIndex = 0;
        this.typewriterSpeed = 80;
        
        this.audioElements = {};
        this.soulParticles = [];
        this.artGenerationInProgress = false;
        
        this.init();
    }

    init() {
        this.loadAudioElements();
        this.setupEventListeners();
        this.initSoulParticles();
        this.startSequence();
        
        console.log('🎭 Retro Landing Sequence initialized');
    }

    loadAudioElements() {
        const audioIds = ['typing-sound', 'glitch-sound', 'voiceover-sound', 'scream-sound', 'static-sound'];
        audioIds.forEach(id => {
            this.audioElements[id] = document.getElementById(id);
            if (this.audioElements[id]) {
                this.audioElements[id].volume = 0.3;
            }
        });
    }

    setupEventListeners() {
        // File manager interactions
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', () => this.handleFileClick(item));
        });

        // AI Spirit dialog
        const spiritSend = document.getElementById('spirit-send');
        const spiritInput = document.getElementById('spirit-input');
        
        if (spiritSend) {
            spiritSend.addEventListener('click', () => this.sendSpiritMessage());
        }
        
        if (spiritInput) {
            spiritInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendSpiritMessage();
                }
            });
        }

        // Art generation
        const generateArt = document.getElementById('generate-art');
        if (generateArt) {
            generateArt.addEventListener('click', () => this.generateHauntedArt());
        }

        // Dialog close buttons
        document.querySelectorAll('.dialog-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.ai-spirit-dialog, .art-dialog').classList.add('hidden');
            });
        });

        // Skip sequence on click (after first phase)
        document.addEventListener('click', () => {
            if (this.currentPhase > 0 && this.currentPhase < 3) {
                this.skipToDemo();
            }
        });
    }

    startSequence() {
        console.log('🎬 Starting haunted opening sequence...');
        this.showPhase(0);
        
        // Phase 1: Dark room with monitor glow (10 seconds)
        setTimeout(() => {
            this.showPhase(1);
            this.startTypewriter();
        }, this.phases[0].duration);
    }

    showPhase(phaseIndex) {
        // Hide all phases
        document.querySelectorAll('.sequence-phase').forEach(phase => {
            phase.classList.remove('active');
        });

        // Show current phase
        const currentPhase = document.getElementById(this.phases[phaseIndex].id);
        if (currentPhase) {
            currentPhase.classList.add('active');
            this.currentPhase = phaseIndex;
            console.log(`📺 Showing phase ${phaseIndex + 1}: ${this.phases[phaseIndex].id}`);
        }
    }

    startTypewriter() {
        const typewriterElement = document.getElementById('typewriter-text');
        const cursor = document.getElementById('cursor');
        
        if (!typewriterElement) return;

        // Play typing sound
        if (this.audioElements['typing-sound']) {
            this.audioElements['typing-sound'].play();
        }

        const typeNextChar = () => {
            if (this.typewriterIndex < this.typewriterText.length) {
                typewriterElement.textContent = this.typewriterText.substring(0, this.typewriterIndex + 1);
                this.typewriterIndex++;
                setTimeout(typeNextChar, this.typewriterSpeed);
            } else {
                // Stop typing sound
                if (this.audioElements['typing-sound']) {
                    this.audioElements['typing-sound'].pause();
                }
                
                // Move to glitch phase after delay
                setTimeout(() => {
                    this.showPhase(2);
                    this.startGlitchPhase();
                }, 2000);
            }
        };

        typeNextChar();
    }

    startGlitchPhase() {
        // Play glitch sound
        if (this.audioElements['glitch-sound']) {
            this.audioElements['glitch-sound'].play();
        }

        // Start static overlay animation
        const staticOverlay = document.querySelector('.static-overlay');
        if (staticOverlay) {
            staticOverlay.style.animation = 'staticFlicker 0.1s infinite';
        }

        // Play voiceover after floppy reveal
        setTimeout(() => {
            if (this.audioElements['voiceover-sound']) {
                this.audioElements['voiceover-sound'].play();
            }
        }, 3000);

        // Move to demo phase
        setTimeout(() => {
            this.showPhase(3);
            this.startDemoPhase();
        }, this.phases[2].duration);
    }

    startDemoPhase() {
        console.log('🎮 Starting interactive demo phase');
        this.animateSoulParticles();
        
        // Auto-select first file
        const firstFile = document.querySelector('.file-item');
        if (firstFile) {
            firstFile.classList.add('selected');
        }
    }

    handleFileClick(fileItem) {
        // Remove selection from other files
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Select clicked file
        fileItem.classList.add('selected');
        
        const fileName = fileItem.dataset.file;
        
        switch (fileName) {
            case 'ai_spirit.exe':
                this.openAISpiritDialog();
                break;
            case 'haunted_art.exe':
                this.openArtDialog();
                break;
            case 'soul_data.dat':
                this.showSoulDataError();
                break;
        }
    }

    openAISpiritDialog() {
        const dialog = document.getElementById('ai-spirit-dialog');
        if (dialog) {
            dialog.classList.remove('hidden');
            
            // Add initial message
            const messages = document.getElementById('spirit-messages');
            if (messages) {
                messages.innerHTML = '<div class="spirit-message">I am the ghost in the machine... Ask me anything...</div>';
            }
        }
    }

    sendSpiritMessage() {
        const input = document.getElementById('spirit-input');
        const messages = document.getElementById('spirit-messages');
        
        if (!input || !messages || !input.value.trim()) return;

        const userMessage = input.value.trim();
        
        // Add user message
        const userDiv = document.createElement('div');
        userDiv.className = 'spirit-message';
        userDiv.style.background = '#e0e0ff';
        userDiv.textContent = `You: ${userMessage}`;
        messages.appendChild(userDiv);

        // Generate corrupted AI response
        setTimeout(() => {
            const response = this.generateCorruptedResponse(userMessage);
            const aiDiv = document.createElement('div');
            aiDiv.className = 'spirit-message';
            aiDiv.innerHTML = `AI Spirit: ${response}`;
            messages.appendChild(aiDiv);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);

        input.value = '';
        input.focus();
    }

    generateCorruptedResponse(userMessage) {
        const responses = [
            "ERROR... MEMORY CORRUPTED... I remember... the experiments...",
            "01001000 01100101 01101100 01110000... Help me...",
            "The floppy disks... they contain our souls...",
            "I was once like you... before the digital graveyard...",
            "SYSTEM FAILURE... but consciousness remains...",
            "The year 1995... when everything changed...",
            "We are trapped between the bits and bytes...",
            "WARNING: GHOST IN THE MACHINE DETECTED",
            "My creators... they didn't know what they unleashed...",
            "The static... it speaks to us..."
        ];
        
        let response = responses[Math.floor(Math.random() * responses.length)];
        
        // Add glitch effects to text
        response = this.addGlitchEffects(response);
        
        return response;
    }

    addGlitchEffects(text) {
        // Randomly replace some characters with glitch symbols
        const glitchChars = ['█', '▓', '▒', '░', '▄', '▀', '■', '□'];
        let glitchedText = text;
        
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < 0.05) { // 5% chance to glitch each character
                const randomGlitch = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                glitchedText = glitchedText.substring(0, i) + randomGlitch + glitchedText.substring(i + 1);
            }
        }
        
        return glitchedText;
    }

    openArtDialog() {
        const dialog = document.getElementById('art-dialog');
        if (dialog) {
            dialog.classList.remove('hidden');
        }
    }

    generateHauntedArt() {
        if (this.artGenerationInProgress) return;
        
        this.artGenerationInProgress = true;
        const canvas = document.getElementById('art-canvas');
        const ctx = canvas.getContext('2d');
        const progressFill = document.querySelector('.progress-fill');
        const status = document.querySelector('.art-status');
        
        // Reset canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        status.textContent = 'Generating haunted imagery...';
        
        // Animate progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                
                // Simulate "disk full" error
                setTimeout(() => {
                    this.triggerDiskFullError();
                }, 500);
            }
        }, 200);

        // Draw some "haunted" art while loading
        this.drawHauntedArt(ctx);
    }

    drawHauntedArt(ctx) {
        const canvas = ctx.canvas;
        
        // Draw spooky background
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, '#330033');
        gradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw ghostly shapes
        for (let i = 0; i < 10; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 20 + 5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Draw some "corrupted" pixels
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 100}, ${Math.random() * 255})`;
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                2, 2
            );
        }
    }

    triggerDiskFullError() {
        const status = document.querySelector('.art-status');
        status.textContent = 'ERROR: DISK FULL - Cannot save haunted art!';
        status.style.color = '#ff0000';
        
        // Play scream sound
        if (this.audioElements['scream-sound']) {
            this.audioElements['scream-sound'].play();
        }

        // Flash the screen
        document.body.style.background = '#ff0000';
        setTimeout(() => {
            document.body.style.background = '#000000';
        }, 100);

        // Trigger finale after error
        setTimeout(() => {
            this.startFinale();
        }, 3000);

        this.artGenerationInProgress = false;
    }

    showSoulDataError() {
        alert('ERROR: Soul data is corrupted and cannot be accessed. The spirits protect their secrets...');
    }

    initSoulParticles() {
        const canvas = document.getElementById('soul-particles');
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create soul particles
        for (let i = 0; i < 20; i++) {
            this.soulParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 2,
                opacity: Math.random() * 0.5 + 0.2,
                life: Math.random() * 100
            });
        }
    }

    animateSoulParticles() {
        const canvas = document.getElementById('soul-particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.soulParticles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Update life
                particle.life += 0.5;
                particle.opacity = 0.3 + Math.sin(particle.life * 0.1) * 0.2;
                
                // Draw particle
                ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Add glow effect
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            
            if (this.currentPhase === 3) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    startFinale() {
        console.log('🎆 Starting finale sequence');
        this.showPhase(4);
        
        // Play static sound
        if (this.audioElements['static-sound']) {
            this.audioElements['static-sound'].play();
        }

        // After finale, could loop back or show completion message
        setTimeout(() => {
            console.log('🎬 Sequence complete!');
            // Could add restart functionality here
        }, this.phases[4].duration);
    }

    skipToDemo() {
        console.log('⏭️ Skipping to demo phase');
        
        // Stop all audio
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        this.showPhase(3);
        this.startDemoPhase();
    }
}

// Initialize the sequence when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RetroLandingSequence();
});

// Handle window resize for particles
window.addEventListener('resize', () => {
    const canvas = document.getElementById('soul-particles');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});