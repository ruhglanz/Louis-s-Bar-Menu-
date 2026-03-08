function showOrderToast(drinkName) {
    const toast = document.getElementById('toast');
    toast.innerText = `Preparing your ${drinkName}...`;
    toast.className = "toast-hidden toast-show";

    if (window.navigator.vibrate) {
        window.navigator.vibrate(20);
    }

    const phoneNumber = "601116260164";
    const message = encodeURIComponent(`Hello! I would like to order: ${drinkName} 🍹`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');

    setTimeout(() => {
        toast.className = "toast-hidden";
    }, 3000);
}

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
});
