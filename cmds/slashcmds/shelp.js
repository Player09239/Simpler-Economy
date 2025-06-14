const { EmbedBuilder, Message, Client } = require('discord.js')
const bot = require('./bot')

module.exports = async (interaction, commandName, client) => {
    let b = await bot.findOne({ client: client.user.id })

    if (commandName === `help`) {
        b.totalCommandsExecuted += 1
        b.totalMessagesSent += 1

        await b.save()

        const help = new EmbedBuilder()
            .setTitle('Help')
            .setColor('#36393F')
            .setDescription(`
**${interaction.user.username}**

**>** **Prefix** \`/\`

**Commands**
**>** **help** Show this message
**>** **invest** Invest your cookies
- invest <amount>
**>** **view-piggy** View your piggy bank
**>** **view-vault** View the server vault
**>** **dep-piggy** Deposit cookies into your piggy bank
- dep-piggy <amount>
**>** **dep-vault** Deposit cookies/gems into the server vault
- dep-vault <currency> <amount>
**>** **with-piggy** Withdraw cookies from your piggy bank
- with-piggy <amount>
**>** **balance** View your balance
**>** **daily** Claim your daily cookies
**>** **claim-drop** Claim the server's drop
**>** **about** About this bot
**>** **walk** Walk to earn cookies
**>** **mine** Mine for a chance to earn gems
**>** **leaderboard** View the server's leaderboard
- leaderboard <type>
**>** **server-info** View server information

                `)
            .setTimestamp()

        interaction.reply({ embeds: [help] })
    }
}