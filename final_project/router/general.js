const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the list of books available in the shop using Async/Await & Axios simulation
public_users.get('/', async function (req, res) {
  try {
    // Asynchronously retrieve book list
    const getBooks = () => new Promise((resolve) => resolve(books));
    const bookList = await getBooks();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list from database" });
  }
});

// Task 11: Get book details based on ISBN using Async/Await & Promises
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(`No book found with ISBN: ${isbn}`);
      }
    });

    const book = await getBookByISBN;
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 12: Get book details based on Author using Async/Await & Promises
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
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

    const booksList = await getBooksByAuthor;
    return res.status(200).json(booksList);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 13: Get book details based on Title using Async/Await & Promises
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
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

    const booksList = await getBooksByTitle;
    return res.status(200).json(booksList);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `No reviews found for ISBN: ${isbn}` });
  }
});

module.exports.general = public_users;
