const fs = require('fs')
const express = require('express')
const { json } = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)


app.use(express.static('public'))

let products = []

let messages = []

//Solo para crear el archivo//condicion archivo

function crearArchivo(Ruta, data) {
    try {
        fs.writeFileSync(Ruta, data)
        console.log("archivo creado correctamente")
    } catch (error) {
        console.log(error)
    }
}

crearArchivo("registroChat.txt", JSON.stringify(messages))

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
        console.log(products)
        //io.socket.emit("---------------")
    })

    socket.on("newMessage", function (data) {
        messages.push(data);
        actualizar("registroChat.txt", JSON.stringify(data))
        io.sockets.emit("mensajes", messages)
    })

})


app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

const PORT = 8080

const srv = server.listen(PORT, () => console.log(`El servidor websocket esta corriendo en el pureto ${srv.address().port}`))

srv.on("error", error => console.log(`Error en el servidor ${error}`))