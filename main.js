/* 
==============================================
Sportcentrum TOPFIT - JavaScript Functionaliteit
Gemaakt in 2025
==============================================
*/

// Wacht tot de pagina volledig is geladen
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
      window.addEventListener('load', function() {
        preloader.style.opacity = '0';
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 300);
      });
    }
    
    // Sticky header
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const searchToggle = document.querySelector('.search-toggle');
    const searchContainer = document.getElementById('searchContainer');
    const searchClose = document.querySelector('.search-close');
    
    if (header) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
          header.classList.add('sticky');
        } else {
          header.classList.remove('sticky');
        }
      });
    }
    
    // Mobiele navigatie toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
    }
    
    // Dropdown menu's op mobiel
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    if (dropdowns.length > 0) {
      dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
          if (window.innerWidth < 992) {
            e.preventDefault();
            this.parentNode.classList.toggle('active');
          }
        });
      });
    }
    
    // Zoekvenster
    if (searchToggle && searchContainer && searchClose) {
      searchToggle.addEventListener('click', function() {
        searchContainer.classList.add('active');
        document.body.classList.add('search-open');
        setTimeout(() => {
          document.querySelector('.search-input').focus();
        }, 300);
      });
      
      searchClose.addEventListener('click', function() {
        searchContainer.classList.remove('active');
        document.body.classList.remove('search-open');
      });
      
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
          searchContainer.classList.remove('active');
          document.body.classList.remove('search-open');
        }
      });
    }
    
    // Initialiseer counters voor statistieken
    const initCounters = () => {
      const counters = document.querySelectorAll('.stat-counter');
      
      if (counters.length > 0) {
        counters.forEach(counter => {
          const target = parseInt(counter.textContent);
          const countUp = new CountUp(counter, 0, target, 0, 2.5, {
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.'
          });
          
          const observer = new IntersectionObserver(
            entries => {
              if (entries[0].isIntersecting) {
                countUp.start();
                observer.disconnect();
              }
            },
            { threshold: 0.5 }
          );
          
          observer.observe(counter);
        });
      }
    };
    
    // Initialiseer counters als CountUp.js beschikbaar is
    if (typeof CountUp !== 'undefined') {
      initCounters();
    } else {
      console.warn('CountUp.js is niet geladen');
    }
    
    // Services filtering
    const serviceFilters = document.querySelectorAll('.service-filter');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (serviceFilters.length > 0 && serviceCards.length > 0) {
      serviceFilters.forEach(filter => {
        filter.addEventListener('click', function() {
          // Active klasse op filter
          serviceFilters.forEach(f => f.classList.remove('active'));
          this.classList.add('active');
          
          const filterValue = this.getAttribute('data-filter');
          
          // Filter de kaarten
          serviceCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory.includes(filterValue)) {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              }, 50);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'scale(0.8)';
              setTimeout(() => {
                card.style.display = 'none';
              }, 300);
            }
          });
        });
      });
    }
    
    // Service Modal
    const createServiceModal = (modalId, title, description, features, imageSrc) => {
      // Kloon de template
      const modalTemplate = document.querySelector('.service-modal-template');
      
      if (!modalTemplate) return;
      
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.id = modalId;
      modal.innerHTML = modalTemplate.innerHTML;
      
      // Vul de modal met content
      modal.querySelector('.modal-title').textContent = title;
      modal.querySelector('.modal-description').innerHTML = description;
      modal.querySelector('.modal-image img').src = imageSrc;
      modal.querySelector('.modal-image img').alt = title;
      
      // Voeg features toe
      const featuresContainer = modal.querySelector('.modal-features');
      featuresContainer.innerHTML = '';
      
      features.forEach(feature => {
        const featureEl = document.createElement('div');
        featureEl.classList.add('feature-item');
        featureEl.innerHTML = `
          <div class="feature-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="feature-text">
            <p>${feature}</p>
          </div>
        `;
        featuresContainer.appendChild(featureEl);
      });
      
      // Voeg de modal toe aan de pagina
      document.body.appendChild(modal);
      
      // Event listeners voor sluiten
      const closeBtn = modal.querySelector('.modal-close');
      
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
          document.body.classList.remove('modal-open');
        }, 300);
      });
      
      // Sluit op Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
          setTimeout(() => {
            document.body.classList.remove('modal-open');
          }, 300);
        }
      });
      
      // Sluit op klik buiten modal
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.remove('active');
          setTimeout(() => {
            document.body.classList.remove('modal-open');
          }, 300);
        }
      });
    };
    
    // Open service modals
    const serviceDetailBtns = document.querySelectorAll('.service-detail-btn');
    
    if (serviceDetailBtns.length > 0) {
      serviceDetailBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          
          const modalId = this.getAttribute('href').substring(1);
          let modal = document.getElementById(modalId);
          
          // Maak modal als deze nog niet bestaat
          if (!modal) {
            const serviceCard = this.closest('.service-card');
            const title = serviceCard.querySelector('.service-title').textContent;
            const description = serviceCard.querySelector('.service-description').textContent;
            const imageSrc = serviceCard.querySelector('.service-image img').src;
            
            // Voorbeeld features (in productie zouden deze vanuit database komen)
            const features = [
              'Professionele begeleiding door ervaren trainers',
              'Moderne apparatuur en faciliteiten',
              'Flexibele trainingstijden',
              'Geschikt voor alle niveaus'
            ];
            
            createServiceModal(modalId, title, description, features, imageSrc);
            modal = document.getElementById(modalId);
          }
          
          // Open de modal
          document.body.classList.add('modal-open');
          modal.classList.add('active');
        });
      });
    }
    
    // Prijzen toggle
    const pricingToggle = document.getElementById('pricingToggle');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');
    const monthlyLabel = document.querySelector('.toggle-label:first-of-type');
    const yearlyLabel = document.querySelector('.toggle-label:last-of-type');
    
    if (pricingToggle && monthlyPrices.length > 0 && yearlyPrices.length > 0) {
      pricingToggle.addEventListener('change', function() {
        if (this.checked) {
          monthlyPrices.forEach(price => price.style.display = 'none');
          yearlyPrices.forEach(price => price.style.display = 'flex');
          monthlyLabel.classList.remove('active');
          yearlyLabel.classList.add('active');
        } else {
          monthlyPrices.forEach(price => price.style.display = 'flex');
          yearlyPrices.forEach(price => price.style.display = 'none');
          monthlyLabel.classList.add('active');
          yearlyLabel.classList.remove('active');
        }
      });
    }
    
    // Virtuele Tour
    const tourStartBtn = document.querySelector('.tour-start-button');
    const tourControls = document.querySelectorAll('.tour-control');
    
    if (tourStartBtn) {
      tourStartBtn.addEventListener('click', function() {
        // Hier zou echte tour logica komen, voor nu een placeholder
        alert('Virtuele tour functionaliteit wordt geladen...');
      });
    }
    
    if (tourControls.length > 0) {
      tourControls.forEach(control => {
        control.addEventListener('click', function() {
          const action = this.getAttribute('data-tip');
          // Placeholder voor echte tour navigatie
          console.log(`Tour actie: ${action}`);
        });
      });
    }
    
    // Google Map activeren
    const mapActivateBtn = document.querySelector('.map-activate');
    const mapOverlay = document.querySelector('.map-overlay');
    
    if (mapActivateBtn && mapOverlay) {
      mapActivateBtn.addEventListener('click', function() {
        mapOverlay.classList.add('hidden');
      });
    }
    
    // Countdown timer voor evenementen
    const countdowns = document.querySelectorAll('.event-countdown');
    
    if (countdowns.length > 0) {
      countdowns.forEach(countdown => {
        const targetDate = new Date(countdown.getAttribute('data-date')).getTime();
        const daysEl = countdown.querySelector('.days');
        const hoursEl = countdown.querySelector('.hours');
        const minutesEl = countdown.querySelector('.minutes');
        const secondsEl = countdown.querySelector('.seconds');
        
        if (!targetDate || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        
        // Update de countdown elke seconde
        const interval = setInterval(function() {
          const now = new Date().getTime();
          const distance = targetDate - now;
          
          if (distance < 0) {
            clearInterval(interval);
            countdown.innerHTML = '<p>Het evenement is begonnen!</p>';
            return;
          }
          
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          daysEl.textContent = days.toString().padStart(2, '0');
          hoursEl.textContent = hours.toString().padStart(2, '0');
          minutesEl.textContent = minutes.toString().padStart(2, '0');
          secondsEl.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
      });
    }
    
    // Testimonial slider
    let testimonialSlider;
    
    const initTestimonialSlider = () => {
      if (typeof Swiper !== 'undefined' && document.querySelector('.testimonials-slider .swiper-container')) {
        testimonialSlider = new Swiper('.testimonials-slider .swiper-container', {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            }
          }
        });
    } else {
        console.warn('Swiper is niet geladen of testimonial slider niet gevonden');
      }
    };
    
    // Initialiseer de testimonial slider
    initTestimonialSlider();
    
    // Form validatie
    const forms = document.querySelectorAll('form');
    
    if (forms.length > 0) {
      forms.forEach(form => {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Eenvoudige validatie
          let isValid = true;
          const requiredFields = form.querySelectorAll('[required]');
          
          requiredFields.forEach(field => {
            if (!field.value.trim()) {
              isValid = false;
              field.classList.add('error');
              
              // Maak een foutmelding als deze nog niet bestaat
              let errorMessage = field.parentNode.querySelector('.error-message');
              
              if (!errorMessage) {
                errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'Dit veld is verplicht';
                field.parentNode.appendChild(errorMessage);
              }
            } else {
              field.classList.remove('error');
              const errorMessage = field.parentNode.querySelector('.error-message');
              if (errorMessage) {
                errorMessage.remove();
              }
            }
          });
          
          // Email validatie
          const emailFields = form.querySelectorAll('input[type="email"]');
          
          emailFields.forEach(field => {
            if (field.value.trim() && !isValidEmail(field.value)) {
              isValid = false;
              field.classList.add('error');
              
              let errorMessage = field.parentNode.querySelector('.error-message');
              
              if (!errorMessage) {
                errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'Voer een geldig e-mailadres in';
                field.parentNode.appendChild(errorMessage);
              }
            }
          });
          
          // Als formulier geldig is, verstuur
          if (isValid) {
            // Toon een succes bericht (in productie zou dit een echte AJAX verzending zijn)
            const formId = form.id;
            let successMessage;
            
            if (formId === 'signupForm') {
              successMessage = 'Bedankt voor je inschrijving! We nemen snel contact met je op.';
            } else if (formId === 'contactForm') {
              successMessage = 'Bedankt voor je bericht! We reageren binnen 24 uur.';
            } else if (formId === 'trialForm') {
              successMessage = 'Je proefles is aangevraagd! We nemen contact op om een datum te plannen.';
            } else {
              successMessage = 'Formulier succesvol verzonden!';
            }
            
            const successEl = document.createElement('div');
            successEl.classList.add('success-message');
            successEl.innerHTML = `
              <i class="fas fa-check-circle"></i>
              <p>${successMessage}</p>
            `;
            
            // Verberg het formulier en toon succes bericht
            form.style.display = 'none';
            form.parentNode.appendChild(successEl);
            
            // Reset het formulier (voor als het opnieuw getoond wordt)
            form.reset();
          }
        });
        
        // Live validatie onFocus/onBlur
        const inputFields = form.querySelectorAll('input, textarea, select');
        
        inputFields.forEach(field => {
          field.addEventListener('focus', function() {
            this.classList.add('focused');
          });
          
          field.addEventListener('blur', function() {
            this.classList.remove('focused');
            
            // Valideer alleen als het veld verplicht is of al ingevuld
            if (field.hasAttribute('required') || field.value.trim()) {
              if (!field.value.trim()) {
                field.classList.add('error');
                
                let errorMessage = field.parentNode.querySelector('.error-message');
                
                if (!errorMessage) {
                  errorMessage = document.createElement('div');
                  errorMessage.classList.add('error-message');
                  errorMessage.textContent = 'Dit veld is verplicht';
                  field.parentNode.appendChild(errorMessage);
                }
              } else {
                // Extra validatie voor email
                if (field.type === 'email' && !isValidEmail(field.value)) {
                  field.classList.add('error');
                  
                  let errorMessage = field.parentNode.querySelector('.error-message');
                  
                  if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = 'Voer een geldig e-mailadres in';
                    field.parentNode.appendChild(errorMessage);
                  }
                } else {
                  field.classList.remove('error');
                  const errorMessage = field.parentNode.querySelector('.error-message');
                  if (errorMessage) {
                    errorMessage.remove();
                  }
                }
              }
            }
          });
        });
      });
    }
    
    // Email validatie helper functie
    function isValidEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    
    // Proefles Modal
    const trialBtns = document.querySelectorAll('a[href="#trial"]');
    const trialModal = document.getElementById('trialModal');
    
    if (trialBtns.length > 0 && trialModal) {
      trialBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          document.body.classList.add('modal-open');
          trialModal.classList.add('active');
        });
      });
      
      // Sluit modal functionaliteit
      const closeBtn = trialModal.querySelector('.modal-close');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          trialModal.classList.remove('active');
          setTimeout(() => {
            document.body.classList.remove('modal-open');
          }, 300);
        });
      }
      
      // Sluit op Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && trialModal.classList.contains('active')) {
          trialModal.classList.remove('active');
          setTimeout(() => {
            document.body.classList.remove('modal-open');
          }, 300);
        }
      });
      
      // Sluit op klik buiten modal
      trialModal.addEventListener('click', function(e) {
        if (e.target === trialModal) {
          trialModal.classList.remove('active');
          setTimeout(() => {
            document.body.classList.remove('modal-open');
          }, 300);
        }
      });
    }
    
    // Back to Top button
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
          backToTopBtn.classList.add('active');
        } else {
          backToTopBtn.classList.remove('active');
        }
      });
      
      backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // Cookies consent
    const cookiesConsent = document.getElementById('cookiesConsent');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieSettings = document.getElementById('cookieSettings');
    
    if (cookiesConsent && cookieAccept && cookieSettings) {
      // Controleer of gebruiker al heeft geaccepteerd
      const cookiesAccepted = localStorage.getItem('cookiesAccepted');
      
      if (!cookiesAccepted) {
        setTimeout(() => {
          cookiesConsent.classList.add('active');
        }, 1000);
      }
      
      cookieAccept.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookiesConsent.classList.remove('active');
      });
      
      cookieSettings.addEventListener('click', function() {
        // Zou een cookie settings overlay openen
        alert('Instellingen voor cookies worden geladen...');
      });
    }
    
    // Smooth Scroll voor interne links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    if (smoothScrollLinks.length > 0) {
      smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // Sla over als het een modal trigger is of dropdown toggle
          if (this.classList.contains('dropdown-toggle') || 
              this.classList.contains('service-detail-btn') || 
              this.closest('.dropdown-menu')) {
            return;
          }
          
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Sluit mobiel menu als open
            if (navMenu && navMenu.classList.contains('active')) {
              navToggle.classList.remove('active');
              navMenu.classList.remove('active');
              document.body.classList.remove('menu-open');
            }
            
            // Smooth scroll naar target
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
    
    // ScrollReveal animaties
    const initScrollReveal = () => {
      if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
          distance: '50px',
          duration: 1000,
          easing: 'ease',
          origin: 'bottom',
          reset: false
        });
        
        // Hero sectie
        sr.reveal('.hero-tagline', { delay: 200 });
        sr.reveal('.hero-title', { delay: 400 });
        sr.reveal('.hero-subtitle', { delay: 600 });
        sr.reveal('.hero-cta', { delay: 800 });
        
        // Stats
        sr.reveal('.stat-item', { 
          interval: 200,
          origin: 'right'
        });
        
        // About sectie
        sr.reveal('.about-image-container', { 
          origin: 'left',
          distance: '100px'
        });
        sr.reveal('.about-text', { 
          origin: 'right',
          distance: '100px'
        });
        
        // Services
        sr.reveal('.service-card', { 
          interval: 200,
          origin: 'bottom'
        });
        
        // DIDO sectie
        sr.reveal('.dido-content', { 
          origin: 'left',
          distance: '100px'
        });
        sr.reveal('.dido-image', { 
          origin: 'right',
          distance: '100px',
          delay: 300
        });
        
        // Prijzen
        sr.reveal('.pricing-card', { 
          interval: 200,
          scale: 0.9
        });
        
        // Tour
        sr.reveal('.tour-preview', {
          scale: 0.9
        });
        sr.reveal('.facility-item', { 
          interval: 200
        });
        
        // Timeline
        sr.reveal('.timeline-event', { 
          interval: 300,
          origin: 'left'
        });
        sr.reveal('.news-card', { 
          interval: 200
        });
        
        // Testimonials
        sr.reveal('.testimonial-card', { 
          interval: 200,
          scale: 0.9
        });
        
        // Signup
        sr.reveal('.signup-content', { 
          origin: 'left'
        });
        sr.reveal('.signup-form-container', { 
          origin: 'right',
          delay: 300
        });
        
        // Contact
        sr.reveal('.contact-info', { 
          origin: 'left'
        });
        sr.reveal('.contact-map', { 
          origin: 'right',
          delay: 300
        });
        sr.reveal('.contact-form-container', { 
          origin: 'bottom',
          delay: 500
        });
      } else {
        console.warn('ScrollReveal is niet geladen');
      }
    };
    
    // Initialiseer ScrollReveal
    initScrollReveal();
    
    // Video Modal voor hero video button
    const videoBtn = document.querySelector('.video-btn');
    
    if (videoBtn) {
      videoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Creëer een video modal
        const videoModal = document.createElement('div');
        videoModal.classList.add('modal');
        videoModal.classList.add('video-modal');
        videoModal.innerHTML = `
          <div class="modal-dialog">
            <div class="modal-content">
              <button class="modal-close"><i class="fas fa-times"></i></button>
              <div class="video-container">
                <iframe src="https://www.youtube.com/embed/your-video-id?autoplay=1" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>
          </div>
        `;
        
        document.body.appendChild(videoModal);
        
        // Open de modal
        setTimeout(() => {
          document.body.classList.add('modal-open');
          videoModal.classList.add('active');
        }, 50);
        
        // Sluitfunctionaliteit
        const closeBtn = videoModal.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', function() {
          videoModal.classList.remove('active');
          setTimeout(() => {
            document.body.classList.remove('modal-open');
            videoModal.remove();
          }, 300);
        });
        
        // Sluit op Escape
        const escHandler = function(e) {
          if (e.key === 'Escape') {
            videoModal.classList.remove('active');
            setTimeout(() => {
              document.body.classList.remove('modal-open');
              videoModal.remove();
            }, 300);
            document.removeEventListener('keydown', escHandler);
          }
        };
        
        document.addEventListener('keydown', escHandler);
        
        // Sluit op klik buiten modal
        videoModal.addEventListener('click', function(e) {
          if (e.target === videoModal) {
            videoModal.classList.remove('active');
            setTimeout(() => {
              document.body.classList.remove('modal-open');
              videoModal.remove();
            }, 300);
          }
        });
      });
    }
  });