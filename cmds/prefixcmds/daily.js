import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function daily(message, client) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        const args = message.content.trim().split(/ +/)
        const command = args.shift();

        if (command === `${b.prefix}daily`) {
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

            // Cooldown: 24 hours (in ms)
            const cooldown = 24 * 60 * 60 * 1000
            const now = Date.now()
            const lastDaily = u.lastDaily || 0

            if (now - lastDaily < cooldown) {
                const remaining = cooldown - (now - lastDaily)
                const hours = Math.floor(remaining / (60 * 60 * 1000))
                const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
                const seconds = Math.floor((remaining % (60 * 1000)) / 1000)

                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`You have already claimed your daily reward!\n\n**>** **Time Remaining** ${hours}h ${minutes}m ${seconds}s`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

            // Set daily reward amount
            const dailyAmount = Math.floor(u.piggybank * u.piggybankinterest)

            u.cookies += dailyAmount
            u.lastDaily = now
            await u.save()

            const success = new EmbedBuilder()
                .setTitle('Daily Reward')
                .setColor('#36393F')
                .setDescription(`
**${message.author.username}**

**>** **Claimed** ${await format(dailyAmount)} 🍪
**>** **Your Cookies** ${await format(u.cookies)} 🍪
                `)
                .setTimestamp()

            message.channel.send({ embeds: [success] })
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