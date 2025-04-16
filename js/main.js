// Общие функции для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    checkAuth();
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElements = document.querySelectorAll('#cart-count');
    
    countElements.forEach(el => {
        el.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    });
}

function checkAuth() {
    const user = localStorage.getItem('user');
    const authLinks = document.querySelectorAll('#auth-link');
    
    if (user) {
        const userData = JSON.parse(user);
        authLinks.forEach(link => {
            link.textContent = userData.name;
            link.href = 'profile.html';
        });
    } else {
        authLinks.forEach(link => {
            link.textContent = 'Войти';
            link.href = 'auth.html';
        });
    }
}