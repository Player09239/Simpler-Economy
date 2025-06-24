import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function claim_drop(message, client, claim_dropcd) {
    try {
        let b = await bot.findOne({ client: client.user.id })
        let s = await server.findOne({ guildId: message.guild.id })

        if (message.content === `${b.prefix}claim-drop`) {
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

            if (claim_dropcd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.claim_drop + 100}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

            if (s.isDrop === true) {
                s.isDrop = false
                u.cookies = Math.floor(u.cookies + (u.piggybank * s.drop))
                await s.save()
                await u.save()

                const claimed = new EmbedBuilder()
                    .setTitle('Claimed Drop')
                    .setColor('#36393F')
                    .setDescription(`
**${message.author.username}**

You have claimed the server drop!

**>** **Claimed** ${await format(u.piggybank * s.drop)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
                    `)
                    .setTimestamp()

                message.channel.send({ embeds: [claimed] })
            } else {
                const err = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`
**${message.author.username}**

There is no server drop to claim!
                    `)
                .setTimestamp()

                message.channel.send({ embeds: [err] })
            }

            u.last.claim_drop = Math.floor(Date.now() / 1000)
            await u.save()
            claim_dropcd.add(message.author.id)
            setTimeout(() => {
                claim_dropcd.delete(message.author.id)
            }, 100000)

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