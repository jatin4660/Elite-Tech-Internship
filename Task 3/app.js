const products = [
  {
    id: "pantry-kit",
    name: "Pantry Starter Kit",
    category: "groceries",
    price: 899,
    rating: "4.8",
    description: "Shelf-stable grains, sauces, and snacks for quick family meals.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "smart-bottle",
    name: "Smart Water Bottle",
    category: "wellness",
    price: 1299,
    rating: "4.7",
    description: "Keeps drinks cold and reminds you to hydrate during long days.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "linen-set",
    name: "Cotton Linen Set",
    category: "home",
    price: 2499,
    rating: "4.9",
    description: "Soft, breathable bedding packed in a reusable storage sleeve.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "charge-hub",
    name: "Compact Charge Hub",
    category: "tech",
    price: 1799,
    rating: "4.6",
    description: "A travel-friendly charger for phone, earbuds, and watch.",
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cleaning-bundle",
    name: "Home Cleaning Bundle",
    category: "home",
    price: 699,
    rating: "4.5",
    description: "Refillable surface cleaner, dish tabs, and compostable cloths.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "protein-pack",
    name: "Protein Snack Pack",
    category: "groceries",
    price: 549,
    rating: "4.4",
    description: "Nut mixes, bars, and roasted chickpeas for easy energy.",
    image: "https://images.unsplash.com/photo-1622484211148-5d863dbb4d2f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sleep-mask",
    name: "Weighted Sleep Mask",
    category: "wellness",
    price: 999,
    rating: "4.8",
    description: "Cooling eye mask with gentle pressure for better rest.",
    image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "desk-lamp",
    name: "Focus Desk Lamp",
    category: "tech",
    price: 3299,
    rating: "4.7",
    description: "Warm and cool light modes with a small wireless charging base.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
  },
];

const storageKey = "offlinemart-cart";
const grid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const cartButton = document.querySelector("#cartButton");
const closeCartButton = document.querySelector("#closeCartButton");
const cartPanel = document.querySelector("#cartPanel");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const subtotalNode = document.querySelector("#subtotal");
const deliveryNode = document.querySelector("#delivery");
const totalNode = document.querySelector("#total");
const checkoutButton = document.querySelector("#checkoutButton");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const priceRange = document.querySelector("#priceRange");
const priceLabel = document.querySelector("#priceLabel");
const toast = document.querySelector("#toast");
const networkDot = document.querySelector("#networkDot");
const networkStatus = document.querySelector("#networkStatus");
const cacheStatus = document.querySelector("#cacheStatus");
const notifyButton = document.querySelector("#notifyButton");
const installButton = document.querySelector("#installButton");
const offlineTestButton = document.querySelector("#offlineTestButton");

let deferredPrompt = null;
let cart = loadCart();

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const maxPrice = Number(priceRange.value);
  priceLabel.textContent = money(maxPrice);

  const visibleProducts = products.filter((product) => {
    const matchesQuery =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    const matchesCategory = category === "all" || product.category === category;
    return matchesQuery && matchesCategory && product.price <= maxPrice;
  });

  resultCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "item" : "items"}`;

  grid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-art">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
              <strong>${product.rating}</strong>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div class="product-footer">
            <strong>${money(product.price)}</strong>
            <button class="add-button" type="button" data-add="${product.id}">Add</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCart() {
  const entries = Object.entries(cart);
  const itemTotal = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return product ? sum + product.price * quantity : sum;
  }, 0);
  const delivery = subtotal > 0 && subtotal < 999 ? 49 : 0;

  cartCount.textContent = itemTotal;
  subtotalNode.textContent = money(subtotal);
  deliveryNode.textContent = money(delivery);
  totalNode.textContent = money(subtotal + delivery);

  if (!entries.length) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty. Add an item to start a demo order.</p>`;
    return;
  }

  cartItems.innerHTML = entries
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      if (!product) return "";
      return `
        <article class="cart-item">
          <div>
            <h3>${product.name}</h3>
            <p>${money(product.price)} each</p>
          </div>
          <div class="cart-controls">
            <button class="qty-button" type="button" data-decrease="${id}" title="Decrease quantity">-</button>
            <strong>${quantity}</strong>
            <button class="qty-button" type="button" data-increase="${id}" title="Increase quantity">+</button>
            <button class="remove-button" type="button" data-remove="${id}">Remove</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  const product = products.find((item) => item.id === id);
  showToast(`${product.name} added to cart`);
}

function changeQuantity(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if (cart[id] === 0) delete cart[id];
  saveCart();
  renderCart();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setCartOpen(open) {
  cartPanel.classList.toggle("open", open);
  cartPanel.setAttribute("aria-hidden", String(!open));
}

function updateNetworkStatus() {
  const online = navigator.onLine;
  networkDot.classList.toggle("online", online);
  networkDot.classList.toggle("offline", !online);
  networkStatus.textContent = online ? "Online: fresh products available" : "Offline: cached store is available";
}

async function requestNotification() {
  if (!("Notification" in window)) {
    showToast("Notifications are not supported in this browser.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    showToast("Notifications were not enabled.");
    return;
  }

  showToast("Notifications enabled.");
  const registration = await navigator.serviceWorker?.ready;
  if (registration?.showNotification) {
    registration.showNotification("OfflineMart sale alert", {
      body: "Demo notification: 20% off pantry kits today.",
      icon: "assets/icon.svg",
      badge: "assets/icon.svg",
    });
  } else {
    new Notification("OfflineMart sale alert", {
      body: "Demo notification: 20% off pantry kits today.",
    });
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    cacheStatus.textContent = "Service workers are not supported";
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("service-worker.js");
    await navigator.serviceWorker.ready;
    cacheStatus.textContent = "Offline cache ready";
    registration.update();
  } catch (error) {
    cacheStatus.textContent = "Offline cache unavailable";
  }
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");

  if (increase) changeQuantity(increase.dataset.increase, 1);
  if (decrease) changeQuantity(decrease.dataset.decrease, -1);
  if (remove) {
    delete cart[remove.dataset.remove];
    saveCart();
    renderCart();
  }
});

cartButton.addEventListener("click", () => setCartOpen(true));
closeCartButton.addEventListener("click", () => setCartOpen(false));

checkoutButton.addEventListener("click", async () => {
  if (!Object.keys(cart).length) {
    showToast("Add an item before placing a demo order.");
    return;
  }
  cart = {};
  saveCart();
  renderCart();
  showToast("Demo order placed. The cart also works offline.");

  if (Notification.permission === "granted") {
    const registration = await navigator.serviceWorker?.ready;
    registration?.showNotification?.("Order received", {
      body: "Your OfflineMart demo order has been placed.",
      icon: "assets/icon.svg",
    });
  }
});

for (const input of [searchInput, categorySelect, priceRange]) {
  input.addEventListener("input", renderProducts);
}

notifyButton.addEventListener("click", requestNotification);

offlineTestButton.addEventListener("click", () => {
  showToast("To test: open DevTools, set Network to Offline, then refresh. The store should still load.");
});

window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.hidden = true;
});

renderProducts();
renderCart();
updateNetworkStatus();
registerServiceWorker();
