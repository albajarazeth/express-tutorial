# Express.js Beginner's Guide

> Learn how to build backends with JavaScript using Node.js and Express.js

---

## Table of Contents

- [What is Express.js?](#what-is-expressjs)
- [Getting Started](#getting-started)
- [Your First Server](#your-first-server)
- [Understanding Routes](#understanding-routes)
- [Working with JSON](#working-with-json)
- [Route Parameters](#route-parameters)
- [Connecting a Frontend](#connecting-a-frontend)
- [Handling CORS](#handling-cors)
- [POST Requests & Forms](#post-requests--forms)
- [Express Router](#express-router)
- [Middleware](#middleware)
- [Project Structure](#project-structure)

---

## What is Express.js?

**Express.js** is a minimal and flexible web framework for Node.js. It provides a robust set of features to build web applications and APIs.

Think of it this way:
- **Node.js** = JavaScript runtime that lets you run JS outside the browser
- **Express.js** = A toolkit that makes building web servers with Node.js much easier

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed. You can check by running:

```bash
node --version
npm --version
```

### Installation

1. **Initialize your project:**
   ```bash
   npm init -y
   ```
   This creates a `package.json` file that tracks your project dependencies.

2. **Install Express and CORS:**
   ```bash
   npm install express cors
   ```
   A `node_modules` folder will appear — this is where all the package code lives. You don't need to touch it!

---

## Your First Server

Create a file called `server.js`:

```javascript
const express = require("express");  // 1. Import Express
const app = express();                // 2. Create the app

app.listen(3000, () => {              // 3. Start listening on port 3000
  console.log("The server is running");
});
```

**Run it:**
```bash
node server.js
```

That's it! You now have a server running at `http://localhost:3000`

---

## Understanding Routes

A **route** tells Express: *"When someone visits this URL, do this thing."*

### Route Anatomy

```
app.METHOD(PATH, HANDLER)
```

| Part | Description |
|------|-------------|
| `METHOD` | HTTP method (`get`, `post`, `put`, `delete`) |
| `PATH` | The URL path (`/`, `/about`, `/products`) |
| `HANDLER` | Function that runs when the route matches |

### Basic GET Routes

```javascript
// Homepage route
app.get("/", (req, res) => {
  res.send("Hey there!!");
});

// About page route  
app.get("/about", (req, res) => {
  res.send("This is the about page");
});
```

- **`req`** (request) — Contains info about what the user is asking for
- **`res`** (response) — Used to send something back to the user

### Test Your Routes

1. Start the server: `node server.js`
2. Visit `http://localhost:3000` → See "Hey there!!"
3. Visit `http://localhost:3000/about` → See "This is the about page"

---

## Working with JSON

Real APIs don't just send text — they send **JSON** (JavaScript Object Notation).

JSON looks like a JavaScript object and is easy for both humans and machines to read:

```json
{ "id": 1, "name": "laptop", "price": 999 }
```

### Sending JSON Responses

Use `res.json()` instead of `res.send()`:

```javascript
app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "laptop", price: 999 },
    { id: 2, name: "phone", price: 699 }
  ]);
});
```

Visit `http://localhost:3000/products` and you'll see nicely formatted JSON data!

---

## Route Parameters

What if you have a million products? You can't create a million routes!

**Route parameters** let you capture dynamic values from the URL:

```javascript
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);  // Extract the ID from the URL
  
  const products = [
    { id: 1, name: "laptop" },
    { id: 2, name: "phone" }
  ];
  
  const product = products.find(p => p.id === id);
  res.json(product);
});
```

Now:
- `/products/1` → Returns the laptop
- `/products/2` → Returns the phone

The `:id` part is a **placeholder** that captures whatever value is in the URL.

> **Tip:** You can name it anything: `:id`, `:productId`, `:slug` — access it via `req.params.yourName`

---

## Connecting a Frontend

Here's how a frontend (HTML/JavaScript) talks to your Express backend:

### Frontend Code (index.html)

```javascript
fetch("http://localhost:3000/message")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data.message);  // Use the data!
  })
  .catch(err => {
    console.error(err);
  });
```

### How It Works

```
┌─────────────────┐         GET /message          ┌─────────────────┐
│                 │  ─────────────────────────▶   │                 │
│    Frontend     │                               │  Express Server │
│  (Browser)      │   ◀─────────────────────────  │  (Port 3000)    │
│                 │     { "message": "Hello!" }   │                 │
└─────────────────┘                               └─────────────────┘
```

---

## Handling CORS

If your frontend and backend run on different ports, you'll see this error:

```
Access to fetch has been blocked by CORS policy
```

**CORS** (Cross-Origin Resource Sharing) is a security feature that prevents unauthorized access.

### The Fix

1. **Install the cors package:**
   ```bash
   npm install cors
   ```

2. **Enable it in your server:**
   ```javascript
   const cors = require("cors");
   
   app.use(cors());  // Allow all origins (for development)
   ```

   Or whitelist specific origins:
   ```javascript
   app.use(cors({
     origin: ["http://localhost:5500", "http://127.0.0.1:5500"]
   }));
   ```

Now your frontend can talk to your backend!

---

## POST Requests & Forms

GET requests **retrieve** data. POST requests **send** data to the server.

### Step 1: Enable JSON Body Parsing

Express can't read JSON from requests by default. Add this line:

```javascript
app.use(express.json());
```

> **Important:** This must come BEFORE your routes!

### Step 2: Create a POST Route

```javascript
app.post("/message", (req, res) => {
  const { name, message } = req.body;  // Extract data from request
  
  console.log("Received:", name, message);
  
  res.json({
    success: true,
    reply: `Thanks ${name}, we received your message!`
  });
});
```

### Step 3: Send Data from Frontend

```javascript
form.addEventListener("submit", (e) => {
  e.preventDefault();  // Stop page reload
  
  fetch("http://localhost:3000/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      name: "Alba", 
      message: "Hello!" 
    })
  })
  .then(response => response.json())
  .then(data => console.log(data));
});
```

---

## Express Router

As your app grows, one file becomes messy. **Express Router** lets you split routes into separate files.

### Create a Router File (products.js)

```javascript
const express = require("express");
const router = express.Router();

// These routes will be prefixed with /products
router.get("/", (req, res) => {
  res.json([{ id: 1, name: "laptop" }]);
});

router.get("/:id", (req, res) => {
  // Get specific product...
});

module.exports = router;
```

### Use It in server.js

```javascript
const productsRouter = require("./products");

app.use("/products", productsRouter);
```

Now:
- `router.get("/")` → becomes `/products`
- `router.get("/:id")` → becomes `/products/:id`

### Route Order Matters!

```javascript
// CORRECT: Specific routes first
router.get("/special", ...);  // /products/special
router.get("/:id", ...);      // /products/123

// WRONG: Generic route catches everything
router.get("/:id", ...);      // This catches "special" as an ID!
router.get("/special", ...);  // Never reached
```

---

## Middleware

**Middleware** = Functions that run BETWEEN the request arriving and the route handler executing.

```
Request  →  Middleware  →  Middleware  →  Route Handler  →  Response
              (cors)      (express.json)    (your code)
```

### Common Use Cases

| Use Case | Example |
|----------|---------|
| Logging | Log every request method and path |
| Authentication | Check if user is logged in |
| Parsing | Parse JSON from request body |
| Validation | Check data before it reaches the route |
| Error handling | Catch and handle errors gracefully |

### Built-in Middleware

```javascript
app.use(express.json());  // Parse JSON bodies
```

### Custom Middleware

```javascript
app.use((req, res, next) => {
  console.log(req.method, req.path);  // Log: GET /products
  next();  // MUST call next() or request gets stuck!
});
```

### Middleware Order Matters!

```javascript
// CORRECT: Middleware before routes
app.use(express.json());
app.post("/data", ...);  // req.body works!

// WRONG: Middleware after routes  
app.post("/data", ...);  // req.body is undefined!
app.use(express.json());
```

---

## Project Structure

```
express-tutorial/
├── node_modules/      # Dependencies (don't touch!)
├── server.js          # Main server file
├── products.js        # Product routes (Router)
├── index.html         # Frontend example
├── package.json       # Project config & dependencies
├── package-lock.json  # Dependency lock file
└── README.md          # You are here!
```

---

## Quick Reference

### Starting the Server
```bash
node server.js
```

### Common Response Methods
```javascript
res.send("text");           // Send plain text
res.json({ data: "value" }); // Send JSON
res.status(404).send("Not found"); // Send with status code
```

### Request Object Cheatsheet
```javascript
req.params.id    // URL parameters (/products/:id)
req.query.search // Query strings (/products?search=laptop)  
req.body.name    // POST body data (needs express.json())
req.method       // HTTP method (GET, POST, etc.)
req.path         // URL path (/products)
```

---

## What's Next?

Now that we understand Express basics, you can:

1. **Connect to a database** (MongoDB, PostgreSQL, etc.)
2. **Add authentication** (JWT, sessions)
3. **Build a REST API** for a frontend framework (React, Vue)
4. **Deploy your app** to the cloud (Heroku, Railway, Vercel)

---

<div align="center">

**Happy coding!**

*Built while learning Express.js*

</div>
