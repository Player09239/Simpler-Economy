import { Schema, model } from 'mongoose'

const botSchema = new Schema({
    prefix: {
        type: String,
        default: '!',
        require: true
    },
    client: {
        type: String,
        require: true
    },
    totalMessagesSent: {
        type: Number,
        default: 0
    },
    totalCommandsExecuted: {
        type: Number,
        default: 0
    }
});

export default model('Bot', botSchema);