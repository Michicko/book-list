const title = document.querySelector('#title');
const author = document.querySelector('#author');
const isbn = document.querySelector('#isbn');
const bookForm = document.querySelector("#book-form");
const bookList = document.querySelector('#book-list');

// DOMContenLoaded
document.addEventListener('DOMContentLoaded', function () {
    const store = new Store();
    const ui = new UI();
    const books = store.getBooks();
    books.forEach((book) => {
        ui.displayBook(book);
    });
});

// EventListener
bookForm.addEventListener('submit', addBookToDom);
bookList.addEventListener('click', deleteBook);

// Book 
function Book(title, author, isbn) {
    this.title = title;
    this.author = author; 
    this.isbn = isbn;
}

// UI
function UI() {}
UI.prototype.displayBook = function (book) {
    let html = `<tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td class="del">X</td>
                </tr>`;
    bookList.innerHTML += html;   
}

// =================
// UI Prototypes
// =================

// clear fields
UI.prototype.clearFields = function () {
    title.value = '';
    author.value = '';
    isbn.value = '';
}

// Remove book
UI.prototype.removeBook = function (bookItem) {
    bookItem.remove();
}

// show alert
UI.prototype.showAlert = function (msg, className) {
    const message = document.querySelector('.message');
    message.classList += ` ${className}`;

    // if error already exists
    if (message.firstChild) {
        message.firstChild.remove();
    }

    // show alert
    message.appendChild(document.createTextNode(msg));

    // remove alert after 2s
    setTimeout(function () {
        if (message.firstChild) {
            message.classList.remove(className);
            message.firstChild.remove();
        }
    }, 2000);
}


// storage
function Store() { }

// ==================
// Storage Prototypes
// ==================

// get books from storage
Store.prototype.getBooks = function () {
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}

// save book to storage
Store.prototype.saveBook = function (book) {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}

// remove from storage
Store.prototype.removeFromStore = function (isbn) {
    const books = this.getBooks();
    books.forEach((book, i) => {
        if (book.isbn === isbn) {
            books.splice(i, 1);
        }
    });
    localStorage.setItem('books', JSON.stringify(books));
}

// Add book to dom
function addBookToDom(e) {
    const bookTitle = title.value;
    const bookAuthor = author.value;
    const bookIsbn = isbn.value;
    const book = new Book(bookTitle, bookAuthor, bookIsbn);
    const ui = new UI();
    const store = new Store();
    
    if (bookTitle === '' || bookAuthor === '' || bookIsbn === '') {
        console.log('Please fill all fields');
        ui.showAlert('Please fill all fields', 'error')
    } else {
        ui.displayBook(book);
        ui.clearFields();
        ui.showAlert('Book added successfully', 'success');
        store.saveBook(book);
    }
    e.preventDefault();
}

// Delete book from dom
function deleteBook(e) {
    const bookItem = e.target.parentElement;
    const isbn = e.target.parentElement.children[2].textContent;
    const ui = new UI();
    const store = new Store();
    if (e.target.classList.contains('del')) {
        ui.removeBook(bookItem);
        store.removeFromStore(isbn);
        ui.showAlert('Deleted successfully', 'success');
    }
}


