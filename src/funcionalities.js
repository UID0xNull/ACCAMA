document.addEventListener("DOMContentLoaded", function () {
    const numParticles = 24; // Cantidad de partículas
    const hero = document.querySelector(".mainhero"); // Seleccionamos el hero
    if (!hero) return;

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = 0;
    container.style.left = 0;
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.overflow = "hidden";
    container.style.pointerEvents = "none";
    hero.appendChild(container);

    function createParticle() {
        const particle = document.createElement("img");
        particle.src ="src/assets/cannabis-leaf-svgrepo-com.svg";
        particle.style.position = "absolute";
        particle.style.width = "30px";
        particle.style.height = "30px";
        particle.style.opacity = Math.random() * 0.8 + 0.2;
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        const heroRect = hero.getBoundingClientRect();
        const startX = Math.random() * heroRect.width;
        const startY = Math.random() * heroRect.height;
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;

        container.appendChild(particle);
        animateParticle(particle);
    }

    function animateParticle(particle) {
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        function move() {
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            x += speedX;
            y += speedY;
            
            if (x < 0) x = hero.clientWidth;
            if (x > hero.clientWidth) x = 0;
            if (y < 0) y = hero.clientHeight;
            if (y > hero.clientHeight) y = 0;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            requestAnimationFrame(move);
        }
        move();
    }

    for (let i = 0; i < numParticles; i++) {
        createParticle();
    }

    document.addEventListener("mousemove", function (e) {
        document.querySelectorAll(".hero img").forEach((particle) => {
            const dx = e.clientX - parseFloat(particle.style.left);
            const dy = e.clientY - parseFloat(particle.style.top);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                particle.style.transform = `translate(${dx * 0.1}px, ${dy * 0.1}px)`;
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
});



document.addEventListener("scroll", function () {
    const logoContainer = document.getElementById("h1");
    const logodesplazado = document.getElementById("logoimg");
    if (window.scrollY > 30 && window.scrollY < 1600) { 
        logoContainer.classList.add("scrolled");
        logodesplazado.classList.add("des")
        logoContainer.classList.remove("appear"); // Remueve la animación de vuelta
    } else {
        logoContainer.classList.remove("scrolled");
        logodesplazado.classList.remove("des")
        logoContainer.classList.add("appear"); // Remueve la animación de vuelta
    }
});




document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768;
    
    // Initialize appropriate carousel based on device
    if (isMobile) {
        initializeCircularMobileCarousel();
    } else {
        initializeDesktopCarousel();
    }

    // Desktop carousel functionality remains unchanged
    function initializeDesktopCarousel() {
        // Your existing desktop carousel code
        const productCards = document.querySelectorAll('.product-card');
        const productCarousel = document.querySelector('.product-carousel');
        
        // Remove old structures
        const slides = document.querySelectorAll('.product-slide');
        slides.forEach(slide => slide.remove());
        
        const oldArrows = document.querySelectorAll('.carousel-arrow');
        const oldDots = document.querySelector('.carousel-nav');
        if (oldDots) oldDots.remove();
        oldArrows.forEach(arrow => arrow.remove());
        
        // Create container for continuous carousel
        const trackContainer = document.createElement('div');
        trackContainer.classList.add('products-track');
        productCarousel.appendChild(trackContainer);
        
        // Add all products to track
        productCards.forEach(card => {
            trackContainer.appendChild(card);
        });
        
        // Clone some products for infinite effect
        for (let i = 0; i < Math.min(productCards.length, 6); i++) {
            const clone = productCards[i].cloneNode(true);
            trackContainer.appendChild(clone);
        }
        
        // Create slider control
        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('slider-container');
        
        const sliderTrack = document.createElement('div');
        sliderTrack.classList.add('slider-track');
        
        const sliderThumb = document.createElement('div');
        sliderThumb.classList.add('slider-thumb');

        // Create cannabis leaf icon
        const leafIcon = document.createElement('img');
        leafIcon.src = "src/assets/cannabis-leaf-svgrepo-com.svg";
        leafIcon.alt = "Cannabis leaf";

        // Add image to thumb
        sliderThumb.appendChild(leafIcon);

        sliderTrack.appendChild(sliderThumb);
        sliderContainer.appendChild(sliderTrack);
        productCarousel.appendChild(sliderContainer);
        
        // Control variables
        let scrollPosition = 0;
        const scrollSpeed = 0.3; // Speed in pixels per frame
        let animationId = null;
        let isDragging = false;
        let lastTime = 0;
        
        // Calculate total carousel width
        const totalWidth = productCards.length * (productCards[0].offsetWidth + 30); // +30 for gap
        
        // Get slider dimensions
        const sliderWidth = sliderTrack.offsetWidth;
        const thumbWidth = sliderThumb.offsetWidth;
        
        // Function to update positions
        function updatePositions() {
            // Update carousel position
            trackContainer.style.transform = `translateX(${-scrollPosition}px)`;
            
            // Calculate and update thumb position
            const normalizedPosition = (scrollPosition % totalWidth) / totalWidth;
            const thumbPosition = normalizedPosition * (sliderWidth - thumbWidth);
            sliderThumb.style.transform = `translateX(${thumbPosition}px)`;
        }
        
        // Function for continuous scrolling
        function scrollCarousel(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;
            
            // Limit update rate for smooth movement
            if (elapsed > 12) { // ~60fps
                scrollPosition += scrollSpeed * elapsed / 12;
                lastTime = timestamp;
                
                // Reset position when reaching the end for seamless looping
                if (scrollPosition >= totalWidth) {
                    scrollPosition = 0;
                    trackContainer.style.transition = 'none';
                    updatePositions();
                    // Force reflow before restoring transition
                    void trackContainer.offsetWidth;
                    trackContainer.style.transition = 'transform 0.5s ease';
                } else {
                    updatePositions();
                }
            }
            
            animationId = requestAnimationFrame(scrollCarousel);
        }
        
        // Set initial transition
        trackContainer.style.transition = 'transform 0.5s ease';
        sliderThumb.style.transition = 'transform 0.1s ease';
        
        // Start automatic carousel
        animationId = requestAnimationFrame(scrollCarousel);
        
        // Control carousel with slider (thumb drag)
        let startX = 0;
        let currentX = 0;
        let thumbStartX = 0;
        
        sliderThumb.addEventListener('mousedown', startDrag);
        sliderThumb.addEventListener('touchstart', startDrag);
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            
            // Cancel automatic animation
            cancelAnimationFrame(animationId);
            
            // Save initial position
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            thumbStartX = parseInt(sliderThumb.style.transform.replace('translateX(', '').replace('px)', '') || 0);
            
            // Add event listeners for movement
            document.addEventListener('mousemove', dragThumb);
            document.addEventListener('touchmove', dragThumb);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }
        
        function dragThumb(e) {
            if (!isDragging) return;
            
            currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const diff = currentX - startX;
            
            // Calculate new thumb position
            let newThumbPosition = thumbStartX + diff;
            
            // Limit to slider range
            newThumbPosition = Math.max(0, Math.min(newThumbPosition, sliderWidth - thumbWidth));
            
            // Update thumb position
            sliderThumb.style.transform = `translateX(${newThumbPosition}px)`;
            
            // Calculate and update carousel position
            const normalizedPosition = newThumbPosition / (sliderWidth - thumbWidth);
            scrollPosition = normalizedPosition * totalWidth;
            trackContainer.style.transform = `translateX(${-scrollPosition}px)`;
        }
        
        function stopDrag() {
            if (isDragging) {
                isDragging = false;
                
                // Remove event listeners
                document.removeEventListener('mousemove', dragThumb);
                document.removeEventListener('touchmove', dragThumb);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);
                
                // Resume automatic animation
                lastTime = 0;
                animationId = requestAnimationFrame(scrollCarousel);
            }
        }
        
        // Click on track
        sliderTrack.addEventListener('click', function(e) {
            // Ignore if click was on thumb
            if (e.target === sliderThumb) return;
            
            // Calculate relative click position on track
            const rect = sliderTrack.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            
            // Calculate new normalized position
            const normalizedPosition = Math.max(0, Math.min(clickX / sliderWidth, 1));
            
            // Update carousel position
            scrollPosition = normalizedPosition * totalWidth;
            
            // Update positions
            updatePositions();
        });
        
        // Pause on mouse enter
        productCarousel.addEventListener('mouseenter', function() {
            cancelAnimationFrame(animationId);
        });
        
        // Resume on mouse leave
        productCarousel.addEventListener('mouseleave', function() {
            if (!isDragging) {
                lastTime = 0;
                animationId = requestAnimationFrame(scrollCarousel);
            }
        });
        
        // Update dimensions on resize
        window.addEventListener('resize', function() {
            // Recalculate dimensions
            const newTotalWidth = productCards.length * (productCards[0].offsetWidth + 30);
            const newSliderWidth = sliderTrack.offsetWidth;
            
            // Adjust position proportionally
            scrollPosition = (scrollPosition / totalWidth) * newTotalWidth;
            
            // Update global variables
            totalWidth = newTotalWidth;
            sliderWidth = newSliderWidth;
            
            // Update positions
            updatePositions();
        });
    }

    // New circular mobile carousel implementation
    function initializeCircularMobileCarousel() {
        const productCarousel = document.querySelector('.product-carousel');
        
        // Collect all product cards from various possible sources
        let allProductCards = [];
        
        // Try to get products from slides first
        const productSlides = document.querySelectorAll('.product-slide');
        if (productSlides.length > 0) {
            productSlides.forEach(slide => {
                const cards = slide.querySelectorAll('.product-card');
                cards.forEach(card => allProductCards.push(card));
            });
        } 
        // If no products in slides, try direct selector
        else {
            const directCards = productCarousel.querySelectorAll('.product-card');
            directCards.forEach(card => allProductCards.push(card));
        }
        
        // If still no products, look in the document
        if (allProductCards.length === 0) {
            const documentCards = document.querySelectorAll('.product-card');
            documentCards.forEach(card => allProductCards.push(card));
        }
        
        // Create circular carousel container
        const circularCarouselContainer = document.createElement('div');
        circularCarouselContainer.classList.add('circular-carousel-container');
        
        // Create carousel track where cards will be placed
        const carouselTrack = document.createElement('div');
        carouselTrack.classList.add('circular-carousel-track');
        
        // Variables for carousel functionality
        let currentIndex = 0;
        const totalCards = allProductCards.length;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;
        let cardWidth = 0;
        
        // Setup the circular carousel with initial cards
        function setupCircularCarousel() {
            carouselTrack.innerHTML = '';
            
            // Calculate initial card positions for circular effect
            cardWidth = window.innerWidth * 0.8; // 80% of screen width
            
            // Clone cards and add to carousel track for infinite scrolling
            // We need enough cards to fill the viewport and allow for smooth scrolling
            const cardsNeeded = Math.ceil(window.innerWidth / cardWidth) * 3 + 2;
            const centerOffset = Math.floor(cardsNeeded / 2);
            
            // Create virtual indexes that wrap around
            for (let i = -centerOffset; i <= centerOffset; i++) {
                let virtualIndex = (currentIndex + i) % totalCards;
                if (virtualIndex < 0) virtualIndex += totalCards;
                
                // Clone the card at virtualIndex
                const cardClone = allProductCards[virtualIndex].cloneNode(true);
                cardClone.classList.add('circular-card');
                
                // Set initial position and z-index for 3D effect
                const distance = Math.abs(i);
                const scale = 1 - Math.min(0.3, distance * 0.15);
                const zIndex = 100 - distance;
                const opacity = 1 - Math.min(0.6, distance * 0.3);
                const translateX = i * cardWidth;
                
                cardClone.style.transform = `translateX(${translateX}px) scale(${scale})`;
                cardClone.style.zIndex = zIndex;
                cardClone.style.opacity = opacity;
                
                // Store the index and position for reference
                cardClone.dataset.index = virtualIndex;
                cardClone.dataset.position = i;
                
                carouselTrack.appendChild(cardClone);
            }
            
            // Set initial transform
            carouselTrack.style.transform = `translateX(0px)`;
        }
        
        // Touch events for dragging
        function touchStart(event) {
            if (isDragging) return;
            
            cancelAnimationFrame(animationID);
            isDragging = true;
            
            // Get starting position
            startX = getPositionX(event);
            prevTranslate = currentTranslate;
            
            carouselTrack.style.transition = 'none';
        }
        
        function touchMove(event) {
            if (!isDragging) return;
            
            const currentX = getPositionX(event);
            const moveX = currentX - startX;
            currentTranslate = prevTranslate + moveX;
            
            setSliderPosition();
            updateCardsAppearance();
        }
        
        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            const moveDistance = currentTranslate - prevTranslate;
            
            // Determine if we should move to next/prev card based on distance moved
            if (Math.abs(moveDistance) > cardWidth * 0.3) {
                if (moveDistance < 0) {
                    // Move to next card
                    currentIndex = (currentIndex + 1) % totalCards;
                } else {
                    // Move to previous card
                    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                }
            }
            
            // Snap back to nearest card
            snapToNearestCard();
        }
        
        // Get pointer/touch X position
        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }
        
        // Update carousel position
        function setSliderPosition() {
            carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        }
        
        // Update card appearance based on position
        function updateCardsAppearance() {
            const cards = carouselTrack.querySelectorAll('.circular-card');
            const center = currentTranslate / cardWidth;
            
            cards.forEach(card => {
                const position = parseFloat(card.dataset.position);
                const adjustedPosition = position - center;
                const distance = Math.abs(adjustedPosition);
                
                const scale = 1 - Math.min(0.3, distance * 0.15);
                const zIndex = 100 - Math.floor(distance * 10);
                const opacity = 1 - Math.min(0.6, distance * 0.3);
                
                card.style.transform = `translateX(${position * cardWidth}px) scale(${scale})`;
                card.style.zIndex = zIndex;
                card.style.opacity = opacity;
            });
        }
        
        // Snap to nearest card with animation
        function snapToNearestCard() {
            currentTranslate = 0;
            carouselTrack.style.transition = 'transform 0.3s ease-out';
            carouselTrack.style.transform = `translateX(0px)`;
            
            // Wait for transition to finish then rebuild carousel with new current card
            setTimeout(() => {
                carouselTrack.style.transition = 'none';
                setupCircularCarousel();
            }, 300);
        }
        
        // Add necessary event listeners
        function addEventListeners() {
            carouselTrack.addEventListener('mousedown', touchStart);
            carouselTrack.addEventListener('touchstart', touchStart, { passive: true });
            
            carouselTrack.addEventListener('mousemove', touchMove);
            carouselTrack.addEventListener('touchmove', touchMove, { passive: true });
            
            carouselTrack.addEventListener('mouseup', touchEnd);
            carouselTrack.addEventListener('touchend', touchEnd);
            carouselTrack.addEventListener('mouseleave', touchEnd);
            
            // Add click listener to center card for better UX
            carouselTrack.addEventListener('click', (e) => {
                const clickedCard = e.target.closest('.circular-card');
                if (clickedCard && parseInt(clickedCard.dataset.position) === 0) {
                    // Handle center card click (could open product details)
                    console.log('Center card clicked:', clickedCard.dataset.index);
                }
            });
            
            // Button navigation for better accessibility
            const prevButton = document.createElement('button');
            prevButton.classList.add('circular-carousel-button', 'prev-button');
            prevButton.innerHTML = '&#10094;';
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                carouselTrack.style.transition = 'transform 0.3s ease-out';
                setSliderPosition();
                setTimeout(() => {
                    carouselTrack.style.transition = 'none';
                    setupCircularCarousel();
                }, 300);
            });
            
            const nextButton = document.createElement('button');
            nextButton.classList.add('circular-carousel-button', 'next-button');
            nextButton.innerHTML = '&#10095;';
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalCards;
                carouselTrack.style.transition = 'transform 0.3s ease-out';
                setSliderPosition();
                setTimeout(() => {
                    carouselTrack.style.transition = 'none';
                    setupCircularCarousel();
                }, 300);
            });
            
            circularCarouselContainer.appendChild(prevButton);
            circularCarouselContainer.appendChild(nextButton);
        }
        
        // Add carousel track to container
        circularCarouselContainer.appendChild(carouselTrack);
        
        // Replace existing carousel content
        productCarousel.innerHTML = '';
        productCarousel.appendChild(circularCarouselContainer);
        
        // Set up and initialize
        setupCircularCarousel();
        addEventListeners();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                cardWidth = window.innerWidth * 0.8;
                setupCircularCarousel();
            }
        });
    }

    // Handle responsive switching between carousel modes
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 768;
        const productCarousel = document.querySelector('.product-carousel');
        
        // Check if we need to switch carousel mode
        if (isMobile && !productCarousel.querySelector('.circular-carousel-container')) {
            initializeCircularMobileCarousel();
        } else if (!isMobile && !productCarousel.querySelector('.products-track')) {
            initializeDesktopCarousel();
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.textContent = standardStyles;
    document.head.appendChild(styleElement);
    
    // Function to standardize all product cards on the page
    function standardizeProductCards() {
      // Apply consistent sizing to all card types
      const allCards = document.querySelectorAll('.product-card, .circular-card, .mobile-card');
      
      allCards.forEach(card => {
        // Ensure the card has the proper structure
        if (!card.querySelector('.product-image')) {
          const productImage = document.createElement('div');
          productImage.className = 'product-image';
          
          // Move any direct img element into the product-image container
          const directImg = card.querySelector('img');
          if (directImg) {
            productImage.appendChild(directImg.cloneNode(true));
            directImg.remove();
          }
          
          // Insert the product-image at the beginning of the card
          card.insertBefore(productImage, card.firstChild);
        }
        
        // Ensure product content exists
        if (!card.querySelector('.product-content')) {
          const productContent = document.createElement('div');
          productContent.className = 'product-content';
          
          // Move any h3 and non-image content to the product-content
          const title = card.querySelector('h3');
          if (title) {
            productContent.appendChild(title.cloneNode(true));
            title.remove();
          }
          
          card.appendChild(productContent);
        }
        
        // Ensure consultar button has consistent structure
        const consultarBtn = card.querySelector('.consultar-btn');
        if (consultarBtn) {
          const link = consultarBtn.querySelector('a');
          if (link) {
            // Ensure the link fills the button
            link.style.width = '100%';
            link.style.height = '100%';
            link.style.display = 'flex';
            link.style.alignItems = 'center';
            link.style.justifyContent = 'center';
          }
        }
      });
      
      // Fix specifically for circular carousel
      if (document.querySelector('.circular-carousel-track')) {
        const circularCards = document.querySelectorAll('.circular-card');
        circularCards.forEach(card => {
          // Ensure proper structure by moving elements if needed
          const productContent = card.querySelector('.product-content');
          const consultarBtn = card.querySelector('.consultar-btn');
          
          if (consultarBtn && productContent && !productContent.contains(consultarBtn)) {
            productContent.appendChild(consultarBtn);
          }
        });
      }
    }
    
    // Run standardization on page load
    standardizeProductCards();
    
    // Also run after a small delay to ensure all carousel scripts have initialized
    setTimeout(standardizeProductCards, 1000);
  });
  
  // Modify the circular carousel code to maintain standard card appearance
  document.addEventListener("DOMContentLoaded", function() {
    // This will run if the circular carousel is initialized
    const circularTrack = document.querySelector('.circular-carousel-track');
    if (circularTrack) {
      // Override the updateCardsAppearance function to maintain consistent dimensions
      function improveCircularCardAppearance() {
        const cards = document.querySelectorAll('.circular-card');
        
        cards.forEach(card => {
          const position = parseInt(card.dataset.position || 0);
          
          // Base transformation - scale only for non-center cards
          let scale = 1;
          let zIndex = 100;
          let opacity = 1;
          
          if (position !== 0) {
            scale = Math.max(0.8, 1 - Math.abs(position) * 0.1);
            zIndex = 100 - Math.abs(position) * 10;
            opacity = Math.max(0.6, 1 - Math.abs(position) * 0.2);
          }
          
          // Apply transformations while preserving internal structure
          card.style.zIndex = zIndex;
          card.style.opacity = opacity;
          
          // Only apply scaling to the outer card, not its contents
          if (position === 0) {
            card.style.transform = `translateX(0) scale(1)`;
          } else if (position < 0) {
            card.style.transform = `translateX(${position * 60}%) scale(${scale})`;
          } else {
            card.style.transform = `translateX(${position * 60}%) scale(${scale})`;
          }
          
          // Ensure internal elements remain properly sized
          const productImage = card.querySelector('.product-image');
          const productContent = card.querySelector('.product-content');
          
          if (productImage) productImage.style.transform = 'none';
          if (productContent) productContent.style.transform = 'none';
        });
      }
      
      // Run the improvement function
      improveCircularCardAppearance();
      
      // Add observer to detect changes and maintain standardization
      const observer = new MutationObserver(() => {
        improveCircularCardAppearance();
      });
      
      observer.observe(circularTrack, { childList: true, subtree: true });
    }
  });
  
  // Improvements for mobile carousel
  document.addEventListener("DOMContentLoaded", function() {
    const mobileContainer = document.querySelector('.mobile-carousel-container');
    if (mobileContainer) {
      // Ensure mobile cards maintain standard sizing
      function standardizeMobileCards() {
        const mobileCards = document.querySelectorAll('.mobile-card');
        
        mobileCards.forEach(card => {
          // Ensure product image has proper dimensions
          const productImage = card.querySelector('.product-image');
          if (productImage) {
            productImage.style.height = '200px';
            
            const img = productImage.querySelector('img');
            if (img) {
              img.style.maxHeight = '180px';
              img.style.maxWidth = '90%';
            }
          }
          
          // Ensure consistent button styling
          const consultarBtn = card.querySelector('.consultar-btn');
          if (consultarBtn) {
            consultarBtn.style.width = '120px';
            consultarBtn.style.height = '40px';
            consultarBtn.style.margin = '15px auto';
          }
        });
      }
      
      standardizeMobileCards();
      
      // Also observe for changes
      const observer = new MutationObserver(() => {
        standardizeMobileCards();
      });
      
      observer.observe(mobileContainer, { childList: true, subtree: true });
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el formulario
    const form = document.querySelector('.form-container form');
    
    // Agregar event listener para el envío del formulario
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío normal del formulario
            
            // Obtener los datos del formulario
            const formData = new FormData(form);
            
            // Enviar los datos usando fetch
            fetch('procesar-formulario.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Crear elemento para mostrar el mensaje
                const messageElement = document.createElement('div');
                messageElement.className = data.success ? 'success-message' : 'error-message';
                messageElement.textContent = data.message;
                
                // Insertar el mensaje después del formulario
                form.parentNode.insertBefore(messageElement, form.nextSibling);
                
                // Si el envío fue exitoso, limpiar el formulario
                if (data.success) {
                    form.reset();
                    
                    // Eliminar el mensaje después de 5 segundos
                    setTimeout(() => {
                        messageElement.remove();
                    }, 5000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Crear elemento para mostrar el error
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = 'Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.';
                
                // Insertar el mensaje después del formulario
                form.parentNode.insertBefore(errorElement, form.nextSibling);
                
                // Eliminar el mensaje después de 5 segundos
                setTimeout(() => {
                    errorElement.remove();
                }, 5000);
            });
        });
    }
});