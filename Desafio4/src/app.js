import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import viewRouter from "./routes/views.routes.js";
import ProductManager from "./public/js/ProductManager.js";
// declarando el servidor express
const app = express();
const PORT = 8080;

//preparamos servidor para recibir JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// carpeta pública
app.use(express.static(__dirname + "/public"));

app.use("/", viewRouter);
const httpServer = app.listen(PORT, () =>
  console.log("Listening on port ", PORT)
);

//instanciamos socket.io (Server es una clase)
const socketServer = new Server(httpServer);
const productManager = new ProductManager();
//abrimos conexión global del lado del servidor

let contador = 0;

socketServer.on("connection", async (socket) => {
  contador += 1;
  console.log(contador, " nuevo cliente conectado");
  const productosObtenidos = await productManager.getProducts();
  socketServer.emit("infoProductos", productosObtenidos);
});
