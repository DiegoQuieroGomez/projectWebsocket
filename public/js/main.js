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

    } else {

        alert("debe ingresar un Email para chatear")

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

function hbsInsert(array) {
    const source = document.getElementById("tablaProducto")
    const template = hbs.compile(`
        <div class="container">
            <h1>Listado de Productos</h1>
            <div class="container">
                {{#if productos.length}}
                <table class="table table-dark table-striped" style="text-align: center;">
                    <tr>
                        <th scope="col">Nombre Producto</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Foto Producto</th>
                    </tr>
                    <br>
                    {{#each productos}}
                    <tr>
                        <td scope="row">{{this.nombre}}</td>
                        <td scope="row">$ {{this.precio}}</td>
                        <td scope="row"><img src="{{this.url}}" class="img-fluid" style="width: 40px; heigth: 40px"></td>
                    </tr>
                    {{/each}}
                </table>
                {{else}}
                <h2>No hay productos</h2>
                {{/if}}
            </div>
        </div>
    `)
    const html = template(array)
    source.innerHTML = html
}

hbsInsert(products)