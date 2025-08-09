// Navigation and Page System
class NavigationSystem {
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'subjects', 'nft-marketplace', 'how-it-works', 'for-tutors'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Navigation links
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavigation(e));
            });

            // Hero buttons
            const tryFreeBtn = document.querySelector('.btn-primary');
            const exploreNFTsBtn = document.querySelector('.btn-secondary');

            if (tryFreeBtn) {
                tryFreeBtn.addEventListener('click', (e) => this.handleTryFree(e));
            }

            if (exploreNFTsBtn) {
                exploreNFTsBtn.addEventListener('click', (e) => this.handleExploreNFTs(e));
            }

            // Footer links
            const footerLinks = document.querySelectorAll('.footer-links a');
            footerLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleFooterNavigation(e));
            });

            // Logo click
            const logo = document.querySelector('.logo');
            if (logo) {
                logo.addEventListener('click', (e) => this.handleLogoClick(e));
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => this.handlePopState(e));
        
        // Handle scroll for header background
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleNavigation(event) {
        event.preventDefault();
        const link = event.target.closest('a');
        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        // Update active state
        this.updateActiveNavLink(link);

        // Handle different navigation types
        switch(text.toLowerCase()) {
            case 'home':
                this.scrollToTop();
                this.showSection('home');
                break;
            
            case 'subjects':
                this.showSubjectsModal();
                break;
            
            case 'nft marketplace':
                this.scrollToSection('.nft-portal');
                this.showSection('nft-marketplace');
                break;
            
            case 'how it works':
                this.scrollToSection('.demo-container');
                this.showSection('how-it-works');
                break;
            
            case 'for tutors':
                this.showTutorModal();
                break;
            
            default:
                if (href && href.startsWith('#')) {
                    this.scrollToSection(href);
                }
        }

        // Analytics
        this.trackNavigation(text);
    }

    handleTryFree(event) {
        event.preventDefault();
        
        // Show free question modal
        this.showFreeQuestionModal();
        
        // Analytics
        this.trackButtonClick('try_free_question');
    }

    handleExploreNFTs(event) {
        event.preventDefault();
        
        // Scroll to NFT section with animation
        this.scrollToSection('.nft-portal', () => {
            // Highlight NFT cards
            this.highlightNFTCards();
        });
        
        // Analytics
        this.trackButtonClick('explore_nfts');
    }

    handleFooterNavigation(event) {
        event.preventDefault();
        const link = event.target;
        const text = link.textContent.trim();

        // Handle different footer links
        switch(text.toLowerCase()) {
            case 'terms of service':
                this.showLegalModal('Terms of Service', this.getTermsContent());
                break;
            
            case 'privacy policy':
                this.showLegalModal('Privacy Policy', this.getPrivacyContent());
                break;
            
            case 'copyright compliance':
                this.showLegalModal('Copyright Compliance', this.getCopyrightContent());
                break;
            
            case 'gdpr portal':
                this.showGDPRModal();
                break;
            
            case 'academic integrity policy':
                this.showLegalModal('Academic Integrity Policy', this.getIntegrityContent());
                break;
            
            case 'become a verifier':
                this.showVerifierModal();
                break;
            
            case 'support center':
                this.showSupportModal();
                break;
            
            default:
                this.showComingSoonModal(text);
        }
    }

    handleLogoClick(event) {
        event.preventDefault();
        this.scrollToTop();
        this.updateActiveNavLink(document.querySelector('.nav-links a'));
    }

    updateActiveNavLink(activeLink) {
        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    scrollToSection(selector, callback) {
        const element = document.querySelector(selector);
        if (!element) return;

        // Smooth scroll with offset for header
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Execute callback after scroll
        if (callback) {
            setTimeout(callback, 800);
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    showSection(sectionName) {
        this.currentSection = sectionName;
        
        // Update URL without page reload
        const newUrl = sectionName === 'home' ? '/' : `#${sectionName}`;
        history.pushState({ section: sectionName }, '', newUrl);
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id], .hero, .nft-portal');
        const navLinks = document.querySelectorAll('.nav-links a');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id || entry.target.className;
                    this.updateActiveNavFromScroll(sectionId);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    updateActiveNavFromScroll(sectionId) {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));

        // Map section IDs to nav links
        const sectionNavMap = {
            'hero': 0,
            'features': 0,
            'nft-portal': 2,
            'demo': 3
        };

        const linkIndex = sectionNavMap[sectionId];
        if (linkIndex !== undefined && navLinks[linkIndex]) {
            navLinks[linkIndex].classList.add('active');
        }
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToSection(anchor.getAttribute('href'));
                }
            });
        });
    }

    setupMobileMenu() {
        // Mobile menu functionality (if needed later)
        const mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuToggle.style.display = 'none';

        // Add to header
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            headerContent.appendChild(mobileMenuToggle);
        }

        // Toggle functionality
        mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
    }

    handleScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        const scrolled = window.scrollY > 20;
        
        if (scrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    showSubjectsModal() {
        const subjects = [
            { name: 'Mathematics', icon: 'calculator', topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics'] },
            { name: 'Sciences', icon: 'flask', topics: ['Physics', 'Chemistry', 'Biology', 'Earth Science'] },
            { name: 'Computer Science', icon: 'laptop-code', topics: ['Programming', 'Data Structures', 'Algorithms', 'Web Development'] },
            { name: 'Languages', icon: 'language', topics: ['English', 'Spanish', 'French', 'Literature'] },
            { name: 'Social Studies', icon: 'globe', topics: ['History', 'Geography', 'Economics', 'Psychology'] },
            { name: 'Test Prep', icon: 'graduation-cap', topics: ['SAT', 'ACT', 'AP Exams', 'GRE'] }
        ];

        const subjectsGrid = subjects.map(subject => `
            <div class="subject-card" onclick="window.NavigationSystem.exploreSubject('${subject.name}')">
                <div class="subject-icon">
                    <i class="fas fa-${subject.icon}"></i>
                </div>
                <h4>${subject.name}</h4>
                <ul class="subject-topics">
                    ${subject.topics.map(topic => `<li>${topic}</li>`).join('')}
                </ul>
                <div class="subject-action">
                    <span>Explore ${subject.topics.length} topics</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        `).join('');

        this.showModal('Available Subjects', `
            <div class="subjects-intro">
                <p>Explore our comprehensive curriculum across multiple subjects, all with AI-powered explanations and human verification.</p>
            </div>
            <div class="subjects-grid">${subjectsGrid}</div>
        `, [
            { text: 'Close', action: () => {} }
        ], 'large');
    }

    showFreeQuestionModal() {
        this.showModal('Try a Free Question', `
            <div class="free-question-demo">
                <div class="demo-question">
                    <h4>Sample Question:</h4>
                    <p><strong>Calculus:</strong> Find the derivative of f(x) = 3x² + 2x - 1</p>
                    
                    <div class="demo-solution">
                        <h5>AI Solution:</h5>
                        <p>Using the power rule and sum rule:</p>
                        <p>f'(x) = d/dx(3x²) + d/dx(2x) - d/dx(1)</p>
                        <p>f'(x) = 6x + 2 - 0</p>
                        <p><strong>Answer: f'(x) = 6x + 2</strong></p>
                        
                        <div class="verification-badge">
                            <i class="fas fa-badge-check"></i>
                            Verified by Stanford Mathematics PhD
                        </div>
                    </div>
                </div>
                
                <div class="try-your-question">
                    <h4>Ask Your Own Question:</h4>
                    <textarea placeholder="Enter your question here..." rows="3"></textarea>
                    <button class="ask-question-btn" onclick="window.NavigationSystem.processFreeSolution()">
                        <i class="fas fa-paper-plane"></i>
                        Get AI Solution
                    </button>
                </div>
                
                <div class="upgrade-notice">
                    <div class="notice-content">
                        <i class="fas fa-crown"></i>
                        <div>
                            <h5>Unlock Premium Features</h5>
                            <p>Get unlimited questions, detailed explanations, and premium content with our NFT passes.</p>
                        </div>
                    </div>
                    <button class="upgrade-btn" onclick="window.NavigationSystem.scrollToSection('.nft-portal'); document.querySelector('.modal-overlay').remove();">
                        View NFT Passes
                    </button>
                </div>
            </div>
        `, [
            { text: 'Close', action: () => {} }
        ], 'large');
    }

    processFreeSolution() {
        const textarea = document.querySelector('.try-your-question textarea');
        const button = document.querySelector('.ask-question-btn');
        
        if (!textarea.value.trim()) {
            this.showNotification('Please enter a question first.', 'warning');
            return;
        }

        // Show processing state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;

        // Simulate AI processing
        setTimeout(() => {
            const solution = document.createElement('div');
            solution.className = 'generated-solution';
            solution.innerHTML = `
                <div class="solution-header">
                    <i class="fas fa-robot"></i>
                    <span>AI Generated Solution</span>
                </div>
                <p>Thank you for your question! This is a demo of our AI tutoring system.</p>
                <p>For detailed, step-by-step solutions with human verification, please connect your wallet and explore our NFT passes.</p>
                <div class="solution-disclaimer">
                    <i class="fas fa-info-circle"></i>
                    <span>Full AI solutions available with premium access</span>
                </div>
            `;

            textarea.parentNode.insertBefore(solution, textarea.nextSibling);
            
            button.innerHTML = '<i class="fas fa-paper-plane"></i> Get AI Solution';
            button.disabled = false;
            
            // Scroll to show solution
            solution.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        }, 2000);
    }

    showTutorModal() {
        this.showModal('Become a Tutor', `
            <div class="tutor-application">
                <div class="tutor-benefits">
                    <h4>Why Join Our Tutor Network?</h4>
                    <ul>
                        <li><i class="fas fa-dollar-sign"></i> Earn cryptocurrency for verified solutions</li>
                        <li><i class="fas fa-clock"></i> Flexible schedule - work when you want</li>
                        <li><i class="fas fa-graduation-cap"></i> Share knowledge with students worldwide</li>
                        <li><i class="fas fa-shield-alt"></i> Build your reputation in our community</li>
                    </ul>
                </div>
                
                <div class="tutor-requirements">
                    <h4>Requirements:</h4>
                    <ul>
                        <li>Graduate degree in relevant subject</li>
                        <li>Teaching or tutoring experience</li>
                        <li>Strong communication skills</li>
                        <li>Commitment to academic integrity</li>
                    </ul>
                </div>
                
                <div class="application-form">
                    <h4>Quick Application:</h4>
                    <form class="tutor-form">
                        <input type="text" placeholder="Full Name" required>
                        <input type="email" placeholder="Email Address" required>
                        <select required>
                            <option value="">Select Subject Area</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="physics">Physics</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="biology">Biology</option>
                            <option value="computer-science">Computer Science</option>
                        </select>
                        <input type="text" placeholder="Highest Degree & Institution">
                        <textarea placeholder="Brief description of your teaching experience" rows="3"></textarea>
                    </form>
                </div>
            </div>
        `, [
            { text: 'Submit Application', action: () => this.submitTutorApplication(), primary: true },
            { text: 'Learn More', action: () => this.showDetailedTutorInfo() },
            { text: 'Close', action: () => {} }
        ], 'large');
    }

    submitTutorApplication() {
        // Collect form data
        const form = document.querySelector('.tutor-form');
        const formData = new FormData(form);
        
        // Show success message
        this.showNotification('Application submitted successfully! We\'ll review and contact you within 48 hours.', 'success');
        
        // Close modal
        document.querySelector('.modal-overlay').remove();
        
        // Analytics
        this.trackButtonClick('tutor_application_submitted');
    }

    highlightNFTCards() {
        const nftCards = document.querySelectorAll('.nft-card');
        nftCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.2)';
                
                setTimeout(() => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }, 1000);
            }, index * 200);
        });
    }

    // Utility methods
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
                        `<button class="modal-btn ${btn.primary ? 'primary' : ''}" onclick="${btn.action.toString()}; if(!this.classList.contains('no-close')) this.closest('.modal-overlay').remove();">
                            ${btn.text}
                        </button>`
                    ).join('')}
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

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
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
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
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

    trackNavigation(section) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'navigation', {
                event_category: 'Navigation',
                event_label: section
            });
        }
    }

    trackButtonClick(buttonName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'button_click', {
                event_category: 'Engagement',
                event_label: buttonName
            });
        }
    }

    showComingSoonModal(feature) {
        this.showModal('Coming Soon', `
            <div class="coming-soon-content">
                <div class="coming-soon-icon">
                    <i class="fas fa-rocket"></i>
                </div>
                <h4>${feature}</h4>
                <p>We're working hard to bring you this feature. Stay tuned!</p>
                <div class="notify-form">
                    <input type="email" placeholder="Enter your email for updates">
                    <button onclick="window.NavigationSystem.subscribeUpdates(this)">Notify Me</button>
                </div>
            </div>
        `, [
            { text: 'Close', action: () => {} }
        ]);
    }

    subscribeUpdates(button) {
        const email = button.previousElementSibling.value;
        if (!email) {
            this.showNotification('Please enter your email address.', 'warning');
            return;
        }

        button.innerHTML = 'Subscribed!';
        button.disabled = true;
        this.showNotification('You\'ll be notified when this feature is available!', 'success');
    }

    // Content methods for legal modals
    getTermsContent() {
        return `
            <div class="legal-content">
                <h4>Terms of Service</h4>
                <p><strong>Last updated:</strong> January 2025</p>
                
                <section>
                    <h5>1. Educational Purpose</h5>
                    <p>StudyPrep AI is an educational platform designed to supplement traditional learning. Our content is for study assistance only and should not replace official curriculum or textbooks.</p>
                </section>
                
                <section>
                    <h5>2. NFT Access</h5>
                    <p>NFT passes grant access to premium educational content. NFTs have no inherent investment value and are purely functional tokens for platform access.</p>
                </section>
                
                <section>
                    <h5>3. AI-Generated Content</h5>
                    <p>AI-generated explanations should be verified with official sources. We provide human verification for critical STEM topics but cannot guarantee 100% accuracy.</p>
                </section>
                
                <section>
                    <h5>4. Academic Integrity</h5>
                    <p>Users must maintain academic integrity. Our platform is for learning assistance, not for submitting work as your own.</p>
                </section>
            </div>
        `;
    }

    getPrivacyContent() {
        return `
            <div class="legal-content">
                <h4>Privacy Policy</h4>
                <p><strong>Last updated:</strong> January 2025</p>
                
                <section>
                    <h5>Data We Collect</h5>
                    <p>We collect minimal data through wallet connections only. No personal information is stored on our servers.</p>
                </section>
                
                <section>
                    <h5>Wallet Data</h5>
                    <p>We only access your wallet address for NFT verification. Private keys remain secure in your wallet.</p>
                </section>
                
                <section>
                    <h5>Usage Analytics</h5>
                    <p>Anonymous usage data helps improve our platform. No personally identifiable information is collected.</p>
                </section>
                
                <section>
                    <h5>GDPR Compliance</h5>
                    <p>We are fully GDPR compliant. Users can request data deletion at any time through our GDPR portal.</p>
                </section>
            </div>
        `;
    }

    getCopyrightContent() {
        return `
            <div class="legal-content">
                <h4>Copyright Compliance</h4>
                
                <section>
                    <h5>Educational Fair Use</h5>
                    <p>All content follows educational fair use guidelines. We cite sources and limit excerpts to educational commentary.</p>
                </section>
                
                <section>
                    <h5>Original Content</h5>
                    <p>AI-generated explanations and human verifications are our original educational content.</p>
                </section>
                
                <section>
                    <h5>Textbook Citations</h5>
                    <p>We properly cite all referenced textbooks and educational materials according to academic standards.</p>
                </section>
                
                <section>
                    <h5>DMCA Policy</h5>
                    <p>We respond promptly to valid DMCA takedown requests. Contact us if you believe your copyright has been infringed.</p>
                </section>
            </div>
        `;
    }

    getIntegrityContent() {
        return `
            <div class="legal-content">
                <h4>Academic Integrity Policy</h4>
                
                <section>
                    <h5>Learning Assistance Only</h5>
                    <p>Our platform provides learning assistance and explanations to help you understand concepts, not to complete assignments for you.</p>
                </section>
                
                <section>
                    <h5>Prohibited Uses</h5>
                    <ul>
                        <li>Submitting our content as your own work</li>
                        <li>Using solutions without understanding</li>
                        <li>Violating your institution's honor code</li>
                        <li>Sharing copyrighted content</li>
                    </ul>
                </section>
                
                <section>
                    <h5>Verification System</h5>
                    <p>Our human verification system ensures accuracy but users are responsible for confirming information with official sources.</p>
                </section>
            </div>
        `;
    }
}

// Add navigation styles
const navStyles = document.createElement('style');
navStyles.textContent = `
    .nav-links a.active {
        color: #2563eb;
        font-weight: 600;
    }
    
    .nav-links a.active::after {
        width: 100%;
    }
    
    header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .subjects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
    
    .subject-card {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 1rem;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .subject-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-color: #2563eb;
    }
    
    .subject-icon {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }
    
    .subject-topics {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
    }
    
    .subject-topics li {
        padding: 0.25rem 0;
        color: #6b7280;
        font-size: 0.875rem;
    }
    
    .subject-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        color: #2563eb;
        font-weight: 500;
        font-size: 0.875rem;
    }
    
    .free-question-demo {
        max-width: 600px;
    }
    
    .demo-question {
        background: #f0f9ff;
        border-radius: 1rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .demo-solution {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e0f2fe;
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
    
    .try-your-question textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-family: inherit;
        resize: vertical;
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
        padding: 1.5rem;
        margin-top: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .notice-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notice-content i {
        font-size: 2rem;
    }
    
    .upgrade-btn {
        background: white;
        color: #7c3aed;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .generated-solution {
        background: #f3f4f6;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .solution-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #374151;
    }
    
    .solution-disclaimer {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
    }
    
    .tutor-application {
        max-width: 600px;
    }
    
    .tutor-benefits,
    .tutor-requirements {
        margin-bottom: 2rem;
    }
    
    .tutor-benefits ul,
    .tutor-requirements ul {
        list-style: none;
        padding: 0;
    }
    
    .tutor-benefits li,
    .tutor-requirements li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: #374151;
    }
    
    .tutor-benefits i {
        color: #059669;
    }
    
    .tutor-form {
        display: grid;
        gap: 1rem;
    }
    
    .tutor-form input,
    .tutor-form select,
    .tutor-form textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-family: inherit;
    }
    
    .coming-soon-content {
        text-align: center;
        max-width: 400px;
    }
    
    .coming-soon-icon {
        font-size: 4rem;
        color: #2563eb;
        margin-bottom: 1rem;
    }
    
    .notify-form {
        display: flex;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }
    
    .notify-form input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
    }
    
    .notify-form button {
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
    }
    
    .legal-content {
        max-width: 600px;
        max-height: 60vh;
        overflow-y: auto;
    }
    
    .legal-content section {
        margin-bottom: 1.5rem;
    }
    
    .legal-content h5 {
        color: #374151;
        margin-bottom: 0.5rem;
    }
    
    .legal-content ul {
        padding-left: 1.5rem;
    }
    
    .legal-content li {
        margin-bottom: 0.25rem;
    }
    
    @media (max-width: 768px) {
        .subjects-grid {
            grid-template-columns: 1fr;
        }
        
        .upgrade-notice {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
        
        .notify-form {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(navStyles);

// Initialize navigation system
const navigationSystem = new NavigationSystem();

// Export for global use
window.NavigationSystem = navigationSystem;