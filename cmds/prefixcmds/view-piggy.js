const { EmbedBuilder, Message, Client } = require('discord.js')
const user = require('./data')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (message, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}view-piggy`) {
            let u = await user.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            const piggy = new EmbedBuilder()
                .setTitle('Piggybank')
                .setColor('#36393F')
                .setDescription(`
**${message.author.username}**

**>** **Piggy Bank** ${await format(u.piggybank)} 🍪
**>** **Daily Cookies** ${await format(u.piggybank * u.piggybankinterest)} 🍪 (${Math.floor(u.piggybankinterest * 100)}%)
                `)
                .setTimestamp()

            message.channel.send({ embeds: [piggy] })
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