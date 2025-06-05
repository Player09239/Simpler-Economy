const { EmbedBuilder, Message, Client } = require('discord.js')
const data = require('./data.js')
const bot = require('./bot.js')
const format = require('./numformat.js')

module.exports = async (message, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        const args = message.content.trim().split(/ +/)
        const command = args.shift();

        if (command === `${b.prefix}o-forcetake`) {

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (message.author.id !== '1235411394019725322') {
                const authorizationerr = new EmbedBuilder() 
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`You are not authorized to use this command`)
                    .setTimestamp()

                return message.channel.send({ embeds: [authorizationerr] })
            }

            const user = await client.users.fetch(args[0]).catch(() => null);
            if (!user) {
                const userNotFound = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`User not found`)
                    .setTimestamp()

                return message.channel.send({ embeds: [userNotFound] })
            } else {
                const err = new EmbedBuilder()  
                    .setTitle('Error')
                    .setColor('Red')
                    .setDescription(`Arguments missing, expected: **${b.prefix}o-forcetake <userId> <amount>**`)
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

                if (!args[0] || !args[1]) return message.channel.send({ embeds: [err] })
                if (isNaN(args[1])) return message.channel.send({ embeds: [err2] })
                if (Number(args[1]) <= 0) return message.channel.send({ embeds: [err3] })

                const amount = Number(args[1]);
                let u = await data.findOne({ userId: args[0] });
                
                u.cookies -= amount;

                if (u.cookies < 0) {
                    u.cookies = 0
                }

                await u.save();

                const taken = new EmbedBuilder()
                    .setTitle('Admin ForceTake')
                    .setColor('#36393F')
                    .setDescription(`
**${user.username}**

**>** **Taken Cookies** ${await format(amount)} 🍪
                    `)
                    .setTimestamp()

                return message.channel.send({ embeds: [taken] })
            }
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
