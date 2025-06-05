const { Schema, model } = require('mongoose');

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

module.exports = model('Bot', botSchema);