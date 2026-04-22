/* ═══════════════════════════════════════════════
   RAJAPERUMAL — PORTFOLIO SCRIPT
   Full Stack Developer Portfolio
   Advanced 3D Animations & Interactions
═══════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────
   LOADING ANIMATION
───────────────────────────────────────────── */
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
    // Trigger hero animations after loader
    initHeroAnimations();
    animateCounters();
  }, 1800);
});

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
(function initCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  // Smooth ring following
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect
  const hoverEls = document.querySelectorAll("a, button, [data-cursor='link'], .project-card, .service-card, .tech-chip");
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "0.7";
  });
})();

/* ─────────────────────────────────────────────
   SCROLL PROGRESS INDICATOR
───────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   NAVBAR SCROLL EFFECT
───────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   MOBILE HAMBURGER MENU
───────────────────────────────────────────── */
(function initMobileMenu() {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    menu.classList.toggle("open");
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      btn.classList.remove("active");
      menu.classList.remove("open");
    });
  });
})();

/* ─────────────────────────────────────────────
   CANVAS PARTICLE SYSTEM (Hero Background)
───────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles, mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 3 + 1;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.hue = Math.random() > 0.6 ? 231 : 35; // indigo or amber
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 55%, ${this.opacity})`;
      ctx.fill();
    }
    update() {
      // Gentle drift
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 100;
        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          this.x += (dx / dist) * force * 2.5;
          this.y += (dy / dist) * force * 2.5;
        }
      }

      // Boundary bounce
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
      this.x = Math.max(0, Math.min(w, this.x));
      this.y = Math.max(0, Math.min(h, this.y));
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.strokeStyle = `rgba(85, 65, 215, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    const count = Math.min(70, Math.floor((w * h) / 14000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => { resize(); init(); }, { passive: true });

  document.getElementById("hero").addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.getElementById("hero").addEventListener("mouseleave", () => {
    mouse.x = null; mouse.y = null;
  });

  init();
  animate();
})();

/* ─────────────────────────────────────────────
   HERO 3D CARD — MOUSE PARALLAX
───────────────────────────────────────────── */
(function initHeroParallax() {
  const hero = document.getElementById("hero");
  const profileCard = document.getElementById("profileCard");
  const heroLeft = document.getElementById("heroLeft");
  const cube = document.getElementById("shapeCube");
  const ring = document.getElementById("shapeRing");
  const diamond = document.getElementById("shapeDiamond");

  if (!hero || !profileCard) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetX = (e.clientX - cx) / rect.width;
    targetY = (e.clientY - cy) / rect.height;
  });

  hero.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  function animateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    const maxTilt = 15;
    const rotY = currentX * maxTilt;
    const rotX = -currentY * maxTilt;

    // 3D card tilt
    profileCard.style.transform = `
      translate(-50%, -50%)
      perspective(800px)
      rotateX(${rotX}deg)
      rotateY(${rotY}deg)
      translateZ(0)
    `;

    // Floating shapes parallax
    if (cube) cube.style.transform = `translate(${currentX * 30}px, ${currentY * 20}px)`;
    if (ring) ring.style.transform = `translate(${-currentX * 25}px, ${-currentY * 18}px)`;
    if (diamond) diamond.style.transform = `rotate(45deg) translate(${currentX * 20}px, ${currentY * 15}px)`;

    // Subtle hero text parallax
    if (heroLeft) {
      heroLeft.style.transform = `translate(${currentX * 8}px, ${currentY * 5}px)`;
    }

    requestAnimationFrame(animateParallax);
  }
  animateParallax();
})();

/* ─────────────────────────────────────────────
   GSAP HERO ANIMATIONS
───────────────────────────────────────────── */
function initHeroAnimations() {
  if (typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".hero-badge", { y: 30, opacity: 0, duration: 0.7 })
    .from(".line", { y: "100%", opacity: 0, duration: 0.9, stagger: 0.15 }, "-=0.3")
    .from(".hero-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
    .from(".hero-ctas > *", { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.4")
    .from(".hero-stats > *", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
    .from(".profile-card", {
      scale: 0.85,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.8")
    .from(".orbit-ring", {
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.5")
    .from(".float-shape", {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(2)"
    }, "-=0.5")
    .from(".scroll-indicator", { opacity: 0, y: 10, duration: 0.5 }, "-=0.2");
}

/* ─────────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────────── */
function animateCounters() {
  const counters = document.querySelectorAll(".stat-num[data-count]");
  counters.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const duration = 1500;
    const step = duration / target;
    const timer = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= target) {
        clearInterval(timer);
        el.textContent = target;
      }
    }, step);
  });
}

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER — SCROLL REVEAL
───────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-right");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  revealEls.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────────
   SKILL BAR ANIMATION
───────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-item");
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector(".skill-fill");
        const level = entry.target.dataset.level;
        if (fill && level) {
          setTimeout(() => {
            fill.style.width = level + "%";
          }, 200);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach((bar) => observer.observe(bar));
})();

/* ─────────────────────────────────────────────
   VANILLA TILT INITIALIZATION
───────────────────────────────────────────── */
(function initTilt() {
  if (typeof VanillaTilt === "undefined") return;

  // Project cards
  VanillaTilt.init(document.querySelectorAll(".project-card[data-tilt]"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
    perspective: 1000,
    scale: 1.02,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  });

  // About card
  VanillaTilt.init(document.querySelectorAll(".about-card[data-tilt]"), {
    max: 10,
    speed: 500,
    glare: true,
    "max-glare": 0.2,
    perspective: 800,
    scale: 1.01,
  });

  // Service cards
  VanillaTilt.init(document.querySelectorAll(".service-card[data-tilt]"), {
    max: 6,
    speed: 600,
    glare: false,
    perspective: 1200,
    scale: 1.01,
  });

  // Tech chips
  VanillaTilt.init(document.querySelectorAll(".tech-chip[data-tilt]"), {
    max: 15,
    speed: 300,
    perspective: 600,
    scale: 1.05,
  });
})();

/* ─────────────────────────────────────────────
   GSAP SCROLL TRIGGER ANIMATIONS
───────────────────────────────────────────── */
(function initGSAPScroll() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  // About section
  gsap.from(".about-text > *", {
    scrollTrigger: { trigger: "#about", start: "top 75%", toggleActions: "play none none reverse" },
    y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
  });
  gsap.from(".about-visual", {
    scrollTrigger: { trigger: "#about", start: "top 75%", toggleActions: "play none none reverse" },
    x: 60, opacity: 0, duration: 1, ease: "power3.out",
  });

  // Skill categories
  gsap.from(".skill-category", {
    scrollTrigger: { trigger: "#skills", start: "top 70%", toggleActions: "play none none reverse" },
    y: 50, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
  });

  // Project cards
  gsap.from(".project-card", {
    scrollTrigger: { trigger: "#projects", start: "top 70%", toggleActions: "play none none reverse" },
    y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
  });

  // Service cards
  gsap.from(".service-card", {
    scrollTrigger: { trigger: "#services", start: "top 70%", toggleActions: "play none none reverse" },
    y: 50, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
  });

  // Contact section
  gsap.from(".contact-item", {
    scrollTrigger: { trigger: "#contact", start: "top 70%", toggleActions: "play none none reverse" },
    x: -40, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
  });
  gsap.from(".contact-form", {
    scrollTrigger: { trigger: "#contact", start: "top 70%", toggleActions: "play none none reverse" },
    x: 40, opacity: 0, duration: 0.8, ease: "power3.out",
  });

  // Section titles
  gsap.utils.toArray(".section-title").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
      y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
    });
  });

  // Tech cloud chips
  gsap.from(".tech-chip", {
    scrollTrigger: { trigger: ".tech-cloud", start: "top 80%", toggleActions: "play none none reverse" },
    scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.06, ease: "back.out(1.5)",
  });

  // Parallax blob effect
  gsap.to(".blob-1", {
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 2 },
    y: -200, x: 60,
  });
  gsap.to(".blob-2", {
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 3 },
    y: -150, x: -40,
  });
})();

/* ─────────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");
  if (!form) return;

  // Ripple effect on submit button
  const submitBtn = form.querySelector(".btn-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", function (e) {
      const ripple = this.querySelector(".btn-ripple");
      if (!ripple) return;
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top = (e.clientY - rect.top) + "px";
      ripple.style.animation = "none";
      void ripple.offsetWidth; // reflow
      ripple.style.animation = "rippleAnim 0.6s linear";
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#fname").value.trim();
    const email = form.querySelector("#femail").value.trim();
    const message = form.querySelector("#fmessage").value.trim();

    if (!name || !email || !message) {
      // Shake validation
      if (!name) shakeField(form.querySelector("#fname"));
      if (!email) shakeField(form.querySelector("#femail"));
      if (!message) shakeField(form.querySelector("#fmessage"));
      return;
    }

    // Simulate submission
    const btnText = submitBtn.querySelector(".btn-text");
    btnText.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      btnText.textContent = "Send Message";
      submitBtn.disabled = false;
      if (successMsg) {
        successMsg.classList.add("show");
        setTimeout(() => successMsg.classList.remove("show"), 4000);
      }
    }, 1500);
  });

  function shakeField(input) {
    if (!input) return;
    input.style.animation = "none";
    void input.offsetWidth;
    input.style.animation = "shake 0.4s ease";
    setTimeout(() => input.style.animation = "", 500);
  }
})();

/* ─────────────────────────────────────────────
   BACK TO TOP
───────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ─────────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ─────────────────────────────────────────────
   SERVICE CARD HOVER — GSAP
───────────────────────────────────────────── */
(function initServiceHover() {
  if (typeof gsap === "undefined") return;
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card.querySelector(".service-icon-wrap"), {
        rotationY: 15,
        scale: 1.15,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card.querySelector(".service-icon-wrap"), {
        rotationY: 0,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    });
  });
})();

/* ─────────────────────────────────────────────
   PROJECT CARD — DEPTH LIFT
───────────────────────────────────────────── */
(function initProjectHover() {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(card, { y: -8, duration: 0.4, ease: "power2.out" });
      }
    });
    card.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(card, { y: 0, duration: 0.5, ease: "power3.out" });
      }
    });
  });
})();

/* ─────────────────────────────────────────────
   FLOATING BADGE — PARALLAX DEPTH
───────────────────────────────────────────── */
(function initAboutParallax() {
  const badge = document.querySelector(".about-badge-float");
  if (!badge) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const section = document.getElementById("about");
    if (!section) return;
    const sectionTop = section.offsetTop;
    const offset = (scrollY - sectionTop) * 0.08;
    badge.style.transform = `translateY(${-offset}px)`;
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   SECTION LABEL ANIMATION
───────────────────────────────────────────── */
(function initSectionLabels() {
  const labels = document.querySelectorAll(".section-label");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && typeof gsap !== "undefined") {
        gsap.from(entry.target, {
          opacity: 0,
          x: -20,
          duration: 0.6,
          ease: "power3.out",
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  labels.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────────
   CSS — SHAKE KEYFRAME (injected)
───────────────────────────────────────────── */
const styleEl = document.createElement("style");
styleEl.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-8px); }
    30% { transform: translateX(7px); }
    45% { transform: translateX(-5px); }
    60% { transform: translateX(4px); }
    75% { transform: translateX(-2px); }
  }
`;
document.head.appendChild(styleEl);

/* ─────────────────────────────────────────────
   ORBIT DOT TOOLTIP INTERACTION
───────────────────────────────────────────── */
(function initOrbitInteraction() {
  document.querySelectorAll(".tech-badge").forEach((badge) => {
    badge.addEventListener("mouseenter", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(badge, {
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(2)",
        });
      }
    });
    badge.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(badge, {
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
        });
      }
    });
  });
})();

/* ─────────────────────────────────────────────
   CARD SHINE EFFECT (CSS var-based mouse tracking)
───────────────────────────────────────────── */
(function initCardShine() {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--shine-x", x + "%");
      card.style.setProperty("--shine-y", y + "%");
    });
  });
})();

/* ─────────────────────────────────────────────
   CONSOLE EASTER EGG
───────────────────────────────────────────── */
console.log(
  "%c👋 Hey there, fellow developer!",
  "color: #5541d7; font-size: 18px; font-weight: bold;"
);
console.log(
  "%cThis portfolio was crafted by Rajaperumal\nFull Stack Developer — Java | Spring Boot | React",
  "color: #5a5850; font-size: 13px; line-height: 1.6;"
);
console.log(
  "%c📧 raja@example.com",
  "color: #e8a04a; font-size: 12px;"
);