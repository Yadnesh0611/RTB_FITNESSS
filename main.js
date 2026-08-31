/* ==========================================================================
   RAISE THE BAR (RTB) DANCE & FITNESS STUDIO — INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. STICKY GLASS NAVIGATION SCROLL EFFECT */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // ScrollSpy active link update
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');

      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });


  /* 2. MOBILE MENU DRAWER */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {

    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');

      const icon = mobileToggle.querySelector('i');

      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars-staggered');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars-staggered');
        }
      }
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');

        const icon = mobileToggle.querySelector('i');

        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars-staggered');
        }
      });
    });
  }


  /* 3. BEFORE & AFTER TRANSFORMATION COMPARISON SLIDER */
  const slider = document.getElementById('comparisonSlider');
  const beforeImage = slider
    ? slider.querySelector('.image-before')
    : null;
  const handle = document.getElementById('sliderHandle');

  if (slider && beforeImage && handle) {

    let isDragging = false;

    const setSliderPosition = (x) => {
      const rect = slider.getBoundingClientRect();

      let position = x - rect.left;

      if (position < 0) position = 0;
      if (position > rect.width) position = rect.width;

      const percentage = (position / rect.width) * 100;

      beforeImage.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile devices
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }


  /* 4. GALLERY FILTERING & "SEE ALL" TOGGLE */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const seeAllBtn = document.getElementById('seeAllGalleryBtn');

  let isExpanded = false;

  const updateGalleryVisibility = () => {

    const activeFilter = document.querySelector('.filter-btn.active');

    const filterValue = activeFilter
      ? activeFilter.getAttribute('data-filter')
      : 'all';

    galleryItems.forEach(item => {

      const isExtra = item.classList.contains('extra-item');

      const matchesCategory =
        filterValue === 'all' ||
        item.getAttribute('data-category') === filterValue;

      if (
        matchesCategory &&
        (!isExtra || isExpanded || filterValue !== 'all')
      ) {

        item.style.display = 'block';

        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);

      } else {

        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';

        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  };

  filterBtns.forEach(btn => {

    btn.addEventListener('click', () => {

      filterBtns.forEach(b => b.classList.remove('active'));

      btn.classList.add('active');

      updateGalleryVisibility();
    });
  });

  if (seeAllBtn) {

    seeAllBtn.addEventListener('click', () => {

      isExpanded = !isExpanded;

      const btnSpan = seeAllBtn.querySelector('span');
      const btnIcon = seeAllBtn.querySelector('i');

      if (isExpanded) {

        if (btnSpan) {
          btnSpan.textContent = 'Show Curated Highlights';
        }

        if (btnIcon) {
          btnIcon.className = 'fa-solid fa-compress';
        }

      } else {

        if (btnSpan) {
          btnSpan.textContent = 'See All Studio Photos';
        }

        if (btnIcon) {
          btnIcon.className = 'fa-solid fa-layer-group';
        }

        const galleryElem = document.getElementById('gallery');

        if (galleryElem) {
          galleryElem.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }

      updateGalleryVisibility();
    });
  }


  /* 5. VISIT BOOKING MODAL HANDLER */
  const visitModal = document.getElementById('visitModal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('modalClose');
  const visitForm = document.getElementById('visitForm');

  const openModal = () => {

    if (visitModal) {
      visitModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {

    if (visitModal) {
      visitModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => {

    btn.addEventListener('click', (e) => {

      e.preventDefault();

      openModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (visitModal) {

    visitModal.addEventListener('click', (e) => {

      if (e.target === visitModal) {
        closeModal();
      }
    });
  }

  if (visitForm) {

    visitForm.addEventListener('submit', (e) => {

      e.preventDefault();

      const name = document.getElementById('visitorName').value;

      const modalContent = visitForm.parentElement;

      modalContent.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--color-secondary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1.5rem auto;">
            <i class="fa-solid fa-heart"></i>
          </div>

          <h3 style="font-size: 2rem; margin-bottom: 0.75rem; font-family: var(--font-serif); color: var(--color-primary);">
            We Can't Wait To Welcome You, ${name}!
          </h3>

          <p style="color: var(--color-text-muted); font-size: 1.05rem; margin-bottom: 2rem;">
            Your visit request has been received. Our team will reach out warmly via phone/WhatsApp to confirm your preferred timing.
          </p>

          <button class="btn btn-primary" onclick="location.reload()">
            Return To RTB
          </button>
        </div>
      `;
    });
  }


  /* 6. SCROLL REVEAL INTERSECTION OBSERVER */
  const revealElements = document.querySelectorAll(
    '.why-card, .program-card, .team-card, .testimonial-card, .section-header'
  );

  const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.style.opacity = '1';

        entry.target.style.transform = 'translateY(0)';

        revealObserver.unobserve(entry.target);
      }
    });

  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => {

    el.style.opacity = '0';

    el.style.transform = 'translateY(30px)';

    el.style.transition =
      'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    revealObserver.observe(el);
  });

});