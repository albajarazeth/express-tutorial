const express = require("express");
const app = express();
const productsRouter = require("./products");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use("/products", productsRouter);

app.get("/", (req, res) => {
  res.send("Hey there!!");
});

app.get("/about", (req, res) => {
  res.send("This is the about page");
});

app.get("/message", (req, res) => {
  res.json({ message: "Hello from express backend" });
});

app.post("/message", (req, res) => {
  const { name, message } = req.body;
  console.log("Received:", name, message);
  res.json({
    success: true,
    reply: `Thanks ${name}, we received your message!`,
  });
});

app.listen(3000, () => {
  console.log("The server is running");
});
