const { EmbedBuilder, Message, Client } = require("discord.js");
const bot = require('./bot')
const users = require('./data')
const format = require('./numformat')

module.exports = async (message, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        const args = message.content.trim().split(/ +/)
        const command = args.shift();

        if (command === `${b.prefix}leaderboard`) {
            let u = await users.findOne({ userId: message.author.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            const err1 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription(`Arguments missing, expected: **${b.prefix}leaderboard <type>**`)

            const err2 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`type` param expected cookies, piggybank, or gems')

            if (!args[0]) return message.channel.send({ embeds: [err1] })
            if ((args[0].toLowerCase() !== 'cookies') && (args[0].toLowerCase() !== 'piggybank') && (args[0].toLowerCase() !== 'gems')) return message.channel.send({ embeds: [err2] })

            const lb = new EmbedBuilder()
                .setColor('#36393F')
                .setTimestamp()

            if (args[0].toLowerCase() === 'cookies') {
                topUsers = await users.find().sort({ cookies: -1 }).limit(10).exec();
                lb.setTitle('Leaderboard').setDescription('**>** **Type** Cookies Leaderboard, TOP 10');

                for (const [index, user] of topUsers.entries()) {
                    lb.addFields({
                        name: `**>** ${index + 1} **>** ${user.name}`,
                        value: `- **>** **Cookies** ${await format(user.cookies)} 🍪`
                    });
                }                    
            } else if (args[0].toLowerCase() === 'piggybank') {
                topUsers = await users.find().sort({ piggybank: -1 }).limit(10).exec();
                lb.setTitle('Leaderboard').setDescription('**>** **Type** Piggy Bank Leaderboard, TOP 10');

                for (const [index, user] of topUsers.entries()) {
                    lb.addFields({
                        name: `**>** ${index + 1} **>** ${user.name}`,
                        value: `- **>** **Piggy Bank** ${await format(user.piggybank)} 🍪`
                    });
                }                    
            } else if (args[0].toLowerCase() === 'gems') {
                topUsers = await users.find().sort({ gems: -1 }).limit(10).exec();
                lb.setTitle('Leaderboard').setDescription('**>** **Type** Gems Leaderboard, TOP 10');

                for (const [index, user] of topUsers.entries()) {
                    lb.addFields({
                        name: `**>** ${index + 1} **>** ${user.name}`,
                        value: `- **>** **Gems** ${await format(user.gems)} 💎`
                    });
                }                    
            }

            const err3 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription(`No data available`)
                .setTimestamp()

            if (!topUsers || topUsers.length === 0) return message.channel.send({ embeds: [err3] })

            message.channel.send({ embeds: [lb] })
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