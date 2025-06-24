import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { calculate_earned, format } from './functions.ts'

export async function mine(message, client, minecd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}mine`) {
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (minecd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.mine + 35}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

            const rng = Math.random()

            if (rng < 0.5) {
                const amount = await calculate_earned(Math.floor((Math.random() * 5) + 1), 'gems', message.author.id)
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

            u.last.mine = Math.floor(Date.now() / 1000)
            await u.save()
            minecd.add(message.author.id)
            setTimeout(() => {
                minecd.delete(message.author.id)
            }, 35000)
        }
    } catch (error) {
        const internal_error = new EmbedBuilder()
            .setTitle('Internal Error')
            .setDescription(`\`${error}\``)
            .setColor('Red')
            .setTimestamp()

        interaction.reply({ embeds: [internal_error] })

        console.error(`> [${message.guild.id}] Error Detected: ${error}`)
    }
}