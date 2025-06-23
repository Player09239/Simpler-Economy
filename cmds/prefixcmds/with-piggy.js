const { EmbedBuilder, Message, Client } = require('discord.js')
const user = require('./data')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (message, client, with_piggycd) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        const args = message.content.trim().split(/ +/)
        const command = args.shift();

        if (command === `${b.prefix}with-piggy`) {
            let u = await user.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (with_piggycd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.with_piggy + 10}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

            const err1 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription(`Arguments missing, expected: **${b.prefix}with-piggy <amount>**`)
                .setTimestamp()

            const err2 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`amount` param expected number')
                .setTimestamp()

            const err3 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`amount` param expected numbers more than 0')
                .setTimestamp()
            
            if (!args[0]) return message.channel.send({ embeds: [err1] })

            if (args[0].toLowerCase() === 'all') {
                const amount = u.piggybank
                u.piggybank = 0
                u.cookies = u.cookies + amount
                await u.save()

                const success = new EmbedBuilder()
                    .setTitle('Withdrawn')
                    .setColor('#36393F')
                    .setDescription(`
**${message.author.username}**

**>** **Withdrawn Cookies** ${await format(amount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Your Piggy Bank** ${await format(u.piggybank)} 🍪
                    `)
                    .setTimestamp()

                return message.channel.send({ embeds: [success] })
            }

            if (isNaN(args[0])) {
                return message.channel.send({ embeds: [err2] })
            }

            if (args[0] < 1) return message.channel.send({ embeds: [err3] })

            const amount = Math.floor(parseInt(args[0]))

            const err4 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription(`You don\'t have enough cookies in your piggy bank for this withdrawal!\n\n**>** **Amount Missing** ${await format(amount - u.piggybank)} 🍪`)
                .setTimestamp()

            if (amount > u.piggybank) return message.channel.send({ embeds: [err4] })

            u.cookies = u.cookies + amount
            u.piggybank = u.piggybank - amount

            await u.save()

            const success = new EmbedBuilder()
                .setTitle('Withdrawn')
                .setColor('#36393F')
                .setDescription(`
**${message.author.username}**

**>** **Withdrawn Cookies** ${await format(amount)}

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Your Piggy Bank** ${await format(u.piggybank)} 🍪
                `)
                .setTimestamp()

            message.channel.send({ embeds: [success] })     
            
            u.last.with_piggy = Math.floor(Date.now() / 1000)
            await u.save()
            with_piggycd.add(message.author.id)
            setTimeout(() => {
                with_piggycd.delete(message.author.id)
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