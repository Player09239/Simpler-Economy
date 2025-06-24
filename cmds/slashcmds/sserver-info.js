import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function slash_server_info(interaction, commandName, client, server_infocd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `server-info`) {
            let s = await server.findOne({ guildId: interaction.guild.id })
            let u = await data.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

            if (server_infocd.has(interaction.user.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.server_info + 10}:R>.`)
                    .setTimestamp()

                return interaction.reply({ embeds: [cooldownEmbed] })
            }

            const info = new EmbedBuilder() 
                .setTitle('Server')
                .setColor('#36393F')
                .setDescription(`
**${interaction.user.username}**

**>** **Owner** <@${interaction.guild.ownerId}>

**>** **Name** ${interaction.guild.name}
**>** **Members** ${interaction.guild.memberCount}
**>** **Created At** ${interaction.guild.createdAt.toLocaleDateString()} ${interaction.guild.createdAt.toLocaleTimeString()}
                `)

            interaction.reply({ embeds: [info] })

            u.last.server_info = Math.floor(Date.now() / 1000)
            await u.save()
            server_infocd.add(interaction.user.id)
            setTimeout(() => {
                server_infocd.delete(interaction.user.id)
            }, 10000)
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