// script.js - Theme toggle with localStorage and smooth transitions
// ===== THEME MANAGEMENT =====
(function() {
  // Get theme from localStorage or default to 'light'
  const getSavedTheme = () => {
    return localStorage.getItem('chris-theme') || 'light';
  };

  // Apply theme to document
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('chris-theme', theme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    updateToggleIcon(newTheme);
  };

  // Update the toggle button icon
  const updateToggleIcon = (theme) => {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
        } else {
          icon.className = 'fas fa-moon';
        }
      }
    }
  };

  // Create and inject theme toggle button
  const createThemeToggle = () => {
    // Check if button already exists
    if (document.getElementById('themeToggleBtn')) return;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'themeToggleBtn';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle theme');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toggleBtn.addEventListener('click', toggleTheme);
    document.body.appendChild(toggleBtn);
    
    // Set initial icon based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    updateToggleIcon(currentTheme);
  };

  // Initialize theme on page load
  const initTheme = () => {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    createThemeToggle();
  };

  // Run theme initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();

// ===== EXISTING FUNCTIONALITY (Preserved from original) =====
// Storage keys and cart management
const STORAGE_KEYS = {
  USER: "chris_user",
  CART: "chris_cart",
  SELECTED_PRODUCT: "chris_selected_product"
};

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  updateCartCounters();
}

function updateCartCounters() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cartCount, #cartCount2, #cartCount3').forEach(el => { 
    if(el) el.innerText = total; 
  });
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if(existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  alert(`${product.name} added to bag`);
}

// Product data (dresses)
const products = [
  { id: 1, name: "Silk Midi Dress", price: 189, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop", description: "Elegant silk blend, relaxed fit. Perfect for evening events.", reviews: ["⭐️⭐️⭐️⭐️⭐️ Amazing fabric and fit!", "⭐️⭐️⭐️⭐️✨ Love the color"] },
  { id: 2, name: "Linen Blend Shirt Dress", price: 149, image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=800&fit=crop", description: "Breathable linen, perfect for summer days.", reviews: ["⭐️⭐️⭐️⭐️⭐️ So comfortable", "⭐️⭐️⭐️⭐️ True to size"] },
  { id: 3, name: "Wool Tailored Coat", price: 279, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop", description: "Oversized silhouette with premium wool blend.", reviews: ["⭐️⭐️⭐️⭐️⭐️ Very warm and stylish", "⭐️⭐️⭐️⭐️ Quality material"] },
  { id: 4, name: "Knitted Maxi Dress", price: 159, image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop", description: "Soft rib knit, ribbed hem for a cozy feel.", reviews: ["⭐️⭐️⭐️⭐️⭐️ Perfect for winter", "⭐️⭐️⭐️⭐️ Cozy and chic"] }
];

// ---------- LOGIN PAGE ----------
if (document.getElementById('loginForm')) {
  const form = document.getElementById('loginForm');
  const googleBtn = document.getElementById('googleMockBtn');
  const errorDiv = document.getElementById('formError');

  function validateForm(name, email, phone, addr, pwd) {
    if (!name || !email || !phone || !addr || !pwd) return "All fields required";
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(email)) return "Valid email required";
    if (phone.length < 8) return "Valid phone number required";
    return "";
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('password').value;
    const err = validateForm(fullName, email, phone, address, password);
    if (err) { errorDiv.innerText = err; return; }
    const userData = { fullName, email, phone, address };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    window.location.href = "home.html";
  });

  googleBtn.addEventListener('click', () => {
    const mockUser = { fullName: "Alex Morgan", email: "alex@chris.com", phone: "9876543210", address: "123 Fashion Ave, NY" };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    window.location.href = "home.html";
  });
}

// ---------- HOME PAGE: render products grid ----------
function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  if (grid && grid.children.length === 0) {
    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">$${p.price}</div>
          <button class="btn-details" data-id="${p.id}">View Details</button>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('.btn-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        const product = products.find(p => p.id === id);
        localStorage.setItem(STORAGE_KEYS.SELECTED_PRODUCT, JSON.stringify(product));
        window.location.href = "product.html";
      });
    });
  }
}

document.querySelectorAll(".btn-details").forEach(button => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-id");
    window.location.href = `product.html?id=${productId}`;
  });
});

// ---------- PRODUCT PAGE: show details, add to cart, place order ----------
function loadProductPage() {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;
  const product = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELECTED_PRODUCT));
  if (!product) { window.location.href = "home.html"; return; }
  container.innerHTML = `
    <div class="gallery"><img src="${product.image}" alt="${product.name}"></div>
    <div class="detail-info">
      <h1>${product.name}</h1>
      <p class="product-price">$${product.price}</p>
      <p>${product.description}</p>
      <div class="size-options"><span class="size-btn">XS</span><span class="size-btn">S</span><span class="size-btn">M</span><span class="size-btn">L</span><span class="size-btn">XL</span></div>
      <button id="addToCartBtnProd" class="btn-action">🛍️ Add to Cart</button>
      <button id="placeOrderBtnProd" class="btn-action">✨ Place Order</button>
      <div class="reviews"><h4>Customer reviews</h4>${product.reviews.map(r => `<div class="review-item">${r}</div>`).join('')}</div>
    </div>
  `;
  document.getElementById('addToCartBtnProd')?.addEventListener('click', () => addToCart(product));
  document.getElementById('placeOrderBtnProd')?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PRODUCT, JSON.stringify(product));
    window.location.href = "order.html";
  });
}

// ---------- ORDER PAGE: show product summary, user details, edit address ----------
function initOrderPage() {
  const product = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELECTED_PRODUCT));
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
  if (!product || !user) { alert("Missing info"); window.location.href = "home.html"; return; }
  const summaryDiv = document.getElementById('orderProductSummary');
  summaryDiv.innerHTML = `<div class="order-item"><img src="${product.image}" style="width:80px;height:80px;object-fit:cover;border-radius:12px"><div><strong>${product.name}</strong><br>$${product.price}</div></div>`;
  const displayDiv = document.getElementById('displayUserInfo');
  function renderUser(addr) { displayDiv.innerHTML = `<p><i class="fas fa-user"></i> ${user.fullName}</p><p><i class="fas fa-envelope"></i> ${user.email}</p><p><i class="fas fa-phone"></i> ${user.phone}</p><p><i class="fas fa-map-pin"></i> ${addr}</p>`; }
  let currentAddress = user.address;
  renderUser(currentAddress);
  const editBtn = document.getElementById('editAddressBtn');
  const editForm = document.getElementById('editAddressForm');
  editBtn.addEventListener('click', () => { editForm.style.display = 'block'; });
  document.getElementById('saveAddressBtn')?.addEventListener('click', () => {
    const newAddr = document.getElementById('newAddressInput').value.trim();
    if(newAddr) { currentAddress = newAddr; user.address = newAddr; localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)); renderUser(currentAddress); editForm.style.display = 'none'; }
  });
  document.getElementById('proceedToPaymentBtn')?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PRODUCT, JSON.stringify(product));
    window.location.href = "payment.html";
  });
}

// ---------- PAYMENT PAGE: methods + confirm order success ----------
function initPayment() {
  let selectedMethod = "upi";
  const methodDivs = document.querySelectorAll('.method-card');
  const fieldsContainer = document.getElementById('paymentFields');
  function renderFields() {
    if (selectedMethod === 'upi') fieldsContainer.innerHTML = `<input type="text" placeholder="UPI ID (example@okhdfcbank)" id="upiId">`;
    else if (selectedMethod === 'card') fieldsContainer.innerHTML = `<input type="text" placeholder="Card Number"><input type="text" placeholder="MM/YY"><input type="text" placeholder="CVC">`;
    else fieldsContainer.innerHTML = `<p style="padding:0.5rem;color:var(--text-secondary)">💵 Pay on delivery — no extra details needed</p>`;
  }
  methodDivs.forEach(m => {
    m.addEventListener('click', () => {
      methodDivs.forEach(md => md.classList.remove('active'));
      m.classList.add('active');
      selectedMethod = m.dataset.method;
      renderFields();
    });
  });
  if(methodDivs[0]) methodDivs[0].classList.add('active');
  renderFields();
  document.getElementById('confirmOrderBtn')?.addEventListener('click', () => {
    const msgDiv = document.getElementById('paymentMessage');
    msgDiv.innerHTML = `<i class="fas fa-check-circle"></i> Order confirmed! Thank you for shopping at Chris.`;
    setTimeout(() => { alert("🎉 Order placed successfully! (demo)"); localStorage.removeItem(STORAGE_KEYS.CART); window.location.href = "home.html"; }, 1500);
  });
}

// ---------- Nav, profile, cart icon redirects, mobile menu ----------
function setupNavFeatures() {
  const profileTriggers = ['profileIconNav','profileIconNav2','profileIconNav3'];
  profileTriggers.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', (e) => { e.preventDefault(); const user = localStorage.getItem(STORAGE_KEYS.USER); alert(user ? `Welcome ${JSON.parse(user).fullName}` : "Please login first"); if(!user) window.location.href="index.html"; });
  });
  const cartTriggers = ['cartIconNav','cartIconNav2','cartIconNav3','cartIconNav4'];
  cartTriggers.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', (e) => { e.preventDefault(); alert(`Cart contains ${cart.reduce((s,i)=>s+i.quantity,0)} item(s)`); });
  });
  const menuToggle = document.querySelectorAll('.menu-icon');
  menuToggle.forEach(icon => {
    icon.addEventListener('click', () => { document.querySelector('.nav-links')?.classList.toggle('active'); });
  });
}

// Page router init
document.addEventListener('DOMContentLoaded', () => {
  updateCartCounters();
  setupNavFeatures();
  if (document.getElementById('productGrid')) renderProductGrid();
  if (document.getElementById('productDetailContainer')) loadProductPage();
  if (document.querySelector('.order-summary-container')) initOrderPage();
  if (document.querySelector('.payment-container')) initPayment();
});
