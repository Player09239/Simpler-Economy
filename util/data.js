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
    },
    last: {
        about: {
            type: Number,
            default: 0
        },
        balance: {
            type: Number,
            default: 0
        },
        claim_drop: {
            type: Number,
            default: 0
        },
        dep_piggy: {
            type: Number,
            default: 0
        },
        dep_vault: {
            type: Number,
            default: 0
        },
        help: {
            type: Number,
            default: 0
        },
        invest: {
            type: Number,
            default: 0
        },
        leaderboard: {
            type: Number,
            default: 0
        },
        view_piggy: {
            type: Number,
            default: 0
        },
        view_vault: {
            type: Number,
            default: 0
        },
        with_piggy: {
            type: Number,
            default: 0
        },
        mine: {
            type: Number,
            default: 0
        },
        server_info: {
            type: Number,
            default: 0
        }
    }
});

module.exports = model('User', userSchema);