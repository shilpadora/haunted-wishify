/**
 * Audio Manager for Spooky Web Builder
 * Handles sound effects and audio feedback
 */

class AudioManager {
    constructor(builderEngine) {
        this.builderEngine = builderEngine;
        this.audioElements = new Map();
        this.isInitialized = false;
        this.masterVolume = 0.5;
        this.soundEnabled = true;
        this.audioContext = null;
        this.loadedSounds = new Set();
    }

    async initialize() {
        try {
            // Initialize Web Audio API if available
            if (window.AudioContext || window.webkitAudioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Load audio elements from DOM
            this.loadAudioElements();
            
            // Set up audio event handlers
            this.setupAudioHandlers();
            
            this.isInitialized = true;
            console.log('🔊 Audio Manager initialized');
            
        } catch (error) {
            console.warn('⚠️ Audio Manager initialization failed:', error);
            this.soundEnabled = false;
        }
        
        return Promise.resolve();
    }

    loadAudioElements() {
        // Load existing audio elements from DOM
        const audioElements = document.querySelectorAll('audio[id]');
        audioElements.forEach(audio => {
            const soundName = audio.id.replace('audio-', '');
            this.audioElements.set(soundName, audio);
            this.loadedSounds.add(soundName);
        });

        // Create additional sound effects programmatically
        this.createSyntheticSounds();
        
        console.log('🎵 Loaded', this.audioElements.size, 'audio elements');
    }

    createSyntheticSounds() {
        // Create synthetic sounds using Web Audio API if available
        if (!this.audioContext) return;

        const syntheticSounds = {
            'click': this.createClickSound(),
            'hover': this.createHoverSound(),
            'success': this.createSuccessSound(),
            'error': this.createErrorSound(),
            'magic': this.createMagicSound()
        };

        Object.entries(syntheticSounds).forEach(([name, audioBuffer]) => {
            if (audioBuffer) {
                this.audioElements.set(name, audioBuffer);
                this.loadedSounds.add(name);
            }
        });
    }

    createClickSound() {
        if (!this.audioContext) return null;

        try {
            const duration = 0.1;
            const sampleRate = this.audioContext.sampleRate;
            const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
            const data = buffer.getChannelData(0);

            // Generate a short click sound
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                data[i] = Math.sin(800 * Math.PI * t) * Math.exp(-t * 50) * 0.3;
            }

            return buffer;
        } catch (error) {
            console.warn('Failed to create click sound:', error);
            return null;
        }
    }

    createHoverSound() {
        if (!this.audioContext) return null;

        try {
            const duration = 0.15;
            const sampleRate = this.audioContext.sampleRate;
            const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
            const data = buffer.getChannelData(0);

            // Generate a soft hover sound
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                data[i] = Math.sin(400 * Math.PI * t) * Math.exp(-t * 20) * 0.2;
            }

            return buffer;
        } catch (error) {
            console.warn('Failed to create hover sound:', error);
            return null;
        }
    }

    createSuccessSound() {
        if (!this.audioContext) return null;

        try {
            const duration = 0.3;
            const sampleRate = this.audioContext.sampleRate;
            const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
            const data = buffer.getChannelData(0);

            // Generate a success chime
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                const freq1 = 523.25; // C5
                const freq2 = 659.25; // E5
                const freq3 = 783.99; // G5
                
                data[i] = (
                    Math.sin(freq1 * 2 * Math.PI * t) * 0.3 +
                    Math.sin(freq2 * 2 * Math.PI * t) * 0.3 +
                    Math.sin(freq3 * 2 * Math.PI * t) * 0.3
                ) * Math.exp(-t * 3) * 0.2;
            }

            return buffer;
        } catch (error) {
            console.warn('Failed to create success sound:', error);
            return null;
        }
    }

    createErrorSound() {
        if (!this.audioContext) return null;

        try {
            const duration = 0.4;
            const sampleRate = this.audioContext.sampleRate;
            const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
            const data = buffer.getChannelData(0);

            // Generate an error buzz
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 8) * 0.3;
            }

            return buffer;
        } catch (error) {
            console.warn('Failed to create error sound:', error);
            return null;
        }
    }

    createMagicSound() {
        if (!this.audioContext) return null;

        try {
            const duration = 0.5;
            const sampleRate = this.audioContext.sampleRate;
            const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
            const data = buffer.getChannelData(0);

            // Generate a magical sparkle sound
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                const freq = 800 + Math.sin(t * 20) * 400;
                data[i] = Math.sin(freq * 2 * Math.PI * t) * Math.exp(-t * 4) * 0.25;
            }

            return buffer;
        } catch (error) {
            console.warn('Failed to create magic sound:', error);
            return null;
        }
    }

    setupAudioHandlers() {
        // Handle audio loading errors gracefully
        this.audioElements.forEach((audio, name) => {
            if (audio instanceof HTMLAudioElement) {
                audio.addEventListener('error', (e) => {
                    console.warn(`⚠️ Audio file not found: ${name} (using synthetic fallback)`);
                    this.loadedSounds.delete(name);
                });

                audio.addEventListener('canplaythrough', () => {
                    console.log(`✅ Audio loaded: ${name}`);
                });
                
                // Test if audio can load
                audio.load();
            }
        });

        // Handle user interaction requirement for audio
        document.addEventListener('click', this.enableAudioContext.bind(this), { once: true });
        document.addEventListener('keydown', this.enableAudioContext.bind(this), { once: true });
    }

    enableAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('🔊 Audio context resumed');
            });
        }
    }

    playSound(soundName, options = {}) {
        if (!this.soundEnabled || !this.isInitialized) {
            return Promise.resolve();
        }

        const audio = this.audioElements.get(soundName);
        if (!audio) {
            // Try to play synthetic sound as fallback
            const syntheticSound = this.getSyntheticFallback(soundName);
            if (syntheticSound) {
                return this.playSound(syntheticSound, options);
            }
            // Silently fail for missing sounds
            return Promise.resolve();
        }

        const volume = (options.volume || 1) * this.masterVolume;
        const playbackRate = options.playbackRate || 1;
        const loop = options.loop || false;

        try {
            if (audio instanceof HTMLAudioElement) {
                return this.playHTMLAudio(audio, { volume, playbackRate, loop });
            } else if (audio instanceof AudioBuffer) {
                return this.playAudioBuffer(audio, { volume, playbackRate, loop });
            }
        } catch (error) {
            console.warn(`Failed to play sound ${soundName}:`, error);
        }

        return Promise.resolve();
    }

    playHTMLAudio(audio, options) {
        return new Promise((resolve) => {
            // Clone audio element to allow overlapping sounds
            const audioClone = audio.cloneNode();
            audioClone.volume = Math.max(0, Math.min(1, options.volume));
            audioClone.playbackRate = options.playbackRate;
            audioClone.loop = options.loop;

            audioClone.addEventListener('ended', () => {
                resolve();
            });

            audioClone.addEventListener('error', (e) => {
                console.warn('Audio playback error:', e);
                resolve();
            });

            audioClone.play().catch(error => {
                console.warn('Audio play failed:', error);
                resolve();
            });
        });
    }

    playAudioBuffer(buffer, options) {
        if (!this.audioContext) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            try {
                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();

                source.buffer = buffer;
                source.playbackRate.value = options.playbackRate;
                source.loop = options.loop;

                gainNode.gain.value = Math.max(0, Math.min(1, options.volume));

                source.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                source.addEventListener('ended', () => {
                    resolve();
                });

                source.start();
            } catch (error) {
                console.warn('AudioBuffer playback error:', error);
                resolve();
            }
        });
    }

    getSyntheticFallback(soundName) {
        const fallbacks = {
            'whisper': 'hover',
            'chains': 'click',
            'creak': 'magic'
        };
        return fallbacks[soundName] || null;
    }

    // Convenience methods for common sounds
    playClickSound() {
        return this.playSound('click', { volume: 0.3 });
    }

    playHoverSound() {
        return this.playSound('hover', { volume: 0.2 });
    }

    playSuccessSound() {
        return this.playSound('success', { volume: 0.4 });
    }

    playErrorSound() {
        return this.playSound('error', { volume: 0.5 });
    }

    playMagicSound() {
        return this.playSound('magic', { volume: 0.3 });
    }

    // Spooky-themed sound methods
    playWhisper() {
        return this.playSound('whisper', { volume: 0.2 });
    }

    playChains() {
        return this.playSound('chains', { volume: 0.3 });
    }

    playCreak() {
        return this.playSound('creak', { volume: 0.25 });
    }

    // Volume and settings control
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        console.log('🔊 Master volume set to:', this.masterVolume);
    }

    getMasterVolume() {
        return this.masterVolume;
    }

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        console.log('🔊 Sound', enabled ? 'enabled' : 'disabled');
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }

    // Audio feedback for UI interactions
    setupUIAudioFeedback() {
        // Button hover sounds
        document.querySelectorAll('.haunted-btn, .control-btn, .toolbar-btn').forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });

            button.addEventListener('click', () => {
                this.playClickSound();
            });
        });

        // Component palette interactions
        document.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.playSound('whisper', { volume: 0.1 });
            });

            item.addEventListener('dragstart', () => {
                this.playMagicSound();
            });
        });

        // Canvas interactions
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.addEventListener('drop', () => {
                this.playSuccessSound();
            });
        }

        // Property changes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('property-input')) {
                this.playSound('click', { volume: 0.1 });
            }
        });
    }

    // Ambient sound management
    startAmbientSounds() {
        // Play subtle ambient sounds occasionally
        const ambientSounds = ['whisper', 'creak'];
        
        const playRandomAmbient = () => {
            if (Math.random() < 0.1 && this.soundEnabled) { // 10% chance
                const sound = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];
                this.playSound(sound, { volume: 0.05 });
            }
        };

        // Play ambient sounds every 10-30 seconds
        setInterval(playRandomAmbient, Math.random() * 20000 + 10000);
    }

    // Audio visualization (optional)
    createAudioVisualizer(canvas) {
        if (!this.audioContext || !canvas) return null;

        try {
            const analyser = this.audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            const ctx = canvas.getContext('2d');
            
            const draw = () => {
                analyser.getByteFrequencyData(dataArray);
                
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;
                
                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 2;
                    
                    ctx.fillStyle = `rgb(${barHeight + 100}, 50, ${255 - barHeight})`;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    
                    x += barWidth + 1;
                }
                
                requestAnimationFrame(draw);
            };
            
            draw();
            return analyser;
            
        } catch (error) {
            console.warn('Failed to create audio visualizer:', error);
            return null;
        }
    }

    // Cleanup
    destroy() {
        this.audioElements.forEach((audio) => {
            if (audio instanceof HTMLAudioElement) {
                audio.pause();
                audio.src = '';
            }
        });

        this.audioElements.clear();
        this.loadedSounds.clear();

        if (this.audioContext) {
            this.audioContext.close();
        }

        console.log('🔇 Audio Manager destroyed');
    }

    // Debug and utility methods
    getLoadedSounds() {
        return Array.from(this.loadedSounds);
    }

    testAllSounds() {
        console.log('🎵 Testing all loaded sounds...');
        this.loadedSounds.forEach(soundName => {
            setTimeout(() => {
                console.log(`Playing: ${soundName}`);
                this.playSound(soundName, { volume: 0.3 });
            }, Array.from(this.loadedSounds).indexOf(soundName) * 1000);
        });
    }

    getAudioInfo() {
        return {
            isInitialized: this.isInitialized,
            soundEnabled: this.soundEnabled,
            masterVolume: this.masterVolume,
            loadedSounds: this.getLoadedSounds(),
            audioContextState: this.audioContext?.state || 'not available'
        };
    }
}