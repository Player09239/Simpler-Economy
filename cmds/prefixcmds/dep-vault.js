const { EmbedBuilder, Message, Client } = require('discord.js')
const server = require('./server')
const user = require('./data')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (message, client, dep_vaultcd) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        const args = message.content.trim().split(/ +/)
        const command = args.shift();

        if (command === `${b.prefix}dep-vault`) {
            let u = await user.findOne({ userId: message.author.id })
            let s = await server.findOne({ guildId: message.guild.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

            if (dep_vaultcd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.dep_vault + 10}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

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

            const err3 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription(`Arguments missing, expected: **${b.prefix}dep-vault <currency> <amount>**`)
                .setTimestamp()

            const err4 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`currency` param expected gems or cookies')
                .setTimestamp()

            if (!args[0] || !args[1]) return message.channel.send({ embeds: [err3] })

            if (args[1].toLowerCase() === 'all' && args[0].toLowerCase() === 'cookies') {
                const amount = u.cookies
                s.vault.cookies = s.vault.cookies + amount
                u.cookies = u.cookies - amount
                await u.save()
                await s.save()

                const dep = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${message.author.username}**

**>** **Deposited Cookies** ${await format(amount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Server Vault (Cookies)** ${await format(s.vault.cookies)} 🍪
                    `)
                    .setTimestamp()

                return message.channel.send({ embeds: [dep] })
            }

            if (args[1].toLowerCase() === 'all' && args[0].toLowerCase() === 'gems') {
                const amount = u.gems
                s.vault.gems = s.vault.gems + amount
                u.gems = u.gems - amount
                await u.save()
                await s.save()

                const dep = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${message.author.username}**

**>** **Deposited Gems** ${await format(amount)} 💎

**>** **Your Gems** ${await format(u.gems)} 💎
**>** **Server Vault (Gems)** ${await format(s.vault.gems)} 💎
                    `)
                    .setTimestamp()

                return message.channel.send({ embeds: [dep] })
            }

            if (isNaN(args[1])) {
                return message.channel.send({ embeds: [err1] })
            }

            if (args[1] < 1) return message.channel.send({ embeds: [err2] })

            const amount = Math.floor(parseInt(args[1]))

            if ((amount > u.cookies) && args[0] === 'cookies') {
                const err = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`You don\'t have enough cookies for this deposit!\n\n**>** **Amount Missing** ${await format(amount - u.cookies)} 🍪`)
                    .setTimestamp()

                return message.channel.send({ embeds: [err] })
            }

            if ((amount > u.gems) && args[0] === 'gems') {
                const err = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`You don\'t have enough gems for this deposit!\n\n**>** **Amount Missing** ${await format(amount - u.gems)} 💎`)
                    .setTimestamp()

                return message.channel.send({ embeds: [err] })
            }

            if (args[0] === 'cookies') {
                s.vault.cookies = s.vault.cookies + amount
                u.cookies = u.cookies - amount
                await u.save()
                await s.save()

                const dep = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${message.author.username}**

**>** **Deposited Cookies** ${await format(amount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Server Vault (Cookies)** ${await format(s.vault.cookies)} 🍪
                    `)
                    .setTimestamp()

                return message.channel.send({ embeds: [dep] })
            }

            if (args[0] === 'gems') {
                s.vault.gems = s.vault.gems + amount
                u.gems = u.gems - amount
                await u.save()
                await s.save()

                const dep = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${message.author.username}**

**>** **Deposited Gems** ${await format(amount)} 💎

**>** **Your Gems** ${await format(u.gems)} 💎
**>** **Server Vault (Gems)** ${await format(s.vault.gems)} 💎
                    `)
                    .setTimestamp()

                return message.channel.send({ embeds: [dep] })
            }

            u.last.dep_vault = Math.floor(Date.now() / 1000)
            await u.save()
            dep_vaultcd.add(message.author.id)
            setTimeout(() => {
                dep_vaultcd.delete(message.author.id)
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