let socket = io.connect()

socket.on('mensajes', function (data) {
    console.log(data)
    renderizar(data)
});

function renderizar(data) {
    let html = data.map(function (elem, index) {
        return (`<div>
        <strong>${elem.author}</strong>
        <em>${elem.text}</em>
        </div>
        `)
    }).join(" ")
    document.getElementById('mensajes').innerHTML = html
}

function addMessage(e) {
    let mensaje = {
        author: document.getElementById('author').value,
        text: document.getElementById('text').value
    }

    socket.emit("newMessage", mensaje)

    document.getElementById('author').value = ""
    document.getElementById('text').value = ""

    return false
}

function addProducts(e) {
    let product = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        url: document.getElementById('url').value,
    }

    socket.emit("newProduct", product)
        
    document.getElementById('nombre').value = ""
    document.getElementById('precio').value = ""
    document.getElementById('url').value = ""

    return false
}

