import { msg } from "../models/messages.model.js";

class chatManagerMongo {
    getMessages = async () => {
        try {
            const messages = await msg.find();
            return messages;
        } catch (error) {
            console.log("getMessages error:", error.message);
        }
    };

    sendMessage = async (data) => {
        try {
            const message = await msg.create(data);
            return message;
        } catch (error) {
            console.log("sendMessage error: ", error.message);
        }
    };
}

export const chatManager = new chatManagerMongo();
