import mongoose from "mongoose";

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },

    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },

    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts" 
    },

    favorite: {type: Array, default: []},

    purchases: [{
        purchasesId: { type: mongoose.Schema.Types.ObjectId, ref: "tickets" },
        code: { type: String, required: true, default: 1 },
        }],

    chatid: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "messages"
        type: String
    },

    login: {
        type: String
    }
    
})

const UserModel = mongoose.model("users", schema);

export default UserModel;