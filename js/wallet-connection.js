// Wallet Connection System
class WalletConnector {
    constructor() {
        this.isConnected = false;
        this.userAddress = null;
        this.provider = null;
        this.signer = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingConnection();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const walletBtn = document.querySelector('.wallet-btn');
            if (walletBtn) {
                walletBtn.addEventListener('click', () => this.handleWalletConnection());
            }
        });

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                this.handleAccountChange(accounts);
            });

            window.ethereum.on('chainChanged', (chainId) => {
                this.handleChainChange(chainId);
            });
        }
    }

    async checkExistingConnection() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    this.isConnected = true;
                    this.userAddress = accounts[0];
                    this.updateUI();
                }
            } catch (error) {
                console.error('Error checking existing connection:', error);
            }
        }
    }

    async handleWalletConnection() {
        const walletBtn = document.querySelector('.wallet-btn');
        
        if (this.isConnected) {
            this.showWalletManagementModal();
            return;
        }

        // Check if wallet is available
        if (!window.ethereum) {
            this.showWalletSetupGuide();
            return;
        }

        // Show wallet selection modal
        this.showWalletConnectionModal();
    }

    async checkNetwork() {
        if (!window.ethereum) return;
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const networkName = this.getNetworkName(chainId);
        
        if (chainId !== '0x1') { // Not mainnet
            this.showNotification(`Connected to ${networkName}. Some features may be limited.`, 'warning');
        }
    }

    getNetworkName(chainId) {
        const networks = {
            '0x1': 'Ethereum Mainnet',
            '0x3': 'Ropsten Testnet',
            '0x4': 'Rinkeby Testnet',
            '0x5': 'Goerli Testnet',
            '0x89': 'Polygon Mainnet',
            '0xa86a': 'Avalanche Mainnet'
        };
        return networks[chainId] || `Network ${chainId}`;
    }

    disconnect() {
        this.isConnected = false;
        this.userAddress = null;
        this.provider = null;
        this.signer = null;
        this.updateUI();
        this.showNotification('Wallet disconnected', 'info');
    }

    handleAccountChange(accounts) {
        if (accounts.length === 0) {
            this.disconnect();
        } else if (accounts[0] !== this.userAddress) {
            this.userAddress = accounts[0];
            this.updateUI();
            this.showNotification('Account changed', 'info');
        }
    }

    handleChainChange(chainId) {
        window.location.reload(); // Recommend page reload on network change
    }

    handleConnectionError(error) {
        if (error.code === 4001) {
            this.showNotification('Connection rejected by user', 'error');
        } else if (error.code === -32002) {
            this.showNotification('Connection request already pending', 'warning');
        } else {
            this.showNotification('Failed to connect wallet', 'error');
        }
    }

    updateUI() {
        const walletBtn = document.querySelector('.wallet-btn');
        if (!walletBtn) return;

        if (this.isConnected) {
            this.updateButtonState(walletBtn, 'connected');
        } else {
            this.updateButtonState(walletBtn, 'disconnected');
        }
    }

    updateButtonState(button, state) {
        const states = {
            loading: {
                html: '<i class="fas fa-spinner fa-spin"></i> Connecting...',
                disabled: true,
                className: 'wallet-btn loading'
            },
            connected: {
                html: `<i class="fas fa-check-circle"></i> ${this.formatAddress(this.userAddress)}`,
                disabled: false,
                className: 'wallet-btn connected'
            },
            disconnected: {
                html: '<i class="fas fa-wallet"></i> Connect Wallet',
                disabled: false,
                className: 'wallet-btn'
            }
        };

        const config = states[state];
        button.innerHTML = config.html;
        button.disabled = config.disabled;
        button.className = config.className;
    }

    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    logWalletConnection() {
        // Analytics logging
        if (typeof gtag !== 'undefined') {
            gtag('event', 'wallet_connected', {
                event_category: 'Web3',
                event_label: 'MetaMask'
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));

        // Auto remove after 5 seconds
        setTimeout(() => this.removeNotification(notification), 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#059669',
            error: '#dc2626',
            warning: '#d97706',
            info: '#2563eb'
        };
        return colors[type] || '#2563eb';
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    showWalletSetupGuide() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-large">
                <div class="modal-header">
                    <h3><i class="fas fa-wallet"></i> Wallet Setup Guide</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="wallet-setup-guide">
                        <div class="guide-intro">
                            <div class="intro-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <h4>No Account Needed - Complete Privacy</h4>
                            <p>Students don't create traditional usernames/passwords. No email or personal information required.</p>
                        </div>
                        
                        <div class="setup-steps">
                            <div class="step-card">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h5>Choose Your Wallet</h5>
                                    <p>Install any crypto wallet app - these are free and take 2 minutes to set up:</p>
                                    <div class="wallet-options">
                                        <div class="wallet-option" onclick="window.open('https://metamask.io/', '_blank')">
                                            <div class="wallet-icon metamask-icon">🦊</div>
                                            <div class="wallet-info">
                                                <h6>MetaMask</h6>
                                                <p>Most popular • Easy to use</p>
                                                <span class="wallet-badge">Recommended</span>
                                            </div>
                                        </div>
                                        <div class="wallet-option" onclick="window.open('https://www.coinbase.com/wallet', '_blank')">
                                            <div class="wallet-icon coinbase-icon">🟦</div>
                                            <div class="wallet-info">
                                                <h6>Coinbase Wallet</h6>
                                                <p>User-friendly • Trusted brand</p>
                                            </div>
                                        </div>
                                        <div class="wallet-option" onclick="window.open('https://trustwallet.com/', '_blank')">
                                            <div class="wallet-icon trust-icon">🛡️</div>
                                            <div class="wallet-info">
                                                <h6>Trust Wallet</h6>
                                                <p>Mobile-first • Open source</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="step-card">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h5>One-Click Creation</h5>
                                    <p>When you install a wallet, it automatically creates:</p>
                                    <ul class="feature-list">
                                        <li><i class="fas fa-key"></i> Your public address (like "0x3F5...C4B")</li>
                                        <li><i class="fas fa-lock"></i> Your private key (stored securely on your device)</li>
                                        <li><i class="fas fa-shield"></i> 12-word recovery phrase (keep this secret!)</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="step-card">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h5>Come Back Here</h5>
                                    <p>After installing your wallet, return to StudyPrep AI and click "Connect Wallet" again.</p>
                                    <div class="security-info">
                                        <i class="fas fa-info-circle"></i>
                                        <span>We'll never ask for your private key or recovery phrase!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="privacy-protection">
                            <h5><i class="fas fa-user-shield"></i> How It Protects You</h5>
                            <div class="protection-grid">
                                <div class="protection-item">
                                    <i class="fas fa-user-secret"></i>
                                    <h6>No Personal Data</h6>
                                    <p>We never see your name, email, or personal details</p>
                                </div>
                                <div class="protection-item">
                                    <i class="fas fa-calendar-check"></i>
                                    <h6>Age Check</h6>
                                    <p>We automatically check your wallet's creation date to block under-13 users</p>
                                </div>
                                <div class="protection-item">
                                    <i class="fas fa-mask"></i>
                                    <h6>Complete Privacy</h6>
                                    <p>Your wallet address isn't linked to your real identity</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn primary" onclick="window.open('https://metamask.io/', '_blank')">
                        <i class="fas fa-download"></i>
                        Install MetaMask (Recommended)
                    </button>
                    <button class="modal-btn" onclick="this.closest('.modal-overlay').remove();">
                        I'll Set This Up Later
                    </button>
                </div>
            </div>
        `;
        
        this.addModalToDOM(modal);
    }

    showWalletConnectionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-medium">
                <div class="modal-header">
                    <h3><i class="fas fa-link"></i> Connect Your Wallet</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="wallet-connection-guide">
                        <div class="connection-steps">
                            <h5>Authentication Process (Free & Secure)</h5>
                            <div class="auth-step">
                                <div class="step-icon">
                                    <i class="fas fa-mouse-pointer"></i>
                                </div>
                                <div class="step-text">
                                    <h6>1. Click Connect Below</h6>
                                    <p>Select your wallet from the browser popup</p>
                                </div>
                            </div>
                            <div class="auth-step">
                                <div class="step-icon">
                                    <i class="fas fa-signature"></i>
                                </div>
                                <div class="step-text">
                                    <h6>2. Sign to Login</h6>
                                    <p>Your wallet will ask: "Sign to login to StudyPrep AI?" - This is FREE</p>
                                </div>
                            </div>
                            <div class="auth-step">
                                <div class="step-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="step-text">
                                    <h6>3. Instant Access</h6>
                                    <p>You're logged in! Your address is your anonymous ID</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="security-features">
                            <h6><i class="fas fa-shield-alt"></i> Wallet Security Features</h6>
                            <div class="security-list">
                                <div class="security-item">
                                    <i class="fas fa-key"></i>
                                    <span>Recovery phrases keep your wallet safe</span>
                                </div>
                                <div class="security-item">
                                    <i class="fas fa-mobile-alt"></i>
                                    <span>Device lock with PIN/biometric protection</span>
                                </div>
                                <div class="security-item">
                                    <i class="fas fa-ban"></i>
                                    <span>StudyPrep can't access your crypto funds</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn primary" onclick="window.WalletConnector.connectWallet()">
                        <i class="fas fa-wallet"></i>
                        Connect Wallet Now
                    </button>
                    <button class="modal-btn" onclick="this.closest('.modal-overlay').remove();">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        this.addModalToDOM(modal);
    }

    showWalletManagementModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-medium">
                <div class="modal-header">
                    <h3><i class="fas fa-cog"></i> Wallet Management</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="wallet-management">
                        <div class="connected-wallet">
                            <div class="wallet-status">
                                <i class="fas fa-check-circle"></i>
                                <span>Connected Wallet</span>
                            </div>
                            <div class="wallet-address">
                                <code>${this.formatAddress(this.userAddress)}</code>
                                <button onclick="navigator.clipboard.writeText('${this.userAddress}')" class="copy-btn">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="wallet-actions">
                            <div class="action-card" onclick="window.NFTSystem?.showUserNFTs()">
                                <i class="fas fa-images"></i>
                                <div>
                                    <h6>View My NFTs</h6>
                                    <p>See your learning passes and access premium content</p>
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                            
                            <div class="action-card" onclick="window.WalletConnector.showAccessGuide()">
                                <i class="fas fa-graduation-cap"></i>
                                <div>
                                    <h6>How to Access Content</h6>
                                    <p>Learn about minting NFTs and unlocking subjects</p>
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                            
                            <div class="action-card" onclick="window.WalletConnector.showRecoveryGuide()">
                                <i class="fas fa-life-ring"></i>
                                <div>
                                    <h6>Recovery Options</h6>
                                    <p>What to do if you lose access to your wallet</p>
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn danger" onclick="window.WalletConnector.disconnectWallet()">
                        <i class="fas fa-sign-out-alt"></i>
                        Disconnect Wallet
                    </button>
                    <button class="modal-btn" onclick="this.closest('.modal-overlay').remove();">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        this.addModalToDOM(modal);
    }

    showAccessGuide() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-large">
                <div class="modal-header">
                    <h3><i class="fas fa-coins"></i> Accessing Premium Content</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="access-guide">
                        <div class="guide-section">
                            <h5><i class="fas fa-search"></i> Browse Subjects</h5>
                            <p>View calculus, biology, physics, and other topics on our platform. Each subject shows:</p>
                            <ul>
                                <li>What content is included</li>
                                <li>Number of practice problems</li>
                                <li>Human verification status</li>
                                <li>NFT pass price</li>
                            </ul>
                        </div>
                        
                        <div class="guide-section">
                            <h5><i class="fas fa-shopping-cart"></i> Mint NFT Pass</h5>
                            <div class="mint-process">
                                <div class="mint-step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <h6>Click "Get Access" on a subject</h6>
                                        <p>Choose which subject you want to unlock</p>
                                    </div>
                                </div>
                                <div class="mint-step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <h6>Review NFT details</h6>
                                        <p>See exactly what content you'll get access to</p>
                                    </div>
                                </div>
                                <div class="mint-step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <h6>Confirm payment</h6>
                                        <p>Your wallet asks for payment confirmation</p>
                                    </div>
                                </div>
                                <div class="mint-step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <h6>Instant unlock</h6>
                                        <p>NFT appears in your wallet, subject immediately unlocked</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="guide-section">
                            <h5><i class="fas fa-crown"></i> Your NFTs Stay Yours Forever</h5>
                            <div class="ownership-benefits">
                                <div class="benefit-item">
                                    <i class="fas fa-infinity"></i>
                                    <div>
                                        <h6>Lifetime Access</h6>
                                        <p>Keep access to content even if you switch devices</p>
                                    </div>
                                </div>
                                <div class="benefit-item">
                                    <i class="fas fa-exchange-alt"></i>
                                    <div>
                                        <h6>Transferable</h6>
                                        <p>You can sell or transfer your learning passes</p>
                                    </div>
                                </div>
                                <div class="benefit-item">
                                    <i class="fas fa-shield-alt"></i>
                                    <div>
                                        <h6>Blockchain Protected</h6>
                                        <p>Your ownership is secured by the blockchain</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pricing-info">
                            <h6><i class="fas fa-info-circle"></i> Current Prices</h6>
                            <div class="price-grid">
                                <div class="price-item">
                                    <i class="fas fa-calculator"></i>
                                    <span>Calculus: 0.01 ETH</span>
                                </div>
                                <div class="price-item">
                                    <i class="fas fa-dna"></i>
                                    <span>Biology: 0.015 ETH</span>
                                </div>
                                <div class="price-item">
                                    <i class="fas fa-atom"></i>
                                    <span>Physics: 0.02 ETH</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn primary" onclick="document.querySelector('.nft-portal').scrollIntoView(); this.closest('.modal-overlay').remove();">
                        <i class="fas fa-arrow-right"></i>
                        Browse Subjects
                    </button>
                    <button class="modal-btn" onclick="this.closest('.modal-overlay').remove();">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        this.addModalToDOM(modal);
    }

    showRecoveryGuide() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-medium">
                <div class="modal-header">
                    <h3><i class="fas fa-life-ring"></i> Wallet Recovery Options</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="recovery-guide">
                        <div class="recovery-section">
                            <h5><i class="fas fa-key"></i> If You Lose Access</h5>
                            <div class="recovery-option">
                                <div class="option-icon">
                                    <i class="fas fa-redo-alt"></i>
                                </div>
                                <div class="option-content">
                                    <h6>Recovery Phrase</h6>
                                    <p>Use your 12-word recovery phrase on any device to restore your wallet. This phrase was shown when you first created your wallet.</p>
                                    <div class="warning">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        <span>Never share your recovery phrase with anyone!</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="recovery-option">
                                <div class="option-icon">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                                <div class="option-content">
                                    <h6>NFTs Remain Safe</h6>
                                    <p>Your learning passes stay safe on the blockchain. Even if you lose your wallet, your NFTs are protected and can be recovered.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="recovery-section">
                            <h5><i class="fas fa-headset"></i> Contact Support</h5>
                            <p>If you're having trouble recovering your wallet or accessing your NFTs, our support team can help verify ownership and guide you through recovery.</p>
                            
                            <div class="support-options">
                                <div class="support-item">
                                    <i class="fas fa-envelope"></i>
                                    <div>
                                        <h6>Email Support</h6>
                                        <p>Send us your wallet address and we'll help verify your NFTs</p>
                                    </div>
                                </div>
                                <div class="support-item">
                                    <i class="fas fa-comments"></i>
                                    <div>
                                        <h6>Live Chat</h6>
                                        <p>Get real-time help with wallet recovery</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="recovery-tips">
                            <h6><i class="fas fa-lightbulb"></i> Prevention Tips</h6>
                            <ul>
                                <li>Write down your recovery phrase on paper (don't store digitally)</li>
                                <li>Store the phrase in a safe place separate from your device</li>
                                <li>Consider making multiple copies in different locations</li>
                                <li>Never take screenshots of your recovery phrase</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn primary" onclick="alert('Contact support: support@studyprep-ai.com')">
                        <i class="fas fa-envelope"></i>
                        Contact Support
                    </button>
                    <button class="modal-btn" onclick="this.closest('.modal-overlay').remove();">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        this.addModalToDOM(modal);
    }

    async connectWallet() {
        const walletBtn = document.querySelector('.wallet-btn');
        
        try {
            // Show loading state
            this.updateButtonState(walletBtn, 'loading');
            
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts.length > 0) {
                this.isConnected = true;
                this.userAddress = accounts[0];
                this.provider = new Web3(window.ethereum);
                
                // Check network
                await this.checkNetwork();
                
                this.updateUI();
                this.showNotification('Wallet connected successfully! 🎉', 'success');
                
                // Close any open modals
                const modal = document.querySelector('.modal-overlay');
                if (modal) modal.remove();
                
                // Log connection for analytics
                this.logWalletConnection();
            }
        } catch (error) {
            console.error('Connection failed:', error);
            this.handleConnectionError(error);
            this.updateButtonState(walletBtn, 'disconnected');
        }
    }

    disconnectWallet() {
        this.disconnect();
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
    }

    addModalToDOM(modal) {
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);

        // Close functionality
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Public methods for external use
    getAddress() {
        return this.userAddress;
    }

    isWalletConnected() {
        return this.isConnected;
    }

    getProvider() {
        return this.provider;
    }
}

// Add comprehensive wallet UI styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0 0.5rem;
    }
    .wallet-btn.connected {
        background: linear-gradient(135deg, #059669, #047857) !important;
    }
    .wallet-btn.loading {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    /* Wallet Setup Guide Styles */
    .wallet-setup-guide {
        max-width: 800px;
    }
    .guide-intro {
        text-align: center;
        margin-bottom: 2rem;
        padding: 2rem;
        background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        border-radius: 1rem;
    }
    .intro-icon {
        font-size: 3rem;
        color: #2563eb;
        margin-bottom: 1rem;
    }
    .guide-intro h4 {
        color: #1e40af;
        margin-bottom: 1rem;
    }
    .setup-steps {
        margin-bottom: 2rem;
    }
    .step-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 2rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .step-card:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
    .step-number {
        width: 2.5rem;
        height: 2.5rem;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.125rem;
        float: left;
        margin-right: 1.5rem;
    }
    .step-content {
        overflow: hidden;
    }
    .wallet-options {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
    }
    .wallet-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        background: white;
    }
    .wallet-option:hover {
        border-color: #2563eb;
        background: #f8fafc;
        transform: translateY(-2px);
    }
    .wallet-icon {
        font-size: 2rem;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
    }
    .metamask-icon { background: #f6931e; }
    .coinbase-icon { background: #0052ff; }
    .trust-icon { background: #3375bb; }
    .wallet-info h6 {
        margin-bottom: 0.25rem;
        font-size: 1rem;
        color: #1f2937;
    }
    .wallet-info p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
    }
    .wallet-badge {
        background: #10b981;
        color: white;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        font-weight: 600;
        margin-top: 0.5rem;
        display: inline-block;
    }
    .feature-list {
        list-style: none;
        margin: 1rem 0;
        padding: 0;
    }
    .feature-list li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        color: #374151;
    }
    .feature-list i {
        color: #2563eb;
        width: 1.25rem;
    }
    .security-info {
        background: #ecfdf5;
        border: 1px solid #10b981;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #047857;
        font-weight: 500;
    }
    .privacy-protection {
        background: #f9fafb;
        border-radius: 1rem;
        padding: 2rem;
        margin-top: 2rem;
    }
    .privacy-protection h5 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #1f2937;
    }
    .protection-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }
    .protection-item {
        text-align: center;
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .protection-item i {
        font-size: 2rem;
        color: #2563eb;
        margin-bottom: 1rem;
    }
    .protection-item h6 {
        margin-bottom: 0.5rem;
        color: #1f2937;
    }
    .protection-item p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
    }
    
    /* Wallet Connection Modal Styles */
    .wallet-connection-guide {
        max-width: 500px;
    }
    .connection-steps h5 {
        margin-bottom: 1.5rem;
        color: #1f2937;
        text-align: center;
    }
    .auth-step {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid #2563eb;
    }
    .step-icon {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    .step-text h6 {
        margin-bottom: 0.5rem;
        color: #1f2937;
    }
    .step-text p {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
    }
    .security-features {
        background: #f0f9ff;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-top: 2rem;
    }
    .security-features h6 {
        margin-bottom: 1rem;
        color: #1e40af;
    }
    .security-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .security-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #374151;
        font-size: 0.875rem;
    }
    .security-item i {
        color: #10b981;
        width: 1.25rem;
    }
    
    /* Wallet Management Modal Styles */
    .wallet-management {
        max-width: 500px;
    }
    .connected-wallet {
        background: #ecfdf5;
        border: 1px solid #10b981;
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;
    }
    .wallet-status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: #047857;
        font-weight: 600;
        margin-bottom: 1rem;
    }
    .wallet-status i {
        font-size: 1.25rem;
    }
    .wallet-address {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: white;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid #d1d5db;
    }
    .wallet-address code {
        font-family: 'Courier New', monospace;
        color: #374151;
        font-size: 0.875rem;
    }
    .copy-btn {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        color: #6b7280;
        transition: all 0.2s;
    }
    .copy-btn:hover {
        background: #e5e7eb;
        color: #374151;
    }
    .wallet-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .action-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .action-card:hover {
        background: #f8fafc;
        border-color: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .action-card > i:first-child {
        width: 2.5rem;
        height: 2.5rem;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.125rem;
        flex-shrink: 0;
    }
    .action-card > div {
        flex: 1;
    }
    .action-card h6 {
        margin-bottom: 0.25rem;
        color: #1f2937;
    }
    .action-card p {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
    }
    .action-card > i:last-child {
        color: #9ca3af;
        font-size: 1rem;
    }
    
    /* Access Guide Styles */
    .access-guide {
        max-width: 700px;
    }
    .guide-section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #e5e7eb;
    }
    .guide-section:last-child {
        border-bottom: none;
    }
    .guide-section h5 {
        margin-bottom: 1rem;
        color: #1f2937;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .guide-section ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
    }
    .guide-section li {
        margin-bottom: 0.5rem;
        color: #6b7280;
    }
    .mint-process {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }
    .mint-step {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid #2563eb;
    }
    .mint-step .step-number {
        width: 2rem;
        height: 2rem;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
        margin: 0;
        float: none;
    }
    .mint-step .step-content {
        overflow: visible;
    }
    .mint-step h6 {
        margin-bottom: 0.25rem;
        color: #1f2937;
    }
    .mint-step p {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
    }
    .ownership-benefits {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }
    .benefit-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f0f9ff;
        border-radius: 0.5rem;
    }
    .benefit-item i {
        width: 2.5rem;
        height: 2.5rem;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.125rem;
        flex-shrink: 0;
    }
    .benefit-item h6 {
        margin-bottom: 0.25rem;
        color: #1e40af;
    }
    .benefit-item p {
        margin: 0;
        color: #64748b;
        font-size: 0.875rem;
    }
    .pricing-info {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-top: 2rem;
    }
    .pricing-info h6 {
        color: #92400e;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .price-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    .price-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #92400e;
        font-weight: 500;
        font-size: 0.875rem;
    }
    
    /* Recovery Guide Styles */
    .recovery-guide {
        max-width: 600px;
    }
    .recovery-section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #e5e7eb;
    }
    .recovery-section:last-child {
        border-bottom: none;
    }
    .recovery-option {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
    }
    .option-icon {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    .option-content h6 {
        margin-bottom: 0.5rem;
        color: #1f2937;
    }
    .option-content p {
        margin-bottom: 1rem;
        color: #6b7280;
        font-size: 0.875rem;
    }
    .warning {
        background: #fef2f2;
        border: 1px solid #fca5a5;
        border-radius: 0.5rem;
        padding: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #dc2626;
        font-size: 0.875rem;
        font-weight: 500;
    }
    .support-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    .support-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f0f9ff;
        border-radius: 0.5rem;
    }
    .support-item i {
        width: 2.5rem;
        height: 2.5rem;
        background: #2563eb;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.125rem;
        flex-shrink: 0;
    }
    .support-item h6 {
        margin-bottom: 0.25rem;
        color: #1e40af;
    }
    .support-item p {
        margin: 0;
        color: #64748b;
        font-size: 0.875rem;
    }
    .recovery-tips {
        background: #ecfdf5;
        border-radius: 0.5rem;
        padding: 1.5rem;
    }
    .recovery-tips h6 {
        color: #047857;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .recovery-tips ul {
        margin: 0;
        padding-left: 1.5rem;
    }
    .recovery-tips li {
        margin-bottom: 0.5rem;
        color: #059669;
        font-size: 0.875rem;
    }
    
    /* Modal Button Styles */
    .modal-btn.danger {
        background: #dc2626;
        color: white;
        border: 1px solid #dc2626;
    }
    .modal-btn.danger:hover {
        background: #b91c1c;
        border-color: #b91c1c;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .wallet-options {
            grid-template-columns: 1fr;
        }
        .protection-grid {
            grid-template-columns: 1fr;
        }
        .mint-process {
            gap: 0.75rem;
        }
        .mint-step {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
        }
        .ownership-benefits {
            gap: 0.75rem;
        }
        .benefit-item {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
        }
        .price-grid {
            grid-template-columns: 1fr;
        }
        .support-options {
            grid-template-columns: 1fr;
        }
        .recovery-option {
            flex-direction: column;
            gap: 0.75rem;
        }
        .auth-step {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
        }
    }
`;
document.head.appendChild(style);

// Initialize wallet connector
const walletConnector = new WalletConnector();

// Export for use in other modules
window.WalletConnector = walletConnector;