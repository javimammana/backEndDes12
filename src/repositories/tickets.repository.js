import TicketDao from "../daos/manager/dbMongo/tickets.mongo.js";

const ticketRepo = new TicketDao();

class TicketRepository {

    async createTicket (cart) {
        const codeNumber = await ticketRepo.code();
        const cartBuy = {...cart, code: `${cart.code}${codeNumber}`, purchaser_datetime: new Date()}
        const ticket = await ticketRepo.createTicket(cartBuy);
        return ticket;
    }

    async getTicketById(id) {
        const ticket = await ticketRepo.getTicket(id);
        return ticket;
    }
}

export default TicketRepository;