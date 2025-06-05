const data = require('./data')
const bot = require('./bot')
const server = require('./server')

module.exports = async (message, client) => {
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
