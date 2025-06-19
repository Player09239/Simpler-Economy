const { EmbedBuilder, Message, Client } = require('discord.js')
const server = require('./server')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (interaction, commandName, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `view-vault`) {
            let s = await server.findOne({ guildId: interaction.guild.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            const svault = new EmbedBuilder()
                .setTitle('Server Vault')
                .setColor('#36393F')
                .setDescription(`
**${interaction.user.username}**

**>** **Cookies** ${await format(s.vault.cookies)} 🍪
- **>** **Additional Cookies** +${(s.vault.cookies * 0.000002).toFixed(4)}x
**>** **Gems** ${await format(s.vault.gems)} 💎
- **>** **Additional Gems** +${(s.vault.gems * 0.000002).toFixed(4)}x
                `)
                .setTimestamp()

            interaction.reply({ embeds: [svault] })
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