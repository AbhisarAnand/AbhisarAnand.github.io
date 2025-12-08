document.addEventListener('DOMContentLoaded', () => {

    // 0. Dark Mode Logic
    // Create Toggle Button
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.innerHTML = '🌙'; // Default moon
    btn.title = "Toggle Dark Mode";
    btn.onclick = toggleTheme;
    document.body.appendChild(btn); // Append to body for fixed positioning

    // Check Saved Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        btn.innerHTML = '☀️';
    }

    function toggleTheme() {
        const current = document.body.getAttribute('data-theme');
        const btn = document.querySelector('.theme-toggle');

        if (current === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            if (btn) btn.innerHTML = '🌙';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (btn) btn.innerHTML = '☀️';
        }
    }

    // 1. Scroll Fades
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));


    // 2. Navigation Scroll Effect
    const nav = document.querySelector('.nav-wrapper');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });


    // 3. Photography Loader
    const gallery = document.getElementById('gallery');
    if (gallery) {
        fetch('data/photos.json')
            .then(res => res.json())
            .then(data => {
                data.forEach(photo => {
                    const div = document.createElement('div');
                    div.className = 'photo-item fade-in-up';

                    const img = document.createElement('img');
                    img.src = photo.file;
                    img.alt = photo.title;

                    // Lightbox trigger
                    div.addEventListener('click', () => openLightbox(photo.file));

                    div.appendChild(img);
                    gallery.appendChild(div);
                    observer.observe(div); // Add fade to new item
                });
            })
            .catch(err => console.error('Could not load photos:', err));
    }


    // 4. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    function openLightbox(src) {
        if (!lightbox) return;
        lightboxImg.src = src;
        lightbox.classList.add('active');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    // 5. Timeline Expand Logic
    const timelineHeaders = document.querySelectorAll('.timeline-header');
    timelineHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // 6. Certifications Auto-Scroll (True Infinite Loop)
    const certContainer = document.querySelector('.horizontal-scroll-container');
    if (certContainer) {
        // Clone children for seamless loop
        const cards = Array.from(certContainer.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            certContainer.appendChild(clone);
        });

        let isHovered = false;
        const speed = 0.5; // Slow down for readability

        // Pause on hover
        certContainer.addEventListener('mouseenter', () => {
            isHovered = true;
            certContainer.style.scrollBehavior = 'smooth'; // Smooth manual scroll
        });
        certContainer.addEventListener('mouseleave', () => {
            isHovered = false;
            certContainer.style.scrollBehavior = 'auto'; // Instant auto scroll
        });

        function autoScroll() {
            if (!isHovered) {
                certContainer.scrollLeft += speed;

                // If we've scrolled past the first set of content
                // We use a small buffer (1px) to prevent jitter logic
                if (certContainer.scrollLeft >= (certContainer.scrollWidth / 2)) {
                    certContainer.scrollLeft = 0;
                }
            }
            requestAnimationFrame(autoScroll);
        }
        // Start auto scroll
        requestAnimationFrame(autoScroll);
    }


    // 7. Contact Form AJAX Submission
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(contactForm);

            // Change button text
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success: Hide form, show message
                    contactForm.style.display = 'none';
                    successMsg.style.display = 'block';
                    contactForm.reset();
                } else {
                    alert("Oops! There was a problem submitting your form.");
                }
            } catch (error) {
                alert("Oops! There was a problem submitting your form.");
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

});
