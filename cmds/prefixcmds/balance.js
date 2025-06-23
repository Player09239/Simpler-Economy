const { EmbedBuilder, Client, Message } = require('discord.js')
const data = require('./data.js')
const bot = require('./bot.js')
const format = require('./numformat.js')

module.exports = async (message, client, balancecd) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}balance`) {
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (balancecd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.balance + 10}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

            const embed = new EmbedBuilder()
                .setColor('#36393F')
                .setTitle('Balance')
                .setDescription(`
**${message.author.username}**

**>** **Cookies** ${await format(u.cookies)} 🍪
**>** **Gems** ${await format(u.gems)} 💎
            `)
                .setTimestamp()

            message.channel.send({ embeds: [embed] })

            u.last.balance = Math.floor(Date.now() / 1000)
            await u.save()
            balancecd.add(message.author.id)
            setTimeout(() => {
                balancecd.delete(message.author.id)
            }, 10000)
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