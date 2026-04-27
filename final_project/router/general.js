const express = require('express');
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

// User registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop - Using Async/Await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN - Using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  axios.get(`${BASE_URL}/books/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(404).json({ message: "Book not found", error: error.message });
    });
});

// Get book details based on author - Using Async/Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = decodeURIComponent(req.params.author);
  
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    const books = response.data;
    const result = [];
    
    for (let id in books) {
      if (books[id].author === author) {
        result.push({ isbn: id, ...books[id] });
      }
    }
    
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get all books based on title - Using Promise with Axios
public_users.get('/title/:title', function (req, res) {
  const title = decodeURIComponent(req.params.title);
  
  axios.get(`${BASE_URL}/books`)
    .then(response => {
      const books = response.data;
      let found = null;
      
      for (let id in books) {
        if (books[id].title === title) {
          found = { isbn: id, ...books[id] };
          break;
        }
      }
      
      if (found) {
        return res.status(200).json(found);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => {
      return res.status(500).json({ message: "Error fetching book by title", error: error.message });
    });
});

// Get book review - Using Async/Await with Axios
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    const response = await axios.get(`${BASE_URL}/books/${isbn}`);
    const book = response.data;
    
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching review", error: error.message });
  }
});

module.exports.general = public_users;