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

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');

        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });


  /* 2. MOBILE MENU DRAWER & OVERLAY */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavClose = document.getElementById('mobileNavClose');

  const openMobileNav = () => {
    if (mobileNavDrawer) mobileNavDrawer.classList.add('active');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add('active');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars-staggered');
        icon.classList.add('fa-xmark');
      }
    }
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('active');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars-staggered');
      }
    }
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileNav);
  }

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Close menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });


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

      const nameInput = document.getElementById('visitorName');
      const phoneInput = document.getElementById('visitorPhone');
      const programSelect = document.getElementById('preferredProgram');
      const slotSelect = document.getElementById('preferredSlot');

      const name = nameInput ? nameInput.value.trim() : 'Visitor';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const program = programSelect ? programSelect.value : 'General Visit';
      const slot = slotSelect ? slotSelect.value : 'Flexible';

      // Clean, short & sorted WhatsApp message for Vaishali Ma'am (9890426515)
      const waMessage = 
`Hi Vaishali Ma'am, I want to schedule a visit to RTB Studio.

• Name: ${name}
• Phone: ${phone}
• Program: ${program}
• Batch: ${slot}

Please let me know the available timings.`;

      const whatsappUrl = `https://wa.me/919890426515?text=${encodeURIComponent(waMessage)}`;

      // Open WhatsApp chat in a new tab / app
      window.open(whatsappUrl, '_blank');

      // Update Modal content to show immediate WhatsApp transition feedback
      const modalContent = visitForm.parentElement;
      if (modalContent) {
        modalContent.innerHTML = `
          <div style="text-align: center; padding: 1.5rem 0.5rem;">
            <div style="width: 65px; height: 65px; border-radius: 50%; background: #25D366; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.25rem auto; box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);">
              <i class="fa-brands fa-whatsapp"></i>
            </div>

            <h3 style="font-size: 1.85rem; margin-bottom: 0.75rem; font-family: var(--font-serif); color: var(--color-primary);">
              Opening WhatsApp with Vaishali Ma'am...
            </h3>

            <p style="color: var(--color-text-muted); font-size: 1rem; margin-bottom: 1.5rem; line-height: 1.6;">
              Thank you, <strong>${name}</strong>! Your visit details have been pre-filled. Simply press <strong>Send</strong> on WhatsApp to connect directly with Vaishali Ma'am.
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 290px; margin: 0 auto;">
              <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp" style="width: 100%; justify-content: center; background: #25D366; color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
                <i class="fa-brands fa-whatsapp"></i>
                <span>Open WhatsApp Chat</span>
              </a>
              <button class="btn btn-secondary" id="modalCloseSuccessBtn" style="width: 100%;">
                Done & Return to Site
              </button>
            </div>
          </div>
        `;

        const successCloseBtn = document.getElementById('modalCloseSuccessBtn');
        if (successCloseBtn) {
          successCloseBtn.addEventListener('click', closeModal);
        }
      }
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