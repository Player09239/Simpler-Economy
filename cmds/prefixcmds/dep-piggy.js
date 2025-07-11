import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function dep_piggy(message, client, dep_piggycd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        const args = message.content.trim().split(/ +/)
        const command = args.shift();

        if (command === `${b.prefix}dep-piggy`) {
            let u = await data.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (dep_piggycd.has(message.author.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.dep_piggy + 10}:R>.`)
                    .setTimestamp()

                return message.channel.send({ embeds: [cooldownEmbed] })
            }

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
            
            u.last.dep_piggy = Math.floor(Date.now() / 1000)
            await u.save()
            dep_piggycd.add(message.author.id)
            setTimeout(() => {
                dep_piggycd.delete(message.author.id)
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