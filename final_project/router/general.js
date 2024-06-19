const express = require('express');
const axios = require("axios");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "Customer already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register customer." });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    const response = await axios.get("https://raw.githubusercontent.com/sidhartha426/expressBookReviews/main/final_project/router/books.json");
    const books = response.data;
    res.send(JSON.stringify({ books }, null, 4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
    const isbn = req.params.isbn;
    const response = await axios.get("https://raw.githubusercontent.com/sidhartha426/expressBookReviews/main/final_project/router/books.json");
    const books = response.data;
    res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
    const author = req.params.author;
    const response = await axios.get("https://raw.githubusercontent.com/sidhartha426/expressBookReviews/main/final_project/router/books.json");
    const books = response.data;
    const booksByAuthor = [];
    for (const isbn in books) {
        if (books[isbn]["author"] === author) {
            booksByAuthor.push(books[isbn]);
        }
    }
    res.send(JSON.stringify({ booksbyauthor: booksByAuthor }, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
    const title = req.params.title;
    const response = await axios.get("https://raw.githubusercontent.com/sidhartha426/expressBookReviews/main/final_project/router/books.json");
    const books = response.data;
    const booksByTitle = [];
    for (const isbn in books) {
        if (books[isbn]["title"] === title) {
            booksByTitle.push(books[isbn]);
        }
    }
    res.send(JSON.stringify({ booksbytitle: booksByTitle }, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
