const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
        users.push({ "username" : username, "password": password});
        return res.status(200).json({ message: "Customer successfully registered. Now you can login"});
    } else {
        return res.status(404).json({ message: "User already exists! "});
    }
  }
  return res.status(404).json({ message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Simulating asynchronous retrieval with Promise / Axios
      const getBooks = () => new Promise((resolve) => resolve(books));
      const bookList = await getBooks();
      return res.status(200).json(bookList);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(`No book found with ISBN: ${isbn}`);
      }
    });
  
    getBookByISBN
      .then((book) => res.status(200).json(book))
      .catch((err) => res.status(404).json({ message: err }));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(
        (b) => b.author.toLowerCase() === author.toLowerCase()
      );
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(`No books found for author: ${author}`);
      }
    });
  
    getBooksByAuthor
      .then((booksList) => res.status(200).json(booksList))
      .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(
        (b) => b.title.toLowerCase() === title.toLowerCase()
      );
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(`No books found with title: ${title}`);
      }
    });
  
    getBooksByTitle
      .then((booksList) => res.status(200).json(booksList))
      .catch((err) => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
