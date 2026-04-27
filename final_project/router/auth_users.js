const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (doesn't already exist)
const isValid = (username) => {
  return users.some(user => user.username === username);
}

// Check if usearname and password match records
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, "fingerprint_customer");
    const username = decoded.username;
    
    if (!review) {
      return res.status(400).json({ message: "Review content required" });
    }
    
    if (books[isbn]) {
      // Add or update review for this book by this user
      books[isbn].reviews[username] = review;
      return res.status(200).json({ 
        message: "Review added/updated successfully", 
        reviews: books[isbn].reviews 
      });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, "fingerprint_customer");
    const username = decoded.username;
    
    if (books[isbn]) {
      if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ 
          message: "Review deleted successfully", 
          reviews: books[isbn].reviews 
        });
      } else {
        return res.status(404).json({ message: "No review found for this user" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;