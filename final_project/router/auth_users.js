const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {

    for (const user of users) {
        if (user.username === username)
            return true;
    }
    return false;
}

const authenticatedUser = (username, password) => {
    for (const user of users) {
        if (user.username === username && user.password === password)
            return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).send("Error logging in");
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).send("Invalid Login. Check username and password");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.user.username;
    const isbn = req.params.isbn;
    books[isbn]["reviews"][username] = req.body.review;
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.user.username;
    const isbn = req.params.isbn;
    delete books[isbn]["reviews"][username];
    return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
