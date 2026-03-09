let cart = {}; 

function addToCart(name, price) {
    if (cart[name]) {
        cart[name].qty += 1;
    } else {
        cart[name] = { price: price, qty: 1 };
    }
    updateUI();
    if (document.getElementById('cart-container').classList.contains('modal-active')) {
        renderCartModal(); 
    }
    showToast(`Added ${name} to tray!`);
}

function removeFromCart(name) {
    if (cart[name]) {
        cart[name].qty -= 1;
        if (cart[name].qty <= 0) {
            delete cart[name];
        }
    }
    updateUI();
    renderCartModal(); 
}

function updateUI() {
    let totalQty = 0;
    for (let key in cart) {
        totalQty += cart[key].qty;
    }
    const container = document.getElementById('cart-container');
    document.getElementById('cart-count').innerText = totalQty;
    if (totalQty > 0) {
        container.classList.add('cart-container-show');
    } else {
        container.classList.remove('cart-container-show');
        container.classList.remove('modal-active');
    }
}

function toggleCartModal() {
    const container = document.getElementById('cart-container');
    if (container.classList.contains('modal-active')) {
        container.classList.remove('modal-active');
    } else {
        renderCartModal();
        container.classList.add('modal-active');
    }
}

function renderCartModal() {
    const listContainer = document.getElementById('cart-items-list');
    listContainer.innerHTML = `
        <div class="close-tray" onclick="toggleCartModal()">&times;</div>
        <h3 style="margin: 0 0 20px 0; color: #fdfcfb; font-size: 20px; text-align: left;">Your Tray</h3>
    `; 
    const keys = Object.keys(cart);
    if (keys.length === 0) {
        listContainer.innerHTML += `
            <div class="empty-cart">
                <i>🍹</i>
                <div>Your tray is empty...</div>
                <div style="font-size:12px;">Add your favorite drinks!</div>
            </div>
        `;
        return;
    }
    for (let name in cart) {
        const item = cart[name];
        listContainer.innerHTML += `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <div style="text-align:left;">
                    <div style="font-weight:700; color:#fdfcfb;">${name}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button class="qty-btn" onclick="removeFromCart('${name}')">−</button>
                    <span style="color:#fdfcfb; min-width:20px; text-align:center;">${item.qty}</span>
                    <button class="qty-btn" onclick="addToCart('${name}', ${item.price})">+</button>
                </div>
            </div>
        `;
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('toast-show');
    setTimeout(() => { toast.classList.remove('toast-show'); }, 2000);
}

function sendWhatsAppOrder() {
    let orderText = "Hello! I would like to order:\n\n";
    for (let name in cart) {
        orderText += `• ${name} (x${cart[name].qty})\n`;
    }
    orderText += `\nThank you! 🍹`;
    const phoneNumber = "601116260164";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`;
    window.location.href = url;
}

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.body.style.backgroundPosition = `${x * 10}px ${y * 10}px`;
});

function filterMenu(category, event) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    const cards = document.querySelectorAll('.menu-card');
    let delay = 0; 
    cards.forEach(card => {
        const itemCategories = card.getAttribute('data-category').split(' ');
        if (category === 'all' || itemCategories.includes(category)) {
            card.classList.remove('hide-card');
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = `fadeInUp 0.6s cubic-bezier(0.2,0.8,0.2,1) ${delay}s forwards`;
            delay += 0.1; 
        } else {
            card.classList.add('hide-card');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.menu-img').forEach(img => {
        img.onload = function() {
            this.classList.add('loaded');
        };
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
});

// 最强防右键保存
document.addEventListener('contextmenu', event => {
    event.preventDefault();
});
