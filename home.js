/* ═══════════════════════════════════════════════════════════════
   AFI SYSTEMS — home.js
   All interactive logic for the homepage
   ═══════════════════════════════════════════════════════════════ */

/* ── HERO SLIDER ── */
(function initHero() {
  const track  = document.getElementById('heroTrack');
  const slides = track.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let idx = 0;
  const N = slides.length;

  function goTo(i) {
    slides[idx].classList.remove('active');
    idx = (i + N) % N;
    slides[idx].classList.add('active');
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === idx));
  }

  document.getElementById('heroPrev').onclick = () => goTo(idx - 1);
  document.getElementById('heroNext').onclick = () => goTo(idx + 1);
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

  let timer = setInterval(() => goTo(idx + 1), 5500);
  const heroEl = document.getElementById('hero');
  heroEl.addEventListener('mouseenter', () => clearInterval(timer));
  heroEl.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(idx + 1), 5500); });

  // Touch / swipe support
  let tx = 0;
  heroEl.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  heroEl.addEventListener('touchend',   e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? idx + 1 : idx - 1);
  });
})();

/* ── CORPORATE VIDEO: play / pause toggle ── */
(function initVideo() {
  const vid     = document.getElementById('bgVideo');
  const icon    = document.getElementById('vidIcon');
  const fallback = document.getElementById('vidFallback');
  if (!vid) return;

  vid.addEventListener('error', () => {
    vid.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
    if (icon) icon.className = 'fas fa-play';
  });

  const btn = document.getElementById('vidPlayBtn');
  if (btn) btn.addEventListener('click', () => {
    if (vid.paused) { vid.play(); icon.className = 'fas fa-pause'; }
    else            { vid.pause(); icon.className = 'fas fa-play'; }
  });
})();

/* ── INDUSTRIES GRID ── */
(function buildIndustries() {
  const list = [
    { name: 'Pharmaceuticals',   icon: 'fas fa-flask' },
    { name: 'Corporate Offices', icon: 'fas fa-building' },
    { name: 'Banking & Finance', icon: 'fas fa-university' },
    { name: 'Media & IT',        icon: 'fas fa-laptop-code' },
    { name: 'Hospitality',       icon: 'fas fa-concierge-bell' },
    { name: 'Home & Residential',icon: 'fas fa-home' },
    { name: 'Healthcare',        icon: 'fas fa-hospital' },
    { name: 'Education',         icon: 'fas fa-graduation-cap' },
    { name: 'Co-Working',        icon: 'fas fa-users' },
    { name: 'Automotive',        icon: 'fas fa-car' },
    { name: 'Retail',            icon: 'fas fa-store' },
    { name: 'Defence',           icon: 'fas fa-shield-alt' },
    { name: 'Warehousing',       icon: 'fas fa-warehouse' },
    { name: 'Agriculture',       icon: 'fas fa-seedling' },
    { name: 'Event Management',  icon: 'fas fa-calendar-check' },
    { name: 'Hotels',            icon: 'fas fa-hotel' },
    { name: 'Research Labs',     icon: 'fas fa-microscope' },
    { name: 'Export',            icon: 'fas fa-globe' },
  ];
  const grid = document.getElementById('indGrid');
  if (!grid) return;
  grid.innerHTML = list.map(item => `
    <div class="ind-item anim-up">
      <div class="ind-ico"><i class="${item.icon}"></i></div>
      <span>${item.name}</span>
    </div>`).join('');
})();

/* ── PRODUCT CAROUSELS ── */
(function initCarousels() {
  const chairs = [
    { img: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=440&q=75&fit=crop', name: 'Executive High-Back Chair',   old: '₹12,500', price: '₹8,999',  disc: '28% OFF', badge: 'new'  },
    { img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=440&q=75&fit=crop', name: 'L-Shape Workstation Desk',    old: '₹22,000', price: '₹15,499', disc: '30% OFF', badge: 'sale' },
    { img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=440&q=75&fit=crop', name: '12-Seater Conference Table',  old: '₹58,000', price: '₹42,000', disc: '28% OFF', badge: ''     },
    { img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=440&q=75&fit=crop', name: 'L-Shape Reception Desk',      old: '₹35,000', price: '₹24,999', disc: '29% OFF', badge: 'new'  },
    { img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=440&q=75&fit=crop',   name: '4-Door Metal Locker',         old: '₹9,500',  price: '₹6,999',  disc: '26% OFF', badge: ''     },
    { img: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=440&q=75&fit=crop', name: 'Mesh Ergonomic Chair',        old: '₹7,800',  price: '₹5,299',  disc: '32% OFF', badge: 'new'  },
    { img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=440&q=75&fit=crop', name: 'Fixed Base Chair',            old: '₹5,200',  price: '₹3,799',  disc: '27% OFF', badge: 'sale' },
    { img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=440&q=75&fit=crop', name: 'Café Chair 4-Seater Set',     old: '₹12,000', price: '₹8,499',  disc: '29% OFF', badge: ''     },
  ];

  const tables = [
    { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=440&q=75&fit=crop',   name: '3-Seater Fabric Sofa Set',    old: '₹28,000', price: '₹19,999', disc: '29% OFF', badge: 'new'  },
    { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=440&q=75&fit=crop',   name: '6-Door Sliding Wardrobe',     old: '₹38,000', price: '₹26,500', disc: '30% OFF', badge: 'sale' },
    { img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=440&q=75&fit=crop',   name: 'Modular Kitchen Unit',        old: '₹45,000', price: '₹32,000', disc: '29% OFF', badge: ''     },
    { img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=440&q=75&fit=crop',   name: 'Work From Home Desk',         old: '₹8,200',  price: '₹5,499',  disc: '33% OFF', badge: 'sale' },
    { img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=440&q=75&fit=crop', name: '3-Drawer File Cabinet',      old: '₹6,500',  price: '₹4,799',  disc: '26% OFF', badge: ''     },
    { img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=440&q=75&fit=crop', name: 'Queen Bed with Storage',     old: '₹22,000', price: '₹15,999', disc: '27% OFF', badge: 'new'  },
    { img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=440&q=75&fit=crop', name: 'LED Panel Wardrobe',         old: '₹32,000', price: '₹22,999', disc: '28% OFF', badge: 'sale' },
    { img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=440&q=75&fit=crop', name: '2-Seater Student Bench',     old: '₹3,800',  price: '₹2,599',  disc: '32% OFF', badge: ''     },
  ];

  function buildCard(p) {
    const badge = p.badge === 'new'  ? `<div class="badge-new">NEW</div>`
                : p.badge === 'sale' ? `<div class="badge-sale">SALE</div>` : '';
    const msg = encodeURIComponent(
      `Hi AFI Systems, I'm interested in: *${p.name}* (${p.price}). Please share details.`
    );
    return `
      <div class="prod-card">
        <div class="prod-img">${badge}<img src="${p.img}" alt="${p.name}" loading="lazy"/></div>
        <div class="prod-body">
          <div class="prod-name">${p.name}</div>
          <div class="prod-stars">
            <span class="star-row">★★★★<span style="color:#ddd">★</span></span>
            <span class="star-cnt">(222)</span>
          </div>
          <div class="prod-price">
            <span class="price-old">${p.old}</span>
            <span class="price-new">${p.price}</span>
            <span class="price-off">${p.disc}</span>
          </div>
          <a href="https://wa.me/919818251017?text=${msg}" target="_blank" class="btn-enquire">
            <i class="fab fa-whatsapp"></i>Enquire Now
          </a>
        </div>
      </div>`;
  }

  function initCarousel(trackId, prevId, nextId, items) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = items.map(buildCard).join('');

    let cur = 0;

    function visCount() {
      const w = window.innerWidth;
      return w >= 1400 ? 6 : w >= 1200 ? 5 : w >= 992 ? 4 : w >= 768 ? 3 : 2;
    }
    function cardW() {
      const c = track.querySelector('.prod-card');
      return c ? c.offsetWidth + 100 : 236;
    }
    function maxIdx() {
      /* Clamp so last card aligns to right — no blank space */
      return Math.max(0, items.length - visCount());
    }
    function slide() {
      cur = Math.max(0, Math.min(cur, maxIdx()));
      track.style.transform = `translateX(-${cur * cardW()}px)`;
      document.getElementById(prevId).disabled = cur <= 0;
      document.getElementById(nextId).disabled = cur >= maxIdx();
    }

    document.getElementById(prevId).onclick = () => { cur--; slide(); };
    document.getElementById(nextId).onclick = () => { cur++; slide(); };
    window.addEventListener('resize', () => { cur = Math.min(cur, maxIdx()); slide(); });
    slide();
  }

  initCarousel('chairsTrack', 'chPrev', 'chNext', chairs);
  initCarousel('tablesTrack', 'tbPrev', 'tbNext', tables);
})();

/* ── CLIENTS GRID ── */
(function buildClients() {
  const clients = [
    { name: 'ICompany',       icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'PolicyBazaar',   icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Socomec',        icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Airtel',         icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Bacardi',        icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'DHFL',           icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Red Bull',       icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'TISCO',          icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Antalis',        icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'BNI',            icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Orient',         icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Fortis',         icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'TATA',           icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Amplifon',       icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Reddlife',       icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'DRDO',           icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Red FM',         icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
    { name: 'Café Coffee Day',icon: 'https://www.officetoday.in/OfficeTodaylmages/ClientLogoImage/fortis.jpg' },
  ];
  const grid = document.getElementById('clientGrid');
  if (!grid) return;
  grid.innerHTML = clients.map(c => `
    <div class="client-box">

      <div class="c-ico"><img src="${c.icon}" /></div>
      
    </div>`).join('');
})();
      // <div class="c-ico"><i class="${c.icon}"></i></div>
      // <div class="c-name">${c.name}</div>
/* ── FLAGSHIP SLIDER ── */
(function initFlagship() {
  const track = document.getElementById('flagTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.flag-card');
  let fIdx = 0;

  function goFlag(dir) {
    const vis = window.innerWidth >= 992 ? 3 : window.innerWidth >= 576 ? 2 : 1;
    const max = Math.max(0, cards.length - vis);
    fIdx = Math.max(0, Math.min(fIdx + dir, max));
    const w = cards[0] ? cards[0].offsetWidth : 340;
    track.style.transform = `translateX(-${fIdx * w}px)`;
  }

  document.getElementById('flagPrev').onclick = () => goFlag(-1);
  document.getElementById('flagNext').onclick = () => goFlag(1);
  window.addEventListener('resize', () => goFlag(0));
})();

/* ── INSTAGRAM REELS ── */
(function buildReels() {
  const reels = [
    { img: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=700&q=75&fit=crop', cap: 'Executive Chair Setup 🪑', views: '12.4K' },
    { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=700&q=75&fit=crop',   cap: 'Living Room Sofa 🛋️',      views: '8.1K'  },
    { img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=700&q=75&fit=crop',   cap: 'Modular Kitchen Install',  views: '15.6K' },
    { img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=700&q=75&fit=crop',cap: 'Modern Workstation',       views: '9.3K'  },
    { img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=700&q=75&fit=crop',cap: 'Café Complete Fit-out',    views: '22.1K' },
    { img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=700&q=75&fit=crop',cap: 'School Library Furniture', views: '6.8K'  },
    { img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&h=700&q=75&fit=crop',cap: 'LED Panel Wardrobe ✨',     views: '18.9K' },
    { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&q=75&fit=crop',   cap: 'Sliding Wardrobe Install', views: '11.2K' },
  ];

  const rTrack = document.getElementById('reelsTrack');
  if (!rTrack) return;
  rTrack.innerHTML = reels.map(r => `
    <div class="reel-card" onclick="window.open('https://instagram.com','_blank')">
      <div class="reel-thumb">
        <img src="${r.img}" alt="Reel" loading="lazy"/>
        <div class="reel-play"><i class="fas fa-play" style="margin-left:2px"></i></div>
        <div class="reel-ov">
          <div class="reel-cap">${r.cap}</div>
          <div class="reel-views"><i class="fas fa-eye"></i>${r.views}</div>
        </div>
      </div>
    </div>`).join('');

  let rlIdx = 0;
  function visReels() {
    const w = window.innerWidth;
    return w >= 1200 ? 6 : w >= 992 ? 5 : w >= 768 ? 4 : w >= 576 ? 3 : 2;
  }
  function goReels(dir) {
    const max = Math.max(0, reels.length - visReels());
    rlIdx = Math.max(0, Math.min(rlIdx + dir, max));
    const w = (rTrack.querySelector('.reel-card')?.offsetWidth || 174) + 12;
    rTrack.style.transform = `translateX(-${rlIdx * w}px)`;
  }
  document.getElementById('rlPrev').onclick = () => goReels(-1);
  document.getElementById('rlNext').onclick = () => goReels(1);
  window.addEventListener('resize', () => goReels(0));
})();

/* ── ANIMATED COUNTERS ── */
(function initCounters() {
  let done = false;
  function animCount(el, target, dur = 1800) {
    let s = 0, step = target / (dur / 16);
    const tm = setInterval(() => {
      s += step;
      if (s >= target) { el.textContent = target; clearInterval(tm); }
      else              { el.textContent = Math.floor(s); }
    }, 16);
  }
  const statsEl = document.getElementById('stats');
  if (!statsEl) return;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !done) {
      done = true;
      document.querySelectorAll('.stat-n[data-target]')
        .forEach(el => animCount(el, +el.dataset.target ));
    }
  }, { threshold: .3 }).observe(statsEl);
})();

/* ── SCROLL REVEAL ANIMATIONS ── */
(function initReveal() {
  const els = document.querySelectorAll(
    '.anim-title, .anim-fade, .anim-left, .anim-right, .anim-up'
  );
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .08 });
  els.forEach(el => obs.observe(el));
})();

/* ── NAVBAR: scroll class + active link highlight ── */
(function initNav() {
  const nav = document.getElementById('mainNav');
  const btt = document.getElementById('btt');

  const sectionIds = [
    'hero','stats','industries','spaces','offerings',
    'vid-sec','clients','flagship','testi','why',
    'creds','blog','insta','cta-band','location','contact'
  ];

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 80);
    if (btt) btt.classList.toggle('show', y > 450);

    /* Active nav link */
    let cur = '';
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && y >= el.offsetTop - 140) cur = id;
    });
    document.querySelectorAll('.nav-left > li > a, .nav-right > li > a')
      .forEach(a => {
        const h = a.getAttribute('href');
        const match = (h === '#' && cur === 'hero') || (h === '#' + cur);
        a.closest('li').classList.toggle(
          'active', match && !a.classList.contains('btn-nav-q')
        );
      });
  });
})();

/* ── CONTACT FORM → WhatsApp + PHP ── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name  = document.getElementById('cf_name').value.trim();
    const phone = document.getElementById('cf_phone').value.trim();
    const email = (document.getElementById('cf_email')?.value || '').trim();
    const cat   = document.getElementById('cf_cat').value;
    const msg   = document.getElementById('cf_msg').value.trim();

    if (!name || !phone || !cat || !msg) {
      alert('Please fill all required fields.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    const waText = `*New Enquiry — AFI Systems*\n\n`
      + `👤 *Name:* ${name}\n`
      + `📞 *Phone:* ${phone}\n`
      + (email ? `📧 *Email:* ${email}\n` : '')
      + `🛋️ *Category:* ${cat}\n`
      + `📝 *Message:*\n${msg}`;

    window.open(`https://wa.me/919818251017?text=${encodeURIComponent(waText)}`, '_blank');

    /* Also submit via PHP (email delivery) */
    fetch('contact.php', { method: 'POST', body: new FormData(this) })
      .catch(() => { /* PHP may not be set up yet — WA already opened */ });

    this.reset();
    alert("Enquiry sent! WhatsApp opened. We'll respond shortly.");
  });
})();
