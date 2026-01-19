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
- [Connecting to a Database (Prisma)](#connecting-to-a-database-prisma)
- [Clean Architecture](#clean-architecture)
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

## Connecting to a Database (Prisma)

So far, our data disappears when the server restarts. To persist data, we need a **database**. We'll use **Prisma** — a modern database toolkit for Node.js.

### What is Prisma?

Prisma is an **ORM** (Object-Relational Mapper) that lets you interact with databases using JavaScript instead of writing raw SQL queries.

```
Without Prisma:  "SELECT * FROM products WHERE id = 1"
With Prisma:     prisma.product.findUnique({ where: { id: 1 } })
```

### Why SQLite?

SQLite is a file-based database — perfect for learning. No server setup needed, just a single file (`dev.db`).

---

### Step 1: Install Prisma

```bash
npm install prisma @prisma/client
```

| Package | Purpose |
|---------|---------|
| `prisma` | CLI tool for migrations, generating client |
| `@prisma/client` | The library you use in your code |

---

### Step 2: Initialize Prisma

```bash
npx prisma init --datasource-provider sqlite
```

**What this does:**
- Creates `prisma/schema.prisma` — where you define your data models
- Creates `prisma.config.ts` — database configuration (Prisma 7)

---

### Step 3: Define Your Model

Edit `prisma/schema.prisma` and add a model:

```prisma
model Product {
  id        Int      @id @default(autoincrement())
  name      String
  price     Int
  createdAt DateTime @default(now())
}
```

**What each part means:**

| Part | Meaning |
|------|---------|
| `model Product` | Creates a "products" table |
| `id Int @id` | Primary key, integer |
| `@default(autoincrement())` | Auto-generates 1, 2, 3... |
| `name String` | Text column |
| `createdAt DateTime` | Timestamp column |
| `@default(now())` | Auto-sets current time |

---

### Step 4: Create the Database

```bash
npx prisma migrate dev --name init
```

**What this does:**
1. Creates `dev.db` file (your SQLite database)
2. Creates the `products` table based on your model
3. Generates the Prisma Client (code to interact with DB)

> Run this command every time you change your schema!

---

### Step 5: Install the Database Adapter (Prisma 7)

Prisma 7 requires a **driver adapter** to connect to the database:

```bash
npm install better-sqlite3 @prisma/adapter-better-sqlite3
```

| Package | Purpose |
|---------|---------|
| `better-sqlite3` | SQLite driver (talks to `dev.db`) |
| `@prisma/adapter-better-sqlite3` | Bridges Prisma to the driver |

---

### Step 6: Create the Prisma Client File

Create `db/prisma.js`:

```javascript
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

// Create adapter with database URL
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });

// Create Prisma client with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
```

**How the connection flows:**

```
Your Code  →  PrismaClient  →  Adapter  →  better-sqlite3  →  dev.db
```

---

### Step 7: Use Prisma in Your Routes

In your router file (e.g., `products.js`):

```javascript
const express = require("express");
const router = express.Router();
const prisma = require("./db/prisma");  // Import the client

// GET all products
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// GET single product
router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) }
  });
  res.json(product);
});

// POST create product
router.post("/", async (req, res) => {
  const { name, price } = req.body;
  const product = await prisma.product.create({
    data: { name, price }
  });
  res.status(201).json(product);
});

module.exports = router;
```

---

### Prisma Commands Cheatsheet

| Command | What it does |
|---------|--------------|
| `npx prisma init` | Initialize Prisma in your project |
| `npx prisma migrate dev --name <name>` | Create/update database from schema |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma studio` | Open visual database browser |

---

### Common Prisma Operations

```javascript
// Create
await prisma.product.create({ data: { name: "laptop", price: 999 } });

// Read all
await prisma.product.findMany();

// Read one
await prisma.product.findUnique({ where: { id: 1 } });

// Update
await prisma.product.update({ where: { id: 1 }, data: { price: 899 } });

// Delete
await prisma.product.delete({ where: { id: 1 } });
```

---

### Database File Structure

After setup, you'll have:

```
express-tutorial/
├── prisma/
│   ├── schema.prisma      # Your data models
│   └── migrations/        # Database change history
├── db/
│   └── prisma.js          # Prisma client setup
├── dev.db                 # Your SQLite database file
└── prisma.config.ts       # Prisma configuration
```

---

## Clean Architecture

As your app grows, putting everything in one file becomes messy. We use a **layered architecture** to separate concerns:

```
products/
├── product.routes.js      # Route definitions
├── product.controller.js  # Request/response handling
└── product.service.js     # Business logic & database
```

### Why This Structure?

| Problem | Solution |
|---------|----------|
| One huge file with everything | Split into focused files |
| Routes mixed with database code | Separate layers |
| Hard to test | Each layer can be tested independently |
| Hard to maintain | Clear responsibilities |

### The Three Layers

**1. Routes** (`product.routes.js`)

Maps HTTP methods and URLs to controller functions.

```javascript
const express = require("express");
const router = express.Router();
const productController = require("./product.controller");

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.create);

module.exports = router;
```

**2. Controller** (`product.controller.js`)

Handles the request and response. Calls the service layer for data.

```javascript
const productService = require("./product.service");

const getAll = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

module.exports = { getAll };
```

**3. Service** (`product.service.js`)

Contains business logic and database operations. Knows nothing about HTTP.

```javascript
const prisma = require("../db/prisma");

const getAllProducts = async () => {
  return await prisma.product.findMany();
};

module.exports = { getAllProducts };
```

### Request Flow

```
Client Request
      ↓
   Routes      →  "Which controller handles this URL?"
      ↓
  Controller   →  "Parse request, call service, send response"
      ↓
   Service     →  "Do the actual work (database, logic)"
      ↓
   Database
      ↓
  Response back to client
```

### When to Use This Pattern

| Project Size | Recommendation |
|--------------|----------------|
| Learning / Small | Single file is fine |
| Medium (5+ routes) | Split into folders |
| Large / Team | Full clean architecture |

---

## Project Structure

```
express-tutorial/
├── products/                  # Product feature module
│   ├── product.routes.js      # Route definitions
│   ├── product.controller.js  # Request/response handling
│   └── product.service.js     # Business logic & database
├── prisma/
│   ├── schema.prisma          # Data models
│   └── migrations/            # Database migration history
├── db/
│   └── prisma.js              # Prisma client configuration
├── node_modules/              # Dependencies (don't touch!)
├── server.js                  # Main server file
├── index.html                 # Frontend example
├── dev.db                     # SQLite database file
├── prisma.config.ts           # Prisma configuration
├── package.json               # Project config & dependencies
├── package-lock.json          # Dependency lock file
├── .gitignore                 # Files to ignore in git
└── README.md                  # You are here!
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

Now that you have a working Express + Prisma backend, you can:

1. **Add more models** — Users, Orders, Categories (with relations!)
2. **Add authentication** — JWT tokens, sessions, password hashing
3. **Build a frontend** — Connect React, Vue, or vanilla JS to your API
4. **Switch databases** — Prisma supports PostgreSQL, MySQL, MongoDB
5. **Deploy** — Railway, Render, Vercel, or your own server

---

<div align="center">

**Happy coding!**

*Built while learning Express.js*

</div>
