import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'

export async function msg(message, client) {
    let u = await data.findOne({ userId: message.author.id })

    if (!u) {
        u = new data({
            userId: message.author.id,
            name: message.author.username,
            coins: 0,
            gems: 0,
            piggybank: 0,
            piggybankinterest: 0.10,
            investment: {
                amount: 0,
                start: 0,
                finish: 0,
                active: false
            },
            last: {
                about: 0,
                balance: 0,
                claim_drop: 0,
                dep_piggy: 0,
                dep_vault: 0,
                help: 0,
                leaderboard: 0,
                mine: 0,
                server_info: 0,
                view_piggy: 0,
                view_vault: 0,
                walk: 0,
                with_piggy: 0,
            }
        })
        await u.save()
    }

    let b = await bot.findOne({ client: client.user.id })

    if (!b) {
        b = new bot({
            prefix: '!',
            client: client.user.id,
            totalMessagesSent: 0,
            totalCommandsExecuted: 0
        })
        await b.save()
    }

    let s = await server.findOne({ guildId: message.guild.id })

    if (!s) {
        s = new server({
            guildId: message.guild.id,
            dropmsg: 0,
            isDrop: false,
            drop: 0,
            vault: {
                gems: 0,
                cookies: 0
            }
        })
        await s.save()
    }
}
