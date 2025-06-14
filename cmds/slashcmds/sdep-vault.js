const { EmbedBuilder, Message, Client } = require('discord.js')
const server = require('./server')
const user = require('./data')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (interaction, commandName, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `dep-vault`) {
            let u = await user.findOne({ userId: interaction.user.id })
            let s = await server.findOne({ guildId: interaction.guild.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

            const err1 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`amount` param expected number')
                .setTimestamp()

            const err2 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`amount` param expected number more than 0')
                .setTimestamp()

            const currency = interaction.options.getString('currency')
            const given = interaction.options.getString('amount')

            if (given.toLowerCase() === 'all' && currency.toLowerCase() === 'cookies') {
                const amount = u.cookies
                s.vault.cookies = s.vault.cookies + amount
                u.cookies = u.cookies - amount
                await u.save()
                await s.save()

                const dep = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${interaction.user.username}**

**>** **Deposited Cookies** ${await format(amount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Server Vault (Cookies)** ${await format(s.vault.cookies)} 🍪
                    `)
                    .setTimestamp()

                return interaction.reply({ embeds: [dep] })
            }

            if (given.toLowerCase() === 'all' && currency.toLowerCase() === 'gems') {
                const amount = u.gems
                s.vault.gems = s.vault.gems + amount
                u.gems = u.gems - amount
                await u.save()
                await s.save()

                const dep = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${interaction.user.username}**

**>** **Deposited Gems** ${await format(amount)} 💎

**>** **Your Gems** ${await format(u.gems)} 💎
**>** **Server Vault (Gems)** ${await format(s.vault.gems)} 💎
                    `)
                    .setTimestamp()

                return interaction.reply({ embeds: [dep] })
            }

            if (isNaN(given)) {
                return interaction.reply({ embeds: [err1] })
            }

            if (given < 1) return interaction.reply({ embeds: [err2] })

            const amount = Math.floor(Number(given))

            if ((amount > u.cookies) && currency === 'cookies') {
                const err = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`You don\'t have enough cookies for this deposit!\n\n**>** **Amount Missing** ${await format(amount - u.cookies)} 🍪`)
                    .setTimestamp()

                return interaction.reply({ embeds: [err] })
            }

            if ((amount > u.gems) && currency === 'gems') {
                const err = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`You don\'t have enough gems for this deposit!\n\n**>** **Amount Missing** ${await format(amount - u.gems)} 💎`)
                    .setTimestamp()

                return interaction.reply({ embeds: [err] })
            }

            if (currency === 'cookies') {
                s.vault.cookies = s.vault.cookies + amount
                u.cookies = u.cookies - amount
                await u.save()
                await s.save()

                const dep = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${interaction.user.username}**

**>** **Deposited Cookies** ${await format(amount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Server Vault (Cookies)** ${await format(s.vault.cookies)} 🍪
                    `)
                    .setTimestamp()

                return interaction.reply({ embeds: [dep] })
            }

            if (currency === 'gems') {
                s.vault.gems = s.vault.gems + amount
                u.gems = u.gems - amount
                await u.save()
                await s.save()

                const dep = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${interaction.user.username}**

**>** **Deposited Gems** ${await format(amount)} 💎

**>** **Your Gems** ${await format(u.gems)} 💎
**>** **Server Vault (Gems)** ${await format(s.vault.gems)} 💎
                    `)
                    .setTimestamp()

                return interaction.reply({ embeds: [dep] })
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