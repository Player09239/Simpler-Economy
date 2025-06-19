const { EmbedBuilder, Message, Client } = require('discord.js')
const server = require('./server')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (interaction, commandName, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `server-info`) {
            let s = await server.findOne({ guildId: interaction.guild.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

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