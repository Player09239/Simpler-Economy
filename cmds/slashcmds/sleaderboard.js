const { EmbedBuilder, Message, Client } = require("discord.js");
const bot = require('./bot')
const users = require('./data')
const format = require('./numformat')

module.exports = async (interaction, commandName, client) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `leaderboard`) {
            let u = await users.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            const lb = new EmbedBuilder()
                .setColor('#36393F')
                .setTimestamp()

            if (interaction.options.getString('type') === 'cookies') {
                topUsers = await users.find().sort({ cookies: -1 }).limit(10).exec();
                lb.setTitle('Leaderboard').setDescription('**>** **Type** Cookies Leaderboard, TOP 10');

                for (const [index, user] of topUsers.entries()) {
                    lb.addFields({
                        name: `**>** ${index + 1} **>** ${user.name}`,
                        value: `- **>** **Cookies** ${await format(user.cookies)} 🍪`
                    });
                }                    
            } else if (interaction.options.getString('type') === 'piggybank') {
                topUsers = await users.find().sort({ piggybank: -1 }).limit(10).exec();
                lb.setTitle('Leaderboard').setDescription('**>** **Type** Piggy Bank Leaderboard, TOP 10');

                for (const [index, user] of topUsers.entries()) {
                    lb.addFields({
                        name: `**>** ${index + 1} **>** ${user.name}`,
                        value: `- **>** **Piggy Bank** ${await format(user.piggybank)} 🍪`
                    });
                }                    
            } else if (interaction.options.getString('type') === 'gems') {
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

            if (!topUsers || topUsers.length === 0) return interaction.reply({ embeds: [err3] })

            interaction.reply({ embeds: [lb] })
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