(function(){
  // Nav active state
  const current = document.body.getAttribute('data-page');
  document.querySelectorAll('[data-nav]').forEach(a=>{
    if(a.getAttribute('data-nav')===current){ a.classList.add('active'); }
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.getElementById('mobile-menu');
  if(toggle && mobile){
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', (!expanded).toString());
      mobile.style.display = expanded ? 'none' : 'block';
    });
  }

  // Footer year
  const y = document.getElementById('year');
  if(y){ y.textContent = new Date().getFullYear(); }

  // Restaurants page data + rendering
  const restaurantGrid = document.getElementById('restaurantGrid');
  const sampleData = [
    {name:"South Side Slice", cuisine:"Italian", price:"$", neighborhood:"Hyde Park", img:"https://images.unsplash.com/photo-1548365328-9f547fb0953d?q=80&w=1200&auto=format&fit=crop"},
    {name:"Pilsen Street Tacos", cuisine:"Mexican", price:"$", neighborhood:"Pilsen", img:"https://images.unsplash.com/photo-1601050690597-9fd90f5d16b0?q=80&w=1200&auto=format&fit=crop"},
    {name:"Little Dumpling House", cuisine:"Chinese", price:"$$", neighborhood:"Chinatown", img:"https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop"},
    {name:"Loop Falafel Co.", cuisine:"Middle Eastern", price:"$", neighborhood:"Loop", img:"https://images.unsplash.com/photo-1615141982883-c7ad0d331b5c?q=80&w=1200&auto=format&fit=crop"},
    {name:"Lincoln Park Pasta", cuisine:"Italian", price:"$$", neighborhood:"Lincoln Park", img:"https://images.unsplash.com/photo-1526312426976-593c222c922f?q=80&w=1200&auto=format&fit=crop"},
    {name:"Hyde Park Curry", cuisine:"Indian", price:"$$", neighborhood:"Hyde Park", img:"https://images.unsplash.com/photo-1625944527797-f05a1fd9b756?q=80&w=1200&auto=format&fit=crop"},
    {name:"Pilsen Arepa Bar", cuisine:"Mexican", price:"$", neighborhood:"Pilsen", img:"https://images.unsplash.com/photo-1604908554029-2f2a0d8b5a7c?q=80&w=1200&auto=format&fit=crop"},
    {name:"Chinatown Noodle Lab", cuisine:"Chinese", price:"$", neighborhood:"Chinatown", img:"https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1200&auto=format&fit=crop"},
    {name:"Loop Kebab Kitchen", cuisine:"Middle Eastern", price:"$$", neighborhood:"Loop", img:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200&auto=format&fit=crop"}
  ];
  let visible = 6;

  function renderRestaurants(list){
    if(!restaurantGrid) return;
    restaurantGrid.innerHTML = list.slice(0, visible).map(r=>`
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
  }

  const gridExists = !!restaurantGrid;
  if(gridExists){
    renderRestaurants(sampleData);

    const q = document.getElementById('search');
    const cuisine = document.getElementById('cuisine');
    const price = document.getElementById('price');
    const hood = document.getElementById('neighborhood');
    const apply = document.getElementById('applyFilters');
    const clear = document.getElementById('clearFilters');
    const loadMore = document.getElementById('loadMore');

    let filtered = sampleData.slice();

    function applyFilters(){
      const term = (q.value || '').toLowerCase().trim();
      filtered = sampleData.filter(r=>{
        const matchesTerm = term ? (r.name.toLowerCase().includes(term) || r.cuisine.toLowerCase().includes(term)) : true;
        const matchesCuisine = cuisine.value ? r.cuisine === cuisine.value : true;
        const matchesPrice = price.value ? r.price === price.value : true;
        const matchesHood = hood.value ? r.neighborhood === hood.value : true;
        return matchesTerm && matchesCuisine && matchesPrice && matchesHood;
      });
      visible = 6;
      renderRestaurants(filtered);
    }

    apply && apply.addEventListener('click', applyFilters);
    clear && clear.addEventListener('click', ()=>{
      q.value=''; cuisine.value=''; price.value=''; hood.value='';
      filtered = sampleData.slice(); visible=6; renderRestaurants(filtered);
    });
    loadMore && loadMore.addEventListener('click', ()=>{
      visible += 3; renderRestaurants(filtered);
    });
  }

  // Gallery lightbox
  const galleryGrid = document.getElementById('galleryGrid');
  if(galleryGrid){
    const galleryItems = [
      {src:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop", cap:"Maxwell Street Polish"},
      {src:"https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", cap:"Deep Dish Classic"},
      {src:"https://images.unsplash.com/photo-1544025161-1971a3ea5f19?q=80&w=1200&auto=format&fit=crop", cap:"Bridgeport BBQ"},
      {src:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1200&auto=format&fit=crop", cap:"Street Tacos in Pilsen"},
      {src:"https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop", cap:"Dim Sum Sunday"},
      {src:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1200&auto=format&fit=crop", cap:"Hyde Park Brunch"}
    ];
    galleryGrid.innerHTML = galleryItems.map(i=>`<img src="${i.src}" alt="${i.cap}" data-cap="${i.cap}" loading="lazy">`).join('');

    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbCap = document.getElementById('lightboxCaption');
    const lbClose = document.querySelector('.lightbox-close');

    galleryGrid.addEventListener('click', (e)=>{
      const target = e.target;
      if(target.tagName === 'IMG'){
        lbImg.src = target.src;
        lbImg.alt = target.alt;
        lbCap.textContent = target.dataset.cap || '';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
      }
    });
    lbClose.addEventListener('click', ()=>{
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src='';
    });
    lb.addEventListener('click', (e)=>{
      if(e.target === lb){ lbClose.click(); }
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && lb.classList.contains('open')){ lbClose.click(); }
    });
  }

  // Forms validation + confirmation
  function setupForm(formId){
    const form = document.getElementById(formId);
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(el=>{
        const small = el.parentElement.querySelector('.error');
        if(!el.value.trim()){
          valid = false;
          if(small) small.textContent = 'This field is required.';
          el.setAttribute('aria-invalid','true');
        }else{
          if(small) small.textContent = '';
          el.removeAttribute('aria-invalid');
        }
      });
      // Simple email check
      const email = form.querySelector('input[type="email"]');
      if(email){
        const ok = /^\S+@\S+\.\S+$/.test(email.value);
        if(!ok){ valid=false; email.parentElement.querySelector('.error').textContent='Please enter a valid email.'; }
      }
      if(valid){
        alert('Thanks! Your submission has been received.');
        form.reset();
      }
    });
  }
  setupForm('contactForm');
  setupForm('reviewForm');
})();

