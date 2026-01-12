// Wait for deferred scripts to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Icons
    lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });

    // Initialize Lenis Scrolling
    const lenis = new Lenis({
        duration: 0.7, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical', smoothWheel: true, touchMultiplier: 2,
    });
    window.lenis = lenis; // Expose for scroll-to-top button
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Add js-ready class to enable CSS animation states
    document.body.classList.add('js-ready');

    // Loader Sequence - FASTER for better LCP (0.6s instead of 1.2s)
    const loaderTimeline = gsap.timeline();
    loaderTimeline.to("#loader-progress", {
        width: "100%", duration: 0.6, ease: "power2.inOut",
        onUpdate: function() { document.getElementById("loader-text").innerText = Math.round(this.progress() * 100) + "%"; }
    })
    .to("#loader", { yPercent: -100, duration: 0.4, ease: "power4.inOut", delay: 0.05, onComplete: () => ScrollTrigger.refresh() })
    
    // Wispr-Style Hero Reveal
    .to(".hero-glow", { opacity: 1, duration: 1.2, ease: "power2.out" }, "-=0.3")
    .to(".hero-char", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out"
    }, "-=0.8")
    .to(".hero-fade-in", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out"
    }, "-=0.5");

    // Text Flip effect for greetings
    const flipElement = document.getElementById('flip-text');
    if (flipElement) {
        const greetings = [
            'Welcome !',
            'Bienvenue !',
            'ようこそ !',
            'Bienvenido !',
            'Καλωσόρισες !',
            'Benvenuto !',
            'Bem-vindo !',
            'स्वागत है !'
        ];
        let greetingIndex = 0;
        
        function flipText() {
            const nextIndex = (greetingIndex + 1) % greetings.length;
            const nextText = greetings[nextIndex];
            
            // Animate out (flip up)
            gsap.to(flipElement, {
                rotationX: -90,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    // Change text
                    flipElement.querySelector('.text-flip-inner').textContent = nextText;
                    
                    // Reset position (below)
                    gsap.set(flipElement, { rotationX: 90 });
                    
                    // Animate in (flip down)
                    gsap.to(flipElement, {
                        rotationX: 0,
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            });
            
            greetingIndex = nextIndex;
        }
        
        // Start flipping after loader completes
        setTimeout(() => {
            setInterval(flipText, 3000);
        }, 1200);
    }

    // Selected Work Animation
    const workCards = document.querySelectorAll(".project-card, .section-title, .section-subtitle");
    gsap.from(workCards, {
        scrollTrigger: { 
            trigger: "#work", 
            start: "top 85%",
        },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
    });

    // Skills Section Animation (FIXED)
    const skillCards = gsap.utils.toArray('.skill-card');
    const skillHeader = gsap.utils.toArray('.skills-header');
    
    // Reveal Logic - Using .from() to ensure initial state is invisible regardless of CSS
    gsap.from(skillHeader, {
         scrollTrigger: {
            trigger: "#skills",
            start: "top 80%",
        },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out"
    });

    gsap.from(skillCards, {
        scrollTrigger: {
            trigger: "#skills",
            start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });

    // About & Experience Animation
    const aboutItems = document.querySelectorAll(".section-reveal");
    if(aboutItems.length > 0) {
        gsap.from(aboutItems, {
            scrollTrigger: { 
                trigger: "#about", 
                start: "top 80%",
            },
            y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
        });
    }

    // Contact Section Animation
    gsap.to(".contact-item", {
        scrollTrigger: {
            trigger: "#contact",
            start: "top 75%",
            toggleActions: "play none none reverse"
        },
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out"
    });

    // Cursor Logic (Desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorCircle = document.querySelector('.cursor-circle');
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0 }); });
        gsap.ticker.add(() => {
            cursorX += (mouseX - cursorX) * 0.2; cursorY += (mouseY - cursorY) * 0.2;
            cursorCircle.style.left = cursorX + 'px'; cursorCircle.style.top = cursorY + 'px';
        });
        document.querySelectorAll('a, button, .magnetic-btn, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
        });
    }

    // Magnetic Buttons
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2, duration: 0.2 });
        });
        btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }));
    });

    // Image Slider Logic
    document.querySelectorAll('[data-slider]').forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const slides = slider.querySelectorAll('.slider-slide');
        const dotsContainer = slider.querySelector('.slider-dots');
        const images = slider.querySelectorAll('.project-img');
        let currentIndex = 0;
        
        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('slider-btn', 'slider-btn-prev');
        prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6"/></svg>';
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
        });
        
        const nextBtn = document.createElement('button');
        nextBtn.classList.add('slider-btn', 'slider-btn-next');
        nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18l6-6-6-6"/></svg>';
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });
        
        slider.appendChild(prevBtn);
        slider.appendChild(nextBtn);
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        
        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            goToSlide(currentIndex);
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(currentIndex);
        }

        // Touch swipe functionality
        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let isSwiping = false;
        let isHorizontalSwipe = null; // null = undetermined, true = horizontal, false = vertical
        const swipeThreshold = 50; // Minimum distance to trigger slide change
        const directionLockThreshold = 10; // Distance to determine swipe direction

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchCurrentX = touchStartX;
            isSwiping = true;
            isHorizontalSwipe = null;
            track.style.transition = 'none'; // Disable transition during drag
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            
            touchCurrentX = e.touches[0].clientX;
            const touchCurrentY = e.touches[0].clientY;
            const deltaX = touchCurrentX - touchStartX;
            const deltaY = touchCurrentY - touchStartY;
            
            // Determine swipe direction if not yet determined
            if (isHorizontalSwipe === null && (Math.abs(deltaX) > directionLockThreshold || Math.abs(deltaY) > directionLockThreshold)) {
                isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
            }
            
            // Only handle horizontal swipes
            if (isHorizontalSwipe) {
                e.preventDefault(); // Prevent vertical scroll when swiping horizontally
                
                // Calculate the drag offset with resistance at edges
                let dragOffset = deltaX;
                
                // Add resistance at the edges
                if ((currentIndex === 0 && deltaX > 0) || 
                    (currentIndex === slides.length - 1 && deltaX < 0)) {
                    dragOffset = deltaX * 0.3; // Reduce movement at edges
                }
                
                // Apply the drag transform
                const baseOffset = -currentIndex * 100;
                const dragPercent = (dragOffset / slider.offsetWidth) * 100;
                track.style.transform = `translateX(${baseOffset + dragPercent}%)`;
            }
        }, { passive: false });

        slider.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            isSwiping = false;
            
            // Re-enable transition
            track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
            
            // Only process if it was a horizontal swipe
            if (isHorizontalSwipe) {
                const deltaX = touchCurrentX - touchStartX;
                
                // Determine if swipe was significant enough
                if (Math.abs(deltaX) > swipeThreshold) {
                    if (deltaX < 0 && currentIndex < slides.length - 1) {
                        // Swipe left - go to next slide
                        nextSlide();
                    } else if (deltaX > 0 && currentIndex > 0) {
                        // Swipe right - go to previous slide
                        prevSlide();
                    } else {
                        // At edge, snap back
                        goToSlide(currentIndex);
                    }
                } else {
                    // Swipe wasn't significant, snap back to current slide
                    goToSlide(currentIndex);
                }
            }
            
            isHorizontalSwipe = null;
        }, { passive: true });

        // Handle touch cancel (e.g., if user scrolls away)
        slider.addEventListener('touchcancel', () => {
            if (isSwiping) {
                isSwiping = false;
                isHorizontalSwipe = null;
                track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
                goToSlide(currentIndex);
            }
        }, { passive: true });

        // Mobile scroll-based color reveal for slider images
        // Only apply on touch devices (mobile/tablet)
        if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) {
            // Remove the default grayscale classes since we'll control via JS
            images.forEach(img => {
                img.classList.remove('grayscale', 'group-hover:grayscale-0');
                img.style.filter = 'grayscale(100%)';
                img.style.transition = 'filter 0.5s ease';
            });

            // Create ScrollTrigger for this slider
            ScrollTrigger.create({
                trigger: slider,
                start: "top 70%",
                end: "bottom 30%",
                onUpdate: (self) => {
                    // Calculate how centered the element is (0 = entering, 0.5 = centered, 1 = leaving)
                    const progress = self.progress;
                    // Create a bell curve: max color at center (progress = 0.5)
                    const centeredness = 1 - Math.abs(progress - 0.5) * 2;
                    const grayscaleValue = Math.max(0, 100 - (centeredness * 100));
                    
                    images.forEach(img => {
                        img.style.filter = `grayscale(${grayscaleValue}%)`;
                    });
                },
                onLeave: () => {
                    images.forEach(img => {
                        img.style.filter = 'grayscale(100%)';
                    });
                },
                onLeaveBack: () => {
                    images.forEach(img => {
                        img.style.filter = 'grayscale(100%)';
                    });
                }
            });
        }
    });

}); // End DOMContentLoaded

// Modal Logic (global scope for onclick handlers)
let scrollPosition = 0;

// Handle wheel events on modal scroll areas
function handleModalWheel(e) {
    const scrollArea = e.currentTarget;
    scrollArea.scrollTop += e.deltaY;
    e.preventDefault();
    e.stopPropagation();
}

function openModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if(!modal) return;
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    const scrollArea = modal.querySelector('.modal-scroll-area');
    
    // Store scroll position and stop Lenis
    scrollPosition = window.scrollY;
    if(window.lenis) window.lenis.destroy();

    modal.style.pointerEvents = 'auto';
    document.body.classList.add('modal-open');
    
    // Add wheel event listener for desktop scrolling
    if(scrollArea) {
        scrollArea.addEventListener('wheel', handleModalWheel, { passive: false });
    }
    
    gsap.to(backdrop, { opacity: 1, duration: 0.3 });
    gsap.to(content, { opacity: 1, scale: 1, duration: 0.4, ease: "spring" });
}

function closeModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if(!modal) return;
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    const scrollArea = modal.querySelector('.modal-scroll-area');

    // Remove event listeners
    if(scrollArea) {
        scrollArea.removeEventListener('wheel', handleModalWheel);
        scrollArea.scrollTop = 0;
    }

    gsap.to(backdrop, { opacity: 0, duration: 0.3 });
    gsap.to(content, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => {
        modal.style.pointerEvents = 'none';
        document.body.classList.remove('modal-open');
        
        // Recreate Lenis
        window.lenis = new Lenis({
            duration: 0.7,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });
        function raf(time) { window.lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        
        window.scrollTo(0, scrollPosition);
    }});
}

// Ensure triggers are recalculated after page load
window.addEventListener('load', () => {
    if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});


