import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function slash_claim_drop(interaction, commandName, client, claim_dropcd) {
    try {
        let b = await bot.findOne({ client: client.user.id })
        let s = await server.findOne({ guildId: interaction.guild.id })

        if (commandName === `claim-drop`) {
            let u = await data.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

            if (claim_dropcd.has(interaction.user.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.claim_drop + 100}:R>.`)
                    .setTimestamp()

                return interaction.reply({ embeds: [cooldownEmbed] })
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
**${interaction.user.username}**

You have claimed the server drop!

**>** **Claimed** ${await format(u.piggybank * s.drop)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
                    `)
                    .setTimestamp()

                interaction.reply({ embeds: [claimed] })
            } else {
                const err = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`
**${interaction.user.username}**

There is no server drop to claim!
                    `)
                .setTimestamp()

                interaction.reply({ embeds: [err] })
            }

            u.last.claim_drop = Math.floor(Date.now() / 1000)
            await u.save()
            claim_dropcd.add(interaction.user.id)
            setTimeout(() => {
                claim_dropcd.delete(interaction.user.id)
            }, 100000)

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