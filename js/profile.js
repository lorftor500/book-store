document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'auth.html';
        return;
    }
    
    // Получаем полные данные пользователя из хранилища
    const users = JSON.parse(localStorage.getItem('users'));
    const fullUserData = users.find(u => u.email === user.email);
    
    if (!fullUserData) {
        alert('Данные пользователя не найдены');
        window.location.href = 'auth.html';
        return;
    }
    
    // Заполняем данные профиля
    document.getElementById('profile-name').textContent = fullUserData.name;
    document.getElementById('profile-email').textContent = fullUserData.email;
    
    // Генерируем инициалы для аватара
    const initials = fullUserData.name.split(' ').map(n => n[0]).join('');
    document.getElementById('avatar-initials').textContent = initials;
    
    // Обновляем статистику
    document.getElementById('orders-count').textContent = fullUserData.orders ? fullUserData.orders.length : 0;
    document.getElementById('books-count').textContent = fullUserData.orders ? 
        fullUserData.orders.reduce((total, order) => total + order.items.length, 0) : 0;
    
    // Отображаем историю заказов
    displayOrdersHistory(fullUserData.orders || []);
    
    // Обработчик выхода
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Обновляем счетчик корзины
    updateCartCount();
});

// Функция для отображения истории заказов
function displayOrdersHistory(orders) {
    const ordersList = document.getElementById('orders-list');
    
    if (!ordersList) return;
    
    if (!orders || orders.length === 0) {
        ordersList.innerHTML = '<p class="empty-orders">У вас пока нет заказов</p>';
        return;
    }
    
    // Сортируем заказы по дате (новые сначала)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Форматируем дату
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Определяем класс статуса
        let statusClass = 'status-processing';
        if (order.status.toLowerCase().includes('заверш')) statusClass = 'status-completed';
        if (order.status.toLowerCase().includes('отмен')) statusClass = 'status-cancelled';
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <span class="order-id">Заказ #${order.id}</span>
                    <span class="order-date">${formattedDate}</span>
                </div>
                <span class="order-status ${statusClass}">${order.status}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.title || `Книга #${item.id}`}</span>
                        <span>${item.quantity} × ${item.price} руб.</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Итого: ${order.total} руб.
            </div>
        `;
        
        ordersList.appendChild(orderCard);
    });
}