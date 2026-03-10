/* =========================================
   1. 全局变量与核心逻辑
   ========================================= */
let cart = {}; 

// 添加到购物车
function addToCart(name, price) {
    if (cart[name]) {
        cart[name].qty += 1;
    } else {
        cart[name] = { price: price, qty: 1 };
    }
    
    updateUI();
    
    // 如果弹窗已经打开，实时刷新内容
    if (document.getElementById('cart-container').classList.contains('modal-active')) {
        renderCartModal(); 
    }
    
    showToast(`Added ${name} to tray!`);
}

// 从购物车移除
function removeFromCart(name) {
    if (cart[name]) {
        cart[name].qty -= 1;
        if (cart[name].qty <= 0) {
            delete cart[name];
        }
    }
    
    updateUI();
    
    // 逻辑优化：如果删完了，自动关闭弹窗
    const keys = Object.keys(cart);
    if (keys.length === 0) {
        const container = document.getElementById('cart-container');
        container.classList.remove('modal-active');
    } else {
        renderCartModal(); 
    }
}

/* =========================================
   2. UI 更新与动画触发
   ========================================= */
function updateUI() {
    let totalQty = 0;
    for (let key in cart) {
        totalQty += cart[key].qty;
    }
    
    const container = document.getElementById('cart-container');
    document.getElementById('cart-count').innerText = totalQty;
    
    // 底部胶囊栏的显示与隐藏动画
    if (totalQty > 0) {
        container.classList.add('cart-container-show');
    } else {
        container.classList.remove('cart-container-show');
        container.classList.remove('modal-active'); // 没东西时强制关闭
    }
}

// 切换购物车弹窗 (优化动画节奏)
function toggleCartModal() {
    const container = document.getElementById('cart-container');
    const isOpening = !container.classList.contains('modal-active');

    if (isOpening) {
        renderCartModal(); // 1. 先渲染 HTML 结构
        
        // 2. 使用 requestAnimationFrame 确保 DOM 已就绪后再触发 CSS 过渡
        requestAnimationFrame(() => {
            container.classList.add('modal-active');
        });

        // 手机端震动反馈 (如果支持)
        if (window.navigator.vibrate) window.navigator.vibrate(8);
    } else {
        container.classList.remove('modal-active');
    }
}

// 渲染购物车详情内容
function renderCartModal() {
    const listContainer = document.getElementById('cart-items-list');
    
    // 基础结构：头部标题和关闭按钮
    listContainer.innerHTML = `
        <div class="close-tray" onclick="toggleCartModal()">&times;</div>
        <h3 style="margin: 0 0 20px 0; color: #fdfcfb; font-size: 20px; text-align: left; letter-spacing: 1px;">Your Tray</h3>
    `; 

    const keys = Object.keys(cart);
    
    // 如果为空的状态
    if (keys.length === 0) {
        listContainer.innerHTML += `
            <div class="empty-cart">
                <i>🍹</i>
                <div>Your tray is empty...</div>
                <div style="font-size:12px; opacity:0.6;">Add your favorite drinks!</div>
            </div>
        `;
        return;
    }

    // 渲染商品列表
    for (let name in cart) {
        const item = cart[name];
        listContainer.innerHTML += `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                <div style="text-align:left;">
                    <div style="font-weight:700; color:#fdfcfb; font-size:16px;">${name}</div>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <button class="qty-btn" onclick="removeFromCart('${name}')">−</button>
                    <span style="color:#fdfcfb; min-width:24px; text-align:center; font-weight:600;">${item.qty}</span>
                    <button class="qty-btn" onclick="addToCart('${name}', ${item.price})">+</button>
                </div>
            </div>
        `;
    }
}

/* =========================================
   3. 提示与菜单过滤
   ========================================= */
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('toast-show');
    setTimeout(() => { toast.classList.remove('toast-show'); }, 2000);
}

function filterMenu(category, event) {
    // 处理 Tab 状态
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // 处理卡片过滤
    const cards = document.querySelectorAll('.menu-card');
    let delay = 0; 
    cards.forEach(card => {
        const itemCategories = card.getAttribute('data-category').split(' ');
        if (category === 'all' || itemCategories.includes(category)) {
            card.classList.remove('hide-card');
            
            // 重置并触发入场动画
            card.style.animation = 'none';
            card.offsetHeight; // 触发回流
            card.style.animation = `fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s forwards`;
            delay += 0.08; 
        } else {
            card.classList.add('hide-card');
        }
    });
}

/* =========================================
   4. 系统交互与初始化
   ========================================= */

// 发送订单
function sendWhatsAppOrder() {
    let keys = Object.keys(cart);
    if (keys.length === 0) return;

    let orderText = "Hello! I would like to order:\n\n";
    for (let name in cart) {
        orderText += `• ${name} (x${cart[name].qty})\n`;
    }
    orderText += `\nThank you! 🍹`;
    
    const phoneNumber = "601116260164";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`;
    window.location.href = url;
}

// 背景视差效果
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.body.style.backgroundPosition = `${x * 10}px ${y * 10}px`;
});

// 图片加载状态处理 (配合 CSS 动画)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.menu-img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        }
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
});

// 防右键
document.addEventListener('contextmenu', event => event.preventDefault());
