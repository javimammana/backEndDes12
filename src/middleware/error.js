import { EErrors } from "../services/errors/enum.js";

const manejadorError = (error, req, res, next) => {
    console.log(error.causa);
    switch(error.code) {
        case EErrors.TIPO_INVALIDO:
            res.send({status: "error", error: error.name})
            break;

        case EErrors.INFORMACION_REPETIDA:
            res.send({status: "error", error: error.name})
            break;

            case EErrors.ITEM_INVALIDO:
                res.send({status: "error", error: error.name})
                break;

        default:
            res.send({status: "error", error: "Error desconocido"});
    }

}

export default manejadorError;