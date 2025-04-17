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
    
    // Заполняем данные профиля
    document.getElementById('profile-name').textContent = fullUserData.name;
    document.getElementById('profile-email').textContent = fullUserData.email;
    
    // Генерируем инициалы для аватара
    const initials = fullUserData.name.split(' ').map(n => n[0]).join('');
    document.getElementById('avatar-initials').textContent = initials;
    
    // Обновляем статистику
    document.getElementById('orders-count').textContent = fullUserData.orders.length;
    document.getElementById('books-count').textContent = fullUserData.orders.reduce((total, order) => total + order.items.length, 0);
    
    // Обработчик выхода
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Обновляем счетчик корзины
    updateCartCount();
});