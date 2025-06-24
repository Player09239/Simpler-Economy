import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function view_piggy(message, client, view_piggycd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}view-piggy`) {
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (view_piggycd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.view_piggy + 10}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

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

            u.last.view_piggy = Math.floor(Date.now() / 1000)
            await u.save()
            view_piggycd.add(message.author.id)
            setTimeout(() => {
                view_piggycd.delete(message.author.id)
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