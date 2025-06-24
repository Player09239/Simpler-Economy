import { Schema, model } from 'mongoose'

const serverSchema = new Schema({
    guildId: {
        type: Number,
        required: true
    },
    dropsmsg: {
        type: Number,
        default: 0,
        required: true
    },
    isDrop: {
        type: Boolean,
        default: false,
        required: true
    } ,
    drop: {
        type: Number,
        default: 0,
        required: true
    },
    vault: {
        gems: {
            type: Number,
            default: 0,
            required: true
        },
        cookies: {
            type: Number,
            default: 0,
            required: true
        }
    }
});

export default model('Server', serverSchema);