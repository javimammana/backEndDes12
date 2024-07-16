import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {type: String, index: true, unique: true},
    purchaser_datetime: { type: Date },
    amount: { type: Number },
    purchaser: { type: String },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, required: true},
        price: { type: Number },
        }],
});

const ticketCode = new Schema({
    code:{type: Number},
    description: {type: String, default: "eCommerce"}
})


const TicketModel = model("tickets", ticketSchema);
const TicketCode = model("code", ticketCode);

export { TicketModel, TicketCode };