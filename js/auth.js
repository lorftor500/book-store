document.addEventListener('DOMContentLoaded', function() {
    // Инициализация хранилища пользователей, если его нет
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

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
            
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                alert('Неверный email или пароль');
                return;
            }
            
            // Сохраняем текущего пользователя
            localStorage.setItem('currentUser', JSON.stringify({
                email: user.email,
                name: user.name,
                token: 'fake-jwt-token'
            }));
            
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
            
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Проверяем, есть ли уже пользователь с таким email
            if (users.some(u => u.email === email)) {
                alert('Пользователь с таким email уже зарегистрирован');
                return;
            }
            
            // Добавляем нового пользователя
            const newUser = {
                name: name,
                email: email,
                password: password,
                orders: [],
                registeredAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Автоматически входим после регистрации
            localStorage.setItem('currentUser', JSON.stringify({
                email: newUser.email,
                name: newUser.name,
                token: 'fake-jwt-token'
            }));
            
            alert('Регистрация успешна!');
            checkAuth();
            window.location.href = 'profile.html';
        });
    }
});