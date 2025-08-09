// Interactive Demo Chat System
class DemoChat {
    constructor() {
        this.messages = [];
        this.isProcessing = false;
        this.currentTopic = 'calculus';
        this.responseBank = this.initializeResponseBank();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeChat();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const demoInput = document.querySelector('.demo-input input');
            const demoButton = document.querySelector('.demo-input button');

            if (demoInput && demoButton) {
                demoInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.handleUserInput();
                    }
                });

                demoButton.addEventListener('click', () => this.handleUserInput());

                // Auto-resize input
                demoInput.addEventListener('input', () => this.autoResizeInput(demoInput));
            }
        });
    }

    initializeChat() {
        // Add initial demo messages if not already present
        const messagesContainer = document.querySelector('.demo-messages');
        if (messagesContainer && messagesContainer.children.length <= 3) {
            // Chat is already initialized with static content
            this.messages = [
                { type: 'user', content: 'Can you explain the fundamental theorem of calculus?' },
                { type: 'ai', content: 'The Fundamental Theorem of Calculus connects differentiation and integration...', verified: false },
                { type: 'ai', content: 'The previous explanation is correct...', verified: true }
            ];
        }
    }

    async handleUserInput() {
        const input = document.querySelector('.demo-input input');
        const button = document.querySelector('.demo-input button');
        const userMessage = input.value.trim();

        if (!userMessage || this.isProcessing) return;

        // Add user message
        this.addMessage('user', userMessage);
        
        // Clear input
        input.value = '';
        this.autoResizeInput(input);

        // Show processing state
        this.setProcessingState(button, true);

        try {
            // Simulate AI processing
            await this.delay(1500);
            
            // Generate AI response
            const response = await this.generateResponse(userMessage);
            this.addMessage('ai', response.content, response.verified, response.citation, response.disclaimer);

            // If topic requires verification, add verified response after delay
            if (this.requiresVerification(userMessage)) {
                await this.delay(2000);
                const verifiedResponse = this.getVerifiedResponse(userMessage);
                this.addMessage('ai', verifiedResponse.content, true, null, null, verifiedResponse.verifier);
            }

        } catch (error) {
            console.error('Error generating response:', error);
            this.addMessage('ai', 'I apologize, but I\'m having trouble processing your request right now. Please try again.', false);
        } finally {
            this.setProcessingState(button, false);
        }
    }

    addMessage(type, content, verified = false, citation = null, disclaimer = null, verifier = null) {
        const messagesContainer = document.querySelector('.demo-messages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        
        let messageHTML = content;

        // Add citation if provided
        if (citation) {
            messageHTML += `<div class="citation">${citation}</div>`;
        }

        // Add disclaimer for AI messages
        if (type === 'ai' && !verified && disclaimer !== false) {
            const disclaimerText = disclaimer || 'AI-generated explanation. Verify with textbook or teacher.';
            messageHTML += `
                <div class="disclaimer">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${disclaimerText}</span>
                </div>
            `;
        }

        // Add verification badge for verified messages
        if (verified && verifier) {
            messageHTML = `
                <div class="nft-verify">
                    <i class="fas fa-badge-check"></i>
                    ${verifier}
                </div>
                ${messageHTML}
            `;
        }

        // Add report button for AI messages
        if (type === 'ai') {
            messageHTML += `
                <button class="report-btn" onclick="window.DemoChat.reportMessage(this)">
                    <i class="fas fa-flag"></i>
                    Report Error
                </button>
            `;
        }

        messageElement.innerHTML = messageHTML;

        // Add animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        messagesContainer.appendChild(messageElement);

        // Animate in
        setTimeout(() => {
            messageElement.style.transition = 'all 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 50);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message
        this.messages.push({ type, content, verified, citation, disclaimer });
    }

    async generateResponse(userMessage) {
        const topic = this.detectTopic(userMessage);
        const responses = this.responseBank[topic] || this.responseBank.general;
        
        // Simple keyword matching for demo purposes
        let bestResponse = responses.find(r => 
            r.keywords.some(keyword => 
                userMessage.toLowerCase().includes(keyword.toLowerCase())
            )
        ) || responses[0];

        return {
            content: bestResponse.response,
            verified: false,
            citation: bestResponse.citation,
            disclaimer: bestResponse.disclaimer
        };
    }

    detectTopic(message) {
        const topics = {
            calculus: ['calculus', 'derivative', 'integral', 'limit', 'differential', 'fundamental theorem'],
            biology: ['biology', 'cell', 'dna', 'protein', 'evolution', 'genetics', 'organism'],
            physics: ['physics', 'force', 'energy', 'momentum', 'wave', 'electromagnetic', 'quantum'],
            chemistry: ['chemistry', 'atom', 'molecule', 'reaction', 'bond', 'element'],
            algebra: ['algebra', 'equation', 'variable', 'polynomial', 'quadratic'],
            geometry: ['geometry', 'triangle', 'circle', 'angle', 'proof', 'theorem']
        };

        const messageLower = message.toLowerCase();
        
        for (const [topic, keywords] of Object.entries(topics)) {
            if (keywords.some(keyword => messageLower.includes(keyword))) {
                this.currentTopic = topic;
                return topic;
            }
        }

        return 'general';
    }

    requiresVerification(message) {
        // STEM topics that require human verification
        const verificationTopics = ['calculus', 'physics', 'chemistry', 'biology'];
        const topic = this.detectTopic(message);
        
        return verificationTopics.includes(topic) && Math.random() > 0.3; // 70% chance for demo
    }

    getVerifiedResponse(message) {
        const verifiers = [
            'Verified by MIT Mathematics Graduate',
            'Verified by Stanford Physics PhD',
            'Verified by Harvard Biology Professor',
            'Verified by Princeton Chemistry Expert',
            'Verified by Berkeley Engineering Faculty'
        ];

        const verifiedResponses = {
            calculus: [
                'The previous explanation is mathematically sound. I\'d add that understanding the geometric interpretation helps visualize why this theorem works.',
                'Correct approach. For students, I recommend practicing with both algebraic and geometric examples to build intuition.',
                'The explanation is accurate. This concept forms the foundation for advanced calculus, so mastering it is crucial.'
            ],
            physics: [
                'The physics explanation is correct. Real-world applications include everything from GPS satellites to particle accelerators.',
                'Accurate description. This principle underlies many engineering applications you encounter daily.',
                'Well explained. The mathematical formulation correctly represents the physical phenomenon.'
            ],
            biology: [
                'The biological explanation is scientifically accurate and follows current research understanding.',
                'Correct interpretation. This process is fundamental to understanding cellular function.',
                'The description aligns with established biological principles and recent discoveries.'
            ],
            general: [
                'The explanation is accurate and well-structured for student understanding.',
                'Verified as correct. The step-by-step approach will help students learn effectively.',
                'The information provided is reliable and pedagogically sound.'
            ]
        };

        const topic = this.currentTopic;
        const responses = verifiedResponses[topic] || verifiedResponses.general;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const randomVerifier = verifiers[Math.floor(Math.random() * verifiers.length)];

        return {
            content: randomResponse,
            verifier: randomVerifier
        };
    }

    reportMessage(button) {
        // Visual feedback
        const originalColor = button.style.color;
        const originalContent = button.innerHTML;
        
        button.style.color = '#dc2626';
        button.innerHTML = '<i class="fas fa-check"></i> Reported';

        // Show reporting modal
        setTimeout(() => {
            this.showReportModal();
            
            // Reset button after delay
            setTimeout(() => {
                button.style.color = originalColor;
                button.innerHTML = originalContent;
            }, 3000);
        }, 500);
    }

    showReportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Report Error</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <p>Help us improve by reporting what was incorrect:</p>
                    <form class="report-form">
                        <div class="form-group">
                            <label>Error Type:</label>
                            <select class="error-type">
                                <option value="factual">Factual Error</option>
                                <option value="calculation">Calculation Error</option>
                                <option value="explanation">Poor Explanation</option>
                                <option value="citation">Incorrect Citation</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea class="error-description" placeholder="Please describe the error..." rows="4"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Correct Information (optional):</label>
                            <textarea class="correct-info" placeholder="What should the correct answer be?" rows="3"></textarea>
                        </div>
                    </form>
                    <div class="report-info">
                        <i class="fas fa-info-circle"></i>
                        <span>Your feedback helps train our AI models and improve accuracy for all students.</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn primary" onclick="window.DemoChat.submitReport(); this.closest('.modal-overlay').remove();">Submit Report</button>
                    <button class="modal-btn" onclick="this.closest('.modal-overlay').remove();">Cancel</button>
                </div>
            </div>
        `;

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

    submitReport() {
        const errorType = document.querySelector('.error-type')?.value;
        const description = document.querySelector('.error-description')?.value;
        const correctInfo = document.querySelector('.correct-info')?.value;

        // Simulate report submission
        const report = {
            timestamp: new Date().toISOString(),
            errorType,
            description,
            correctInfo,
            messageContext: this.messages.slice(-3) // Last 3 messages for context
        };

        console.log('Error report submitted:', report);

        // Show success notification
        this.showNotification('Thank you! Your report has been submitted and will help improve our AI.', 'success');

        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'error_reported', {
                event_category: 'Quality',
                event_label: errorType
            });
        }
    }

    setProcessingState(button, processing) {
        this.isProcessing = processing;
        
        if (processing) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
        } else {
            button.innerHTML = 'Send';
            button.disabled = false;
        }
    }

    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
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
            z-index: 1000;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initializeResponseBank() {
        return {
            calculus: [
                {
                    keywords: ['fundamental theorem', 'FTC', 'theorem'],
                    response: 'The Fundamental Theorem of Calculus connects differentiation and integration. It has two parts:<br><br>1. If f is continuous on [a,b] and F is an antiderivative of f, then ∫ₐᵇ f(x)dx = F(b) - F(a)<br>2. If f is continuous on [a,b], then the function F(x) = ∫ₐˣ f(t)dt is continuous on [a,b] and differentiable on (a,b), and F\'(x) = f(x)<br><br>This theorem forms the basis for calculating definite integrals.',
                    citation: 'Source: Stewart\'s Calculus, 8th Ed. p. 320',
                    disclaimer: 'AI-generated explanation. Verify with textbook or teacher. This topic has been flagged for human verification.'
                },
                {
                    keywords: ['derivative', 'differentiation', 'slope'],
                    response: 'A derivative represents the instantaneous rate of change of a function at a specific point. Geometrically, it\'s the slope of the tangent line to the curve at that point.<br><br>For a function f(x), the derivative f\'(x) is defined as:<br>f\'(x) = lim(h→0) [f(x+h) - f(x)]/h<br><br>Common derivative rules include the power rule, product rule, quotient rule, and chain rule.',
                    citation: 'Source: Anton\'s Calculus, 11th Ed. Ch. 2',
                    disclaimer: 'AI-generated explanation. Please verify with your textbook.'
                },
                {
                    keywords: ['integral', 'integration', 'area'],
                    response: 'Integration is the reverse process of differentiation. A definite integral ∫ₐᵇ f(x)dx represents the signed area between the curve f(x) and the x-axis from x=a to x=b.<br><br>An indefinite integral ∫f(x)dx represents the family of all antiderivatives of f(x), written as F(x) + C where C is the constant of integration.',
                    citation: 'Source: Larson Calculus, 12th Ed. Ch. 4',
                    disclaimer: 'AI-generated explanation. Verify with textbook or teacher.'
                }
            ],
            biology: [
                {
                    keywords: ['DNA', 'gene', 'genetics'],
                    response: 'DNA (Deoxyribonucleic Acid) is the hereditary material in all living organisms. It consists of two complementary strands forming a double helix structure.<br><br>Key features:<br>• Four nitrogenous bases: Adenine (A), Thymine (T), Guanine (G), Cytosine (C)<br>• Base pairing rules: A-T and G-C<br>• Genes are specific DNA sequences that code for proteins<br>• DNA replication is semiconservative',
                    citation: 'Source: Campbell Biology, 12th Ed. Ch. 16',
                    disclaimer: 'AI-generated explanation. Consult your textbook for complete details.'
                }
            ],
            physics: [
                {
                    keywords: ['force', 'Newton', 'law'],
                    response: 'Newton\'s Laws of Motion describe the relationship between forces and motion:<br><br>1st Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force.<br><br>2nd Law: F = ma (Force equals mass times acceleration)<br><br>3rd Law: For every action, there is an equal and opposite reaction.',
                    citation: 'Source: Halliday, Resnick & Walker Physics, 12th Ed. Ch. 5',
                    disclaimer: 'AI-generated explanation. Verify with your physics textbook.'
                }
            ],
            general: [
                {
                    keywords: ['help', 'how', 'what', 'explain'],
                    response: 'I\'m here to help explain academic concepts! I can assist with mathematics, science, and other subjects. My responses include:<br><br>• Step-by-step explanations<br>• Textbook citations<br>• Verification by human experts when needed<br><br>What specific topic would you like to explore?',
                    citation: null,
                    disclaimer: 'This is a demo of our AI tutoring system. Full features available with NFT access.'
                }
            ]
        };
    }

    // Public methods
    clearChat() {
        const messagesContainer = document.querySelector('.demo-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            this.messages = [];
        }
    }

    exportChat() {
        const chatData = {
            timestamp: new Date().toISOString(),
            messages: this.messages,
            topic: this.currentTopic
        };
        
        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `studyprep-chat-${Date.now()}.json`;
        link.click();
    }
}

// Add demo chat styles
const chatStyles = document.createElement('style');
chatStyles.textContent = `
    .report-form .form-group {
        margin-bottom: 1rem;
    }
    .report-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
    }
    .report-form select,
    .report-form textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-family: inherit;
        font-size: 0.875rem;
        resize: vertical;
    }
    .report-form select:focus,
    .report-form textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .report-info {
        background: #f0f9ff;
        border: 1px solid #0ea5e9;
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        font-size: 0.875rem;
        color: #0c4a6e;
    }
    .demo-input input {
        resize: none;
        overflow-y: auto;
        min-height: 2.5rem;
        line-height: 1.4;
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
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(chatStyles);

// Initialize demo chat
const demoChat = new DemoChat();

// Export for global use
window.DemoChat = demoChat;