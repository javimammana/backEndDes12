import { ChatModel } from "../../models/chat.model.js";

class ChatDao {

    // async createChatUser () {
    //     const chatUser = await ChatModel.create();
    //     return chatUser;
    // }

    // async getMessagesById (id) {
    //     const messages = await ChatModel.findById(id);
    //     return messages;
    // }

    // async updateMessagesById (id, data) {
    //     const messages = await ChatModel.findByIdAndUpdate(id, data);
    //     return messages;
    // }
    /////////////////////////////////////////
    async getAllMessages() {
        const chats = await ChatModel.find();
        return chats;
    }

    async sendMessage(data) {
        const mensaje = await ChatModel.create(data);
        return mensaje;
    }
}

export default ChatDao;