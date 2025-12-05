/**
 * Main Application Entry Point for Spooky Web Builder
 * Initializes the builder engine and handles global app logic
 */

class SpookyWebBuilderApp {
    constructor() {
        this.builderEngine = null;
        this.isInitialized = false;
        this.loadingScreen = null;
    }

    async initialize() {
        console.log('🎃 Starting Spooky Web Builder...');
        
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Wait a bit to ensure all scripts are loaded
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Initialize builder engine
            this.builderEngine = new BuilderEngine();
            await this.builderEngine.initialize();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✨ Spooky Web Builder fully loaded!');
            
        } catch (error) {
            console.error('💀 Failed to initialize Spooky Web Builder:', error);
            this.showErrorScreen(error);
        }
    }

    showLoadingScreen() {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-skull">💀</div>
                <h2 class="loading-title">Awakening the Spirits...</h2>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
                <p class="loading-text">Summoning components from the digital graveyard</p>
            </div>
        `;
        
        // Add loading screen styles
        const style = document.createElement('style');
        style.textContent = `
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: #f8fafc;
                font-family: 'Creepster', cursive;
            }
            
            .loading-content {
                text-align: center;
                max-width: 400px;
                padding: 2rem;
            }
            
            .loading-skull {
                font-size: 4rem;
                animation: float 2s ease-in-out infinite;
                margin-bottom: 1rem;
            }
            
            .loading-title {
                font-size: 2rem;
                color: #ff6b35;
                text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
                margin-bottom: 2rem;
            }
            
            .loading-bar {
                width: 100%;
                height: 8px;
                background: #374151;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 1rem;
            }
            
            .loading-progress {
                height: 100%;
                background: linear-gradient(90deg, #ff6b35, #8b5cf6);
                width: 0%;
                animation: loadingProgress 3s ease-in-out infinite;
            }
            
            .loading-text {
                font-size: 1rem;
                color: #94a3b8;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes loadingProgress {
                0% { width: 0%; }
                50% { width: 70%; }
                100% { width: 100%; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(this.loadingScreen);
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.transition = 'opacity 0.5s ease-out';
            
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
                this.loadingScreen = null;
            }, 500);
        }
    }

    showErrorScreen(error) {
        const errorScreen = document.createElement('div');
        errorScreen.className = 'error-screen';
        errorScreen.innerHTML = `
            <div class="error-content">
                <div class="error-skull">💀</div>
                <h2 class="error-title">The Spirits Are Restless!</h2>
                <p class="error-message">Something went wrong while awakening the builder:</p>
                <pre class="error-details">${error.message}</pre>
                <button class="retry-btn" onclick="location.reload()">
                    Try Again
                </button>
            </div>
        `;
        
        // Add error screen styles
        const style = document.createElement('style');
        style.textContent = `
            .error-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a0000 0%, #2a0000 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: #f8fafc;
                font-family: 'Creepster', cursive;
            }
            
            .error-content {
                text-align: center;
                max-width: 500px;
                padding: 2rem;
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid #ff6b35;
                border-radius: 12px;
                box-shadow: 0 0 30px rgba(255, 107, 53, 0.3);
            }
            
            .error-skull {
                font-size: 4rem;
                animation: shake 1s ease-in-out infinite;
                margin-bottom: 1rem;
            }
            
            .error-title {
                font-size: 2rem;
                color: #ff6b35;
                text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
                margin-bottom: 1rem;
            }
            
            .error-message {
                font-size: 1rem;
                color: #94a3b8;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin-bottom: 1rem;
            }
            
            .error-details {
                background: #0a0a0a;
                border: 1px solid #374151;
                border-radius: 4px;
                padding: 1rem;
                margin: 1rem 0;
                font-size: 0.8rem;
                color: #ff6b35;
                text-align: left;
                overflow-x: auto;
            }
            
            .retry-btn {
                background: linear-gradient(135deg, #ff6b35, #e55a2b);
                border: none;
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: all 0.3s ease;
            }
            
            .retry-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(errorScreen);
        
        // Hide loading screen if it's still showing
        this.hideLoadingScreen();
    }

    // Global error handler
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('💀 Global error:', event.error);
            
            if (this.builderEngine) {
                this.builderEngine.showNotification(
                    'A spirit has caused an error: ' + event.error.message,
                    'error'
                );
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('💀 Unhandled promise rejection:', event.reason);
            
            if (this.builderEngine) {
                this.builderEngine.showNotification(
                    'A promise was broken in the spirit realm',
                    'error'
                );
            }
        });
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                console.log(`⚡ App loaded in ${loadTime.toFixed(2)}ms`);
                
                if (this.builderEngine) {
                    this.builderEngine.showNotification(
                        `Builder summoned in ${(loadTime / 1000).toFixed(1)}s`,
                        'info'
                    );
                }
            });
        }
    }

    // Development helpers
    setupDevelopmentHelpers() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Add development tools to window
            window.spookyBuilder = {
                app: this,
                engine: this.builderEngine,
                version: '1.0.0',
                debug: {
                    showComponentBounds: () => {
                        document.querySelectorAll('.canvas-component').forEach(el => {
                            el.style.outline = '2px dashed #ff6b35';
                        });
                    },
                    hideComponentBounds: () => {
                        document.querySelectorAll('.canvas-component').forEach(el => {
                            el.style.outline = '';
                        });
                    },
                    exportState: () => {
                        return {
                            project: this.builderEngine?.currentProject,
                            components: this.builderEngine?.canvasManager?.getAllComponents()?.map(c => c.serialize()),
                            settings: this.builderEngine?.settings
                        };
                    }
                }
            };
            
            console.log('🔧 Development tools available at window.spookyBuilder');
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new SpookyWebBuilderApp();
    
    // Setup global handlers
    app.setupGlobalErrorHandling();
    app.setupPerformanceMonitoring();
    app.setupDevelopmentHelpers();
    
    // Initialize the app
    await app.initialize();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👻 Builder entered the shadow realm');
    } else {
        console.log('✨ Builder returned from the shadow realm');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('🌐 Connection to the spirit realm restored');
});

window.addEventListener('offline', () => {
    console.log('📡 Connection to the spirit realm lost');
});