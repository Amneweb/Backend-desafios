import express from "express";
import ProductManager from "./src/ProductManager.js";

let productManager = new ProductManager();
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/products", async (req, res) => {
  let limite = req.query.limit;
  if (limite) {
  } else {
    res.send(await productManager.getProducts());
  }
});
app.get("/products/:id", async (req, res) => {
  res.send(await productManager.getProductByID(parseInt(req.params.id)));
});
app.get("/products/:id", async (req, res) => {
  res.send(await productManager.getProductByID(parseInt(req.params.id)));
});

app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
