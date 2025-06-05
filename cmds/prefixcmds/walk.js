const { EmbedBuilder, Client, Message } = require('discord.js')
const data = require('./data.js')
const bot = require('./bot.js')
const format = require('./numformat.js')
const server = require('./server.js')

module.exports = async (message, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}walk`) {
            let u = await data.findOne({ userId: message.author.id })
            let s = await server.findOne({ guildId: message.guild.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            const earnedCookies = Math.floor(((Math.random() * 5) + 1) * (1 + (s.vault.cookies * 0.000002)))
            const walked = Math.random() * 10

            u.cookies += earnedCookies
            await u.save()

            const embed = new EmbedBuilder()
                .setColor('#36393F')
                .setTitle('Walked')
                .setDescription(`
**${message.author.username}**

You took a walk!

**>** **Walked** ${walked.toFixed(2)}mi
**>** **Earned** ${await format(earnedCookies)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
               `)
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    } catch (error) {
        const internal_error = new EmbedBuilder()
            .setTitle('Internal Error')
            .setDescription(`\`${error}\``)
            .setColor('Red')
            .setTimestamp()

        message.channel.send({ embeds: [internal_error] })

        console.error(`> [${message.guild.id}] Error Detected: ${error}`)
    }
}