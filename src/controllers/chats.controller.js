import { chatServices } from "../services/services.js";

class ChatController {
    async getAllMessages () {
        const messages = await chatServices.getAllMessages();
        return messages;
    }

    async sendMessage (data) {
        const message = await chatServices.sendMessage(data);
        return message;
    }
}

export default ChatController;