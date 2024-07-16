
export const infoErrorProducto = (producto) => {
    return `Datos incompletos:
    - Title: String, valor ingresado: ${producto.title}.
    - Description: String, valor ingresado: ${producto.description}.
    - Price: Number, valor ingresado: ${producto.price}.
    - Code: String, valor ingresado: ${producto.code}.
    - Stock: Number, valor ingresado: ${producto.stock}.
    - Category: String, valor ingresado ${producto.category}`
}

export const infoErrorCode = (code) => {
    return `El codigo ${code}, ya se encuentra registrado.-`
}

export const infoErrorItem = (item) => {
    return `El item ${item}, no existe.-`
}