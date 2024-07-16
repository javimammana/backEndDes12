import { TicketModel, TicketCode } from "../../models/ticket.model.js";

class TicketDao {

    async code () {
        try {
            let findCode = await TicketCode.findOne({description: "eCommerce"});
            if (!findCode) {
                await TicketCode.create({code:1})
                const codigo = "0000000001"
                return codigo;
                
            } else {
                let nvoCode = await TicketCode.findOneAndUpdate({description: "eCommerce"}, {code: findCode.code+1});
                nvoCode = await TicketCode.findOne ({description: "eCommerce"});
                let codigo = nvoCode.code.toString();
                if (codigo.length < 10) {
                    for (let i = codigo.length; i < 10 ; i++) {
                        codigo = `0${codigo}`;
                    }
                }
                return codigo;
            }
        } catch (error) {
            throw new Error ("(DAO) Error al generar Numero de Orden");
        }
    }

    async createTicket (cart) {
        try {
            const ticket = await TicketModel.create(cart);
            return ticket;
        } catch (error) {
            throw new Error ("(DAO) Error al crear ticket" + error);
        }
    }

    async getTicket (id) {
        try {
            const ticket = await TicketModel.findById(id).populate("products.product").lean();
            return ticket;
        } catch (error) {
            throw new Error ("(DAO) Error al consultar ticket");
        }
    }

    async getAllTickets () {
        try {
            const tickets = await TicketModel.find();
            return tickets;
        } catch (error) {
            throw new Error ("(DAO) Error al consultar todos los tickets");
        }
    }

}

export default TicketDao;