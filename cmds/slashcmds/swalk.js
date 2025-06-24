import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { calculate_earned, format } from './functions.ts'

export async function slash_walk(interaction, commandName, client, walkcd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `walk`) {
            let u = await data.findOne({ userId: interaction.user.id })
            let s = await server.findOne({ guildId: interaction.guild.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (walkcd.has(interaction.user.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.walk + 20}:R>.`)
                    .setTimestamp()

                return interaction.reply({ embeds: [cooldownEmbed] })
            }

            const earnedCookies = await calculate_earned(Math.floor((Math.random() * 5) + 1), 'cookies', interaction.user.id)
            const walked = Math.random() * 10

            u.cookies += earnedCookies
            await u.save()

            const embed = new EmbedBuilder()
                .setColor('#36393F')
                .setTitle('Walked')
                .setDescription(`
**${interaction.user.username}**

You took a walk!

**>** **Walked** ${walked.toFixed(2)}mi
**>** **Earned** ${await format(earnedCookies)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
               `)
                .setTimestamp()
            interaction.reply({ embeds: [embed] })

            u.last.walk = Math.floor(Date.now() / 1000)
            await u.save()
            walkcd.add(interaction.user.id)
            setTimeout(() => {
                walkcd.delete(interaction.user.id)
            }, 20000)
        }
    } catch (error) {
        const internal_error = new EmbedBuilder()
            .setTitle('Internal Error')
            .setDescription(`\`${error}\``)
            .setColor('Red')
            .setTimestamp()

        interaction.reply({ embeds: [internal_error] })

        console.error(`> [${interaction.guild.id}] Error Detected: ${error}`)
    }
}