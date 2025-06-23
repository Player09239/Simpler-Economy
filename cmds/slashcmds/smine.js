const { EmbedBuilder, Message, Client } = require('discord.js')
const user = require('./data')
const bot = require('./bot')
const format = require('./numformat')
const { calculate_earned } = require('./functions')

module.exports = async (interaction, commandName, client, minecd) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `mine`) {
            let u = await user.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (minecd.has(interaction.user.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.mine + 35}:R>.`)
                    .setTimestamp()

                return interaction.reply({ embeds: [cooldownEmbed] })
            }

            const rng = Math.random()

            if (rng < 0.5) {
                const amount = await calculate_earned(Math.floor((Math.random() * 5) + 1), 'gems', interaction.user.id)
                u.gems += amount
                await u.save()

                const embed = new EmbedBuilder()
                    .setColor('#36393F')
                    .setTitle('Mined')
                    .setDescription(`
**${interaction.user.username}**

You went mining, and found gems!

**>** **Gems Mined** ${await format(amount)} 💎

**>** **Your Gems** ${await format(u.gems)} 💎
                    `)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] })
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#36393F')
                    .setTitle('Mined')
                    .setDescription(`
**${interaction.user.username}**

You went mining, but found nothing.

**>** **Gems Mined** 0 💎

**>** **Your Gems** ${await format(u.gems)} 💎
                    `)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] })
            }

            u.last.mine = Math.floor(Date.now() / 1000)
            await u.save()
            minecd.add(interaction.user.id)
            setTimeout(() => {
                minecd.delete(interaction.user.id)
            }, 35000)
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