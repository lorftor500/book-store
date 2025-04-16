document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'auth.html';
        return;
    }
    
    // Заполняем данные профиля
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    
    // Генерируем инициалы для аватара
    const initials = user.name.split(' ').map(n => n[0]).join('');
    document.getElementById('avatar-initials').textContent = initials;
    
    // Обработчик выхода
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
    
    // Обновляем ссылку в хедере
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        authLink.textContent = 'Выйти';
        authLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
    
    // Обновляем счетчик корзины
    updateCartCount();
});