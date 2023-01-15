import mySQLProducts from "./databases/mySQLProducts.js"
import ClienteSql from "./crud/contenedor.js"
import express, { json, urlencoded } from "express"
import { dirname } from "path";
import { engine } from "express-handlebars"
import { Server as IOServer } from 'socket.io';
import fs from "express"

const sqlProd = new ClienteSql(mySQLProducts,"productos")
sqlProd.crearTablaProductos()

const app = express()


const PORT = 8080

const srv = app.listen(PORT, () => console.log(`El servidor websocket esta corriendo en el puerto ${srv.address().port}`))
srv.on("error", error => console.log(`Error en el servidor ${error}`))

const io = new IOServer(srv);

app.use(express.static('public'))
app.use(json())
app.use(urlencoded({extended:true}))

app.engine('handlebars', engine())
app.set('views','./public/views')
app.set('view engine', 'handlebars')

let products = []
let messages = []



//Solo para crear el archivo//condicion archivo
/*
function crearArchivo(Ruta, data) {
    try {
        fs.writeFileSync(Ruta, data)
        console.log("archivo creado correctamente")
    } catch (error) {
        console.log(error)
    }
}

crearArchivo("registroChat.txt", JSON.stringify(messages))
*/

async function actualizar(nombreArchivo, object) {
    let messages = []
    const data = await fs.promises.readFile(nombreArchivo, 'utf-8')
        .then(console.log(`Archivo leido correctamente`))
        .catch(error => console.log(error))
    let mix = JSON.parse(data)
    if (mix.length > 0) {
        messages.push(...mix)
    } 
    messages.push(object)
    fs.promises.writeFile(nombreArchivo, JSON.stringify(messages, null, 2))
        .then('sobreescritura correcta')
        .catch(error => console.log(error))
}


io.on("connection", function (socket) {
    console.log("Un cliente se ha conectado")
    socket.emit("mensajes", messages)

    socket.on("newProduct", function (data) {
        products.push(data)
        sqlProd.crearTablaProductos()
        .then(() => console.log('funciona'))
        .then(()=>{
            return sqlProd.insertarDatos(products)
        })
        .then(()=> console.log('Producto ingresado correctamente'))
        console.log(products)
        io.sockets.emit('tabla', {products}) 
    })

    socket.on("newMessage", function (data) {
        messages.push(data);
        actualizar("registroChat.txt", JSON.stringify(data))
        io.sockets.emit("mensajes", messages)
    })

})

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
})

