import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function view_vault(message, client, view_vaultcd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}view-vault`) {
            let s = await server.findOne({ guildId: message.guild.id })
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (view_vaultcd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.view_vault + 10}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

            const svault = new EmbedBuilder()
                .setTitle('Server Vault')
                .setColor('#36393F')
                .setDescription(`
**${message.author.username}**

**>** **Cookies** ${await format(s.vault.cookies)} 🍪
- **>** **Additional Cookies** +${(s.vault.cookies * 0.000002).toFixed(4)}x
**>** **Gems** ${await format(s.vault.gems)} 💎
- **>** **Additional Gems** +${(s.vault.gems * 0.000002).toFixed(4)}x
                `)
                .setTimestamp()

            message.channel.send({ embeds: [svault] })

            u.last.view_vault = Math.floor(Date.now() / 1000)
            await u.save()
            view_vaultcd.add(message.author.id)
            setTimeout(() => {
                view_vaultcd.delete(message.author.id)
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