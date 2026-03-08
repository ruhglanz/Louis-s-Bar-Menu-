function showOrderToast() {
    const toast = document.getElementById('toast');
    
    toast.className = "toast-hidden toast-show";
    
    setTimeout(() => {
        toast.className = "toast-hidden";
    }, 2500);

    if (window.navigator.vibrate) {
        window.navigator.vibrate(20);
    }
}

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
});
