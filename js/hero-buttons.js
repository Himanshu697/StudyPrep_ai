// Hero Buttons System
class HeroButtons {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const tryFreeBtn = document.querySelector('.hero .btn-primary');
            const exploreNFTsBtn = document.querySelector('.hero .btn-secondary');

            if (tryFreeBtn) {
                tryFreeBtn.addEventListener('click', (e) => this.handleTryFreeQuestion(e));
            }

            if (exploreNFTsBtn) {
                exploreNFTsBtn.addEventListener('click', (e) => this.handleExploreNFTs(e));
            }

            this.isInitialized = true;
        });
    }

    handleTryFreeQuestion(event) {
        event.preventDefault();
        
        // Visual feedback
        const button = event.target.closest('.btn');
        const originalContent = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.style.pointerEvents = 'none';
        
        // Short delay for animation
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.pointerEvents = 'auto';
            
            // Show free question modal
            this.showFreeQuestionModal();
            
        }, 800);

        // Analytics
        this.trackButtonClick('hero_try_free_question');
    }

    handleExploreNFTs(event) {
        event.preventDefault();
        
        // Visual feedback
        const button = event.target.closest('.btn');
        const originalContent = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.style.pointerEvents = 'none';
        
        // Short delay for animation
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.pointerEvents = 'auto';
            
            // Scroll to NFT section with highlight effect
            this.scrollToNFTSection();
            
        }, 800);

        // Analytics
        this.trackButtonClick('hero_explore_nfts');
    }

    showFreeQuestionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal modal-large">
                <div class="modal-header">
                    <h3>Try a Free Question</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="free-question-demo">
                        <div class="demo-question">
                            <h4>Sample Question:</h4>
                            <div class="question-card">
                                <div class="question-subject">
                                    <i class="fas fa-calculator"></i>
                                    <span>Calculus</span>
                                </div>
                                <p class="question-text">Find the derivative of f(x) = 3x² + 2x - 1</p>
                                
                                <div class="demo-solution">
                                    <h5><i class="fas fa-robot"></i> AI Solution:</h5>
                                    <div class="solution-steps">
                                        <p>Using the power rule and sum rule for derivatives:</p>
                                        <p class="step">Step 1: d/dx(3x²) = 6x</p>
                                        <p class="step">Step 2: d/dx(2x) = 2</p>
                                        <p class="step">Step 3: d/dx(-1) = 0</p>
                                        <p class="answer"><strong>Answer: f'(x) = 6x + 2</strong></p>
                                    </div>
                                    
                                    <div class="verification-badge">
                                        <i class="fas fa-badge-check"></i>
                                        <span>Verified by Stanford Mathematics PhD</span>
                                    </div>
                                    
                                    <div class="solution-citation">
                                        <i class="fas fa-book"></i>
                                        <span>Source: Stewart's Calculus, 8th Ed. Ch. 3.1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="try-your-question">
                            <h4>Ask Your Own Question:</h4>
                            <div class="question-input-area">
                                <textarea placeholder="Enter your question here... (Example: How do I solve quadratic equations?)" rows="4"></textarea>
                                <div class="input-features">
                                    <div class="subject-selector">
                                        <select>
                                            <option value="mathematics">Mathematics</option>
                                            <option value="physics">Physics</option>
                                            <option value="chemistry">Chemistry</option>
                                            <option value="biology">Biology</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <button class="ask-question-btn" onclick="window.HeroButtons.processFreeSolution()">
                                        <i class="fas fa-paper-plane"></i>
                                        Get AI Solution
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="upgrade-notice">
                            <div class="notice-content">
                                <div class="notice-icon">
                                    <i class="fas fa-crown"></i>
                                </div>
                                <div class="notice-text">
                                    <h5>Unlock Premium Features</h5>
                                    <p>Get unlimited questions, step-by-step solutions, and human verification with our NFT passes.</p>
                                </div>
                            </div>
                            <button class="upgrade-btn" onclick="window.HeroButtons.goToNFTSection()">
                                <i class="fas fa-coins"></i>
                                View NFT Passes
                            </button>
                        </div>
                        
                        <div class="demo-limitations">
                            <h5><i class="fas fa-info-circle"></i> Free Demo Limitations:</h5>
                            <ul>
                                <li>1 question per session</li>
                                <li>Basic explanations only</li>
                                <li>No step-by-step solutions</li>
                                <li>No human verification</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn" onclick="this.closest('.modal-overlay').remove();">Close</button>
                </div>
            </div>
        `;

        // Add modal styles
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

        // Focus on textarea
        setTimeout(() => {
            const textarea = modal.querySelector('textarea');
            if (textarea) textarea.focus();
        }, 100);
    }

    processFreeSolution() {
        const textarea = document.querySelector('.try-your-question textarea');
        const button = document.querySelector('.ask-question-btn');
        const subject = document.querySelector('.subject-selector select').value;
        
        if (!textarea.value.trim()) {
            this.showNotification('Please enter a question first.', 'warning');
            return;
        }

        // Show processing state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;

        // Simulate AI processing with realistic delay
        setTimeout(() => {
            const solutionContainer = document.createElement('div');
            solutionContainer.className = 'generated-solution';
            solutionContainer.innerHTML = `
                <div class="solution-header">
                    <i class="fas fa-robot"></i>
                    <span>AI Generated Response</span>
                </div>
                <div class="solution-content">
                    <p>Thank you for your ${subject} question! This is a demo of our AI tutoring system.</p>
                    <p class="demo-response">For this type of question, I would normally provide:</p>
                    <ul>
                        <li>Step-by-step solution breakdown</li>
                        <li>Detailed explanations of each concept</li>
                        <li>Relevant formula references</li>
                        <li>Practice problem suggestions</li>
                    </ul>
                    <p class="upgrade-prompt">To get the complete solution with human verification, please connect your wallet and explore our NFT passes.</p>
                </div>
                <div class="solution-disclaimer">
                    <i class="fas fa-info-circle"></i>
                    <span>Full AI solutions and human verification available with premium access</span>
                </div>
                <div class="solution-actions">
                    <button class="demo-again-btn" onclick="window.HeroButtons.resetDemo()">
                        <i class="fas fa-redo"></i>
                        Try Another Question
                    </button>
                    <button class="get-premium-btn" onclick="window.HeroButtons.goToNFTSection()">
                        <i class="fas fa-crown"></i>
                        Get Premium Access
                    </button>
                </div>
            `;

            // Insert solution after the input area
            const inputArea = document.querySelector('.question-input-area');
            inputArea.parentNode.insertBefore(solutionContainer, inputArea.nextSibling);
            
            // Reset button
            button.innerHTML = '<i class="fas fa-paper-plane"></i> Get AI Solution';
            button.disabled = false;
            
            // Scroll to show solution
            solutionContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Analytics
            this.trackButtonClick('free_question_processed');
            
        }, 2500); // Realistic processing time
    }

    resetDemo() {
        const textarea = document.querySelector('.try-your-question textarea');
        const existingSolution = document.querySelector('.generated-solution');
        
        if (textarea) textarea.value = '';
        if (existingSolution) existingSolution.remove();
        
        this.showNotification('Demo reset! Ask another question.', 'info');
    }

    scrollToNFTSection() {
        const nftSection = document.querySelector('.nft-portal');
        if (!nftSection) return;

        // Smooth scroll to NFT section
        const headerOffset = 80;
        const elementPosition = nftSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Highlight NFT cards after scroll
        setTimeout(() => {
            this.highlightNFTCards();
        }, 1000);
    }

    highlightNFTCards() {
        const nftCards = document.querySelectorAll('.nft-card');
        
        nftCards.forEach((card, index) => {
            setTimeout(() => {
                // Add highlight effect
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.2)';
                card.style.transition = 'all 0.3s ease';
                
                // Add glow effect
                const glowOverlay = document.createElement('div');
                glowOverlay.style.cssText = `
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.2));
                    border-radius: 1rem;
                    z-index: -1;
                    animation: glow-pulse 2s ease-in-out infinite;
                `;
                
                card.style.position = 'relative';
                card.appendChild(glowOverlay);
                
                // Remove effects after delay
                setTimeout(() => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                    if (glowOverlay.parentNode) {
                        glowOverlay.remove();
                    }
                }, 2000);
            }, index * 200);
        });
    }

    goToNFTSection() {
        // Close any open modals
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
        
        // Scroll to NFT section
        this.scrollToNFTSection();
    }

    trackButtonClick(action) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'button_click', {
                event_category: 'Hero_Interaction',
                event_label: action
            });
        }

        // Console log for development
        console.log(`Hero button action: ${action}`);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto remove
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
}

// Add hero button styles
const heroStyles = document.createElement('style');
heroStyles.textContent = `
    .free-question-demo {
        max-width: 700px;
    }
    
    .demo-question {
        margin-bottom: 2rem;
    }
    
    .question-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1.5rem;
    }
    
    .question-subject {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
    
    .question-text {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
    }
    
    .demo-solution {
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-top: 1rem;
    }
    
    .solution-steps {
        margin: 1rem 0;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 0.5rem;
    }
    
    .step {
        margin-bottom: 0.5rem;
        padding-left: 1rem;
        position: relative;
    }
    
    .step::before {
        content: '→';
        position: absolute;
        left: 0;
        color: #2563eb;
        font-weight: bold;
    }
    
    .answer {
        background: #dcfce7;
        border: 1px solid #16a34a;
        border-radius: 0.5rem;
        padding: 0.75rem;
        margin-top: 1rem;
        font-weight: 600;
        color: #166534;
    }
    
    .verification-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #dcfce7;
        color: #166534;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
        margin-top: 1rem;
    }
    
    .solution-citation {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
        font-size: 0.875rem;
        color: #6b7280;
    }
    
    .try-your-question {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .question-input-area textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-family: inherit;
        resize: vertical;
        min-height: 100px;
    }
    
    .input-features {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .subject-selector select {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        background: white;
        font-family: inherit;
    }
    
    .ask-question-btn {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .ask-question-btn:hover {
        transform: translateY(-2px);
    }
    
    .upgrade-notice {
        background: linear-gradient(135deg, #7c3aed, #2563eb);
        color: white;
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
    }
    
    .notice-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }
    
    .notice-icon {
        font-size: 2.5rem;
        opacity: 0.9;
    }
    
    .notice-text h5 {
        margin-bottom: 0.5rem;
        color: white;
    }
    
    .upgrade-btn {
        background: white;
        color: #7c3aed;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        flex-shrink: 0;
    }
    
    .upgrade-btn:hover {
        transform: translateY(-2px);
    }
    
    .demo-limitations {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 0.5rem;
        padding: 1.5rem;
    }
    
    .demo-limitations h5 {
        color: #92400e;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .demo-limitations ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .demo-limitations li {
        padding: 0.25rem 0;
        color: #92400e;
        font-size: 0.875rem;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .demo-limitations li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: #f59e0b;
        font-weight: bold;
    }
    
    .generated-solution {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin: 2rem 0;
    }
    
    .solution-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #374151;
    }
    
    .solution-content {
        margin-bottom: 1.5rem;
    }
    
    .demo-response {
        font-weight: 600;
        margin: 1rem 0;
    }
    
    .upgrade-prompt {
        background: #dbeafe;
        border: 1px solid #3b82f6;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
        color: #1e40af;
        font-weight: 500;
    }
    
    .solution-disclaimer {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        color: #92400e;
    }
    
    .solution-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .demo-again-btn, .get-premium-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .demo-again-btn {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }
    
    .get-premium-btn {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
    }
    
    .demo-again-btn:hover, .get-premium-btn:hover {
        transform: translateY(-2px);
    }
    
    @keyframes glow-pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.4; }
    }
    
    @media (max-width: 768px) {
        .upgrade-notice {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
        }
        
        .notice-content {
            flex-direction: column;
            text-align: center;
        }
        
        .input-features {
            flex-direction: column;
            align-items: stretch;
        }
        
        .solution-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(heroStyles);

// Initialize hero buttons system
const heroButtons = new HeroButtons();

// Export for global use
window.HeroButtons = heroButtons;