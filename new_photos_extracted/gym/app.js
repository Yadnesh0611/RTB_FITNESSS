/* ==========================================================================
   RAISE THE BAR LADIES GYM - INTERACTIVITY & CONVERSION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        revealElements.forEach(el => el.classList.add('active'));
    }

    // ----------------------------------------------------------------------
    // 2. ANIMATED NUMERICAL STATS COUNTER
    // ----------------------------------------------------------------------
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countStarted = false;

    function startCounting() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds animation
            let current = 0;
            
            // Adjust step increment and frequency based on the target size
            const increment = target > 200 ? Math.ceil(target / 80) : 1;
            const intervalTime = target > 200 ? 25 : Math.floor(duration / target);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = current;
                }
            }, intervalTime);
        });
    }

    if ('IntersectionObserver' in window && statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countStarted) {
                    countStarted = true;
                    startCounting();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        
        statsObserver.observe(statsSection);
    } else {
        // Fallback
        startCounting();
    }

    // ----------------------------------------------------------------------
    // 3. INTERACTIVE BEFORE-AFTER SLIDER
    // ----------------------------------------------------------------------
    const baSlider = document.getElementById('baSlider');
    const afterContainer = document.getElementById('afterContainer');
    const sliderHandle = document.getElementById('sliderHandle');

    if (baSlider && afterContainer && sliderHandle) {
        let isDragging = false;
        const afterImg = afterContainer.querySelector('img');

        function resizeSliderImage() {
            if (afterImg) {
                afterImg.style.width = `${baSlider.offsetWidth}px`;
            }
        }

        // Initialize and listen to resize
        resizeSliderImage();
        window.addEventListener('resize', resizeSliderImage);

        // Run once DOM is fully drawn (slight delay to ensure offsetWidth is populated)
        setTimeout(resizeSliderImage, 100);

        function moveSlider(clientX) {
            const rect = baSlider.getBoundingClientRect();
            const x = clientX - rect.left;
            let percentage = (x / rect.width) * 100;
            
            // Clamp values between 0% and 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            
            afterContainer.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        }

        // Mouse Events
        sliderHandle.addEventListener('mousedown', () => { isDragging = true; });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });

        // Touch Events for Mobile Responsiveness
        sliderHandle.addEventListener('touchstart', () => { isDragging = true; });
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlider(e.touches[0].clientX);
        });

        // Allow direct click on the container to move slide division
        baSlider.addEventListener('click', (e) => {
            if (e.target === sliderHandle || sliderHandle.contains(e.target)) return;
            moveSlider(e.clientX);
        });
    }

    // ----------------------------------------------------------------------
    // 4. TESTIMONIALS SLIDER
    // ----------------------------------------------------------------------
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = Array.from(track.children);
        let currentIndex = 0;
        
        // Generate Navigation dots dynamic elements
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsContainer.appendChild(dot);
        });
        
        const dots = Array.from(dotsContainer.children);
        
        function updateDots(index) {
            dots.forEach((dot, i) => {
                if (i === index) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
        
        function moveToSlide(index) {
            if (index < 0) index = cards.length - 1;
            if (index >= cards.length) index = 0;
            
            track.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateDots(index);
        }
        
        nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
        
        // Auto transition slides every 6.5 seconds
        let autoPlay = setInterval(() => moveToSlide(currentIndex + 1), 6500);
        
        // Pause auto play on hover interaction
        const sliderContainer = document.querySelector('.testimonials-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlay));
            sliderContainer.addEventListener('mouseleave', () => {
                autoPlay = setInterval(() => moveToSlide(currentIndex + 1), 6500);
            });
        }
    }

    // ----------------------------------------------------------------------
    // 5. FAQ ACCORDION TOGGLES
    // ----------------------------------------------------------------------
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const answer = q.nextElementSibling;
            const isActive = item.classList.contains('active');
            
            // Close all open FAQs
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Open clicked FAQ if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ----------------------------------------------------------------------
    // 6. TICKET GENERATION AND BOOKING MODALS
    // ----------------------------------------------------------------------
    const bookingModal = document.getElementById('bookingModal');
    const successModal = document.getElementById('successModal');
    const lightboxModal = document.getElementById('lightboxModal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    
    const modalClose = document.getElementById('modalClose');
    const successClose = document.getElementById('successClose');
    const successDoneBtn = document.getElementById('successDoneBtn');
    
    // Forms
    const heroForm = document.getElementById('heroTrialForm');
    const contactForm = document.getElementById('contactForm');
    const modalForm = document.getElementById('modalForm');
    
    // Ticket HTML elements
    const ticketIdEl = document.getElementById('ticketId');
    const ticketNameEl = document.getElementById('ticketName');
    const ticketGoalEl = document.getElementById('ticketGoal');
    const ticketSlotEl = document.getElementById('ticketSlot');

    function openModal(modal) {
        modal.classList.add('active');
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal(bookingModal));
    });

    if (modalClose) modalClose.addEventListener('click', () => closeModal(bookingModal));
    if (successClose) successClose.addEventListener('click', () => closeModal(successModal));
    if (successDoneBtn) successDoneBtn.addEventListener('click', () => closeModal(successModal));

    // Close Modals when clicking outside boundaries
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal(bookingModal);
        if (e.target === successModal) closeModal(successModal);
        if (e.target === lightboxModal) closeModal(lightboxModal);
    });

    // Generate random Ticket ID
    function generateTicketId() {
        const randNum = Math.floor(10000 + Math.random() * 90000);
        return `RTB-${randNum}`;
    }

    // Success State Modal Trigger
    function triggerSuccessTicket(name, goal, slot = 'Confirm on Call') {
        ticketIdEl.textContent = generateTicketId();
        ticketNameEl.textContent = name;
        ticketGoalEl.textContent = goal;
        ticketSlotEl.textContent = slot;
        
        closeModal(bookingModal);
        openModal(successModal);
    }

    // Form Submissions
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = heroForm.querySelector('input[type="text"]').value;
            const goalSelect = heroForm.querySelector('select');
            const goalText = goalSelect.options[goalSelect.selectedIndex].text;
            
            triggerSuccessTicket(name, goalText, 'Morning/Evening (Flexible)');
            heroForm.reset();
        });
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('modalName').value;
            const goalSelect = document.getElementById('modalGoal');
            const goalText = goalSelect.options[goalSelect.selectedIndex].text;
            const slotSelect = document.getElementById('modalTime');
            const slotText = slotSelect.options[slotSelect.selectedIndex].text;
            
            triggerSuccessTicket(name, goalText, slotText);
            modalForm.reset();
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const goalSelect = document.getElementById('program');
            const goalText = goalSelect.options[goalSelect.selectedIndex].text;
            
            triggerSuccessTicket(name, goalText, 'Contact via Phone');
            contactForm.reset();
        });
    }

    // ----------------------------------------------------------------------
    // 7. LIGHTBOX GALLERY
    // ----------------------------------------------------------------------
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    window.openLightbox = function(imageSrc) {
        if (lightboxModal && lightboxImage) {
            lightboxImage.src = imageSrc;
            openModal(lightboxModal);
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => closeModal(lightboxModal));
    }

    // ----------------------------------------------------------------------
    // 8. MOBILE HAMBURGER NAVIGATION DRAWER
    // ----------------------------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});
