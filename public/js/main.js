let socket = io.connect()

socket.on('mensajes', function (data) {
    console.log(data)
    renderizar(data)
});

function renderizar(data) {
    let html = data.map(function (elem, index) {
        return (`<div>
        <p style="color: brown">
        <b style="color: blue">${elem.email}</b>
        [${elem.fecha}] :
        <i style="color:green">${elem.text}</i></p>
        </div>
        `)
    }).join(" ")
    document.getElementById('mensajes').innerHTML = html
}

function addMessage(e) {
    let email = document.getElementById('email').value
    let fecha = new Date().toLocaleString()
    if (email != null) {
        let mensaje = {
            email: email,
            fecha: fecha,
            text: document.getElementById('text').value
        }
        socket.emit("newMessage", mensaje)
        
        document.getElementById('text').value = ""

        return false

    }else{

        prompt("debe ingresar un Email para chatear")

    }  
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

