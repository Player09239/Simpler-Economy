const { EmbedBuilder, Message, Client } = require('discord.js')
const user = require('./data')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (message, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}mine`) {
            let u = await user.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            const rng = Math.random()

            if (rng < 0.5) {
                const amount = Math.floor((Math.random() * 5) + 1)
                u.gems += amount
                await u.save()

                const embed = new EmbedBuilder()
                    .setColor('#36393F')
                    .setTitle('Mined')
                    .setDescription(`
**${message.author.username}**

You went mining, and found gems!

**>** **Gems Mined** ${await format(amount)} 💎

**>** **Your Gems** ${await format(u.gems)} 💎
                    `)
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#36393F')
                    .setTitle('Mined')
                    .setDescription(`
**${message.author.username}**

You went mining, but found nothing.

**>** **Gems Mined** 0 💎

**>** **Your Gems** ${await format(u.gems)} 💎
                    `)
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })
            }
        }
    } catch (error) {
        
    }
}