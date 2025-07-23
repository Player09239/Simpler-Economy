import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'
import os from 'os'

export async function slash_about(interaction, commandName, client, aboutcd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `about`) {
            let u = await data.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (aboutcd.has(interaction.user.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.about + 20}:R>.`)
                    .setTimestamp()

                return interaction.reply({ embeds: [cooldownEmbed] })
            }

            const usage = process.cpuUsage(); // Get CPU usage at this moment
            const load = (usage.user + usage.system) / 1000; // Convert microseconds to milliseconds
            const percentLoad = (load / (os.uptime() * 1000)) * 100; // Calculate percentage

            // Calculate uptime in h, m, s
            const totalSeconds = Math.floor(client.uptime / 1000)
            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60

            const embed = new EmbedBuilder()
                .setColor('#36393F')
                .setTitle('About')
                .setDescription(`
                    
[GITHUB](https://github.com/Player09239/Simpler-Economy/tree/main)
[CHILL WITH THE DEV](https://discord.gg/HdqT2kbmFC)
[INVITE THE BOT](https://discord.com/oauth2/authorize?client_id=1362806385057730651&scope=bot&permissions=8)

**${client.user.username}**

**>** **Developer** chaos_09239
**>** **Uptime** ${hours}h ${minutes}m ${seconds}s
**>** **Ping** ${Math.floor(client.ws.ping)}ms
**>** **CPU Load** ${percentLoad.toFixed(2)}%

**>** **Total Users** ${await format(client.users.cache.size)}
**>** **Total Servers** ${await (client.guilds.cache.size)}
**>** **Total Messages Sent** ${await (b.totalMessagesSent)}
**>** **Total Commands Executed** ${await (b.totalCommandsExecuted)}
                `)
                .setTimestamp()

            interaction.reply({ embeds: [embed] })

            u.last.about = Math.floor(Date.now() / 1000)
            await u.save()
            aboutcd.add(interaction.user.id)
            setTimeout(() => {
                aboutcd.delete(interaction.user.id)
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