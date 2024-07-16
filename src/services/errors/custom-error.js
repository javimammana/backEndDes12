
class CustomError {
    static crearError ({nombre = "Error", causa = "Desconocida", mensaje, codigo = 1}) {

        const error = new Error(mensaje);
        error.name = nombre;
        error.causa = causa;
        error.code = codigo;

        throw error;
    }
}

export default CustomError