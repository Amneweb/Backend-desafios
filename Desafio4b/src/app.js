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

const hbs = handlebars.create({
  helpers: {
    formatear: function (amount) {
      const formateado = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(amount);
      return formateado;
    },
  },
});
app.engine("handlebars", hbs.engine);
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

let contador = 0; //para verificar la cantidad de ventanas abiertas

socketServer.on("connection", async (socket) => {
  contador += 1;
  console.log(contador, " nuevo cliente conectado");
  const productosObtenidos = await productManager.getProducts();
  socketServer.emit("infoProductos", productosObtenidos);
  socket.on("nuevoProducto", async (data) => {
    console.log("producto agregado ", data);

    try {
      await productManager.addProduct(
        data.title,
        data.price,
        data.code,
        data.stock,
        data.description,
        data.status,
        data.category
      );
    } catch (e) {
      console.log("error ", e.message);
      socket.emit("errorAgregar", e.message);
    }
  });
  socket.on("aBorrar", async (data) => {
    console.log("data a borrar ", data);
    try {
      await productManager.deleteProductByID(parseInt(data));
    } catch (e) {
      console.log("error ", e.message);
      socketServer.emit("errormsj", e.message);
    }
  });
  socket.on("aModificar", async (data) => {
    console.log("data a modificar ", data);
    try {
      await productManager.updateProductByID(
        parseInt(data.IDamodificar),
        data.propiedad,
        data.valor
      );
    } catch (e) {
      console.log("error modificando", e.message);
      socketServer.emit("errorModificar", e.message);
    }
  });
});
