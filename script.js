// Modern Design JavaScript Implementation

// Wallet connection functionality with modern UI feedback
document.addEventListener('DOMContentLoaded', function() {
    const walletBtn = document.querySelector('.wallet-btn');
    if (walletBtn) {
        walletBtn.addEventListener('click', () => {
            // Add loading state
            walletBtn.style.transform = 'scale(0.98)';
            walletBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            
            // Simulate connection (replace with actual Web3Modal integration)
            setTimeout(() => {
                walletBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
                walletBtn.style.transform = '';
                alert('Wallet connection modal would appear here. Integration with Web3Modal for multi-wallet support.');
            }, 1000);
        });
    }

    // Error reporting with modern feedback
    document.querySelectorAll('.report-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Add visual feedback
            this.style.color = '#ef4444';
            this.innerHTML = '<i class="fas fa-check"></i> Reported';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.style.color = '';
                this.innerHTML = '<i class="fas fa-flag"></i> Report Error';
                alert('Error reporting modal would open. Users can categorize errors for model retraining.');
            }, 2000);
        });
    });

    // Modern scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add fade-in animation to cards
    document.querySelectorAll('.feature-card, .nft-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Modern demo input functionality
    const demoInput = document.querySelector('.demo-input input');
    const demoBtn = document.querySelector('.demo-input button');
    
    if (demoInput && demoBtn) {
        demoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendDemoMessage();
            }
        });
        
        demoBtn.addEventListener('click', sendDemoMessage);
    }

    function sendDemoMessage() {
        const input = document.querySelector('.demo-input input');
        if (input.value.trim()) {
            // Add loading state
            demoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            demoBtn.disabled = true;
            
            // Simulate processing
            setTimeout(() => {
                demoBtn.innerHTML = 'Send';
                demoBtn.disabled = false;
                input.value = '';
                alert('Demo message sent! In a real implementation, this would add the message to the chat.');
            }, 1500);
        }
    }

    // Modern smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add modern loading states to NFT buttons
    document.querySelectorAll('.nft-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.style.pointerEvents = 'none';
            
            // Simulate transaction
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
                alert('NFT minting process would start here. Integration with Web3 wallet required.');
            }, 2000);
        });
    });
});