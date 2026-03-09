let cart = {}; 

function addToCart(name, price) {
    if (cart[name]) {
        cart[name].qty += 1;
    } else {
        cart[name] = { price: price, qty: 1 };
    }
    updateUI();
    // 只有在面板打开时才重绘，避免性能浪费
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
    let totalPrice = 0;
    for (let key in cart) {
        totalQty += cart[key].qty;
        totalPrice += (cart[key].qty * cart[key].price);
    }

    const container = document.getElementById('cart-container');
    document.getElementById('cart-count').innerText = totalQty;
    document.getElementById('total-price').innerText = `RM ${totalPrice.toFixed(2)}`;
    document.getElementById('modal-total').innerText = `RM ${totalPrice.toFixed(2)}`;

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
    
    // 【唯一打叉渲染】
    listContainer.innerHTML = `
        <div class="close-tray" onclick="toggleCartModal()">&times;</div>
        <h3 style="margin: 0 0 20px 0; color: #fdfcfb; font-size: 20px; text-align: left;">Your Tray</h3>
    `; 

    const keys = Object.keys(cart);
    if (keys.length === 0) {
        listContainer.innerHTML += `<div style="padding: 40px 0; opacity: 0.5;">Your tray is empty...</div>`;
        return;
    }

    for (let name in cart) {
        const item = cart[name];
        const itemHtml = `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <div class="item-info" style="text-align: left;">
                    <div class="item-name" style="font-weight:700; color:#fdfcfb;">${name}</div>
                    <div class="item-price" style="color:#c5a059;">RM ${item.price.toFixed(2)}</div>
                </div>
                <div class="qty-controls" style="display:flex; align-items:center; gap:10px;">
                    <button class="qty-btn" onclick="removeFromCart('${name}')">−</button>
                    <span class="item-qty" style="color:#fdfcfb; min-width:20px; text-align:center;">${item.qty}</span>
                    <button class="qty-btn" onclick="addToCart('${name}', ${item.price})">+</button>
                </div>
            </div>
        `;
        listContainer.innerHTML += itemHtml;
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
    let grandTotal = 0;
    for (let name in cart) {
        let itemTotal = cart[name].qty * cart[name].price;
        orderText += `• ${name} (x${cart[name].qty}) - RM ${itemTotal.toFixed(2)}\n`;
        grandTotal += itemTotal;
    }
    orderText += `\nTotal: RM ${grandTotal.toFixed(2)}\nThank you! 🍹`;
    const phoneNumber = "601116260164";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`;
    window.location.href = url;
}

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.body.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
});
