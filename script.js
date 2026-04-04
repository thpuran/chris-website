// script.js - Complete KRIZ ecommerce logic
// ========== GLOBALS & STORAGE ==========
const STORAGE = {
  USER: "kriz_user",
  CART: "kriz_cart",
  SELECTED_PRODUCT: "kriz_selected",
  ORDERS: "kriz_orders",
  THEME: "kriz_theme"
};

let cart = JSON.parse(localStorage.getItem(STORAGE.CART)) || [];
const productsDB = [
  { id: 1, name: "Silk Column Dress", price: 289, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800", description: "Fluid silk satin, cowl neck, minimalist elegance.", reviews: ["⭐️⭐️⭐️⭐️⭐️ pure luxury"] },
  { id: 2, name: "Linen Trench Coat", price: 359, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800", description: "Oversized unisex coat, breathable linen.", reviews: ["⭐️⭐️⭐️⭐️⭐️ perfect layering"] },
  { id: 3, name: "Knit Midi Dress", price: 219, image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800", description: "Ribbed knit, body-hugging silhouette.", reviews: ["⭐️⭐️⭐️⭐️✨ cozy and chic"] },
  { id: 4, name: "Wool-Blend Blazer", price: 399, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", description: "Tailored blazer with modern cut.", reviews: ["⭐️⭐️⭐️⭐️⭐️ structured"] }
];

function saveCart() { localStorage.setItem(STORAGE.CART, JSON.stringify(cart)); updateCartCounters(); }
function updateCartCounters() { let total = cart.reduce((s,i)=>s+i.qty,0); document.querySelectorAll('#cartCount, #cartCount2').forEach(el=>{if(el)el.innerText=total;}); }
function addToCart(product, qty=1) { let existing = cart.find(i=>i.id===product.id); if(existing) existing.qty += qty; else cart.push({...product, qty}); saveCart(); alert(`✨ ${product.name} added to bag`); }

// Theme management
function initTheme() { let theme = localStorage.getItem(STORAGE.THEME) || 'light'; if(theme==='dark') document.documentElement.setAttribute('data-theme','dark'); }
function toggleTheme() { let isDark = document.documentElement.getAttribute('data-theme')==='dark'; if(isDark) document.documentElement.removeAttribute('data-theme'), localStorage.setItem(STORAGE.THEME,'light'); else document.documentElement.setAttribute('data-theme','dark'), localStorage.setItem(STORAGE.THEME,'dark'); }
document.addEventListener('DOMContentLoaded',()=>{ initTheme(); document.querySelectorAll('#themeToggle, #themeToggle2, #themeToggle3, #themeToggle4, #themeToggle5').forEach(btn=>{ if(btn) btn.addEventListener('click',toggleTheme); }); });

// ========== LOGIN ==========
if(document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit',(e)=>{
    e.preventDefault(); let user = { fullName:document.getElementById('fullName').value, email:document.getElementById('email').value, phone:document.getElementById('phone').value, address:document.getElementById('address').value }; localStorage.setItem(STORAGE.USER,JSON.stringify(user)); window.location.href="home.html";
  });
  document.getElementById('googleMockBtn')?.addEventListener('click',()=>{ let mock={fullName:"Alex Rivera", email:"alex@kriz.com", phone:"9876543210", address:"55 Fashion Ave, NYC"}; localStorage.setItem(STORAGE.USER,JSON.stringify(mock)); window.location.href="home.html"; });
}

// ========== HOME: render products ==========
function renderHomeGrid() {
  let grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = productsDB.map(p=>`<div class="product-card" data-id="${p.id}"><img class="product-img" src="${p.image}"><div class="product-info"><div class="product-name">${p.name}</div><div class="product-price">$${p.price}</div><button class="btn-view details-btn" data-id="${p.id}">View Details</button></div></div>`).join('');
  document.querySelectorAll('.details-btn, .product-card').forEach(el=>{ el.addEventListener('click',(e)=>{ let id = e.currentTarget.closest('.product-card')?.dataset.id || e.target.dataset.id; if(id) { let prod = productsDB.find(p=>p.id==parseInt(id)); localStorage.setItem(STORAGE.SELECTED_PRODUCT,JSON.stringify(prod)); window.location.href="product.html"; } }); });
}
if(window.location.pathname.includes('home.html')) renderHomeGrid();

// ========== PRODUCT PAGE ==========
function loadProductPage() {
  let container = document.getElementById('productDetailContainer');
  if(!container) return;
  let product = JSON.parse(localStorage.getItem(STORAGE.SELECTED_PRODUCT));
  if(!product){ window.location.href="home.html"; return; }
  container.innerHTML = `<div class="detail-gallery"><img src="${product.image}" alt="${product.name}"></div><div class="detail-info"><h1>${product.name}</h1><div class="detail-price">$${product.price}</div><p>${product.description}</p><div class="size-selector"><strong>Size</strong><div class="size-options"><span class="size-btn" data-size="S">S</span><span class="size-btn" data-size="M">M</span><span class="size-btn" data-size="L">L</span></div></div><div class="quantity-selector"><label>Qty</label><input type="number" id="prodQty" value="1" min="1"></div><div class="action-buttons"><button id="addToCartDetail" class="btn-primary">Add to Cart</button><button id="buyNowDetail" class="btn-primary" style="background:var(--accent)">Buy Now</button></div><div class="reviews-section"><h3>Reviews</h3>${product.reviews.map(r=>`<div class="review-card">${r}</div>`).join('')}</div></div>`;
  document.getElementById('addToCartDetail')?.addEventListener('click',()=>{ let qty = parseInt(document.getElementById('prodQty')?.value||1); addToCart(product,qty); });
  document.getElementById('buyNowDetail')?.addEventListener('click',()=>{ localStorage.setItem(STORAGE.SELECTED_PRODUCT,JSON.stringify(product)); window.location.href="order.html"; });
}
if(window.location.pathname.includes('product.html')) loadProductPage();

// ========== ORDER PAGE ==========
function initOrderPage() {
  let product = JSON.parse(localStorage.getItem(STORAGE.SELECTED_PRODUCT));
  let user = JSON.parse(localStorage.getItem(STORAGE.USER));
  if(!product || !user) { alert("Please login first"); window.location.href="index.html"; return; }
  document.getElementById('orderProductSummary').innerHTML = `<div class="order-item"><img src="${product.image}" style="width:80px;height:100px;object-fit:cover;border-radius:16px"><div><h4>${product.name}</h4><p>$${product.price}</p></div></div>`;
  let displayDiv = document.getElementById('displayUserInfo');
  function renderAddr(addr) { displayDiv.innerHTML = `<p><i class="fas fa-user"></i> ${user.fullName}</p><p>${user.email}</p><p>${user.phone}</p><p><i class="fas fa-map-pin"></i> ${addr}</p>`; }
  let currentAddr = user.address;
  renderAddr(currentAddr);
  document.getElementById('editAddressBtn')?.addEventListener('click',()=>{ document.getElementById('editAddressForm').style.display='block'; });
  document.getElementById('saveAddressBtn')?.addEventListener('click',()=>{ let newAddr = document.getElementById('newAddressInput').value.trim(); if(newAddr){ currentAddr=newAddr; user.address=newAddr; localStorage.setItem(STORAGE.USER,JSON.stringify(user)); renderAddr(currentAddr); document.getElementById('editAddressForm').style.display='none'; } });
  document.getElementById('proceedToPaymentBtn')?.addEventListener('click',()=>{ let qty = parseInt(document.getElementById('orderQuantity')?.value||1); let orderItem = {...product, orderedQty: qty, totalPrice: product.price * qty, address: currentAddr, orderDate: new Date().toISOString() }; localStorage.setItem('kriz_pending_order', JSON.stringify(orderItem)); window.location.href="payment.html"; });
}
if(window.location.pathname.includes('order.html')) initOrderPage();

// ========== PAYMENT ==========
function initPayment() {
  let selectedMethod = "upi";
  const fieldsDiv = document.getElementById('paymentFields');
  function renderFields() { if(selectedMethod==='upi') fieldsDiv.innerHTML=`<input placeholder="UPI ID (example@okhdfc)">`; else if(selectedMethod==='card') fieldsDiv.innerHTML=`<input placeholder="Card Number"><input placeholder="MM/YY"><input placeholder="CVC">`; else fieldsDiv.innerHTML=`<p>Pay on delivery</p>`; }
  document.querySelectorAll('.method-card').forEach(card=>{ card.addEventListener('click',()=>{ document.querySelectorAll('.method-card').forEach(c=>c.classList.remove('active')); card.classList.add('active'); selectedMethod=card.dataset.method; renderFields(); }); });
  if(document.querySelector('.method-card')) document.querySelector('.method-card').classList.add('active'); renderFields();
  document.getElementById('confirmOrderBtn')?.addEventListener('click',()=>{ let pending = JSON.parse(localStorage.getItem('kriz_pending_order')); if(pending){ let orders = JSON.parse(localStorage.getItem(STORAGE.ORDERS))||[]; orders.push({...pending, status:'placed', orderId: Date.now()}); localStorage.setItem(STORAGE.ORDERS,JSON.stringify(orders)); localStorage.removeItem('kriz_pending_order'); document.getElementById('paymentMessage').innerHTML='✅ Order confirmed! Redirecting...'; setTimeout(()=>{ window.location.href="tracking.html"; },1200); } else alert('error'); });
}
if(window.location.pathname.includes('payment.html')) initPayment();

// ========== TRACKING PAGE ==========
function initTracking() {
  let orders = JSON.parse(localStorage.getItem(STORAGE.ORDERS))||[];
  let latestOrder = orders[orders.length-1];
  if(!latestOrder){ document.getElementById('trackingOrderInfo').innerHTML='<p>No recent order</p>'; return; }
  document.getElementById('trackingOrderInfo').innerHTML = `<div><img src="${latestOrder.image}" width="80" style="border-radius:12px"><div><strong>${latestOrder.name}</strong><br>Qty: ${latestOrder.orderedQty}<br>Total: $${latestOrder.totalPrice}</div></div>`;
  let steps = ['placed','packed','shipped','out','delivered'];
  let currentStep = 0;
  function updateProgress(stepIdx) { steps.forEach((s,i)=>{ let el = document.querySelector(`.timeline-step[data-step="${s}"]`); if(el && i<=stepIdx) el.classList.add('active'); else if(el) el.classList.remove('active'); }); let percent = (stepIdx/(steps.length-1))*100; document.getElementById('trackProgressBar').style.width=percent+'%'; let msgs=["Order confirmed","Being packed","On the way","Out for delivery","Delivered 🎉"]; document.getElementById('trackStatusMsg').innerText=msgs[stepIdx]||"Processing"; }
  updateProgress(currentStep);
  let simBtn = document.getElementById('simulateUpdateBtn');
  simBtn?.addEventListener('click',()=>{ if(currentStep<steps.length-1){ currentStep++; updateProgress(currentStep); if(currentStep===steps.length-1) simBtn.disabled=true; } });
}
if(window.location.pathname.includes('tracking.html')) initTracking();

// Navigation & cart counters, profile, orders
function setupNav() {
  updateCartCounters();
  document.querySelectorAll('#cartLinkNav, #cartLinkNav2, #cartLinkNav3').forEach(link=>{ if(link) link.addEventListener('click',(e)=>{ e.preventDefault(); alert(`Cart items: ${cart.reduce((a,b)=>a+b.qty,0)}`); }); });
  document.querySelectorAll('#profileLinkNav, #ordersLinkNav, #ordersLinkNav2, #trackOrdersLink').forEach(link=>{ if(link) link.addEventListener('click',(e)=>{ e.preventDefault(); alert("Your profile & orders are stored in localStorage."); }); });
  const menuIcon = document.querySelector('.menu-icon'); if(menuIcon) menuIcon.addEventListener('click',()=>{ document.querySelector('.nav-links')?.classList.toggle('active'); });
}
document.addEventListener('DOMContentLoaded', setupNav);
