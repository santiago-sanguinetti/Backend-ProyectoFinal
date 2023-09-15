import mongoose from "mongoose";

const msgCollection = "messages";

const msgSchema = mongoose.Schema({
    user: String,
    msg: {
        type: String,
        required: true,
    },
});

export const msg = mongoose.model(msgCollection, msgSchema);
