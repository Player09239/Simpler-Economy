import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'
import os from 'os'

export async function about(message, client, aboutcd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}about`) {
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (aboutcd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.about + 20}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
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
**>** **Total Servers** ${await format (client.guilds.cache.size)}
**>** **Total Messages Sent** ${await format(b.totalMessagesSent)}
**>** **Total Commands Executed** ${await format(b.totalCommandsExecuted)}
                `)
                .setTimestamp()

            message.channel.send({ embeds: [embed] })

            u.last.about = Math.floor(Date.now() / 1000)
            await u.save()
            aboutcd.add(message.author.id)
            setTimeout(() => {
                aboutcd.delete(message.author.id)
            }, 20000)
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