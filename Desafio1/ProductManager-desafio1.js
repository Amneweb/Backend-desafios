//generé este array para agregar varios productos al mismo tiempo
data = [
  {
    titulo: "Remera térmica infantil",
    precio: 12000,
    codigo: "WsT017",
    stock: 10,
    descripcion:
      "Remera fabricada en tela bamboo, ideal como primera piel para usarse debajo del neoprene",
    diapositiva: "/imagenes/thumbnails/WsT017.jpg",
  },
  {
    titulo: "Calza térmica infantil",
    precio: 12600,
    codigo: "WsT018",
    stock: 5,
    descripcion:
      "Calza larga fabricada en tela bamboo, ideal como primera piel para usarse debajo del neoprene",
    diapositiva: "/imagenes/thumbnails/WsT018.jpg",
  },
  {
    titulo: "Chaqueta náutica respirable Thermoskin",
    precio: 96000,
    codigo: "Ws4019",
    stock: 11,
    descripcion:
      "Chaqueta fabricada en tela impermeable y respirable, con puños y cintura de neoprene",
    diapositiva: "/imagenes/thumbnails/Ws4019.jpg",
  },
  {
    titulo: "Remera térmica infantil",
    precio: 12000,
    codigo: "WsT017",
    stock: 10,
    descripcion:
      "Remera fabricada en tela bamboo, ideal como primera piel para usarse debajo del neoprene",
    diapositiva: "/imagenes/thumbnails/WsT017.jpg",
  },
  {
    titulo: "Anteojos polarizados ringless",
    precio: 54000,
    codigo: "UND1054",
    stock: 3,
    descripcion: "Anteojos con marco superior, lentes polarizados y espejados.",
    diapositiva: "/imagenes/thumbnails/UND1054.jpg",
  },
  {
    titulo: "Anteojos protección UV marco cuadrado, espejados",
    codigo: "UND1050",
    stock: 2,
    descripcion: "Anteojos con marco cuadrado, casi planos, sin curvatura.",
    diapositiva: "/imagenes/thumbnails/UND1050.jpg",
  },
];

class ProductManager {
  constructor() {
    this.productos = [];
  }
  addProduct = (title, price, code, stock, description, thumb) => {
    if (!title || !price || !code || !stock || !description || !thumb) {
      return console.log(
        `Al producto con nombre ${title} le faltan uno o más datos`
      );
    }

    if (this.productos.find((cadaproducto) => cadaproducto.code === code)) {
      return console.log(
        `El producto con código ${code} ya está en la bdd y no será agregado`
      );
    }

    this.productos.push({
      title,
      code,
      price,
      thumb,
      stock,
      description,
      id: this.productos.length + 1,
    });
    console.log(`El producto con código ${code} fue agregado con éxito`);
  };
  getProducts = () => {
    console.log("Productos", this.productos);
  };
  getProductByID = (id) => {
    const productoEncontrado = this.productos.find(
      (cadaproducto) => cadaproducto.id === id
    );
    productoEncontrado
      ? console.log(
          "El producto encontrado con id: ",
          id,
          " es el siguiente: ",
          productoEncontrado
        )
      : console.log("No se encontró el producto con el id ", id);
  };
}

productos = new ProductManager();
console.log("existentes al principio ");
productos.getProducts();
//agrego un solo producto
productos.addProduct(
  "Chaleco Salvavidas Zhik",
  120000,
  "PFD20",
  30,
  "Chaleco con espuma de celda cerrada",
  "imagenes/thumbnails/PFD20.jpg"
);
console.log("existentes después del primer agregado ");
productos.getProducts();
//agrego productos del array data
data.forEach((producto) => {
  {
    productos.addProduct(...Object.values(producto));
  }
});
console.log("Luego de agregar el array de datos");
productos.getProducts();

productos.getProductByID(2);
productos.getProductByID("amneris");
