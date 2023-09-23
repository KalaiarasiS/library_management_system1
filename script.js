class Library {
    constructor(title, availableCopies) {
        this.title = title;
        this.availableCopies = availableCopies;
        this.borrowed = false;
        this.borrowedDate = null;
    }

    getTitle() {
        return this.title;
    }

    getAvailableCopies() {
        return this.availableCopies;
    }
   //abstract methods
    borrowItem(borrowedDate) {
    }

    returnItem(returnDate, borrowedDate) {
    }

    calculateLateFees(returnDate, borrowedDate) {
    }
}
//inheritance using extends keyword
class Book extends Library {
    items = [];
    constructor(title, author, ISBN, availableCopies) {
        super(title, availableCopies);
        this.author = author;
        this.ISBN = ISBN;
    }

    getAuthor() {
        return this.author;
    }

    getISBN() {
        return this.ISBN;
    }

    addBook(book) {
        this.items.push(book);
    }

    getBookByISBN(ISBN) {
        return this.items.find(book => book instanceof Book && book.getISBN() === ISBN);
    }

    getAllBooks() {
        return this.items.filter(item => item instanceof Book);
    }

    searchBooks(query) {
        return this.items.filter(item =>
            item instanceof Book &&
            (item.getTitle().toLowerCase().includes(query.toLowerCase()) ||
            item.getAuthor().toLowerCase().includes(query.toLowerCase()))
        );
    }

    borrowItem(borrowedDate) {
        if (this.availableCopies > 0) {
            this.availableCopies--;
            this.borrowed = true;
            this.borrowedDate = borrowedDate;
        }
    }

    returnItem(returnDate, borrowedDate) {
        if (this.borrowed) {
            this.availableCopies++; 
            this.borrowed = false;
            return this.calculateLateFees(returnDate, borrowedDate);
        }
        return 0;
    }

    calculateLateFees(returnDate, borrowedDate) {
        const lateFeePerDay = 2;
        const dueDate = new Date(borrowedDate);
        dueDate.setDate(dueDate.getDate() + 14);

        if (returnDate > dueDate) {
            const daysOverdue = Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24));
            return daysOverdue * lateFeePerDay;
        } else {
            return 0;
        }
    }

    returnBookByISBN(ISBN) {
        const book = this.getBookByISBN(ISBN);
        if (book !== undefined) {
            if (book.borrowed) {
                const borrowedDate = new Date();
                borrowedDate.setDate(borrowedDate.getDate() - 28);

                const lateFees = book.returnItem(new Date(), borrowedDate);
                displayMessage(`Late fees for this book: ${lateFees.toFixed(2)} rupees`);
            } else {
                displayMessage("You can only return a borrowed book.");
            }
        } else {
            displayMessage("Book not found.");
        }
    }
}
const book = new Book();

function displayMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message;
}

function showInputFields() {
    const inputDiv = document.getElementById('input');
    const outputDiv = document.getElementById('output');
    const menuDiv = document.querySelector('.menu');

    if (menuDiv) {
        menuDiv.style.display = 'none';
    }

    if (inputDiv) {
        inputDiv.style.display = 'block';
    }

    if (outputDiv) {
        outputDiv.innerHTML = '';
    }
}

function showMainMenu() {
    const inputDiv = document.getElementById('input');
    const menuDiv = document.querySelector('.menu');

    if (inputDiv) {
        inputDiv.style.display = 'none';
    }

    if (menuDiv) {
        menuDiv.style.display = 'block';
    }
}

function addBook() {
    showInputFields();

    const inputDiv = document.getElementById('input');
    const form = document.createElement('form');

    form.innerHTML = `
        <h2>Add a Book</h2>
        <label for="title">Title:</label>
        <input type="text" id="title" required><br>

        <label for="author">Author:</label>
        <input type="text" id="author" required><br>

        <label for="isbn">ISBN:</label>
        <input type="text" id="isbn" required><br>

        <label for="copies">Available Copies:</label>
        <input type="number" id="copies" required><br>

        <button type="button" onclick="submitAddBook()">Submit</button>
    `;

    inputDiv.innerHTML = '';
    inputDiv.appendChild(form);
    // displayMessage('');
}

function submitAddBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const ISBN = document.getElementById('isbn').value;
    const availableCopies = parseInt(document.getElementById('copies').value);

    if (!title || !author || !ISBN || isNaN(availableCopies)) {
        displayMessage("All fields must be filled, and 'Available Copies' must be a valid number.");
    } else {
        const existingBook = book.getBookByISBN(ISBN);
        if (existingBook) {
            displayMessage("A book with the same ISBN already exists in the library.");
        } else {
            const newBook = new Book(title, author, ISBN, availableCopies);
            book.addBook(newBook);
            displayMessage("Book added successfully.");
        }
    }
    showMainMenu();
}

function borrowBook() {
    showInputFields();

    const inputDiv = document.getElementById('input');
    const form = document.createElement('form');

    form.innerHTML = `
        <h2>Borrow a Book</h2>
        <label for="borrowISBN">Enter ISBN of the book to borrow:</label>
        <input type="text" id="borrowISBN" required><br>

        <button type="button" onclick="submitBorrowBook()">Submit</button>
    `;

    inputDiv.innerHTML = '';
    inputDiv.appendChild(form);
    displayMessage('');
}

function submitBorrowBook() {
    const borrowISBN = document.getElementById('borrowISBN').value;
    if (!borrowISBN) {
        displayMessage("ISBN field must not be empty.");
    } else {
        const borrowBook = book.getBookByISBN(borrowISBN);
        if (borrowBook !== undefined) {
            const borrowedDate = new Date();
            borrowBook.borrowItem(borrowedDate);
            displayMessage("Book borrowed successfully.");
        } else {
            displayMessage("Book not found or no available copies.");
        }
    }
    showMainMenu();
}

function returnBook() {
    showInputFields();

    const inputDiv = document.getElementById('input');
    const form = document.createElement('form');

    form.innerHTML = `
        <h2>Return a Book</h2>
        <label for="returnISBN">Enter ISBN of the book to return:</label>
        <input type="text" id="returnISBN" required><br>

        <button type="button" onclick="submitReturnBook()">Submit</button>
    `;

    inputDiv.innerHTML = '';
    inputDiv.appendChild(form);
    displayMessage('');
}

function submitReturnBook() {
    const returnISBN = document.getElementById('returnISBN').value;
    book.returnBookByISBN(returnISBN);
    showMainMenu();
}

function listBooks() {
    const allBooks = book.getAllBooks();
    let bookList = "All Books in the Library:<br>";
    allBooks.forEach(book => {
        bookList += `Title: ${book.getTitle()}, Author: ${book.getAuthor()}, ISBN: ${book.getISBN()}, Available Copies: ${book.getAvailableCopies()}<br>`;
    });
    displayMessage(bookList);
}

function searchBooks() {
    showInputFields();

    const inputDiv = document.getElementById('input');
    const form = document.createElement('form');

    form.innerHTML = `
        <h2>Search for Books</h2>
        <label for="searchQuery">Enter search query (title or author):</label>
        <input type="text" id="searchQuery" required><br>

        <button type="button" onclick="submitSearchBooks()">Submit</button>
    `;

    inputDiv.innerHTML = '';
    inputDiv.appendChild(form);
    displayMessage('');
}

function submitSearchBooks() {
    const query = document.getElementById('searchQuery').value;
    if (!query) {
        displayMessage("Search query must not be empty.");
    } else {
        const matchingBooks = book.searchBooks(query);
        if (matchingBooks.length === 0) {
            displayMessage("No matching books found.");
        } else {
            let matchingBookList = "Matching Books:<br>";
            matchingBooks.forEach(book => {
                matchingBookList += `Title: ${book.getTitle()}, Author: ${book.getAuthor()}, ISBN: ${book.getISBN()}, Available Copies: ${book.getAvailableCopies()}<br>`;
            });
            displayMessage(matchingBookList);
        }
    }
    showMainMenu();
}

function quit() {
    displayMessage("Exiting Library Management System. Goodbye!");
}

showMainMenu();