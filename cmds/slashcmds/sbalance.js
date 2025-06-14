const { EmbedBuilder, Client, Message } = require('discord.js')
const data = require('./data.js')
const bot = require('./bot.js')
const format = require('./numformat.js')

module.exports = async (interaction, commandName, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `balance`) {
            let u = await data.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            const embed = new EmbedBuilder()
                .setColor('#36393F')
                .setTitle('Balance')
                .setDescription(`
**${interaction.user.username}**

**>** **Cookies** ${await format(u.cookies)} 🍪
**>** **Gems** ${await format(u.gems)} 💎
            `)
                .setTimestamp()

            interaction.reply({ embeds: [embed] })
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