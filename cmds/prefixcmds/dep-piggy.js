const { EmbedBuilder, Message, Client } = require('discord.js')
const user = require('./data')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (message, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        const args = message.content.trim().split(/ +/)
        const command = args.shift();

        if (command === `${b.prefix}dep-piggy`) {
            let u = await user.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            const err1 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription(`Arguments missing, expected: **${b.prefix}dep-piggy <amount>**`)
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
                const amount = u.cookies
                u.cookies = 0
                u.piggybank = u.piggybank + amount
                await u.save()

                const success = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${message.author.username}**

**>** **Deposited Cookies** ${await format(amount)} 🍪

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
                .setDescription(`You don\'t have enough cookies for this deposit!\n\n**>** **Amount Missing** ${await format(amount - u.cookies)} 🍪`)
                .setTimestamp()

            if (amount > u.cookies) return message.channel.send({ embeds: [err4] })

            u.cookies = u.cookies - amount
            u.piggybank = u.piggybank + amount

            await u.save()

            const success = new EmbedBuilder()
                .setTitle('Deposited')
                .setColor('#36393F')
                .setDescription(`
**${message.author.username}**

**>** **Deposited Cookies** ${await format(amount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Your Piggy Bank** ${await format(u.piggybank)} 🍪
                `)
                .setTimestamp()

            message.channel.send({ embeds: [success] })         
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