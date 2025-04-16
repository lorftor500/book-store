document.addEventListener('DOMContentLoaded', function() {
    const books = [
        {
            id: 1,
            title: 'Властелин колец',
            author: 'Дж. Р. Р. Толкин',
            genre: 'fantasy',
            price: 899,
            description: 'Эпическая фэнтезийная сага о Средиземье.'
        },
        {
            id: 2,
            title: 'Убийство в Восточном экспрессе',
            author: 'Агата Кристи',
            genre: 'detective',
            price: 450,
            description: 'Знаменитый детектив Эркюль Пуаро расследует убийство в поезде.'
        },
        {
            id: 3,
            title: 'Снеговик',
            author: 'Ю Несбё',
            genre: 'romance',
            price: 550,
            description: ' детективный роман Ю Несбё, часть серии о Харри Холе.'
        },
        {
            id: 4,
            title: 'Краткая история времени',
            author: 'Стивен Хокинг',
            genre: 'science',
            price: 699,
            description: 'Популярное изложение космологии для широкой аудитории.'
        },
        {
            id: 5,
            title: 'Гарри Поттер и философский камень',
            author: 'Дж. К. Роулинг',
            genre: 'fantasy',
            price: 799,
            description: 'Первая книга о приключениях юного волшебника.'
        },
        {
            id: 6,
            title: 'Шерлок Холмс: Собака Баскервилей',
            author: 'Артур Конан Дойл',
            genre: 'detective',
            price: 499,
            description: 'Знаменитый детектив расследует загадочное убийство.'
        }
    ];
    
    displayBooks(books);
    
    const genreFilter = document.getElementById('genre-filter');
    if (genreFilter) {
        genreFilter.addEventListener('change', function() {
            const genre = this.value;
            const filteredBooks = genre === 'all' 
                ? books 
                : books.filter(book => book.genre === genre);
            displayBooks(filteredBooks);
        });
    }
    
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const genre = document.getElementById('genre-filter').value;
            
            let filteredBooks = books;
            
            if (genre !== 'all') {
                filteredBooks = filteredBooks.filter(book => book.genre === genre);
            }
            
            if (query) {
                filteredBooks = filteredBooks.filter(book => 
                    book.title.toLowerCase().includes(query)
                );
            }
            
            displayBooks(filteredBooks);
        });
    }
});

function displayBooks(books) {
    const catalogGrid = document.getElementById('catalog');
    
    if (!catalogGrid) return;
    
    catalogGrid.innerHTML = '';
    
    if (books.length === 0) {
        catalogGrid.innerHTML = '<p class="empty-catalog">Книги не найдены</p>';
        return;
    }
    
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('data-id', book.id);
        
        bookCard.innerHTML = `
            <div class="book-image">
                <span>${book.title}</span>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>Автор: ${book.author}</p>
                <div class="book-price">${book.price} руб.</div>
                <button class="btn add-to-cart" data-id="${book.id}">В корзину</button>
            </div>
        `;
        
        bookCard.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart')) {
                showBookDetails(book);
            }
        });
        
        catalogGrid.appendChild(bookCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const bookId = parseInt(this.getAttribute('data-id'));
            addToCart(bookId);
        });
    });
}

function showBookDetails(book) {
    const modal = document.createElement('div');
    modal.className = 'book-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-image" style="background: linear-gradient(45deg, #4361ee, #3a0ca3)">
                <h2>${book.title}</h2>
            </div>
            <div class="modal-details">
                <h3>${book.title}</h3>
                <p class="book-author">Автор: ${book.author}</p>
                <p class="book-genre">Жанр: ${getGenreName(book.genre)}</p>
                <p class="book-price">Цена: ${book.price} руб.</p>
                <div class="book-description">
                    <h4>Описание:</h4>
                    <p>${book.description}</p>
                </div>
                <button class="btn add-to-cart-modal" data-id="${book.id}">Добавить в корзину</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    modal.querySelector('.add-to-cart-modal').addEventListener('click', function(e) {
        e.stopPropagation();
        const bookId = parseInt(this.getAttribute('data-id'));
        addToCart(bookId);
        closeModal();
    });
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

function getGenreName(genre) {
    const genres = {
        'fantasy': 'Фэнтези',
        'detective': 'Детектив',
        'romance': 'Роман',
        'science': 'Научная литература'
    };
    return genres[genre] || genre;
}

function addToCart(bookId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: bookId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    showNotification('Книга добавлена в корзину!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}
