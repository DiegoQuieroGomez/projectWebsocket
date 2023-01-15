import knexLib from "knex";


class ClienteSql {
    constructor(config, tabla) {
        this.knexDB = knexLib(config)
        this.tabla = tabla

    }

    async crearTablaProductos(){
        return this.knexDB.schema.dropTableIfExists(this.tabla)
            .finally(() =>{
                return this.knexDB.schema.createTable(this.tabla, table =>{
                    table.increments('id').primary();
                    table.string('nombre',15).notNullable();
                    table.float('precio');
                    table.string('url', 200).notNullable();

                })
            })
    }

    async crearTablaChats(){
        return this.knexDB.schema.dropTableIfExists(this.tabla)
        //return this.knexDB.schema.createTableIfNotExists(this.tabla)
            .finally(() =>{
                return this.knexDB.schema.createTable(productos, table =>{
                    table.increments('id').primary();
                    table.string('nombre',15).notNullable();
                    table.float('precio');
                    table.string('url', 200).notNullable();

                })
            })
    }
    
    

    async insertarDatos(data){
        return this.knexDB(this.tabla).insert(data);
    }

    async listarDatos(){
        return this.knexDB(this.tabla).select('*')
    }

    async borrarProductosPorId(id){
        return this.knexDB.from(this.tabla).where('id', id)
    }

    async actualizarProductos(nombre, precio, url, id){
        return this.knexDB.from(this.tabla).where('id', id).update({nombre:nombre, precio:precio, url:url})
    }

    close(){
        this.knex.destroy()
    }
}   

export default ClienteSql