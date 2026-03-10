/* =========================================
   JS 动画逻辑增强
   ========================================= */

function toggleCartModal() {
    const container = document.getElementById('cart-container');
    const isOpening = !container.classList.contains('modal-active');

    if (isOpening) {
        // 1. 先渲染内容，确保高度已知
        renderCartModal();
        // 2. 稍微延迟一点点触发类名，让浏览器有时间准备好内容再动
        requestAnimationFrame(() => {
            container.classList.add('modal-active');
        });
        
        // 触感反馈 (可选)
        if (window.navigator.vibrate) window.navigator.vibrate(8);
    } else {
        // 关闭逻辑
        container.classList.remove('modal-active');
    }
}

// 修改 removeFromCart 确保在删除最后一个商品时平滑关闭
function removeFromCart(name) {
    if (cart[name]) {
        cart[name].qty -= 1;
        if (cart[name].qty <= 0) {
            delete cart[name];
        }
    }
    updateUI();
    
    // 如果车空了，自动关闭
    if (Object.keys(cart).length === 0) {
        document.getElementById('cart-container').classList.remove('modal-active');
    } else {
        renderCartModal(); 
    }
}
