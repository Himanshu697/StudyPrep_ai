// NFT Minting and Management System
class NFTSystem {
    constructor() {
        this.contracts = {
            calculus: '0x1234567890123456789012345678901234567890',
            biology: '0x2345678901234567890123456789012345678901',
            physics: '0x3456789012345678901234567890123456789012'
        };
        this.prices = {
            calculus: '0.01',
            biology: '0.015',
            physics: '0.02'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserNFTs();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const nftButtons = document.querySelectorAll('.nft-btn');
            nftButtons.forEach((button, index) => {
                const nftType = ['calculus', 'biology', 'physics'][index];
                button.addEventListener('click', (e) => this.handleNFTMint(e, nftType));
            });
        });
    }

    async handleNFTMint(event, nftType) {
        event.preventDefault();
        const button = event.target;

        // Check wallet connection
        if (!window.WalletConnector?.isWalletConnected()) {
            this.showModal('Connect Wallet', 'Please connect your wallet first to mint NFTs.', [
                { text: 'Connect Wallet', action: () => document.querySelector('.wallet-btn').click(), primary: true },
                { text: 'Cancel', action: () => {} }
            ]);
            return;
        }

        // Check if user already owns this NFT
        const alreadyOwns = await this.checkNFTOwnership(nftType);
        if (alreadyOwns) {
            this.showModal('Already Owned', `You already own the ${this.capitalizeFirst(nftType)} NFT!`, [
                { text: 'View My NFTs', action: () => this.showUserNFTs(), primary: true },
                { text: 'Close', action: () => {} }
            ]);
            return;
        }

        // Show minting confirmation modal
        this.showMintingModal(nftType, button);
    }

    async checkNFTOwnership(nftType) {
        try {
            const userAddress = window.WalletConnector.getAddress();
            // Simulate NFT ownership check (replace with actual contract call)
            const owned = localStorage.getItem(`nft_${nftType}_${userAddress}`);
            return owned === 'true';
        } catch (error) {
            console.error('Error checking NFT ownership:', error);
            return false;
        }
    }

    showMintingModal(nftType, button) {
        const nftData = this.getNFTData(nftType);
        
        const modalContent = `
            <div class="nft-mint-modal">
                <div class="nft-preview">
                    <div class="nft-preview-header" style="background: ${nftData.gradient}">
                        <i class="fas fa-${nftData.icon}" style="font-size: 3rem; color: white; margin-bottom: 1rem;"></i>
                        <h3>${nftData.title}</h3>
                    </div>
                    <div class="nft-preview-body">
                        <div class="nft-features-preview">
                            ${nftData.features.map(feature => `<div class="feature-item"><i class="fas fa-check"></i> ${feature}</div>`).join('')}
                        </div>
                        <div class="nft-price-section">
                            <div class="price-display">${this.prices[nftType]} ETH</div>
                            <div class="price-usd">≈ $${this.ethToUsd(this.prices[nftType])} USD</div>
                        </div>
                    </div>
                </div>
                <div class="mint-info">
                    <p><strong>What you're getting:</strong></p>
                    <ul>
                        <li>Lifetime access to ${nftData.title} content</li>
                        <li>Human-verified solutions and explanations</li>
                        <li>Regular content updates</li>
                        <li>Priority support</li>
                        <li>Transferable ownership</li>
                    </ul>
                    <div class="mint-warning">
                        <i class="fas fa-info-circle"></i>
                        <span>This NFT grants access to educational content only. No investment value.</span>
                    </div>
                </div>
            </div>
        `;

        this.showModal('Mint NFT Pass', modalContent, [
            { 
                text: `Mint for ${this.prices[nftType]} ETH`, 
                action: () => this.processMint(nftType, button), 
                primary: true 
            },
            { text: 'Cancel', action: () => {} }
        ], 'large');
    }

    async processMint(nftType, button) {
        const originalText = button.innerHTML;
        const steps = [
            'Preparing transaction...',
            'Waiting for confirmation...',
            'Processing on blockchain...',
            'Finalizing NFT...'
        ];

        try {
            for (let i = 0; i < steps.length; i++) {
                button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${steps[i]}`;
                await this.delay(2000); // Simulate processing time
            }

            // Simulate successful minting
            await this.completeMint(nftType);
            
            button.innerHTML = '<i class="fas fa-check"></i> Owned';
            button.disabled = true;
            button.style.background = 'linear-gradient(135deg, #059669, #047857)';

            this.showSuccessModal(nftType);

        } catch (error) {
            console.error('Minting failed:', error);
            button.innerHTML = originalText;
            this.showModal('Minting Failed', 'Transaction failed. Please try again.', [
                { text: 'Retry', action: () => this.processMint(nftType, button), primary: true },
                { text: 'Cancel', action: () => {} }
            ]);
        }
    }

    async completeMint(nftType) {
        const userAddress = window.WalletConnector.getAddress();
        
        // Store NFT ownership locally (replace with actual blockchain interaction)
        localStorage.setItem(`nft_${nftType}_${userAddress}`, 'true');
        
        // Add to user's NFT collection
        const userNFTs = JSON.parse(localStorage.getItem(`user_nfts_${userAddress}`) || '[]');
        userNFTs.push({
            type: nftType,
            mintedAt: new Date().toISOString(),
            tokenId: Math.floor(Math.random() * 10000),
            transactionHash: '0x' + Math.random().toString(36).substr(2, 64)
        });
        localStorage.setItem(`user_nfts_${userAddress}`, JSON.stringify(userNFTs));

        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'nft_minted', {
                event_category: 'NFT',
                event_label: nftType,
                value: parseFloat(this.prices[nftType])
            });
        }
    }

    showSuccessModal(nftType) {
        const nftData = this.getNFTData(nftType);
        
        const successContent = `
            <div class="success-animation">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>NFT Minted Successfully!</h3>
                <p>You now own the <strong>${nftData.title}</strong> NFT.</p>
                <div class="success-actions">
                    <button class="access-content-btn" onclick="this.accessContent('${nftType}')">
                        <i class="fas fa-graduation-cap"></i>
                        Access Content Now
                    </button>
                    <button class="view-nfts-btn" onclick="this.showUserNFTs()">
                        <i class="fas fa-images"></i>
                        View My NFTs
                    </button>
                </div>
            </div>
        `;

        this.showModal('Success!', successContent, [
            { text: 'Close', action: () => {} }
        ]);
    }

    showUserNFTs() {
        const userAddress = window.WalletConnector.getAddress();
        const userNFTs = JSON.parse(localStorage.getItem(`user_nfts_${userAddress}`) || '[]');

        if (userNFTs.length === 0) {
            this.showModal('Your NFTs', '<p>You don\'t own any StudyPrep AI NFTs yet.</p>', [
                { text: 'Browse NFTs', action: () => document.querySelector('.nft-portal').scrollIntoView(), primary: true },
                { text: 'Close', action: () => {} }
            ]);
            return;
        }

        const nftsContent = `
            <div class="user-nfts-grid">
                ${userNFTs.map(nft => `
                    <div class="user-nft-card">
                        <div class="user-nft-header" style="background: ${this.getNFTData(nft.type).gradient}">
                            <i class="fas fa-${this.getNFTData(nft.type).icon}"></i>
                        </div>
                        <div class="user-nft-body">
                            <h4>${this.getNFTData(nft.type).title}</h4>
                            <p>Token ID: #${nft.tokenId}</p>
                            <p>Minted: ${new Date(nft.mintedAt).toLocaleDateString()}</p>
                            <button class="access-btn" onclick="window.NFTSystem.accessContent('${nft.type}')">
                                Access Content
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.showModal('Your NFTs', nftsContent, [
            { text: 'Close', action: () => {} }
        ], 'large');
    }

    accessContent(nftType) {
        const nftData = this.getNFTData(nftType);
        
        // Create premium content access
        const contentModal = `
            <div class="premium-content">
                <div class="content-header">
                    <h3><i class="fas fa-crown"></i> Premium ${nftData.title} Content</h3>
                    <span class="verified-badge"><i class="fas fa-badge-check"></i> Human Verified</span>
                </div>
                <div class="content-sections">
                    <div class="content-section">
                        <h4><i class="fas fa-book"></i> Study Materials</h4>
                        <ul>
                            <li><a href="#" onclick="alert('Opening comprehensive study guide...')">Comprehensive Study Guide</a></li>
                            <li><a href="#" onclick="alert('Opening practice problems...')">500+ Practice Problems</a></li>
                            <li><a href="#" onclick="alert('Opening solutions manual...')">Step-by-Step Solutions</a></li>
                        </ul>
                    </div>
                    <div class="content-section">
                        <h4><i class="fas fa-video"></i> Video Tutorials</h4>
                        <ul>
                            <li><a href="#" onclick="alert('Opening video series...')">Complete Video Series</a></li>
                            <li><a href="#" onclick="alert('Opening interactive demos...')">Interactive Demonstrations</a></li>
                            <li><a href="#" onclick="alert('Opening expert interviews...')">Expert Interviews</a></li>
                        </ul>
                    </div>
                    <div class="content-section">
                        <h4><i class="fas fa-users"></i> Community Access</h4>
                        <ul>
                            <li><a href="#" onclick="alert('Opening Discord server...')">Private Discord Server</a></li>
                            <li><a href="#" onclick="alert('Opening study groups...')">Study Group Sessions</a></li>
                            <li><a href="#" onclick="alert('Opening office hours...')">Weekly Office Hours</a></li>
                        </ul>
                    </div>
                </div>
                <div class="content-footer">
                    <p><i class="fas fa-info-circle"></i> Your NFT grants lifetime access to all current and future content in this category.</p>
                </div>
            </div>
        `;

        this.showModal(`${nftData.title} - Premium Access`, contentModal, [
            { text: 'Close', action: () => {} }
        ], 'large');

        // Close previous modal
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
    }

    loadUserNFTs() {
        if (!window.WalletConnector?.isWalletConnected()) return;

        const userAddress = window.WalletConnector.getAddress();
        const userNFTs = JSON.parse(localStorage.getItem(`user_nfts_${userAddress}`) || '[]');

        // Update NFT buttons to show ownership
        userNFTs.forEach(nft => {
            const nftCards = document.querySelectorAll('.nft-card');
            const cardIndex = ['calculus', 'biology', 'physics'].indexOf(nft.type);
            if (cardIndex !== -1 && nftCards[cardIndex]) {
                const button = nftCards[cardIndex].querySelector('.nft-btn');
                if (button) {
                    button.innerHTML = '<i class="fas fa-check"></i> Owned';
                    button.disabled = true;
                    button.style.background = 'linear-gradient(135deg, #059669, #047857)';
                }
            }
        });
    }

    getNFTData(nftType) {
        const data = {
            calculus: {
                title: 'Calculus Mastery',
                icon: 'calculator',
                gradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                features: ['AP Calculus AB/BC', 'College-level Calculus', 'Step-by-step solutions', 'Textbook citations']
            },
            biology: {
                title: 'AP Biology',
                icon: 'dna',
                gradient: 'linear-gradient(135deg, #059669, #2563eb)',
                features: ['Full AP Biology curriculum', 'Lab experiment guides', 'Practice FRQs', '3D model explanations']
            },
            physics: {
                title: 'Physics Bundle',
                icon: 'atom',
                gradient: 'linear-gradient(135deg, #7c3aed, #ea580c)',
                features: ['Mechanics & E&M', '100+ practice problems', 'Formula derivations', 'Real-world applications']
            }
        };
        return data[nftType];
    }

    ethToUsd(ethAmount) {
        // Simplified conversion (replace with real-time API)
        const ethPrice = 2000; // Placeholder price
        return (parseFloat(ethAmount) * ethPrice).toFixed(2);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showModal(title, content, buttons = [], size = 'medium') {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-${size}">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttons.map(btn => 
                        `<button class="modal-btn ${btn.primary ? 'primary' : ''}" onclick="${btn.action.toString()}; this.closest('.modal-overlay').remove();">
                            ${btn.text}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;

        // Add styles
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
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        background: white;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    .modal-large { max-width: 800px; }
    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
    }
    .modal-content {
        padding: 1.5rem;
    }
    .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    .modal-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
    }
    .modal-btn.primary {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        border-color: transparent;
    }
    .modal-btn:hover {
        transform: translateY(-1px);
    }
    .nft-mint-modal {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    .nft-preview-header {
        padding: 2rem;
        text-align: center;
        color: white;
        border-radius: 1rem 1rem 0 0;
    }
    .nft-preview-body {
        padding: 1.5rem;
    }
    .feature-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: #374151;
    }
    .feature-item i {
        color: #059669;
    }
    .price-display {
        font-size: 2rem;
        font-weight: 800;
        color: #7c3aed;
        text-align: center;
        margin: 1rem 0;
    }
    .price-usd {
        text-align: center;
        color: #6b7280;
        font-size: 0.875rem;
    }
    .mint-warning {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        font-size: 0.875rem;
        color: #92400e;
    }
    .success-animation {
        text-align: center;
    }
    .success-icon {
        font-size: 4rem;
        color: #059669;
        margin-bottom: 1rem;
        animation: bounceIn 0.6s ease;
    }
    .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    .access-content-btn, .view-nfts-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
    }
    .access-content-btn {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
    }
    .view-nfts-btn {
        background: #f3f4f6;
        color: #374151;
    }
    .user-nfts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    .user-nft-card {
        border: 1px solid #e5e7eb;
        border-radius: 1rem;
        overflow: hidden;
    }
    .user-nft-header {
        padding: 2rem;
        text-align: center;
        color: white;
        font-size: 2rem;
    }
    .user-nft-body {
        padding: 1.5rem;
        text-align: center;
    }
    .access-btn {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        margin-top: 1rem;
    }
    .premium-content {
        max-width: 600px;
    }
    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }
    .verified-badge {
        background: #dcfce7;
        color: #166534;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    .content-sections {
        display: grid;
        gap: 2rem;
    }
    .content-section h4 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: #374151;
    }
    .content-section ul {
        list-style: none;
        padding: 0;
    }
    .content-section li {
        margin-bottom: 0.5rem;
    }
    .content-section a {
        color: #2563eb;
        text-decoration: none;
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: background 0.2s;
    }
    .content-section a:hover {
        background: #f3f4f6;
    }
    .content-footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 0.875rem;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    @media (max-width: 768px) {
        .nft-mint-modal {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        .user-nfts-grid {
            grid-template-columns: 1fr;
        }
        .success-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(modalStyles);

// Initialize NFT system
const nftSystem = new NFTSystem();

// Export for global use
window.NFTSystem = nftSystem;