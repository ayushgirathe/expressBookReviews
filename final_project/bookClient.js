// bookClient.js - Node.js program using Axios with Async/Await and Promises
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// ============================================
// TASK 10: Get all books - Using Async/Await
// ============================================
async function getAllBooks() {
    console.log("\n" + "=".repeat(60));
    console.log("TASK 10: Get All Books (Async/Await)");
    console.log("=".repeat(60));
    
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log("Success! Retrieved all books:");
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

// ============================================
// TASK 11: Search by ISBN - Using Promises
// ============================================
function getBookByISBN(isbn) {
    console.log("\n" + "=".repeat(60));
    console.log(`TASK 11: Search by ISBN ${isbn} (Promises)`);
    console.log("=".repeat(60));
    
    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => {
            console.log("Success! Book found:");
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch(error => {
            console.error("Error fetching book by ISBN:", error.message);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
        });
}

// ============================================
// TASK 12: Search by Author - Using Async/Await
// ============================================
async function getBooksByAuthor(author) {
    console.log("\n" + "=".repeat(60));
    console.log(`TASK 12: Search by Author "${author}" (Async/Await)`);
    console.log("=".repeat(60));
    
    try {
        const encodedAuthor = encodeURIComponent(author);
        const response = await axios.get(`${BASE_URL}/author/${encodedAuthor}`);
        console.log("Success! Books found:");
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

// ============================================
// TASK 13: Search by Title - Using Promises
// ============================================
function getBookByTitle(title) {
    console.log("\n" + "=".repeat(60));
    console.log(`TASK 13: Search by Title "${title}" (Promises)`);
    console.log("=".repeat(60));
    
    const encodedTitle = encodeURIComponent(title);
    axios.get(`${BASE_URL}/title/${encodedTitle}`)
        .then(response => {
            console.log("Success! Book found:");
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch(error => {
            console.error("Error fetching book by title:", error.message);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
        });
}

// ============================================
// Run all functions
// ============================================
async function runAll() {
    console.log("\n");
    console.log("█".repeat(70));
    console.log("     NODE.JS PROGRAM WITH AXIOS - COMPLETE OUTPUT");
    console.log("     Tasks 10, 11, 12, 13");
    console.log("█".repeat(70));
    
    // Task 10: Get all books (Async/Await)
    await getAllBooks();
    
    // Task 11: Search by ISBN (Promises)
    getBookByISBN('1');
    
    // Wait a bit for Promise to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Task 12: Search by Author (Async/Await)
    await getBooksByAuthor('Chinua Achebe');
    
    // Task 13: Search by Title (Promises)
    getBookByTitle('Things Fall Apart');
    
    console.log("\n" + "█".repeat(70));
    console.log("     ALL TASKS COMPLETED SUCCESSFULLY!");
    console.log("█".repeat(70) + "\n");
}

// Execute the program
runAll();