import { EmbedBuilder, Client, Message } from 'discord.js'
import users from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function slash_leaderboard(interaction, commandName, client, leaderboardcd) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `leaderboard`) {
            let u = await users.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (leaderboardcd.has(interaction.user.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.leaderboard + 20}:R>.`)
                    .setTimestamp()

                return interaction.reply({ embeds: [cooldownEmbed] })
            }

            let topUsers;

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

            u.last.leaderboard = Math.floor(Date.now() / 1000)
            await u.save()
            leaderboardcd.add(interaction.user.id)
            setTimeout(() => {
                leaderboardcd.delete(interaction.user.id)
            }, 20000)
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