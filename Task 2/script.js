const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const form = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const canvas = document.querySelector("#scene");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

navToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  });
});

function showElement(element, index = 0) {
  element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  element.classList.add("visible");
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const visibleSiblings = [...entry.target.parentElement.querySelectorAll(".reveal")];
          showElement(entry.target, visibleSiblings.indexOf(entry.target));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach(showElement);
}

window.addEventListener("load", () => {
  if (window.gsap && !reducedMotion) {
    gsap.from(".brand, .nav-links a, .nav-toggle", {
      y: -18,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out"
    });

    gsap.to(".hero-media img", {
      y: -14,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Thanks! Connect this form to email or a backend before final hosting.";
  form.reset();
});

function initThreeScene() {
  if (!window.THREE || reducedMotion) {
    return false;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  const group = new THREE.Group();
  const colors = [0x0f8b8d, 0xff6f59, 0xc7ef00, 0x6658f6];

  camera.position.z = 7;
  scene.add(group);

  for (let index = 0; index < 34; index += 1) {
    const geometry = index % 2 === 0 ? new THREE.TetrahedronGeometry(0.12) : new THREE.IcosahedronGeometry(0.09);
    const material = new THREE.MeshBasicMaterial({
      color: colors[index % colors.length],
      transparent: true,
      opacity: 0.34
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((Math.random() - 0.5) * 11, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 5);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    group.add(mesh);
  }

  function resize() {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function animate() {
    group.rotation.y += 0.0018;
    group.rotation.x += 0.0008;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();
  animate();
  return true;
}

function initCanvasFallback() {
  const context = canvas.getContext("2d");
  const particles = [];
  const palette = ["#0f8b8d", "#ff6f59", "#c7ef00", "#6658f6"];

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    const count = Math.min(42, Math.floor(window.innerWidth / 28));
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 2 + Math.random() * 5,
        color: palette[index % palette.length],
        vx: -0.25 + Math.random() * 0.5,
        vy: -0.18 + Math.random() * 0.36
      });
    }
  }

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = window.innerWidth + 20;
      if (particle.x > window.innerWidth + 20) particle.x = -20;
      if (particle.y < -20) particle.y = window.innerHeight + 20;
      if (particle.y > window.innerHeight + 20) particle.y = -20;

      context.beginPath();
      context.globalAlpha = 0.34;
      context.fillStyle = particle.color;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;

    if (!reducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  draw();
}

if (!initThreeScene()) {
  initCanvasFallback();
}
