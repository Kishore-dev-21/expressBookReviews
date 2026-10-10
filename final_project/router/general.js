const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    bookKeys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({ message: "Author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    bookKeys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({ message: "Title not found" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on Author using Promises
public_users.get('/async/author/:author', function (req, res) {
    const author = req.params.author;
    const getBookByAuthor = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const matchingBooks = [];
        bookKeys.forEach((key) => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push(books[key]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("Author not found");
        }
    });

    getBookByAuthor
        .then((books) => res.status(200).json(books))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/async/title/:title', function (req, res) {
    const title = req.params.title;
    const getBookByTitle = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const matchingBooks = [];
        bookKeys.forEach((key) => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push(books[key]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("Title not found");
        }
    });

    getBookByTitle
        .then((books) => res.status(200).json(books))
        .catch((err) => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
