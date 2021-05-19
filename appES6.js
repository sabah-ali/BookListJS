class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Constructor 
class UI {
    constructor() { }
    addBookToList(book) {
        const list = document.querySelector('#book-list');
        //create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">x</a></td>
    `;
        // appending row to the booklist <tbody> in html doc 
        list.appendChild(row);
    }
    //show alerts
    showAlert(message, classname) {
        //creating div element
        const div = document.createElement('div');
        // add class name
        div.className = `alert ${classname}`;
        // add text 
        div.appendChild(document.createTextNode(message));
        // get a parent
        const container = document.querySelector('.container');
        // get form
        const form = document.querySelector('#book-form');
        //insert alert
        // insert div and what we want to insert before is the form 
        container.insertBefore(div, form);

        // timeout after 3 seconds
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }
    // delete book
    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }
    // clear fields prototype
    clearFields() {
        document.querySelector('#title').value = ' ';
        document.querySelector('#author').value = ' ';
        document.querySelector('#isbn').value = ' ';
    }
}

// local storage class

class Store {
    static getBooks(){
        let books; 
        if(localStorage.getItem('books')=== null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            // add book to ui
            ui.addBookToList(book);

        });
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index,1);
            }

        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// DOM load event 

document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event listeners for add book 
document.querySelector('#book-form').addEventListener('submit',function(e){
    // get form values 
const title = document.querySelector('#title').value,
    author = document.querySelector('#author').value,
    isbn = document.querySelector('#isbn').value

    // new book
 const book = new Book(title,author,isbn)

    // creating ui object
    const ui = new UI();
    
    //validate
    if (title === ' ' || author === ' ' || isbn === ' '){
        // error alert
        ui.showAlert('enter information into fields', 'error');
    } else {
    // add book to list 
    ui.addBookToList(book);

    // add to local storage
    Store.addBook(book);

    // show success
    ui.showAlert('Book added', 'success');

    // clear fields
    ui.clearFields();

    }


   
e.preventDefault();
});

// event listener for delete
document.querySelector('#book-list').addEventListener('click',function(e){
   
    // create ui object 
    const ui = new UI();
    //delete book 
    ui.deleteBook(e.target);

    // remove from ls
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show message
    ui.showAlert('Book removed','success');
    
    e.preventDefault();
})