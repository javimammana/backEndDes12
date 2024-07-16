import ChatDao from "../daos/manager/dbMongo/chats.mongo.js";

const chatDao = new ChatDao();

class ChatRepository {

    async getAllMessages () {
        const messages = await chatDao.getAllMessages();
        return messages;
    }

    async sendMessage (data) {
        const message = await chatDao.sendMessage(data);
        return message;
    }
}

export default ChatRepository;