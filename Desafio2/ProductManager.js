// creamos una clase para los productos
class Producto {
  constructor() {
    this.title = title;
    this.price = price;
    this.code = code;
    this.description = description;
    this.thumb = thumb;
    this.id = id;
  }
}

class ProductManager {
  #productos;
  #productosRutaDirectorio;
  #productosRutaArchivo;
  #fs;

  constructor() {
    this.#productos = [];
    this.#productosRutaDirectorio = "./archivos";
    this.#productosRutaArchivo =
      this.#productosRutaDirectorio + "/productos.json";
    this.#fs = require("fs");
  }
  addProduct = async (title, price, code, stock, description, thumb) => {
    //verifico si tiene todos los datos. Si no los tiene interrumpe el proceso
    if (!title || !price || !code || !stock || !description || !thumb) {
      return console.log(
        `Al producto con nombre ${title} le faltan uno o más datos`
      );
    }
    //creo el producto nuevo con la clase Producto
    let productoNuevo = new Producto(
      title,
      price,
      code,
      stock,
      description,
      thumb
    );
    console.log("se creará un producto nuevo: ", productoNuevo);
    try {
      await this.#fs.promises.mkdir(this.#productosRutaDirectorio, {
        recursive: true,
      });
      //recursive se usa para que no salte un error si el directorio ya existía
      if (!this.#fs.existsSync(this.#productosRutaArchivo)) {
        //Se crea el archivo vacio.
        await this.#fs.promises.writeFile(this.#productosRutaArchivo, "[]");
        //leemos el archivo
        let productosEnArchivo = await this.#fs.promises.readFile(
          this.#productosRutaArchivo,
          "utf-8"
        );
        console.info("Archivo JSON obtenido desde archivo: ");
        console.log(productosEnArchivo);

        // Convertimos el json a objeto y le hacemos un push del nuevo producto
        this.#productos = JSON.parse(productosEnArchivo);
        console.log("Productos que ya estaban en el archivo: ");
        console.log(this.#productos);

        this.#productos.push(productoNuevo);
        console.log("Lista actualizada de productos: ");
        console.log(this.#productos);

        //Sobreescribimos el archivo original con el nuevo producto agregado
        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );
      }
    } catch {}

    if (
      this.#productos.find(
        (cadaproducto) => cadaproducto.code === productoNuevo.code
      )
    ) {
      return console.log(
        `El producto con código ${productoNuevo.code} ya está en la bdd y no será agregado`
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
