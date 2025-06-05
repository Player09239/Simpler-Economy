const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    cookies: {
        type: Number,
        default: 0,
    },
    gems: {
        type: Number,
        default: 0,
    },
    piggybank: {
        type: Number,
        default: 0
    },
    piggybankinterest: {
        type: Number,
        default: 0.10
    },
    lastDaily: {
        type: Number,
        default: 0
    },
    investment: {
        type: Object,
        required: true
    }
});

module.exports = model('User', userSchema);