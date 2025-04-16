document.addEventListener('DOMContentLoaded', function() {
    // Переключение между вкладками
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Обработка формы входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const user = {
                email: email,
                name: email.split('@')[0],
                token: 'fake-jwt-token'
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            alert('Вы успешно вошли!');
            checkAuth();
            window.location.href = 'profile.html';
        });
    }
    
    // Обработка формы регистрации
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            
            if (password !== confirm) {
                alert('Пароли не совпадают!');
                return;
            }
            
            const user = {
                email: email,
                name: name,
                token: 'fake-jwt-token'
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            alert('Регистрация успешна!');
            checkAuth();
            window.location.href = 'profile.html';
        });
    }
});