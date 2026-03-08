function showOrderToast(drinkName) {
    const toast = document.getElementById('toast');
    toast.innerText = `Connecting to Bartender for ${drinkName}...`;
    toast.className = "toast-hidden toast-show";

    const phoneNumber = "601116260164";
    const message = encodeURIComponent(`Hello! I would like to order: ${drinkName} 🍹`);

    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    
    window.location.href = whatsappUrl;

    setTimeout(() => {
        toast.className = "toast-hidden";
    }, 3000);
}

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
});
