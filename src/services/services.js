import ProductRepository from "../repositories/products.repository.js";
import CartRepository from "../repositories/carts.repository.js";
import UserRepository from "../repositories/users.repository.js";
import ChatRepository from "../repositories/chats.repository.js";
import TicketRepository from "../repositories/tickets.repository.js";

export const productServices = new ProductRepository();
export const cartServices = new CartRepository();
export const userServices = new UserRepository();
export const chatServices = new ChatRepository();
export const ticketServices = new TicketRepository();
