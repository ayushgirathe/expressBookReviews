const express = require('express');
const axios = require('axios'); // Axios for HTTP requests
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Base URL for internal API calls
const BASE_URL = 'http://localhost:5000';

// ============================================
// USER REGISTRATION
// ============================================
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  
  // Check if user already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  
  // Register new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// ============================================
// TASK 10: Get all books - Using Async/Await with Axios
// ============================================
public_users.get('/', async function (req, res) {
  try {
    // Make HTTP request to get all books
    const response = await axios.get(`${BASE_URL}/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Handle any errors during the request
    return res.status(500).json({ 
      message: "Error fetching books", 
      error: error.message 
    });
  }
});

// ============================================
// TASK 11: Get book by ISBN - Using Promises with Axios
// ============================================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Using Promise pattern with .then() and .catch()
  axios.get(`${BASE_URL}/books/${isbn}`)
    .then(response => {
      // Success: Return the book data
      return res.status(200).json(response.data);
    })
    .catch(error => {
      // Error: Book not found or server error
      return res.status(404).json({ 
        message: "Book not found", 
        error: error.message 
      });
    });
});

// ============================================
// TASK 12: Get books by author - Using Async/Await with Axios
// ============================================
public_users.get('/author/:author', async function (req, res) {
  // Decode the author name from URL (handles spaces and special characters)
  const author = decodeURIComponent(req.params.author);
  
  try {
    // Fetch all books from the /books endpoint
    const response = await axios.get(`${BASE_URL}/books`);
    const books = response.data;
    const result = [];
    
    // Loop through all books and filter by author name
    for (let id in books) {
      if (books[id].author === author) {
        // Add matching book to result array with ISBN included
        result.push({ isbn: id, ...books[id] });
      }
    }
    
    // Return results if found, otherwise 404
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ 
      message: "Error fetching books by author", 
      error: error.message 
    });
  }
});

// ============================================
// TASK 13: Get book by title - Using Promises with Axios
// ============================================
public_users.get('/title/:title', function (req, res) {
  // Decode the title from URL (handles spaces and special characters)
  const title = decodeURIComponent(req.params.title);
  
  // Using Promise pattern with .then() and .catch()
  axios.get(`${BASE_URL}/books`)
    .then(response => {
      const books = response.data;
      let found = null;
      
      // Loop through all books to find matching title
      for (let id in books) {
        if (books[id].title === title) {
          found = { isbn: id, ...books[id] };
          break; // Stop searching once found
        }
      }
      
      // Return result if found, otherwise 404
      if (found) {
        return res.status(200).json(found);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => {
      return res.status(500).json({ 
        message: "Error fetching book by title", 
        error: error.message 
      });
    });
});

// ============================================
// Get book review - Using Async/Await with Axios
// ============================================
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    // Fetch the specific book by ISBN
    const response = await axios.get(`${BASE_URL}/books/${isbn}`);
    const book = response.data;
    
    // Return the reviews object (empty if no reviews exist)
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ 
      message: "Error fetching review", 
      error: error.message 
    });
  }
});

module.exports.general = public_users;