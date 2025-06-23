const { EmbedBuilder, Message, Client } = require('discord.js')
const server = require('./server')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (message, client, server_infocd) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (message.content === `${b.prefix}server-info`) {
            let s = await server.findOne({ guildId: message.guild.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

            if (server_infocd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.server_info + 10}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

            const info = new EmbedBuilder() 
                .setTitle('Server')
                .setColor('#36393F')
                .setDescription(`
**${message.author.username}**

**>** **Owner** <@${message.guild.ownerId}>

**>** **Name** ${message.guild.name}
**>** **Members** ${message.guild.memberCount}
**>** **Created At** ${message.guild.createdAt.toLocaleDateString()} ${message.guild.createdAt.toLocaleTimeString()}
                `)

            message.channel.send({ embeds: [info] })

            u.last.server_info = Math.floor(Date.now() / 1000)
            await u.save()
            server_infocd.add(message.author.id)
            setTimeout(() => {
                server_infocd.delete(message.author.id)
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