document.addEventListener('DOMContentLoaded', function() {
    // Данные о книгах (должны совпадать с catalog.js)
    const books = [
        { id: 1, title: 'Властелин колец', price: 899 },
        { id: 2, title: 'Убийство в Восточном экспрессе', price: 450 },
        { id: 3, title: 'Гордость и предубеждение', price: 550 },
        { id: 4, title: 'Краткая история времени', price: 699 },
        { id: 5, title: 'Гарри Поттер и философский камень', price: 799 },
        { id: 6, title: 'Шерлок Холмс: Собака Баскервилей', price: 499 }
    ];
    
    // Инициализация корзины
    displayCartItems(books);
    
    // Обработка оформления заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (!user) {
                alert('Пожалуйста, войдите или зарегистрируйтесь для оформления заказа.');
                window.location.href = 'auth.html';
                return;
            }
            
            if (cart.length === 0) {
                alert('Ваша корзина пуста!');
                return;
            }
            
            // Сохраняем заказ в профиль пользователя
            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.email === user.email);
            
            if (userIndex !== -1) {
                const order = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    items: [...cart],
                    total: calculateTotal(cart, books),
                    status: 'Обрабатывается'
                };
                
                users[userIndex].orders.push(order);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Обновляем данные текущего пользователя
                const updatedUser = {
                    ...user,
                    orders: users[userIndex].orders
                };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
            
            alert('Заказ успешно оформлен! Спасибо за покупку.');
            localStorage.removeItem('cart');
            updateCartCount();
            displayCartItems(books);
            
            // Перенаправляем в профиль
            window.location.href = 'profile.html';
        });
    }
});

// Функция для отображения товаров в корзине
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
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-id="${book.id}">-</button>
                        <span class="quantity">${cartItem.quantity}</span>
                        <button class="quantity-btn plus" data-id="${book.id}">+</button>
                    </div>
                    <p>${book.price} руб. × ${cartItem.quantity}</p>
                </div>
                <div class="cart-item-price">${itemPrice} руб.</div>
                <button class="cart-item-remove" data-id="${book.id}">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        }
    });
    
    // Добавляем обработчики для кнопок управления количеством
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(bookId, -1, books);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(bookId, 1, books);
        });
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

// Функция для обновления количества товара в корзине
function updateCartItemQuantity(bookId, change, books) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === bookId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        // Удаляем товар, если количество стало 0 или меньше
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems(books);
    }
}

// Функция для удаления товара из корзины
function removeFromCart(bookId, books) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems(books);
}

// Функция для расчета общей суммы заказа
function calculateTotal(cart, books) {
    return cart.reduce((total, item) => {
        const book = books.find(b => b.id === item.id);
        return total + (book ? book.price * item.quantity : 0);
    }, 0);
}

// Функция для обновления счетчика корзины (уже есть в main.js)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElements = document.querySelectorAll('#cart-count');
    
    countElements.forEach(el => {
        el.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    });
}