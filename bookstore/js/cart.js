document.addEventListener('DOMContentLoaded', function() {
    // Пример данных о книгах (должны совпадать с catalog.js)
    const books = [
        { id: 1, title: 'Властелин колец', price: 899 },
        { id: 2, title: 'Убийство в Восточном экспрессе', price: 450 },
        { id: 3, title: 'Гордость и предубеждение', price: 550 },
        { id: 4, title: 'Краткая история времени', price: 699 },
        { id: 5, title: 'Гарри Поттер и философский камень', price: 799 },
        { id: 6, title: 'Шерлок Холмс: Собака Баскервилей', price: 499 }
    ];
    
    displayCartItems(books);
    
    // Обработка оформления заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const user = localStorage.getItem('user');
            
            if (!user) {
                alert('Пожалуйста, войдите или зарегистрируйтесь для оформления заказа.');
                window.location.href = 'auth.html';
                return;
            }
            
            // В реальном приложении здесь был бы запрос к серверу
            alert('Заказ успешно оформлен! Спасибо за покупку.');
            localStorage.removeItem('cart');
            updateCartCount();
            displayCartItems(books);
        });
    }
});

function displayCartItems(books) {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        totalPriceElement.textContent = '0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(cartItem => {
        const book = books.find(b => b.id === cartItem.id);
        
        if (book) {
            const itemPrice = book.price * cartItem.quantity;
            totalPrice += itemPrice;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <h3>${book.title}</h3>
                    <p>${book.price} руб. × ${cartItem.quantity}</p>
                </div>
                <div class="cart-item-price">${itemPrice} руб.</div>
                <span class="cart-item-remove" data-id="${book.id}">×</span>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        }
    });
    
    // Добавляем обработчики для удаления товаров
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            removeFromCart(bookId, books);
        });
    });
    
    totalPriceElement.textContent = totalPrice;
    if (checkoutBtn) checkoutBtn.disabled = false;
}

function removeFromCart(bookId, books) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems(books);
}