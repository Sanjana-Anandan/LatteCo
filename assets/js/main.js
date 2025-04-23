document.addEventListener('DOMContentLoaded', () => {
  /*=============== SHOW MENU ===============*/
  const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

  /*===== MENU SHOW =====*/
  /* Validate if constant exists */
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  /*===== MENU HIDDEN =====*/
  /* Validate if constant exists */
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  /*=============== REMOVE MENU MOBILE ===============*/
  const navLink = document.querySelectorAll('.nav__link');

  const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
  };
  navLink.forEach((n) => n.addEventListener('click', linkAction));

  const scrollHeader = () => {
    const header = document.getElementById('header');
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    this.scrollY >= 50
      ? header.classList.add('scroll-header')
      : header.classList.remove('scroll-header');
  };
  window.addEventListener('scroll', scrollHeader);

  /*=============== CART FUNCTIONALITY ===============*/
  const cartLink = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-panel');
  const cartModalClose = document.getElementById('cart-close');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalElem = document.getElementById('cart-total');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');

  function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      cartTotalElem.textContent = 'Total: $0';
      return;
    }

    let total = 0;
    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');
      itemDiv.innerHTML = `
        <div>
          <strong>${item.name}</strong>
        </div>
        <div>Price: $${item.price.toFixed(2)}</div>
        <div>
          Quantity: <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" />
        </div>
        <div>Subtotal: $${subtotal.toFixed(2)}</div>
        <button data-index="${index}" class="remove-btn">Remove</button>
        <hr/>
      `;
      cartItemsContainer.appendChild(itemDiv);
    });
    cartTotalElem.textContent = 'Total: $' + total.toFixed(2);

    // Add event listeners for quantity inputs and remove buttons
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = e.target.getAttribute('data-index');
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        e.target.value = val;
        const cart = getCart();
        cart[idx].quantity = val;
        saveCart(cart);
        renderCart();
      });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        const cart = getCart();
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      });
    });
  }

  clearCartBtn.addEventListener('click', () => {
    localStorage.removeItem('cart');
    renderCart();
  });

  checkoutBtn.addEventListener('click', () => {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    alert('Thank you for your purchase! Payment method: ' + paymentMethod);
    localStorage.removeItem('cart');
    renderCart();
  });

  cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.classList.add('open');
    renderCart();
  });

  // Dynamically add Pay Now button to cart panel buttons
  const cartPanelButtons = document.querySelector('.cart-panel-buttons');
  if (cartPanelButtons) {
    const payNowBtn = document.createElement('button');
    payNowBtn.id = 'pay-now';
    payNowBtn.textContent = 'Pay Now';
    cartPanelButtons.appendChild(payNowBtn);

    payNowBtn.addEventListener('click', () => {
      const paymentMethodElem = document.querySelector('input[name="payment"]:checked');
      if (!paymentMethodElem) {
        alert('Please select a payment method.');
        return;
      }
      const paymentMethod = paymentMethodElem.value;

      if (paymentMethod === 'Credit Card') {
        const cardNumber = document.getElementById('card-number').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        const cardCvc = document.getElementById('card-cvc').value.trim();
        if (!cardNumber || !cardExpiry || !cardCvc) {
          alert('Please fill in all credit card details.');
          return;
        }
      }

      alert('Payment successful. Thank you for your purchase!');
      // Optionally clear cart and close panel
      localStorage.removeItem('cart');
      renderCart();
      cartModal.classList.remove('open');
    });
  }

  cartModalClose.addEventListener('click', () => {
    cartModal.classList.remove('open');
  });

  /*=============== ADD TO CART BUTTONS ===============*/
  const addToCartButtons = document.querySelectorAll('.products__button');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.products__card');
      const name = productCard.querySelector('.products__name').textContent;
      const priceText = productCard.querySelector('.products__price').textContent;
      const price = parseFloat(priceText.replace('$', ''));
      const cart = getCart();
      const existingItemIndex = cart.findIndex(item => item.name === name);
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      saveCart(cart);
      alert(`${name} added to cart.`);
    });
  });

  /*=============== FIND NEARBY CAFES BUTTON ===============*/
  const findNearbyBtn = document.getElementById('find-nearby-stores');
  if (findNearbyBtn) {
    findNearbyBtn.addEventListener('click', () => {
      const mapsUrl = 'https://www.google.com/maps/search/coffee+shops+near+me';
      window.open(mapsUrl, '_blank');
    });
  }

  /*=============== DAILY SPECIALS COUNTDOWN TIMER ===============*/
  const countdownTimerElem = document.getElementById('countdown-timer');
  if (countdownTimerElem) {
    // Set countdown duration in seconds (e.g., 12 minutes 45 seconds = 765 seconds)
    let countdownSeconds = 12 * 60 + 45;

    const updateCountdown = () => {
      if (countdownSeconds <= 0) {
        countdownTimerElem.textContent = '00:00:00';
        clearInterval(countdownInterval);
        return;
      }
      const hours = Math.floor(countdownSeconds / 3600);
      const minutes = Math.floor((countdownSeconds % 3600) / 60);
      const seconds = countdownSeconds % 60;
      countdownTimerElem.textContent = 
        `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      countdownSeconds--;
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
  }

  /*=============== CUSTOMIZABLE ORDERS (DYNAMIC FORMS) ===============*/
  const productCards = document.querySelectorAll('.products__card');

  productCards.forEach(card => {
    const basePriceElem = card.querySelector('.products__price');
    if (!basePriceElem) return;

    const basePrice = parseFloat(basePriceElem.getAttribute('data-base-price') || basePriceElem.textContent.replace('$', ''));
    const customPriceElem = card.querySelector('.custom-price');
    const sizeSelect = card.querySelector('.custom-option.size');

    if (!customPriceElem || !sizeSelect) return;

    const priceModifiers = JSON.parse(sizeSelect.getAttribute('data-price-modifier'));

    const updatePrice = () => {
      const selectedSize = sizeSelect.value;
      const modifier = priceModifiers[selectedSize] || 0;
      const newPrice = basePrice + modifier;
      customPriceElem.textContent = `Price: $${newPrice.toFixed(2)}`;
    };

    sizeSelect.addEventListener('change', updatePrice);

    // Initialize price on load
    updatePrice();
  });

  /*=============== SPEECH-BASED SEARCH ===============*/
  // Create and insert speech search button in products section header
  const productsSection = document.getElementById('products');
  if (productsSection) {
    const sectionTitle = productsSection.querySelector('.section__title');
    if (sectionTitle) {
      const speechBtn = document.createElement('button');
      speechBtn.textContent = '🎤 Voice Search';
      speechBtn.style.marginLeft = '10px';
      speechBtn.style.padding = '5px 10px';
      speechBtn.style.cursor = 'pointer';
      sectionTitle.appendChild(speechBtn);

      const productsContent = productsSection.querySelector('.products__content');

      // Add filtering function for category and name
      function filterProductsByCategoryOrName(filter) {
        const productCards = productsContent.querySelectorAll('.products__card');
        productCards.forEach(card => {
          const nameElem = card.querySelector('.products__name');
          if (!nameElem) return;
          const nameText = nameElem.textContent.toLowerCase();
          const cardClasses = card.classList;
          // Normalize filter for category matching
          const normalizedFilter = filter.trim().toLowerCase();
          if (normalizedFilter === '') {
            // Show all products
            card.style.display = 'block';
          } else if (normalizedFilter === 'main menu' && cardClasses.contains('main-menu')) {
            card.style.display = 'block';
          } else if (normalizedFilter === 'coffee' && cardClasses.contains('coffee')) {
            card.style.display = 'block';
          } else if ((normalizedFilter === 'dessert' || normalizedFilter === 'desserts') && cardClasses.contains('dessert')) {
            card.style.display = 'block';
          } else if (nameText.includes(normalizedFilter)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }

      // Add click event listeners to filter menu items
      const filterItems = document.querySelectorAll('.products__filters .products__item');

      // Mapping from data-filter attribute to product card class
      const filterClassMap = {
        '.delicacies': '', // empty string means show all
        '.coffee': 'coffee',
        '.cake': 'dessert'
      };

      filterItems.forEach(item => {
        item.addEventListener('click', () => {
          // Remove active class from all
          filterItems.forEach(i => i.classList.remove('active-product'));
          // Add active class to clicked
          item.classList.add('active-product');
          // Get data-filter attribute
          const dataFilter = item.getAttribute('data-filter');
          const filterClass = filterClassMap[dataFilter] || '';
          filterProductsByCategoryOrName(filterClass);
        });
      });

      speechBtn.addEventListener('click', () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          alert('Speech Recognition API not supported in this browser.');
          return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          filterProductsByCategoryOrName(transcript);
        };

        recognition.onerror = (event) => {
          alert('Speech recognition error: ' + event.error);
        };
      });
    }
  };

  /*=============== ORDER NOW BUTTON ===============*/
  const orderNowBtn = document.querySelector('.hero__button');
  if (orderNowBtn) {
    orderNowBtn.addEventListener('click', () => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});
document.addEventListener("DOMContentLoaded", function () {
  const widget = document.getElementById('spotifyWidget');
  const btn = document.getElementById('minimizeBtn');

  btn.addEventListener('click', () => {
    widget.classList.toggle('minimized');
    btn.textContent = widget.classList.contains('minimized') ? 'Show 🎵' : 'Hide 🎵';
  });
});

