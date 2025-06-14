const { EmbedBuilder, Client, Message } = require('discord.js')
const bot = require('./bot')
const user = require('./data')
const format = require('./numformat')
const server = require('./server')

module.exports = async (interaction, commandName, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })
        let s = await server.findOne({ guildId: interaction.guild.id })

        if (commandName === `claim-drop`) {
            let u = await user.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

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