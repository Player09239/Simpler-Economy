const { EmbedBuilder, Message, Client } = require('discord.js')
const bot = require('./bot.js')
const data = require('./data.js')
const format = require('./numformat.js')
const os = require('os')

module.exports = async (message, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}about`) {
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

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
[CHILL WITH THE DEV](https://discord.gg/qEnRAhPQfg)
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

            message.channel.send({ embeds: [embed] })
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
