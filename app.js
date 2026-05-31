// ===== DATA =====
const dishes = [
  { id:1,  name:'Baião de Dois',      desc:'Rice, green beans, coalho cheese and smoked sausage',      price:32.90, emoji:'🫘', cat:'pratos',     badge:'🔥 Classic' },
  { id:2,  name:'Carne de Sol',       desc:'Stone-grilled sun-dried beef with clarified butter',        price:45.90, emoji:'🥩', cat:'pratos',     badge:null },
  { id:3,  name:'Moqueca Nordestina', desc:'Shrimp and fish stew with coconut milk and cilantro',       price:58.00, emoji:'🍲', cat:'pratos',     badge:'⭐ Popular' },
  { id:4,  name:'Escondidinho',       desc:'Shredded jerked beef topped with creamy mashed cassava',    price:38.50, emoji:'🥘', cat:'pratos',     badge:'⭐ Popular' },
  { id:5,  name:'Tapioca Recheada',   desc:'Handmade tapioca crepe with your choice of filling',        price:18.90, emoji:'🫓', cat:'pratos',     badge:null },
  { id:6,  name:'Combo Nordeste',     desc:'Main dish, drink and dessert at a special price',           price:69.90, emoji:'🌟', cat:'combos',     badge:'💥 Deal' },
  { id:7,  name:'Suco de Umbú',       desc:'Chilled juice from the iconic sertão umbu fruit',           price:12.00, emoji:'🥤', cat:'bebidas',    badge:'⭐ Popular' },
  { id:8,  name:'Caldo de Cana',      desc:'Fresh sugarcane juice, pressed right on the spot',          price:9.50,  emoji:'🌿', cat:'bebidas',    badge:null },
  { id:9,  name:'Vitamina de Cajá',   desc:'Creamy cajá fruit blended with cold milk',                  price:13.00, emoji:'🧃', cat:'bebidas',    badge:null },
  { id:10, name:'Cocada Branca',      desc:'Sweet coconut candy made with freshly grated coconut',      price:8.00,  emoji:'🥥', cat:'sobremesas', badge:null },
  { id:11, name:'Pudim de Leite',     desc:"Grandma's recipe — silky caramel milk pudding",             price:11.90, emoji:'🍮', cat:'sobremesas', badge:'❤️ Favourite' },
  { id:12, name:'Queijadinha',        desc:'Traditional Northeastern sweet cheese pastry',               price:7.50,  emoji:'🧁', cat:'sobremesas', badge:null },
];

// ===== DISH OF THE DAY =====
// To change it, just update the fields below.
const dishOfTheDay = {
  id: 99,
  name: 'Peixada Nordestina',
  desc: 'Whole fish slow-cooked with tomatoes, peppers, onions and fresh herbs',
  price: 52.00,
  emoji: '🐟',
  cat: 'pratos',
  badge: '🌟 Dish of the Day',
};

let cart = {};
let currentCat = 'all';

// ===== RENDER MENU =====
function renderMenu(cat) {
  const grid = document.getElementById('menu-grid');

  let filtered;
  if (cat === 'all') {
    // Show dish of the day first, then the rest
    filtered = [dishOfTheDay, ...dishes];
  } else if (cat === 'popular') {
    filtered = dishes.filter(d => d.badge && d.badge.includes('Popular'));
  } else if (cat === 'dotd') {
    filtered = [dishOfTheDay];
  } else {
    filtered = dishes.filter(d => d.cat === cat);
  }

  grid.innerHTML = filtered.map(d => `
    <div class="dish-card" data-id="${d.id}">
      <div class="dish-img">
        ${d.emoji}
        ${d.badge ? `<div class="dish-badge">${d.badge}</div>` : ''}
      </div>
      <div class="dish-info">
        <div class="dish-name">${d.name}</div>
        <div class="dish-desc">${d.desc}</div>
        <div class="dish-footer">
          <div class="dish-price"><span>R$</span> ${d.price.toFixed(2).replace('.',',')}</div>
          <button class="btn-add" onclick="addToCart(${d.id}, event)">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== CART =====
function addToCart(id, e) {
  // Look in both dishes and dishOfTheDay
  const allDishes = [dishOfTheDay, ...dishes];
  const dish = allDishes.find(d => d.id == id);
  if (!dish) return;

  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
  showToast('✓ Added to order!');
  createRipple(e);
}

function removeFromCart(id) {
  if (cart[id] > 1) cart[id]--;
  else delete cart[id];
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const allDishes = [dishOfTheDay, ...dishes];
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    return sum + (allDishes.find(d => d.id == id)?.price || 0) * qty;
  }, 0);

  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total-float').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  const floatEl = document.getElementById('cart-float');
  if (count > 0) floatEl.classList.add('visible');
  else floatEl.classList.remove('visible');
}

function renderCartItems() {
  const allDishes = [dishOfTheDay, ...dishes];
  const list = document.getElementById('cart-items-list');
  const items = Object.entries(cart);

  if (items.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#aaa;">
        <div style="font-size:3rem;margin-bottom:10px;">🛒</div>
        <div style="font-size:0.9rem;">No items in your order yet</div>
      </div>`;
    return;
  }

  let sub = 0;
  list.innerHTML = items.map(([id, qty]) => {
    const d = allDishes.find(d => d.id == id);
    sub += d.price * qty;
    return `
      <div class="cart-item">
        <div class="cart-item-emoji">${d.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${d.name}</div>
          <div class="cart-item-price">R$ ${(d.price * qty).toFixed(2).replace('.', ',')} (${qty}x)</div>
        </div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="removeFromCart(${d.id})">−</button>
          <div class="qty-num">${qty}</div>
          <button class="qty-btn" onclick="addToCart(${d.id}, event)">+</button>
        </div>
      </div>`;
  }).join('');

  const tax = sub * 0.1;
  document.getElementById('summary-sub').textContent   = `R$ ${sub.toFixed(2).replace('.', ',')}`;
  document.getElementById('summary-tax').textContent   = `R$ ${tax.toFixed(2).replace('.', ',')}`;
  document.getElementById('summary-total').textContent = `R$ ${(sub + tax).toFixed(2).replace('.', ',')}`;
}

// ===== NAVIGATION =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-cart') renderCartItems();
}

function showPopulares() {
  showScreen('screen-menu');
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  renderMenu('popular');
}

function showDishOfTheDay() {
  showScreen('screen-menu');
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  renderMenu('dotd');
}

function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCat = cat;
  renderMenu(cat);
}

function confirmOrder() {
  if (Object.keys(cart).length === 0) {
    showToast('⚠️ Add items to your order first!');
    return;
  }
  const num = String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('order-num').textContent = num;
  showScreen('screen-success');
  spawnConfetti();
}

function newOrder() {
  cart = {};
  updateCartUI();
  showScreen('screen-home');
}

// ===== EFFECTS =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function createRipple(e) {
  if (!e) return;
  const btn = e.currentTarget;
  const r = document.createElement('span');
  r.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  r.style.width = r.style.height = '60px';
  r.style.left = (e.clientX - rect.left - 30) + 'px';
  r.style.top  = (e.clientY - rect.top  - 30) + 'px';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 700);
}

function spawnConfetti() {
  const colors = ['#F5A623', '#E8620A', '#C0392B', '#2E7D32', '#D4A017', '#fff'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.classList.add('confetti-piece');
    p.style.left              = Math.random() * 100 + 'vw';
    p.style.background        = colors[Math.floor(Math.random() * colors.length)];
    p.style.borderRadius      = Math.random() > 0.5 ? '50%' : '0';
    p.style.animationDelay    = Math.random() * 1.5 + 's';
    p.style.animationDuration = (2 + Math.random() * 2) + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

// ===== CURSOR =====
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

document.querySelectorAll('button, .dish-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ===== INIT =====
renderMenu('all');
