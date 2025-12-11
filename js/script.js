(function () {
  // Nav active state
  const current = document.body.getAttribute('data-page');
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === current) a.classList.add('active');
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.getElementById('mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', (!expanded).toString());
      mobile.style.display = expanded ? 'none' : 'block';
    });
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // --- Restaurants page ---
  const restaurantGrid = document.getElementById('restaurantGrid');
  const sampleData = [
    {
      name: "The Pasta Bowl",
      cuisine: "Italian",
      price: "$",
      neighborhood: "Lincoln Park",
      img: "https://d2s742iet3d3t1.cloudfront.net/restaurant_service/restaurants/9c5986fd-012c-4dc9-93e8-63d02eca94d8/Restaurant/94eddda8-52cd-4d82-bf32-922511b8360e.jpg"
    },
    {
      name: "El Famous Burrito",
      cuisine: "Mexican",
      price: "$",
      neighborhood: "Rogers Park",
      img: "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/store/header/40af2da1-c503-414b-ac7f-303a978c1a8e.JPG"
    },
    {
      name: "MingHin Cuisine",
      cuisine: "Chinese",
      price: "$$",
      neighborhood: "Chinatown",
      img: "https://tb-static.uber.com/prod/image-proc/processed_images/3c3812fe32953c4c293d9413d8f43b1d/c9252e6c6cd289c588c3381bc77b1dfc.jpeg"
    },
    {
      name: "Trivoli Tavern",
      cuisine: "Italian",
      price: "$$$",
      neighborhood: "Loop",
      img: "https://www.lemon8-app.com/seo/image?item_id=7225618378269245958&index=0&sign=4f2226a16ec561a93ea61d3935377d3a"
    },
    {
      name: "Little Goat Diner",
      cuisine: "Diner Classic",
      price: "$",
      neighborhood: "Lake View",
      img: "https://images.squarespace-cdn.com/content/v1/67a74865610a88774386fe2c/1739282391564-D1BHQCUTAKALBFQOI2JC/IMG_8823.jpg"
    },
    {
      name: "Serena Restaurant",
      cuisine: "Indian",
      price: "$$",
      neighborhood: "Rogers Park",
      img: "https://serenarestaurant.com/wp-content/uploads/2024/09/AuthenticandHalalPakistaniandIndianDishes-ezgif.com-optiwebp.webp"
    },
    {
      name: "Pizzeria Portofino",
      cuisine: "Italian",
      price: "$$",
      neighborhood: "Loop",
      img: "https://storage.googleapis.com/pizzeriaportofino_bucket/wp-content/uploads/3d394ce6-pizzeria-portofino_bar-harbor-mussels-pigato-portofino-punta-crena-.jpg"
    },
    {
      name: "Meat Moot",
      cuisine: "Middle Eastern",
      price: "$$$",
      neighborhood: "Burbank",
      img: "https://meatmoot.com.tr/storage/2025/09/Smoked-Beef-Brisket-Meat-Moot-Menu.webp"
    }
  ];

  function noResults() {
    return `
      <article class="card place" style="grid-column: 1 / -1; text-align:center;">
        <div class="place-body">
          <h3>No matches</h3>
          <div class="place-meta">Try different filters.</div>
        </div>
      </article>`;
  }

  let visible = 6;

  function renderRestaurants(list) {
    if (!restaurantGrid) return;
    const items = list.slice(0, visible).map(r => `
      <article class="card place">
        <img src="${r.img}" alt="${r.name}" loading="lazy" />
        <div class="place-body">
          <h3>${r.name}</h3>
          <div class="place-meta">
            <span>${r.cuisine}</span>
            <span>• ${r.price}</span>
            <span>• ${r.neighborhood}</span>
          </div>
        </div>
      </article>
    `).join('');
    restaurantGrid.innerHTML = items || noResults();
  }

  if (restaurantGrid) {
    renderRestaurants(sampleData);

    const q = document.getElementById('search'); 
    const cuisine = document.getElementById('cuisine');
    const price = document.getElementById('price');
    const hood = document.getElementById('neighborhood');
    const apply = document.getElementById('applyFilters');
    const clear = document.getElementById('clearFilters');
    const loadMore = document.getElementById('loadMore');

    let filtered = sampleData.slice();

    function applyFilters() {
      const term = q ? (q.value || '').toLowerCase().trim() : '';
      filtered = sampleData.filter(r => {
        const matchesTerm = term ? (
          r.name.toLowerCase().includes(term) ||
          r.cuisine.toLowerCase().includes(term) ||
          r.neighborhood.toLowerCase().includes(term)
        ) : true;

        const matchesCuisine = cuisine.value ? r.cuisine === cuisine.value : true;
        const matchesPrice   = price.value   ? r.price === price.value       : true;
        const matchesHood    = hood.value    ? r.neighborhood === hood.value : true;

        return matchesTerm && matchesCuisine && matchesPrice && matchesHood;
      });

      visible = 6;
      renderRestaurants(filtered);
    }

    apply && apply.addEventListener('click', applyFilters);

    // Also filter immediately on dropdown change (nice UX)
    [cuisine, price, hood].forEach(el => {
      el && el.addEventListener('change', applyFilters);
    });

    clear && clear.addEventListener('click', () => {
      if (q) q.value = '';
      cuisine.value = '';
      price.value   = '';
      hood.value    = '';
      filtered = sampleData.slice();
      visible = 6;
      renderRestaurants(filtered);
    });

    loadMore && loadMore.addEventListener('click', () => {
      visible += 3;
      renderRestaurants(filtered);
    });
  }

  // --- Gallery lightbox ---
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    const galleryItems = [
      { src: "https://meatmoot.com.tr/storage/2023/01/LAMB-SHOULDER-MEAT-MOOT-1-scaled-e1673617640447.webp", cap: "Meat Moot Lamb Shank" },
      { src: "https://serenarestaurant.com/wp-content/uploads/2023/11/Homepage-min.jpg", cap: "Serena Resturant Seekh Kebob & Chicken Kebob" },
      { src: "https://tb-static.uber.com/prod/image-proc/processed_images/48eb7b673d48cce8183ab481a7ff3173/f6deb0afc24fee6f4bd31a35e6bcbd47.jpeg", cap: "SALT Burger & Fries" },
      { src: "https://s3-media0.fl.yelpcdn.com/bphoto/b-3j62AUaKQn7qKG4PuOLQ/348s.jpg", cap: "Mediterranean near Rogers Park" },
      { src: "https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=600,height=400,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/32f131c8-61e5-45ce-8eac-304d4a7ee3d7.jpg", cap: "Sharks Fish & Chicken" },
      { src: "https://preview.redd.it/trio-french-toast-flight-at-honeybear-cafe-v0-hbjueefovg7c1.jpeg?auto=webp&s=f61441454a2ff84b034f13f2d106e0d22a532e8c", cap: "Honeybear Cafe Rogers Park" },
      { src: "https://s3-media0.fl.yelpcdn.com/bphoto/Xk_eCdZviriApm2FF1h-Aw/348s.jpg", cap: "Ann Sather Lake View" },
      { src: "https://images.squarespace-cdn.com/content/v1/62684e1fe9da29777be00b0e/1654024147230-PCVWO0QTEPC8944NNB7C/foodphoto4.jpeg", cap: "Hot Chi Chicken Loop Area" },
      { src: "https://cp1.inkrefuge.com/admin/asset/uploads/441/on_page_element/eggtuck-home-banner.jpg", cap: "Egg Tuck Lincoln Park" }
    ];

    galleryGrid.innerHTML = galleryItems.map(i =>
      `<img src="${i.src}" alt="${i.cap}" data-cap="${i.cap}" loading="lazy">`
    ).join('');

    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbCap = document.getElementById('lightboxCaption');
    const lbClose = document.querySelector('.lightbox-close');

    galleryGrid.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'IMG') {
        lbImg.src = target.src;
        lbImg.alt = target.alt;
        lbCap.textContent = target.dataset.cap || '';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
      }
    });

    lbClose && lbClose.addEventListener('click', () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
    });

    lb && lb.addEventListener('click', (e) => {
      if (e.target === lb) lbClose.click();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lb.classList.contains('open')) lbClose.click();
    });
  }

  function setupForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      form.querySelectorAll('[required]').forEach(el => {
        const small = el.parentElement.querySelector('.error');
        if (!el.value.trim()) {
          valid = false;
          if (small) small.textContent = 'This field is required.';
          el.setAttribute('aria-invalid', 'true');
        } else {
          if (small) small.textContent = '';
          el.removeAttribute('aria-invalid');
        }
      });

      const email = form.querySelector('input[type="email"]');
      if (email) {
        const ok = /^\S+@\S+\.\S+$/.test(email.value);
        if (!ok) {
          valid = false;
          const small = email.parentElement.querySelector('.error');
          if (small) small.textContent = 'Please enter a valid email.';
        }
      }

      if (valid) {
        alert('Thanks! Your submission has been received.');
        form.reset();
      }
    });
  }

  setupForm('contactForm');
  setupForm('reviewForm');
})();

