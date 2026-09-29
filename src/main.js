/**
 * Rouh Al Ward Spa & Wellness - Main Application Logic
 * Integrates environment variables, interactive particle system, language toggle, WhatsApp routing,
 * and Snapchat Pixel event tracking.
 */

// 1. Read Environment Variables with Safe Fallbacks
const CONFIG = {
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '966548060848').replace(/[^0-9]/g, ''),
  defaultMessage: import.meta.env.VITE_DEFAULT_MESSAGE || 'Hello Rouh Al Ward Spa & Wellness, I would like to inquire about booking an appointment.',
  companyName: 'ROUH AL WARD',
  companyTagline: 'SPA & WELLNESS',
  companyLocation: 'RIYADH • الرياض',
  companyNameAr: 'روح الورد',
  formattedPhone: '+966 548060848'
};


// 2. Bilingual Text Content
const I18N = {
  en: {
    status: 'Available for Bookings',
    langToggle: 'العربية',
    tagline: 'SPA & WELLNESS',
    offerBadge: 'SPECIAL PROMOTION',
    offerTitle: 'عرض الأحد • Sunday Offer',
    offerVisit1: 'First 2 Visits',
    offerVisit2: 'Third Visit',
    claimOfferBtn: 'Book This Offer on WhatsApp',
    chipsTitle: 'Select an inquiry or tap below to chat directly:',
    btnMain: 'Chat on WhatsApp',
    btnSub: 'Direct Booking & Instant Support',
    phoneLabel: 'Direct Number:',
    trust1: 'Luxury Ambiance',
    trust2: 'Certified Specialists',
    trust3: 'Organic Treatments',
    trust4: 'Instant Confirmation',
    footerLocation: 'Riyadh, Kingdom of Saudi Arabia • الرياض، المملكة العربية السعودية',
    sundayOfferMsg: 'Hello Rouh Al Ward, I would like to book the Sunday Special Offer (أول زيارتين ٢٥٠ ريال / الثالثة ٣٠٠ ريال).'
  },
  ar: {
    status: 'متاح للحجوزات الآن',
    langToggle: 'English',
    tagline: 'سبا وعناية صحية',
    offerBadge: 'عرض حصري ومميز',
    offerTitle: 'عرض الأحد الفاخر',
    offerVisit1: 'أول زيارتين',
    offerVisit2: 'الزيارة الثالثة',
    claimOfferBtn: 'احجز هذا العرض عبر واتساب',
    chipsTitle: 'اختر نوع الاستفسار أو اضغط بالأسفل للمحادثة الفورية:',
    btnMain: 'تواصل عبر واتساب',
    btnSub: 'حجز فوري وخدمة عملاء مباشرة',
    phoneLabel: 'الرقم المباشر:',
    trust1: 'أجواء فاخرة وراقية',
    trust2: 'أخصائيون معتمدون',
    trust3: 'زيوت ومستحضرات طبيعية',
    trust4: 'تأكيد حجز فوري',
    footerLocation: 'الرياض، المملكة العربية السعودية',
    sundayOfferMsg: 'مرحباً روح الورد، أود حجز عرض يوم الأحد (أول زيارتين ٢٥٠ ريال / الثالثة ٣٠٠ ريال).'
  }
};

let currentLang = 'en';
let selectedMessage = CONFIG.defaultMessage;

// 3. Helper: Generate WhatsApp URL
function buildWhatsAppUrl(message) {
  const phone = CONFIG.whatsappNumber;
  const encodedMsg = encodeURIComponent(message || CONFIG.defaultMessage);
  return `https://wa.me/${phone}?text=${encodedMsg}`;
}

// 3b. Snapchat Pixel — Safe WhatsApp button event tracker
function fireSnapchatWhatsAppEvent() {
  if (typeof window.snaptr === 'function') {
    window.snaptr('track', 'CUSTOM_EVENT_1', {
      description: 'WHATSAPP_BUTTON_CLICK'
    });
  }
}

// 4. Update WhatsApp CTA Link
function updateWhatsAppCta(message) {
  selectedMessage = message || CONFIG.defaultMessage;
  const ctaBtn = document.getElementById('whatsappCtaBtn');
  if (ctaBtn) {
    ctaBtn.href = buildWhatsAppUrl(selectedMessage);
  }
}

// 5. Initialize DOM Elements & Events
function initApp() {
  // Set Current Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Set Company Details from Config
  const titleEl = document.getElementById('brandTitle');
  if (titleEl) titleEl.textContent = CONFIG.companyName;

  const phoneDisplay = document.getElementById('phoneDisplay');
  if (phoneDisplay) {
    phoneDisplay.textContent = `+${CONFIG.whatsappNumber.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')}` || CONFIG.formattedPhone;
  }

  // Initial WhatsApp Link
  updateWhatsAppCta(CONFIG.defaultMessage);

  // Snapchat Pixel — Intercept WhatsApp CTA clicks to fire tracking event
  const whatsappBtn = document.getElementById('whatsappCtaBtn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fireSnapchatWhatsAppEvent();
      const whatsappUrl = whatsappBtn.href || buildWhatsAppUrl(selectedMessage);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Quick Inquiry Chips Handling
  const chipBtns = document.querySelectorAll('.chip-btn');
  chipBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      chipBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const msg = btn.getAttribute('data-msg');
      updateWhatsAppCta(msg);

      // Smooth highlight effect on the main CTA button
      const ctaBtn = document.getElementById('whatsappCtaBtn');
      if (ctaBtn) {
        ctaBtn.style.transform = 'scale(1.03)';
        setTimeout(() => {
          ctaBtn.style.transform = '';
        }, 200);
      }
    });
  });

  // Special Offer Quick Claim Button
  const claimOfferBtn = document.getElementById('claimOfferBtn');
  if (claimOfferBtn) {
    claimOfferBtn.addEventListener('click', () => {
      const offerMsg = currentLang === 'ar' ? I18N.ar.sundayOfferMsg : I18N.en.sundayOfferMsg;
      const url = buildWhatsAppUrl(offerMsg);
      window.open(url, '_blank');
    });
  }

  // Copy Phone Number
  const copyBtn = document.getElementById('copyPhoneBtn');
  const tooltip = document.getElementById('copyTooltip');
  if (copyBtn && tooltip) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(`+${CONFIG.whatsappNumber}`);
        tooltip.textContent = currentLang === 'ar' ? 'تم النسخ!' : 'Copied!';
        tooltip.classList.add('show');
        setTimeout(() => {
          tooltip.classList.remove('show');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    });
  }

  // Language Switcher
  const langToggleBtn = document.getElementById('langToggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLanguage);
  }

  // Initialize Canvas Particles
  initParticleCanvas();
}

// 6. Language Toggle Handler
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  const htmlEl = document.documentElement;
  const t = I18N[currentLang];

  htmlEl.setAttribute('lang', currentLang);
  htmlEl.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

  // Update UI texts
  document.getElementById('statusText').textContent = t.status;
  document.getElementById('langLabel').textContent = t.langToggle;
  document.getElementById('brandTagline').textContent = t.tagline;
  document.getElementById('offerBadgeText').textContent = t.offerBadge;
  document.getElementById('offerTitle').textContent = t.offerTitle;
  document.getElementById('offerVisit1').textContent = t.offerVisit1;
  document.getElementById('offerVisit2').textContent = t.offerVisit2;
  document.getElementById('claimOfferText').textContent = t.claimOfferBtn;
  document.getElementById('chipsTitle').textContent = t.chipsTitle;
  document.getElementById('btnMainLabel').textContent = t.btnMain;
  document.getElementById('btnSubLabel').textContent = t.btnSub;
  document.getElementById('phoneLabel').textContent = t.phoneLabel;
  document.getElementById('trust1').textContent = t.trust1;
  document.getElementById('trust2').textContent = t.trust2;
  document.getElementById('trust3').textContent = t.trust3;
  document.getElementById('trust4').textContent = t.trust4;
  document.getElementById('footerLocation').textContent = t.footerLocation;

  // Update chips labels based on language
  const chipLabels = document.querySelectorAll('.chip-label');
  chipLabels.forEach((label) => {
    const text = label.getAttribute(`data-${currentLang}`);
    if (text) label.textContent = text;
  });
}

// 7. Ambient Golden Particle Canvas Engine
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 45;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.alphaChange = (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1);
      this.hue = Math.random() > 0.3 ? 42 : 36; // Warm gold tones
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.alpha += this.alphaChange;

      if (this.alpha <= 0.1 || this.alpha >= 0.8) {
        this.alphaChange *= -1;
      }

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 85%, 68%, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${this.hue}, 90%, 60%, 0.8)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// Start application on DOM Ready
document.addEventListener('DOMContentLoaded', initApp);
